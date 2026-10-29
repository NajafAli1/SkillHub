import Link from 'next/link'

import { JobCard } from '../ui/job-card'
import type { JobSummary } from '@/lib/queries/jobs'

export function LatestJobs({ jobs }: { jobs: JobSummary[] }) {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-12">
          <div>
            <h2 className="text-2xl font-bold text-on-surface md:text-3xl">Lowongan Terbaru</h2>
            <p className="mt-2 text-sm text-on-surface-variant md:text-base">
              Proyek freelance terbaru yang diposting oleh client
            </p>
          </div>
          {jobs.length > 0 && (
            <Link href="/jobs" className="hidden shrink-0 text-sm font-bold text-primary-container hover:underline sm:block">
              Lihat Semua &rarr;
            </Link>
          )}
        </div>

        {jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            <Link
              href="/jobs"
              className="mt-6 block rounded-[10px] border border-border-card py-3 text-center text-sm font-bold text-primary-container sm:hidden"
            >
              Lihat Semua Lowongan &rarr;
            </Link>
          </>
        ) : (
          <div className="rounded-[12px] border border-dashed border-outline-variant bg-surface px-6 py-12 text-center">
            <p className="font-semibold text-on-surface">Belum ada lowongan yang dibuka.</p>
            <p className="mt-1 text-sm text-on-surface-variant">Jadilah client pertama yang memasang proyek di SkillHub.</p>
            <Link
              href="/auth/register?role=client"
              className="mt-5 inline-block rounded-[10px] bg-primary-container px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary"
            >
              Pasang Lowongan
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
