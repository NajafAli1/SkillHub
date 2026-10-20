import Link from 'next/link'
import Image from 'next/image'
import { FaSearch } from 'react-icons/fa'
import { MdVerified, MdGridView } from 'react-icons/md'

import type { Category } from '@/lib/queries/jobs'

const POPULAR_SEARCHES = ['Logo', 'Landing Page', 'Artikel', 'Video Editing']

export function HeroSection({ categories }: { categories: Category[] }) {
  return (
    <section className="relative w-full overflow-hidden bg-surface px-4 pb-12 pt-10 sm:px-6 md:pt-16 lg:px-12">
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center text-center">
        <div className="flex max-w-3xl flex-col items-center gap-5 md:gap-6">
          <span className="flex items-center gap-2 rounded-full bg-surface-variant px-4 py-1.5 text-xs font-medium text-on-surface-variant shadow-sm sm:text-sm">
            <MdVerified className="text-lg text-primary" /> Selamat Datang di SkillHub
          </span>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl">
            Kerja lepas pertama, mulai dari sini
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-on-surface-variant md:text-lg">
            Platform yang menghubungkan mahasiswa berbakat dengan klien untuk proyek freelance yang bermakna.
            Bangun portofolio sambil kuliah.
          </p>

          <form
            action="/jobs"
            method="get"
            role="search"
            className="mt-2 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-outline-variant bg-surface-container-lowest p-2 shadow-lg md:flex-row md:rounded-full"
          >
            <label className="flex flex-1 items-center px-4 py-2">
              <FaSearch className="mr-3 shrink-0 text-outline" />
              <span className="sr-only">Kata kunci</span>
              <input
                type="search"
                name="q"
                placeholder="Cari skill atau judul proyek..."
                className="w-full border-none bg-transparent text-sm text-on-surface outline-none placeholder:text-outline"
              />
            </label>

            <div className="hidden h-8 w-px self-center bg-outline-variant md:block"></div>
            <div className="h-px bg-outline-variant/60 md:hidden"></div>

            <label className="flex flex-1 items-center px-4 py-2">
              <MdGridView className="mr-3 shrink-0 text-lg text-outline" />
              <span className="sr-only">Kategori</span>
              <select
                name="category"
                defaultValue=""
                className="w-full cursor-pointer appearance-none border-none bg-transparent text-sm text-on-surface outline-none"
              >
                <option value="">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-container px-8 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary md:rounded-full"
            >
              <FaSearch />
              Cari
            </button>
          </form>

          <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="font-medium text-on-surface-variant">Populer:</span>
            {POPULAR_SEARCHES.map((tag) => (
              <Link
                key={tag}
                href={`/jobs?q=${encodeURIComponent(tag)}`}
                className="rounded-full border border-outline-variant bg-surface-container px-3 py-1 text-on-surface-variant transition-colors hover:bg-surface-variant"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex w-full max-w-2xl justify-center">
          <Image
            src="/assets/ilustator/ilustrasi.png"
            alt="Mahasiswa bekerja lepas di kafe"
            width={800}
            height={500}
            sizes="(max-width: 768px) 100vw, 672px"
            className="h-auto w-full rounded-2xl object-contain"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  )
}
