import { HeroSection } from '@/components/sections/hero-section'
import { TrustStrip } from '@/components/sections/trust-strip'
import { CategoryGrid } from '@/components/sections/category-grid'
import { LatestJobs } from '@/components/sections/latest-jobs'
import { HowItWorks } from '@/components/sections/how-it-works'
import { CtaBanner } from '@/components/sections/cta-banner'
import { getPlatformStats, listCategoriesWithCount, listOpenJobs } from '@/lib/queries/jobs'

export default async function HomePage() {
  const [categories, jobs, stats] = await Promise.all([
    listCategoriesWithCount(),
    listOpenJobs({ limit: 6 }),
    getPlatformStats(),
  ])

  return (
    <>
      <HeroSection categories={categories} />
      <TrustStrip stats={stats} />
      <CategoryGrid categories={categories} />
      <LatestJobs jobs={jobs} />
      <HowItWorks />
      <CtaBanner />
    </>
  )
}
