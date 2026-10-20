import Link from 'next/link'
import Image from 'next/image'

import { logout } from '@/app/auth/actions'
import { dashboardPath, displayName, getProfile } from '@/lib/auth'
import { MobileMenu } from './mobile-menu'

const NAV_LINKS = [
  { href: '/jobs', label: 'Cari Lowongan' },
  { href: '/#kategori', label: 'Kategori' },
  { href: '/#cara-kerja', label: 'Cara Kerja' },
]

export async function Navbar() {
  const profile = await getProfile()
  const session = profile
    ? { name: displayName(profile), dashboard: dashboardPath(profile.role) }
    : null

  return (
    <header className="sticky top-0 z-50 border-b border-border-card/60 bg-surface-container-lowest/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 md:h-20 lg:px-12">
        <Link href="/" className="group flex shrink-0 items-center gap-2">
          <Image
            src="/assets/icons/logo-navbar-lg.png"
            alt="Logo SkillHub"
            width={48}
            height={48}
            className="h-9 w-9 md:h-12 md:w-12"
          />
          <span className="text-lg font-bold text-primary md:text-xl">SkillHub</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-primary md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary-container">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {session ? (
            <>
              <Link
                href={session.dashboard}
                className="rounded-[10px] bg-primary-container px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary"
              >
                Dashboard
              </Link>
              <form action={logout}>
                <button type="submit" className="px-3 py-2 text-sm font-semibold text-primary hover:underline">
                  Keluar
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="px-3 py-2 text-sm font-semibold text-primary hover:underline">
                Masuk
              </Link>
              <Link
                href="/auth/register"
                className="rounded-[10px] bg-primary-container px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary"
              >
                Daftar Sekarang
              </Link>
            </>
          )}
        </div>

        <MobileMenu links={NAV_LINKS} session={session} logoutAction={logout} />
      </div>
    </header>
  )
}
