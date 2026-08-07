import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SkillHub',
  description: 'Platform kolaborasi mahasiswa dan client',
  icons: {
    icon: [
      { url: '/assets/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/assets/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/assets/icons/apple-touch-icon.png',
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className={plusJakartaSans.className}>{children}</body>
    </html>
  )
}
