'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { requireRole } from '@/lib/auth'
import createClient from '@/lib/supabase/server'
import { applicationSchema, idSchema } from '@/lib/validations/job'
import { PG_RLS_VIOLATION, PG_UNIQUE_VIOLATION, type ActionState } from '@/lib/action-state'

export async function applyToJob(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const profile = await requireRole('student')

  const parsed = applicationSchema.safeParse({
    job_id: formData.get('job_id'),
    cover_letter: formData.get('cover_letter'),
    proposed_rate: formData.get('proposed_rate'),
  })
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors }

  const supabase = await createClient()
  const { error } = await supabase.from('applications').insert({
    ...parsed.data,
    student_id: profile.id,
  })

  if (error) {
    if (error.code === PG_UNIQUE_VIOLATION) return { error: 'Kamu sudah melamar lowongan ini.' }
    if (error.code === PG_RLS_VIOLATION) return { error: 'Lowongan ini sudah tidak menerima lamaran.' }
    console.error('applyToJob:', error.message)
    return { error: 'Gagal mengirim lamaran. Coba lagi.' }
  }

  revalidatePath(`/jobs/${parsed.data.job_id}`)
  revalidatePath('/student')
  return { info: 'Lamaran terkirim! Pantau statusnya di dashboard.' }
}

export async function withdrawApplication(formData: FormData): Promise<void> {
  const profile = await requireRole('student')
  const id = idSchema.safeParse(formData.get('application_id'))
  if (!id.success) return

  const supabase = await createClient()
  const { error } = await supabase
    .from('applications')
    .update({ status: 'withdrawn' })
    .eq('id', id.data)
    .eq('student_id', profile.id)
    .eq('status', 'pending')
  if (error) console.error('withdrawApplication:', error.message)

  revalidatePath('/student')
}
