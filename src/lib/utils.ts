// Menolak URL absolut/protokol-relatif (mis. "//evil.com" atau "/\evil.com",
// yang dinormalisasi sebagian browser jadi "//evil.com") supaya ?next= dari
// middleware tidak bisa dipakai untuk open redirect.
export function safeNext(next: string | null | undefined): string | null {
  if (!next) return null
  if (!next.startsWith('/')) return null
  if (next.startsWith('//') || next.startsWith('/\\')) return null
  return next
}

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function formatBudget(
  min: number | null,
  max: number | null,
  paymentType: 'fixed' | 'hourly' = 'fixed',
): string {
  const suffix = paymentType === 'hourly' ? ' / jam' : ''
  if (min != null && max != null && min !== max) {
    return `${rupiah.format(min)} - ${rupiah.format(max)}${suffix}`
  }
  const value = max ?? min
  return value != null ? `${rupiah.format(value)}${suffix}` : 'Budget dinegosiasikan'
}

const relative = new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' })

export function timeAgo(iso: string): string {
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000)
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ]
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit)
  }
  return 'baru saja'
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const LOCATION_LABEL = {
  remote: 'Remote',
  onsite: 'Onsite',
  hybrid: 'Hybrid',
} as const

export const JOB_STATUS_LABEL = {
  draft: 'Draft',
  open: 'Dibuka',
  in_progress: 'Berjalan',
  closed: 'Ditutup',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
} as const

export const APPLICATION_STATUS_LABEL = {
  pending: 'Menunggu',
  accepted: 'Diterima',
  rejected: 'Ditolak',
  withdrawn: 'Ditarik',
} as const
