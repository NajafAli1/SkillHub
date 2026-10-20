type Stats = { openJobs: number; students: number; clients: number }

// Angka baru ditampilkan setelah platform punya cukup data, supaya
// landing page tidak memamerkan "0 lowongan" di awal peluncuran.
const MIN_TOTAL_TO_SHOW = 10

export function TrustStrip({ stats }: { stats: Stats }) {
  if (stats.openJobs + stats.students + stats.clients < MIN_TOTAL_TO_SHOW) return null

  const items = [
    { label: 'Lowongan Aktif', value: stats.openJobs },
    { label: 'Mahasiswa Terdaftar', value: stats.students },
    { label: 'Client Terdaftar', value: stats.clients },
  ]

  return (
    <section className="border-y border-border-card bg-white py-6 md:py-8">
      <div className="mx-auto grid max-w-[1440px] grid-cols-3 gap-2 divide-x divide-border-card px-4 text-center sm:px-6 lg:px-12">
        {items.map((item) => (
          <div key={item.label}>
            <p className="mb-1 text-2xl font-extrabold text-primary sm:text-3xl lg:text-4xl">
              {item.value.toLocaleString('id-ID')}
            </p>
            <p className="text-xs font-medium text-on-surface-variant sm:text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
