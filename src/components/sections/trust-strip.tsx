export function TrustStrip() {
  const stats = [
    { label: 'Lowongan Aktif', value: '1,200+' },
    { label: 'Mahasiswa Terdaftar', value: '8,500+' },
    { label: 'Client Terverifikasi', value: '450+' },
  ]

  return (
    <section className="bg-white border-y border-[#e3e8de] py-8">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#e3e8de]">
        {stats.map((stat) => (
          <div key={stat.label} className="pt-4 md:pt-0">
            <p className="text-3xl lg:text-4xl font-extrabold text-[#00623f] mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-[#3f4942]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
