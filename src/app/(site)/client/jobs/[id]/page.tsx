import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { SubmitButton } from '@/components/ui/form'
import { ApplicationStatusBadge, JobStatusBadge } from '@/components/ui/status-badge'
import { requireRole } from '@/lib/auth'
import { getJob } from '@/lib/queries/jobs'
import createClient from '@/lib/supabase/server'
import { formatBudget, timeAgo } from '@/lib/utils'
import { idSchema } from '@/lib/validations/job'
import { decideApplication, setJobStatus } from '../../actions'

export const metadata: Metadata = { title: 'Kelola Lowongan · SkillHub' }

type Params = Promise<{ id: string }>

const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`

export default async function ManageJobPage({ params }: { params: Params }) {
  const { id } = await params
  const profile = await requireRole('client')
  if (!idSchema.safeParse(id).success) notFound()

  const job = await getJob(id)
  if (!job || job.clientId !== profile.id) notFound()

  const supabase = await createClient()
  const { data: applications } = await supabase
    .from('applications')
    .select(
      'id, status, cover_letter, proposed_rate, created_at, student:student_profiles(university, major, profile:profiles(full_name, nickname))',
    )
    .eq('job_id', job.id)
    .order('created_at', { ascending: true })

  const list = applications ?? []
  const pendingCount = list.filter((a) => a.status === 'pending').length

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
      <Link href="/client" className="text-sm font-medium text-on-surface-variant hover:text-primary">
        &larr; Dashboard
      </Link>

      <section className="mt-4 rounded-2xl border border-border-card bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <JobStatusBadge status={job.status} />
            <h1 className="mt-2 text-xl font-bold leading-tight text-on-surface md:text-2xl">{job.title}</h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              {formatBudget(job.budgetMin, job.budgetMax, job.paymentType)} · dibuat {timeAgo(job.postedAt)}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {job.status === 'open' && (
              <Link
                href={`/jobs/${job.id}`}
                className="rounded-[10px] border border-outline-variant px-4 py-2.5 text-sm font-semibold text-primary hover:bg-surface-container"
              >
                Lihat Publik
              </Link>
            )}
            {(job.status === 'draft' || job.status === 'closed') && (
              <form action={setJobStatus}>
                <input type="hidden" name="job_id" value={job.id} />
                <input type="hidden" name="status" value="open" />
                <SubmitButton pendingText="...">{job.status === 'draft' ? 'Publikasikan' : 'Buka Kembali'}</SubmitButton>
              </form>
            )}
            {job.status === 'open' && (
              <form action={setJobStatus}>
                <input type="hidden" name="job_id" value={job.id} />
                <input type="hidden" name="status" value="closed" />
                <SubmitButton variant="danger" pendingText="...">Tutup Lowongan</SubmitButton>
              </form>
            )}
          </div>
        </div>
      </section>

      <h2 className="mt-10 text-lg font-bold text-on-surface">
        Pelamar <span className="font-normal text-on-surface-variant">({list.length})</span>
      </h2>
      {job.status === 'open' && pendingCount > 0 && (
        <p className="mt-1 text-sm text-on-surface-variant">
          Menerima satu pelamar akan otomatis menolak pelamar lain yang masih menunggu dan memulai kontrak.
        </p>
      )}

      {list.length === 0 ? (
        <div className="mt-4 rounded-[12px] border border-dashed border-outline-variant bg-white px-6 py-10 text-center text-sm text-on-surface-variant">
          {job.status === 'draft' ? 'Publikasikan lowongan agar mahasiswa bisa melamar.' : 'Belum ada pelamar.'}
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {list.map((app) => {
            const student = app.student
            const name = student?.profile?.nickname?.trim() || student?.profile?.full_name || 'Mahasiswa'
            const campus = [student?.major, student?.university].filter(Boolean).join(' · ')
            return (
              <li key={app.id} className="rounded-[12px] border border-border-card bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-on-surface">{name}</p>
                    <p className="text-xs text-on-surface-variant">
                      {campus || 'Profil kampus belum diisi'} · melamar {timeAgo(app.created_at)}
                    </p>
                  </div>
                  <ApplicationStatusBadge status={app.status} />
                </div>

                {app.cover_letter && (
                  <p className="mt-3 whitespace-pre-line break-words text-sm leading-relaxed text-on-surface-variant">
                    {app.cover_letter}
                  </p>
                )}
                {app.proposed_rate != null && (
                  <p className="mt-2 text-sm">
                    Tawaran: <strong className="text-primary-container">{rupiah(app.proposed_rate)}</strong>
                  </p>
                )}

                {app.status === 'pending' && job.status === 'open' && (
                  <form action={decideApplication} className="mt-4 flex gap-2">
                    <input type="hidden" name="application_id" value={app.id} />
                    <input type="hidden" name="job_id" value={job.id} />
                    <SubmitButton name="decision" value="accepted" className="flex-1 sm:flex-none">
                      Terima
                    </SubmitButton>
                    <SubmitButton name="decision" value="rejected" variant="outline" className="flex-1 sm:flex-none">
                      Tolak
                    </SubmitButton>
                  </form>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
