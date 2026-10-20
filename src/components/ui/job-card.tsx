import Link from 'next/link'
import { MdVerified } from 'react-icons/md'

import { Badge } from './badge'
import type { JobSummary } from '@/lib/queries/jobs'
import { LOCATION_LABEL, formatBudget, timeAgo } from '@/lib/utils'

export function JobCard({ job }: { job: JobSummary }) {
  return (
    <article className="relative flex flex-col justify-between rounded-[12px] border border-border-card bg-white p-5 transition-all hover:border-primary-container sm:p-6">
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint/30 text-sm font-bold text-primary">
              {job.clientName.charAt(0).toUpperCase()}
            </div>
            <span className="truncate text-sm font-medium text-gray-700">{job.clientName}</span>
            {job.clientVerified && (
              <MdVerified className="shrink-0 text-primary-container" aria-label="Terverifikasi" />
            )}
          </div>
          <span className="shrink-0 text-xs text-gray-500">{timeAgo(job.postedAt)}</span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-on-surface sm:text-lg">
          {/* after:absolute membuat seluruh kartu bisa diklik */}
          <Link href={`/jobs/${job.id}`} className="after:absolute after:inset-0 hover:text-primary-container">
            {job.title}
          </Link>
        </h3>
        <p className="mb-4 text-sm font-bold text-primary-container sm:text-base">
          {formatBudget(job.budgetMin, job.budgetMax, job.paymentType)}
        </p>

        {job.skills.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {job.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="pale">{skill}</Badge>
            ))}
            {job.skills.length > 4 && <Badge variant="outline">+{job.skills.length - 4}</Badge>}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border-card/60 pt-3">
        <Badge variant="outline">{LOCATION_LABEL[job.locationType]}</Badge>
        {job.category && <span className="truncate pl-2 text-xs text-gray-500">{job.category.name}</span>}
      </div>
    </article>
  )
}
