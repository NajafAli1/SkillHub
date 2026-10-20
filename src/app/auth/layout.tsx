import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="mx-auto flex w-full max-w-md items-center justify-between px-4 pt-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/icons/logo-navbar-lg.png" alt="Logo SkillHub" width={36} height={36} />
          <span className="text-lg font-bold text-primary">SkillHub</span>
        </Link>
        <Link href="/" className="text-sm font-medium text-on-surface-variant hover:text-primary">
          &larr; Beranda
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-8">
        <div className="rounded-2xl border border-border-card bg-white p-6 shadow-sm sm:p-8">{children}</div>
      </main>
    </div>
  )
}
