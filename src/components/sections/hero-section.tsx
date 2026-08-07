import Link from 'next/link'
import Image from 'next/image'
import { FaSearch, FaArrowUp } from 'react-icons/fa'
import { MdVerified, MdGridView, MdDesignServices, MdTrendingUp } from 'react-icons/md'

export function HeroSection() {
  return (
    <section className="bg-surface w-full pt-16 pb-12 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        
        {/* Header Content */}
        <div className="flex flex-col gap-6 max-w-3xl items-center">
          {/* Badge Welcome */}
          <span className="bg-surface-variant text-on-surface-variant px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
            <MdVerified className="text-[#00623f] text-lg" /> Selamat Datang di SkillHub
          </span>

          {/* Headline Utama */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#00623f] leading-tight tracking-tight">
            Kerja lepas pertama, mulai dari sini
          </h1>

          {/* Subheadline */}
          <p className="text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Platform yang menghubungkan mahasiswa berbakat dengan klien untuk proyek freelance yang bermakna. Bangun portofolio Anda sambil kuliah.
          </p>

          {/* Search Box Pill */}
          <div className="bg-surface-container-lowest shadow-lg border border-outline-variant rounded-full p-2 flex flex-col md:flex-row gap-2 mt-4 w-full max-w-2xl">
            {/* Input Keyword */}
            <div className="flex-1 flex items-center px-4 py-2 bg-transparent">
              <FaSearch className="text-outline mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Cari skill atau judul proyek..."
                className="w-full border-none outline-none bg-transparent text-sm text-on-surface placeholder:text-outline-variant focus:ring-0"
              />
            </div>

            {/* Separator Divider */}
            <div className="w-px h-8 bg-outline-variant hidden md:block self-center"></div>

            {/* Dropdown Kategori */}
            <div className="flex-1 flex items-center px-4 py-2 bg-transparent">
              <MdGridView className="text-outline mr-3 text-lg shrink-0" />
              <select className="w-full border-none outline-none bg-transparent text-sm text-on-surface focus:ring-0 appearance-none cursor-pointer">
                <option value="">Semua Kategori</option>
                <option value="design">Desain Grafis</option>
                <option value="web">Web Development</option>
                <option value="writing">Penulisan</option>
              </select>
            </div>

            {/* Button Cari */}
            <button className="bg-primary-container text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-tertiary transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0">
              <FaSearch />
              Cari
            </button>
          </div>

          {/* Popular Tags */}
          <div className="flex items-center justify-center gap-2 mt-2 flex-wrap text-xs">
            <span className="text-on-surface-variant font-medium">Populer:</span>
            {['Logo Design', 'Web Landing Page', 'Artikel SEO'].map((tag) => (
              <Link
                key={tag}
                href={`/jobs?search=${encodeURIComponent(tag)}`}
                className="bg-surface-container text-on-surface-variant border border-outline-variant px-3 py-1 rounded-full hover:bg-surface-variant transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Hero Image & Floating Cards */}
        <div className="w-full flex justify-center items-end mt-10 relative max-w-4xl">
          {/* Gambar Hero Mahasiswa Bekerja */}
          <Image
            src="/assets/ilustator/ilustrasi.png"
            alt="Mahasiswa bekerja lepas di cafe"
            width={800}
            height={500}
            className="w-full max-w-2xl object-contain relative z-10 rounded-2xl"
            priority
            unoptimized
          />

          {/* Floating Card Kiri (Desain Grafis) */}
          <div className="absolute left-0 top-1/4 bg-surface-container-lowest p-4 rounded-2xl shadow-xl border border-outline-variant hidden lg:flex flex-col gap-2 z-20 text-left min-w-[200px]">
            <div className="flex items-center gap-3">
              <div className="bg-primary-container text-white p-2.5 rounded-full flex items-center justify-center">
                <MdDesignServices className="text-xl" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-background">Desain Grafis</p>
                <p className="text-xs text-on-surface-variant">Kategori Teratas</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 mt-2">
              <div className="flex flex-col">
                <span className="text-xs text-outline">Proyek Selesai</span>
                <span className="text-lg font-bold text-on-background">1,248</span>
              </div>
              <div className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-md text-xs font-bold">
                +12%
              </div>
            </div>
          </div>

          {/* Floating Card Kanan (Klien Aktif) */}
          <div className="absolute right-0 bottom-1/4 bg-surface-container-lowest p-4 rounded-2xl shadow-xl border border-outline-variant hidden lg:flex flex-col gap-2 z-20 text-left min-w-[180px]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-on-background">Klien Aktif</span>
                <MdTrendingUp className="text-primary text-xl" />
              </div>
              <span className="text-2xl font-bold text-on-background">3,592</span>
              <div className="flex items-center gap-1 text-primary">
                <FaArrowUp className="text-xs" />
                <span className="text-xs font-bold">8.4% minggu ini</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}