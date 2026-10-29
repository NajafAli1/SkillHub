'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import { z } from 'zod'

import { requireRole } from '@/lib/auth'
import { sendAcceptanceEmails } from '@/lib/email/notify'
import createClient from '@/lib/supabase/server'
import { idSchema, jobSchema } from '@/lib/validations/job'
import type { ActionState } from '@/lib/action-state'

export async function createJob(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await requireRole('client')

  const parsed = jobSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    category_id: formData.get('category_id'),
    payment_type: formData.get('payment_type'),
    budget_min: formData.get('budget_min'),
    budget_max: formData.get('budget_max'),
    location_type: formData.get('location_type'),
    location_detail: formData.get('location_detail'),
    deadline: formData.get('deadline'),
    skill_ids: formData.getAll('skill_ids'),
    intent: formData.get('intent'),
  })
  if (!parsed.success) {
    return { error: 'Periksa kembali isian form.', fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const { skill_ids, intent, ...job } = parsed.data
  const supabase = await createClient()

  // Selalu dibuat sebagai draft dulu: kalau insert skill gagal, draft masih
  // boleh dihapus pemiliknya (policy hanya mengizinkan hapus draft).
  const { data: created, error } = await supabase
    .from('jobs')
    .insert({ ...job, client_id: profile.id, status: 'draft' })
    .select('id')
    .single()
  if (error || !created) {
    console.error('createJob:', error?.message)
    return { error: 'Gagal menyimpan lowongan. Coba lagi.' }
  }

  if (skill_ids.length > 0) {
    const { error: skillError } = await supabase
      .from('job_skills')
      .insert(skill_ids.map((skill_id) => ({ job_id: created.id, skill_id })))
    if (skillError) {
      console.error('createJob skills:', skillError.message)
      await supabase.from('jobs').delete().eq('id', created.id)
      return { error: 'Gagal menyimpan skill lowongan. Coba lagi.' }
    }
  }

  if (intent === 'open') {
    await supabase.from('jobs').update({ status: 'open' }).eq('id', created.id)
  }

  revalidatePath('/client')
  revalidatePath('/jobs')
  revalidatePath('/')
  redirect(`/client/jobs/${created.id}`)
}

const jobStatusSchema = z.enum(['open', 'closed'])

export async function setJobStatus(formData: FormData): Promise<void> {
  const profile = await requireRole('client')
  const id = idSchema.safeParse(formData.get('job_id'))
  const status = jobStatusSchema.safeParse(formData.get('status'))
  if (!id.success || !status.success) return

  const supabase = await createClient()
  // Hanya transisi yang masuk akal: draft/closed -> open, open -> closed.
  const from = status.data === 'open' ? ['draft', 'closed'] as const : ['open'] as const
  const { error } = await supabase
    .from('jobs')
    .update({ status: status.data })
    .eq('id', id.data)
    .eq('client_id', profile.id)
    .in('status', from)
  if (error) console.error('setJobStatus:', error.message)

  revalidatePath(`/client/jobs/${id.data}`)
  revalidatePath('/client')
  revalidatePath('/jobs')
  revalidatePath('/')
}

const decisionSchema = z.enum(['accepted', 'rejected'])

export async function decideApplication(formData: FormData): Promise<void> {
  await requireRole('client')
  const id = idSchema.safeParse(formData.get('application_id'))
  const jobId = idSchema.safeParse(formData.get('job_id'))
  const decision = decisionSchema.safeParse(formData.get('decision'))
  if (!id.success || !jobId.success || !decision.success) return

  // RLS "applications: job owner decides" memastikan hanya pemilik job yang
  // bisa mengubah. Trigger di DB membuat kontrak & menolak pelamar lain.
  const supabase = await createClient()
  const { data: changed, error } = await supabase
    .from('applications')
    .update({ status: decision.data })
    .eq('id', id.data)
    .eq('job_id', jobId.data)
    .eq('status', 'pending')
    .select('id')
    .maybeSingle()
  if (error) console.error('decideApplication:', error.message)

  // Email hanya dikirim bila status benar-benar berubah (bukan klik ganda).
  // after(): halaman langsung selesai, pengiriman SMTP (~5 detik) berjalan di belakang.
  if (changed && decision.data === 'accepted') {
    const h = await headers()
    const siteUrl = h.get('origin') ?? `${h.get('x-forwarded-proto') ?? 'http'}://${h.get('host')}`
    after(() => sendAcceptanceEmails({ applicationId: changed.id, siteUrl }))
  }

  revalidatePath(`/client/jobs/${jobId.data}`)
  revalidatePath('/client')
}
