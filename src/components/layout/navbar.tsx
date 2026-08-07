import Link from 'next/link'
import Image from 'next/image'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-surface-container-lowest/80 backdrop-blur-sm">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Wordmark */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/assets/icons/logo-navbar-lg.png"
            alt='Logo SkillHub'
            width={48}
            height={48}
          />
          <span className="text-xl font-bold text-[#016C3D] group-hover:text-primary transition-colors">SkillHub</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-primary">
          <Link href="#job " className="hover:text-inverse-primary transition-colors">Cari Freelancer</Link>
          <Link href="#kategori" className="hover:text-inverse-primary transition-colors">Kategori</Link>
          <Link href="#cara-kerja" className="hover:text-inverse-primary transition-colors">Cara Kerja</Link>
          <Link href="#testimoni" className="hover:text-inverse-primary transition-colors">Testimoni</Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-semibold text-[#00623f] hover:underline px-3 py-2">
            Masuk
          </Link>
          <Link
            href="/auth/register"
            className="bg-[#1c7c54] text-white text-sm font-medium px-5 py-2.5 rounded-[10px] hover:bg-[#00623f] transition-colors shadow-none"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </header>
  )
}
