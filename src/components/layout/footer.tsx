import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#f3fde8] border-t border-[#e3e8de] pt-16 pb-12">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
        {/* Wordmark & Info */}
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-3 h-6 bg-[#00623f] rounded-full inline-block"></span>
            <span className="text-2xl font-bold text-[#00623f] tracking-tight">SkillHub</span>
          </Link>
          <p className="text-sm text-[#3f4942] max-w-sm leading-relaxed">
            Marketplace terdepan yang menghubungkan mahasiswa talenta terbaik Indonesia dengan kebutuhan proyek industri & usaha.
          </p>
          <p className="text-xs text-gray-500 pt-4">
            &copy; {new Date().getFullYear()} SkillHub Indonesia. All rights reserved.
          </p>
        </div>

        {/* Kolom Link 1 */}
        <div>
          <h4 className="font-bold text-[#161e11] text-sm mb-4">Kategori</h4>
          <ul className="space-y-2.5 text-xs text-[#3f4942]">
            <li><Link href="/jobs?cat=design" className="hover:text-[#00623f]">Desain Grafis</Link></li>
            <li><Link href="/jobs?cat=web" className="hover:text-[#00623f]">Web Development</Link></li>
            <li><Link href="/jobs?cat=writing" className="hover:text-[#00623f]">Penulisan Konten</Link></li>
            <li><Link href="/jobs?cat=video" className="hover:text-[#00623f]">Video Editing</Link></li>
          </ul>
        </div>

        {/* Kolom Link 2 */}
        <div>
          <h4 className="font-bold text-[#161e11] text-sm mb-4">Perusahaan</h4>
          <ul className="space-y-2.5 text-xs text-[#3f4942]">
            <li><Link href="/about" className="hover:text-[#00623f]">Tentang Kami</Link></li>
            <li><Link href="/careers" className="hover:text-[#00623f]">Karir</Link></li>
            <li><Link href="/blog" className="hover:text-[#00623f]">Blog & Artikel</Link></li>
          </ul>
        </div>

        {/* Kolom Link 3 */}
        <div>
          <h4 className="font-bold text-[#161e11] text-sm mb-4">Dukungan</h4>
          <ul className="space-y-2.5 text-xs text-[#3f4942]">
            <li><Link href="/help" className="hover:text-[#00623f]">Pusat Bantuan</Link></li>
            <li><Link href="/terms" className="hover:text-[#00623f]">Syarat & Ketentuan</Link></li>
            <li><Link href="/privacy" className="hover:text-[#00623f]">Kebijakan Privasi</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
