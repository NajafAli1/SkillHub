import Link from 'next/link'

export function CategoryGrid() {
  const categories = [
    { name: 'Desain & Grafis', count: '320 lowongan', icon: '🎨' },
    { name: 'Web & App Dev', count: '240 lowongan', icon: '💻' },
    { name: 'Penulisan & Penerjemahan', count: '180 lowongan', icon: '✍️' },
    { name: 'Digital Marketing', count: '150 lowongan', icon: '📈' },
    { name: 'Video & Animasi', count: '110 lowongan', icon: '🎬' },
    { name: 'Fotografi & Edit', count: '95 lowongan', icon: '📷' },
    { name: 'Data Entry & Virtual Asst', count: '130 lowongan', icon: '📋' },
    { name: 'Tugas Kuliah & Riset', count: '75 lowongan', icon: '📚' },
  ]

  return (
    <section id="kategori" className="py-20 bg-[#fafbf8]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[#161e11]">Jelajahi Kategori Popular</h2>
            <p className="text-[#3f4942] mt-2">Temukan proyek yang sesuai dengan jurusan dan keahlianmu</p>
          </div>
          <Link href="/categories" className="text-sm font-bold text-[#1c7c54] hover:underline hidden sm:block">
            Lihat Semua Kategori &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/jobs?category=${encodeURIComponent(cat.name)}`}
              className="bg-white border border-[#e3e8de] rounded-[12px] p-6 hover:border-[#1c7c54] transition-all group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform inline-block">
                {cat.icon}
              </div>
              <h3 className="font-bold text-[#161e11] text-base group-hover:text-[#1c7c54] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{cat.count}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
