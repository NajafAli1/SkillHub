import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MdVerified } from 'react-icons/md'

import { Badge } from '@/components/ui/badge'
import { ApplicationStatusBadge, JobStatusBadge } from '@/components/ui/status-badge'
import { getProfile } from '@/lib/auth'
import { getJob } from '@/lib/queries/jobs'
import createClient from '@/lib/supabase/server'
import { LOCATION_LABEL, formatBudget, formatDate, timeAgo } from '@/lib/utils'
import { idSchema } from '@/lib/validations/job'
import { ApplyForm } from './apply-form'

type Params = Promise<{ id: string }>

async function loadJob(id: string) {
  return idSchema.safeParse(id).success ? getJob(id) : null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const job = await loadJob((await params).id)
  return { title: job ? `${job.title} · SkillHub` : 'Lowongan tidak ditemukan · SkillHub' }
}

export default async function JobDetailPage({ params }: { params: Params }) {
  const { id } = await params
  const [job, profile] = await Promise.all([loadJob(id), getProfile()])
  if (!job) notFound()

  let myApplication: { status: 'pending' | 'accepted' | 'rejected' | 'withdrawn' } | null = null
  if (profile?.role === 'student') {
    const supabase = await createClient()
    const { data } = await supabase
      .from('applications')
      .select('status')
      .eq('job_id', job.id)
      .eq('student_id', profile.id)
      .maybeSingle()
    myApplication = data
  }

  const isOwner = profile?.id === job.clientId
  const facts = [
    { label: 'Budget', value: formatBudget(job.budgetMin, job.budgetMax, job.paymentType) },
    { label: 'Lokasi', value: job.locationDetail ? `${LOCATION_LABEL[job.locationType]} · ${job.locationDetail}` : LOCATION_LABEL[job.locationType] },
    { label: 'Deadline', value: job.deadline ? formatDate(job.deadline) : 'Fleksibel' },
    { label: 'Kategori', value: job.category?.name ?? '-' },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
      <Link href="/jobs" className="text-sm font-medium text-on-surface-variant hover:text-primary">
        &larr; Semua lowongan
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_340px]">
        <article className="min-w-0 rounded-2xl border border-border-card bg-white p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-on-surface-variant">
            <span className="font-medium text-on-surface">{job.clientName}</span>
            {job.clientVerified && <MdVerified className="text-primary-container" aria-label="Terverifikasi" />}
            <span>· {timeAgo(job.postedAt)}</span>
            {job.status !== 'open' && <JobStatusBadge status={job.status} />}
          </div>

          <h1 className="mt-2 text-2xl font-bold leading-tight text-on-surface md:text-3xl">{job.title}</h1>

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-[12px] bg-surface p-4 sm:grid-cols-4">
            {facts.map((f) => (
              <div key={f.label} className="min-w-0">
                <dt className="text-xs text-on-surface-variant">{f.label}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-on-surface">{f.value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-8 text-lg font-bold text-on-surface">Deskripsi Proyek</h2>
          <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-on-surface-variant sm:text-base">
            {job.description}
          </p>

          {job.skills.length > 0 && (
            <>
              <h2 className="mt-8 text-lg font-bold text-on-surface">Skill yang Dibutuhkan</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.skills.map((s) => <Badge key={s}>{s}</Badge>)}
              </div>
            </>
          )}
        </article>

        <aside className="h-fit rounded-2xl border border-border-card bg-white p-5 sm:p-6 lg:sticky lg:top-24">
          {isOwner ? (
            <>
              <h2 className="text-lg font-bold text-on-surface">Lowongan milikmu</h2>
              <p className="mt-1 text-sm text-on-surface-variant">Kelola status dan lihat pelamar di dashboard.</p>
              <Link
                href={`/client/jobs/${job.id}`}
                className="mt-4 block rounded-[10px] bg-primary-container px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary"
              >
                Kelola Lowongan
              </Link>
            </>
          ) : job.status !== 'open' ? (
            <p className="text-sm text-on-surface-variant">Lowongan ini sudah tidak menerima lamaran.</p>
          ) : !profile ? (
            <>
              <h2 className="text-lg font-bold text-on-surface">Tertarik?</h2>
              <p className="mt-1 text-sm text-on-surface-variant">Masuk sebagai mahasiswa untuk melamar.</p>
              <Link
                href={`/auth/login?next=/jobs/${job.id}`}
                className="mt-4 block rounded-[10px] bg-primary-container px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary"
              >
                Masuk untuk Melamar
              </Link>
              <Link href="/auth/register?role=student" className="mt-2 block text-center text-sm font-semibold text-primary hover:underline">
                Belum punya akun? Daftar
              </Link>
            </>
          ) : profile.role !== 'student' ? (
            <p className="text-sm text-on-surface-variant">Hanya akun mahasiswa yang bisa melamar lowongan.</p>
          ) : myApplication ? (
            <>
              <h2 className="text-lg font-bold text-on-surface">Kamu sudah melamar</h2>
              <div className="mt-2 flex items-center gap-2 text-sm text-on-surface-variant">
                Status: <ApplicationStatusBadge status={myApplication.status} />
              </div>
              <Link href="/student" className="mt-4 block text-sm font-semibold text-primary hover:underline">
                Lihat di dashboard &rarr;
              </Link>
            </>
          ) : (
            <>
              <h2 className="mb-4 text-lg font-bold text-on-surface">Lamar Proyek Ini</h2>
              <ApplyForm jobId={job.id} />
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
