import type { Metadata } from 'next'
import Link from 'next/link'

import { JobStatusBadge } from '@/components/ui/status-badge'
import { displayName, requireRole } from '@/lib/auth'
import createClient from '@/lib/supabase/server'
import { formatBudget, timeAgo } from '@/lib/utils'

export const metadata: Metadata = { title: 'Dashboard Client · SkillHub' }

export default async function ClientDashboard() {
  const profile = await requireRole('client')
  const supabase = await createClient()

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, status, created_at, budget_min, budget_max, payment_type, applications(count)')
    .eq('client_id', profile.id)
    .order('created_at', { ascending: false })

  const list = (jobs ?? []).map(({ applications, ...job }) => ({
    ...job,
    applicants: (applications as unknown as { count: number }[])[0]?.count ?? 0,
  }))

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-on-surface-variant">Dashboard Client</p>
          <h1 className="text-2xl font-bold text-on-surface md:text-3xl">Halo, {displayName(profile)} 👋</h1>
        </div>
        <Link
          href="/client/jobs/new"
          className="rounded-[10px] bg-primary-container px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary"
        >
          + Pasang Lowongan
        </Link>
      </div>

      <h2 className="mt-10 text-lg font-bold text-on-surface">Lowongan Saya</h2>

      {list.length === 0 ? (
        <div className="mt-4 rounded-[12px] border border-dashed border-outline-variant bg-white px-6 py-10 text-center">
          <p className="font-semibold text-on-surface">Kamu belum memasang lowongan.</p>
          <p className="mt-1 text-sm text-on-surface-variant">Pasang proyek pertamamu dan temukan mahasiswa berbakat.</p>
          <Link href="/client/jobs/new" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
            Pasang lowongan &rarr;
          </Link>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border-card overflow-hidden rounded-[12px] border border-border-card bg-white">
          {list.map((job) => (
            <li key={job.id}>
              <Link
                href={`/client/jobs/${job.id}`}
                className="flex flex-col gap-2 p-4 hover:bg-surface sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="min-w-0">
                  <p className="line-clamp-2 font-semibold text-on-surface">{job.title}</p>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    Dibuat {timeAgo(job.created_at)} · {formatBudget(job.budget_min, job.budget_max, job.payment_type)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-sm text-on-surface-variant">
                    <strong className="text-on-surface">{job.applicants}</strong> pelamar
                  </span>
                  <JobStatusBadge status={job.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
