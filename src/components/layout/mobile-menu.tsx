'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HiMenu, HiX } from 'react-icons/hi'

type Props = {
  links: { href: string; label: string }[]
  session: { name: string; dashboard: string } | null
  logoutAction: () => Promise<void>
}

export function MobileMenu({ links, session, logoutAction }: Props) {
  const pathname = usePathname()
  // Menu dianggap terbuka hanya untuk halaman tempat ia dibuka,
  // jadi otomatis tertutup saat pindah halaman.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null)

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Tutup menu' : 'Buka menu'}
        className="rounded-lg p-2 text-2xl text-primary hover:bg-surface-container"
      >
        {open ? <HiX /> : <HiMenu />}
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-border-card bg-surface-container-lowest px-4 pb-5 pt-2 shadow-lg"
        >
          <nav className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-on-surface hover:bg-surface-container"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-3 flex flex-col gap-2 border-t border-border-card pt-4">
            {session ? (
              <>
                <p className="px-3 text-xs text-on-surface-variant">Masuk sebagai {session.name}</p>
                <Link
                  href={session.dashboard}
                  className="rounded-[10px] bg-primary-container px-4 py-3 text-center text-sm font-medium text-white"
                >
                  Dashboard
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full rounded-[10px] border border-border-card px-4 py-3 text-sm font-semibold text-primary"
                  >
                    Keluar
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="rounded-[10px] bg-primary-container px-4 py-3 text-center text-sm font-medium text-white"
                >
                  Daftar Sekarang
                </Link>
                <Link
                  href="/auth/login"
                  className="rounded-[10px] border border-border-card px-4 py-3 text-center text-sm font-semibold text-primary"
                >
                  Masuk
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
