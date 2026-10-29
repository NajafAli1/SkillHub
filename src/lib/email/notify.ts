import 'server-only'

import createAdminClient from '@/lib/supabase/admin'
import { sendEmail } from './mailer'
import { acceptedClientEmail, acceptedStudentEmail } from './templates'

type NameSource = { full_name: string; nickname: string | null } | null

const nameOf = (profile: NameSource, fallback: string) =>
  profile?.nickname?.trim() || profile?.full_name || fallback

// Dipanggil lewat after() setelah client menerima lamaran: kirim email ke
// mahasiswa dan client. Memakai service role karena email user ada di auth.users.
export async function sendAcceptanceEmails({ applicationId, siteUrl }: { applicationId: string; siteUrl: string }) {
  const admin = createAdminClient()

  const { data: app, error } = await admin
    .from('applications')
    .select(
      `id, status, student_id,
       student:student_profiles(profile:profiles(full_name, nickname)),
       job:jobs(id, title, client_id,
         client:client_profiles(company_name, profile:profiles(full_name, nickname)))`,
    )
    .eq('id', applicationId)
    .single()

  if (error || !app?.job || app.status !== 'accepted') {
    console.error('sendAcceptanceEmails: data lamaran tidak valid', error?.message ?? app?.status)
    return
  }

  const [studentUser, clientUser] = await Promise.all([
    admin.auth.admin.getUserById(app.student_id),
    admin.auth.admin.getUserById(app.job.client_id),
  ])
  const studentEmail = studentUser.data.user?.email
  const clientEmail = clientUser.data.user?.email
  if (!studentEmail || !clientEmail) {
    console.error('sendAcceptanceEmails: email mahasiswa/client tidak ditemukan')
    return
  }

  const info = {
    jobId: app.job.id,
    jobTitle: app.job.title,
    studentName: nameOf(app.student?.profile ?? null, 'Mahasiswa'),
    studentEmail,
    clientName: app.job.client?.company_name?.trim() || nameOf(app.job.client?.profile ?? null, 'Client'),
    clientEmail,
    siteUrl,
  }

  await Promise.all([sendEmail(acceptedStudentEmail(info)), sendEmail(acceptedClientEmail(info))])
}
