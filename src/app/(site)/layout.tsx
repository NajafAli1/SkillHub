import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
