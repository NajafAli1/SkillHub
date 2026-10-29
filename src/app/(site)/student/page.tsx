import type { Metadata } from 'next'
import Link from 'next/link'

import { EmailContact } from '@/components/ui/email-contact'
import { SubmitButton } from '@/components/ui/form'
import { ApplicationStatusBadge } from '@/components/ui/status-badge'
import { displayName, requireRole } from '@/lib/auth'
import { getCounterpartEmail } from '@/lib/queries/jobs'
import createClient from '@/lib/supabase/server'
import { formatBudget, timeAgo } from '@/lib/utils'
import { withdrawApplication } from './actions'

export const metadata: Metadata = { title: 'Dashboard Mahasiswa · SkillHub' }

export default async function StudentDashboard() {
  const profile = await requireRole('student')
  const supabase = await createClient()

  const { data: applications } = await supabase
    .from('applications')
    .select('id, status, created_at, proposed_rate, job:jobs(id, title, budget_min, budget_max, payment_type, client:client_profiles(company_name, profile:profiles(full_name, nickname)))')
    .eq('student_id', profile.id)
    .order('created_at', { ascending: false })

  const list = applications ?? []
  // Email client hanya diambil untuk lamaran yang sudah diterima.
  const contactEmails = new Map(
    await Promise.all(
      list
        .filter((a) => a.status === 'accepted')
        .map(async (a) => [a.id, await getCounterpartEmail(a.id)] as const),
    ),
  )
  const counts = {
    total: list.length,
    pending: list.filter((a) => a.status === 'pending').length,
    accepted: list.filter((a) => a.status === 'accepted').length,
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-on-surface-variant">Dashboard Mahasiswa</p>
          <h1 className="text-2xl font-bold text-on-surface md:text-3xl">Halo, {displayName(profile)} 👋</h1>
        </div>
        <Link
          href="/jobs"
          className="rounded-[10px] bg-primary-container px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary"
        >
          Cari Lowongan
        </Link>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: 'Total lamaran', value: counts.total },
          { label: 'Menunggu', value: counts.pending },
          { label: 'Diterima', value: counts.accepted },
        ].map((s) => (
          <div key={s.label} className="rounded-[12px] border border-border-card bg-white p-4">
            <dt className="text-xs text-on-surface-variant sm:text-sm">{s.label}</dt>
            <dd className="mt-1 text-2xl font-bold text-primary">{s.value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-10 text-lg font-bold text-on-surface">Lamaran Saya</h2>

      {list.length === 0 ? (
        <div className="mt-4 rounded-[12px] border border-dashed border-outline-variant bg-white px-6 py-10 text-center">
          <p className="font-semibold text-on-surface">Kamu belum melamar lowongan apa pun.</p>
          <Link href="/jobs" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
            Jelajahi lowongan &rarr;
          </Link>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-border-card overflow-hidden rounded-[12px] border border-border-card bg-white">
          {list.map((app) => (
            <li key={app.id} className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  {app.job ? (
                    <Link href={`/jobs/${app.job.id}`} className="line-clamp-2 font-semibold text-on-surface hover:text-primary">
                      {app.job.title}
                    </Link>
                  ) : (
                    <span className="font-semibold text-on-surface-variant">Lowongan tidak tersedia</span>
                  )}
                  <p className="mt-1 text-xs text-on-surface-variant">
                    Dilamar {timeAgo(app.created_at)}
                    {app.job && <> · {formatBudget(app.job.budget_min, app.job.budget_max, app.job.payment_type)}</>}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <ApplicationStatusBadge status={app.status} />
                  {app.status === 'pending' && (
                    <form action={withdrawApplication}>
                      <input type="hidden" name="application_id" value={app.id} />
                      <SubmitButton variant="danger" pendingText="..." className="px-3 py-1.5 text-xs">
                        Tarik
                      </SubmitButton>
                    </form>
                  )}
                </div>
              </div>
              {app.job && (
                <EmailContact
                  email={contactEmails.get(app.id) ?? null}
                  roleLabel="client"
                  name={
                    app.job.client?.company_name?.trim() ||
                    app.job.client?.profile?.nickname?.trim() ||
                    app.job.client?.profile?.full_name ||
                    'Client'
                  }
                  jobTitle={app.job.title}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
