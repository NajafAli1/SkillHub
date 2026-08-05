import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'SkillHub',
  description: 'Platform kolaborasi mahasiswa dan client',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  )
}
