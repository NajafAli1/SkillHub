import Link from 'next/link'
import { JobCard, JobCardProps } from '../ui/job-card'

export function LatestJobs() {
  const dummyJobs: JobCardProps[] = [
    {
      id: '1',
      companyName: 'Studio Nusantara',
      isVerified: true,
      title: 'Redesign UI/UX Mobile App Marketplace Edukasi',
      budget: 'Rp 2.500.000 - Rp 4.000.000',
      locationType: 'Remote',
      skills: ['Figma', 'UI/UX', 'Mobile App'],
      postedAt: '2 jam lalu',
    },
    {
      id: '2',
      companyName: 'Kopi Kenangan Tech',
      isVerified: true,
      title: 'Frontend Developer Next.js & Tailwind CSS',
      budget: 'Rp 3.000.000 - Rp 5.000.000',
      locationType: 'Hybrid',
      skills: ['Next.js', 'React', 'Tailwind'],
      postedAt: '4 jam lalu',
    },
    {
      id: '3',
      companyName: 'Agency Kreatif Media',
      isVerified: false,
      title: 'Penulis Artikel Content Marketing (10 Artikel)',
      budget: 'Rp 1.000.000 - Rp 1.500.000',
      locationType: 'Remote',
      skills: ['Copywriting', 'SEO', 'Bahasa Indonesia'],
      postedAt: '5 jam lalu',
    },
    {
      id: '4',
      companyName: 'Brand Fashion Lokal',
      isVerified: true,
      title: 'Video Editor Reels & TikTok (Kontrak 1 Bulan)',
      budget: 'Rp 2.000.000 - Rp 3.000.000',
      locationType: 'Remote',
      skills: ['CapCut', 'Premiere Pro', 'Social Media'],
      postedAt: '1 hari lalu',
    },
    {
      id: '5',
      companyName: 'Startup AgriTech',
      isVerified: true,
      title: 'Desain Maskot & Aset Ilustrasi Brand',
      budget: 'Rp 1.800.000 - Rp 2.500.000',
      locationType: 'Onsite',
      skills: ['Illustration', 'Vector', 'Branding'],
      postedAt: '1 hari lalu',
    },
    {
      id: '6',
      companyName: 'Lembaga Pelatihan',
      isVerified: true,
      title: 'Asisten Data Entry & Visualisasi Dashboard',
      budget: 'Rp 800.000 - Rp 1.200.000',
      locationType: 'Remote',
      skills: ['Excel', 'Google Sheets', 'Data Cleaning'],
      postedAt: '2 hari lalu',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-[#161e11]">Lowongan Terbaru</h2>
            <p className="text-[#3f4942] mt-2">Daftar proyek freelance terbaru yang diposting oleh klien terverifikasi</p>
          </div>
          <Link href="/jobs" className="text-sm font-bold text-[#1c7c54] hover:underline hidden sm:block">
            Lihat Semua Lowongan &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyJobs.map((job) => (
            <JobCard key={job.id} {...job} />
          ))}
        </div>
      </div>
    </section>
  )
}
