import 'server-only'

import createClient from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'

type Tables = Database['public']['Tables']
export type Category = Pick<Tables['categories']['Row'], 'id' | 'name' | 'slug'>
export type Skill = Pick<Tables['skills']['Row'], 'id' | 'name'>

// Bentuk data yang dipakai UI. Komponen tidak perlu tahu struktur join Supabase.
export type JobSummary = {
  id: string
  title: string
  budgetMin: number | null
  budgetMax: number | null
  paymentType: Database['public']['Enums']['payment_type']
  locationType: Database['public']['Enums']['location_type']
  postedAt: string
  category: { name: string; slug: string } | null
  clientName: string
  clientVerified: boolean
  skills: string[]
}

export type JobDetail = JobSummary & {
  clientId: string
  description: string
  locationDetail: string | null
  deadline: string | null
  status: Database['public']['Enums']['job_status']
}

const JOB_SELECT = `
  id, client_id, title, description, budget_min, budget_max, payment_type,
  location_type, location_detail, deadline, status, published_at, created_at,
  category:categories(name, slug),
  client:client_profiles(company_name, is_verified, profile:profiles(full_name, nickname)),
  job_skills(skill:skills(name))
`

type JobRow = {
  id: string
  client_id: string
  title: string
  description: string
  budget_min: number | null
  budget_max: number | null
  payment_type: JobSummary['paymentType']
  location_type: JobSummary['locationType']
  location_detail: string | null
  deadline: string | null
  status: JobDetail['status']
  published_at: string | null
  created_at: string
  category: { name: string; slug: string } | null
  client: {
    company_name: string | null
    is_verified: boolean
    profile: { full_name: string; nickname: string | null } | null
  } | null
  job_skills: { skill: { name: string } | null }[]
}

function toDetail(row: JobRow): JobDetail {
  const profile = row.client?.profile
  return {
    id: row.id,
    clientId: row.client_id,
    title: row.title,
    description: row.description,
    budgetMin: row.budget_min,
    budgetMax: row.budget_max,
    paymentType: row.payment_type,
    locationType: row.location_type,
    locationDetail: row.location_detail,
    deadline: row.deadline,
    status: row.status,
    postedAt: row.published_at ?? row.created_at,
    category: row.category,
    clientName:
      row.client?.company_name?.trim() ||
      profile?.nickname?.trim() ||
      profile?.full_name ||
      'Client',
    clientVerified: row.client?.is_verified ?? false,
    skills: row.job_skills.flatMap((js) => (js.skill ? [js.skill.name] : [])),
  }
}

// Karakter wildcard dibuang supaya input user tidak mengubah pola ILIKE.
function sanitizeSearch(q: string) {
  return q.replace(/[%_,()\\]/g, ' ').trim().slice(0, 100)
}

export async function listOpenJobs({
  q,
  categorySlug,
  limit = 24,
}: { q?: string; categorySlug?: string; limit?: number } = {}): Promise<JobSummary[]> {
  const supabase = await createClient()

  let query = supabase
    .from('jobs')
    .select(JOB_SELECT)
    .eq('status', 'open')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle()
    if (!category) return []
    query = query.eq('category_id', category.id)
  }

  const term = q ? sanitizeSearch(q) : ''
  if (term) query = query.ilike('title', `%${term}%`)

  const { data, error } = await query.returns<JobRow[]>()
  if (error) {
    console.error('listOpenJobs:', error.message)
    return []
  }
  return data.map(toDetail)
}

export async function getJob(id: string): Promise<JobDetail | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('jobs')
    .select(JOB_SELECT)
    .eq('id', id)
    .returns<JobRow[]>()
    .maybeSingle()
  if (error) {
    console.error('getJob:', error.message)
    return null
  }
  return data ? toDetail(data) : null
}

export async function listCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name')
  return data ?? []
}

export async function listCategoriesWithCount(): Promise<(Category & { openJobs: number })[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('id, name, slug, jobs(count)')
    .eq('is_active', true)
    .eq('jobs.status', 'open')
    .order('name')
  return (data ?? []).map(({ jobs, ...cat }) => ({
    ...cat,
    openJobs: (jobs as unknown as { count: number }[])[0]?.count ?? 0,
  }))
}

export async function listSkills(): Promise<Skill[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('skills').select('id, name').order('name')
  return data ?? []
}

export async function getPlatformStats() {
  const supabase = await createClient()
  const count = async (
    builder: PromiseLike<{ count: number | null }>,
  ) => (await builder).count ?? 0

  const [openJobs, students, clients] = await Promise.all([
    count(supabase.from('jobs').select('id', { count: 'exact', head: true }).eq('status', 'open')),
    count(supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student')),
    count(supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'client')),
  ])
  return { openJobs, students, clients }
}
