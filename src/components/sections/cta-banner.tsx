import Link from 'next/link'

export function CtaBanner() {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Sisi Mahasiswa */}
        <div className="bg-[#f3fde8] border border-[#dce6d1] rounded-[16px] p-6 sm:p-8 lg:p-12 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-[#00623f] uppercase tracking-wider">Untuk Mahasiswa</span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#161e11] mt-2 mb-4">
              Siap Menambah Penghasilan & Pengalaman?
            </h3>
            <p className="text-[#3f4942] text-sm leading-relaxed mb-8">
              Temukan ratusan proyek freelance dari Klien terpercaya yang menghargai fleksibilitas jadwal kuliahmu.
            </p>
          </div>
          <div>
            <Link
              href="/auth/register?role=student"
              className="inline-block bg-[#1c7c54] text-white text-sm font-semibold px-6 py-3 rounded-[10px] hover:bg-[#00623f] transition-colors"
            >
              Daftar Sebagai Student
            </Link>
          </div>
        </div>

        {/* Sisi Klien */}
        <div className="bg-[#2a3325] text-white rounded-[16px] p-6 sm:p-8 lg:p-12 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-[#7fd8a9] uppercase tracking-wider">Untuk Klien & Bisnis</span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mt-2 mb-4">
              Butuh Talent Mahasiswa Berbakat?
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              Pasang lowongan proyekmu dan dapatkan kandidat mahasiswa terbaik sesuai kriteria serta budget bisnismu.
            </p>
          </div>
          <div>
            <Link
              href="/auth/register?role=client"
              className="inline-block bg-[#7fd8a9] text-[#002112] text-sm font-semibold px-6 py-3 rounded-[10px] hover:bg-white transition-colors"
            >
              Pasang Lowongan Proyek
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
