import type { Metadata } from 'next'
import Link from 'next/link'

import { requireRole } from '@/lib/auth'
import { listCategories, listSkills } from '@/lib/queries/jobs'
import { JobForm } from './job-form'

export const metadata: Metadata = { title: 'Pasang Lowongan · SkillHub' }

export default async function NewJobPage() {
  await requireRole('client')
  const [categories, skills] = await Promise.all([listCategories(), listSkills()])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 md:py-12">
      <Link href="/client" className="text-sm font-medium text-on-surface-variant hover:text-primary">
        &larr; Dashboard
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-on-surface md:text-3xl">Pasang Lowongan</h1>
      <p className="mt-1 text-sm text-on-surface-variant">
        Jelaskan proyekmu sejelas mungkin supaya mahasiswa yang tepat melamar.
      </p>
      <div className="mt-6 rounded-2xl border border-border-card bg-white p-5 sm:p-8">
        <JobForm categories={categories} skills={skills} />
      </div>
    </div>
  )
}
