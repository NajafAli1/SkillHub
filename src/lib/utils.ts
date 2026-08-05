// Menolak URL absolut/protokol-relatif (mis. "//evil.com" atau "/\evil.com",
// yang dinormalisasi sebagian browser jadi "//evil.com") supaya ?next= dari
// middleware tidak bisa dipakai untuk open redirect.
export function safeNext(next: string | null | undefined): string | null {
  if (!next) return null
  if (!next.startsWith('/')) return null
  if (next.startsWith('//') || next.startsWith('/\\')) return null
  return next
}
