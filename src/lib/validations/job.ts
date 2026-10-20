import { z } from 'zod'

// Input angka dari form datang sebagai string; kosong = null.
const optionalAmount = z.preprocess(
  (v) => (v === '' || v == null ? null : Number(v)),
  z.number({ error: 'Harus berupa angka' }).min(0, 'Tidak boleh negatif').max(10_000_000_000).nullable(),
)

const optionalText = (max: number) =>
  z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? null : v), z.string().trim().max(max).nullable())

export const jobSchema = z
  .object({
    title: z.string().trim().min(5, 'Judul minimal 5 karakter').max(150, 'Judul maksimal 150 karakter'),
    description: z.string().trim().min(20, 'Deskripsi minimal 20 karakter').max(5000, 'Deskripsi maksimal 5000 karakter'),
    category_id: z.uuid('Pilih kategori'),
    payment_type: z.enum(['fixed', 'hourly']),
    budget_min: optionalAmount,
    budget_max: optionalAmount,
    location_type: z.enum(['remote', 'onsite', 'hybrid']),
    location_detail: optionalText(120),
    deadline: z.preprocess(
      (v) => (v === '' || v == null ? null : v),
      z.iso.date('Tanggal tidak valid').nullable(),
    ),
    skill_ids: z.array(z.uuid()).max(10, 'Maksimal 10 skill'),
    intent: z.enum(['draft', 'open']),
  })
  .refine((d) => d.budget_min == null || d.budget_max == null || d.budget_min <= d.budget_max, {
    path: ['budget_max'],
    message: 'Budget maksimal harus lebih besar dari minimal',
  })

export type JobInput = z.infer<typeof jobSchema>

export const applicationSchema = z.object({
  job_id: z.uuid(),
  cover_letter: z
    .string()
    .trim()
    .min(30, 'Ceritakan dirimu minimal 30 karakter')
    .max(3000, 'Maksimal 3000 karakter'),
  proposed_rate: optionalAmount,
})

export const idSchema = z.uuid()
