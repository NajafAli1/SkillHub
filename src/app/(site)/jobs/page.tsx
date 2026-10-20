import type { Metadata } from 'next'
import Link from 'next/link'
import { FaSearch } from 'react-icons/fa'

import { JobCard } from '@/components/ui/job-card'
import { listCategories, listOpenJobs } from '@/lib/queries/jobs'

export const metadata: Metadata = { title: 'Cari Lowongan · SkillHub' }

type SearchParams = Promise<{ q?: string | string[]; category?: string | string[] }>

const first = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v)?.trim() || undefined

export default async function JobsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const q = first(params.q)
  const category = first(params.category)

  const [categories, jobs] = await Promise.all([
    listCategories(),
    listOpenJobs({ q, categorySlug: category, limit: 48 }),
  ])
  const activeCategory = categories.find((c) => c.slug === category)

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 md:py-12 lg:px-12">
      <h1 className="text-2xl font-bold text-on-surface md:text-3xl">Cari Lowongan</h1>
      <p className="mt-1 text-sm text-on-surface-variant md:text-base">
        {jobs.length} lowongan dibuka
        {activeCategory && <> di kategori <strong>{activeCategory.name}</strong></>}
        {q && <> untuk &ldquo;{q}&rdquo;</>}
      </p>

      <form action="/jobs" method="get" role="search" className="mt-6 flex flex-col gap-2 sm:flex-row">
        <label className="flex flex-1 items-center rounded-[10px] border border-outline-variant bg-white px-3">
          <FaSearch className="mr-2 shrink-0 text-outline" />
          <span className="sr-only">Kata kunci</span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Cari judul proyek..."
            className="w-full bg-transparent py-2.5 text-sm outline-none"
          />
        </label>
        <label className="sm:w-60">
          <span className="sr-only">Kategori</span>
          <select
            name="category"
            defaultValue={category ?? ''}
            className="w-full rounded-[10px] border border-outline-variant bg-white px-3 py-2.5 text-sm"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-[10px] bg-primary-container px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary"
        >
          Cari
        </button>
      </form>

      {jobs.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[12px] border border-dashed border-outline-variant bg-white px-6 py-12 text-center">
          <p className="font-semibold text-on-surface">Tidak ada lowongan yang cocok.</p>
          <p className="mt-1 text-sm text-on-surface-variant">Coba kata kunci lain atau lihat semua kategori.</p>
          {(q || category) && (
            <Link href="/jobs" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
              Hapus filter
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
