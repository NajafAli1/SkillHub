import { APPLICATION_STATUS_LABEL, JOB_STATUS_LABEL } from '@/lib/utils'

type ApplicationStatus = keyof typeof APPLICATION_STATUS_LABEL
type JobStatus = keyof typeof JOB_STATUS_LABEL

const TONE = {
  green: 'bg-secondary-container text-on-secondary-fixed-variant',
  amber: 'bg-amber-100 text-amber-800',
  red: 'bg-error-container text-on-error-container',
  gray: 'bg-surface-container-high text-on-surface-variant',
  blue: 'bg-sky-100 text-sky-800',
}

const APPLICATION_TONE: Record<ApplicationStatus, keyof typeof TONE> = {
  pending: 'amber',
  accepted: 'green',
  rejected: 'red',
  withdrawn: 'gray',
}

const JOB_TONE: Record<JobStatus, keyof typeof TONE> = {
  draft: 'gray',
  open: 'green',
  in_progress: 'blue',
  closed: 'gray',
  completed: 'green',
  cancelled: 'red',
}

function Pill({ tone, children }: { tone: keyof typeof TONE; children: React.ReactNode }) {
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONE[tone]}`}>
      {children}
    </span>
  )
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <Pill tone={APPLICATION_TONE[status]}>{APPLICATION_STATUS_LABEL[status]}</Pill>
}

export function JobStatusBadge({ status }: { status: JobStatus }) {
  return <Pill tone={JOB_TONE[status]}>{JOB_STATUS_LABEL[status]}</Pill>
}
