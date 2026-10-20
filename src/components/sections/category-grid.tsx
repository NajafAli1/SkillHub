import Link from 'next/link'

import type { Category } from '@/lib/queries/jobs'

const ICONS: Record<string, string> = {
  'desain-grafis': '🎨',
  'web-app-dev': '💻',
  penulisan: '✍️',
  'digital-marketing': '📈',
  'video-animasi': '🎬',
  fotografi: '📷',
  'data-entry': '📋',
  'riset-data': '📊',
}

export function CategoryGrid({ categories }: { categories: (Category & { openJobs: number })[] }) {
  if (categories.length === 0) return null

  return (
    <section id="kategori" className="scroll-mt-20 bg-[#fafbf8] py-14 md:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl font-bold text-on-surface md:text-3xl">Jelajahi Kategori Populer</h2>
          <p className="mt-2 text-sm text-on-surface-variant md:text-base">
            Temukan proyek yang sesuai dengan jurusan dan keahlianmu
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/jobs?category=${cat.slug}`}
              className="group rounded-[12px] border border-border-card bg-white p-4 transition-all hover:border-primary-container sm:p-6"
            >
              <div className="mb-3 inline-block text-2xl transition-transform group-hover:scale-110 sm:mb-4 sm:text-3xl">
                {ICONS[cat.slug] ?? '🧩'}
              </div>
              <h3 className="text-sm font-bold leading-snug text-on-surface transition-colors group-hover:text-primary-container sm:text-base">
                {cat.name}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {cat.openJobs > 0 ? `${cat.openJobs} lowongan` : 'Belum ada lowongan'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
