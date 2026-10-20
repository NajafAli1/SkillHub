export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Buat Profil Skill',
      desc: 'Daftar menggunakan email kampus dan tampilkan keahlian serta contoh karya portofoliomu.',
    },
    {
      num: '02',
      title: 'Lamar Proyek',
      desc: 'Pilih lowongan freelance yang cocok dengan waktu luangmu, lalu kirimkan penawaran terbaik.',
    },
    {
      num: '03',
      title: 'Kerjakan & Terima Pembayaran',
      desc: 'Selesaikan pekerjaan sesuai deadline dan dapatkan imbalan langsung secara aman.',
    },
  ]

  return (
    <section id="cara-kerja" className="scroll-mt-20 py-14 md:py-20 bg-[#edf7e2]/50 border-y border-[#e3e8de]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#161e11]">Cara Kerja di SkillHub</h2>
        <p className="text-sm md:text-base text-[#3f4942] mt-2 max-w-xl mx-auto">
          Proses sederhana bagi mahasiswa untuk memulai pengalaman freelance secara profesional
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-10 md:mt-16">
          {steps.map((step) => (
            <div key={step.num} className="bg-white border border-[#e3e8de] rounded-[12px] p-6 md:p-8 text-left relative">
              <span className="text-3xl md:text-4xl font-extrabold text-[#73e2a7] block mb-3 md:mb-4">{step.num}</span>
              <h3 className="text-lg md:text-xl font-bold text-[#161e11] mb-2">{step.title}</h3>
              <p className="text-sm text-[#3f4942] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
