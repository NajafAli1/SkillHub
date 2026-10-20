import Link from 'next/link'

const CATEGORY_LINKS = [
  { slug: 'desain-grafis', label: 'Desain & Grafis' },
  { slug: 'web-app-dev', label: 'Web & App Development' },
  { slug: 'penulisan', label: 'Penulisan & Penerjemahan' },
  { slug: 'video-animasi', label: 'Video & Animasi' },
]

export function Footer() {
  return (
    <footer className="border-t border-border-card bg-surface pb-10 pt-12 md:pt-16">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-4 sm:grid-cols-2 sm:px-6 md:grid-cols-4 lg:px-12">
        <div className="space-y-4 sm:col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-block h-6 w-3 rounded-full bg-primary"></span>
            <span className="text-2xl font-bold tracking-tight text-primary">SkillHub</span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-on-surface-variant">
            Marketplace yang menghubungkan mahasiswa berbakat dengan kebutuhan proyek industri dan usaha.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold text-on-surface">Kategori</h4>
          <ul className="space-y-2.5 text-sm text-on-surface-variant">
            {CATEGORY_LINKS.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/jobs?category=${cat.slug}`} className="hover:text-primary">
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold text-on-surface">Mulai</h4>
          <ul className="space-y-2.5 text-sm text-on-surface-variant">
            <li><Link href="/jobs" className="hover:text-primary">Cari Lowongan</Link></li>
            <li><Link href="/auth/register?role=student" className="hover:text-primary">Daftar sebagai Mahasiswa</Link></li>
            <li><Link href="/auth/register?role=client" className="hover:text-primary">Pasang Lowongan</Link></li>
          </ul>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-[1440px] px-4 text-xs text-gray-500 sm:px-6 lg:px-12">
        &copy; {new Date().getFullYear()} SkillHub Indonesia. All rights reserved.
      </p>
    </footer>
  )
}
