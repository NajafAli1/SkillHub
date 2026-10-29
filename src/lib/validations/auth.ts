import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  email: z.email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  full_name: z
    .string()
    .trim()
    .min(2, 'Nama minimal 2 karakter')
    .max(100, 'Nama maksimal 100 karakter'),
  nickname: z
    .string()
    .trim()
    .min(2, 'Nickname minimal 2 karakter')
    .max(50, 'Nickname maksimal 50 karakter')
    .optional()
    .or(z.literal('')),
  role: z.enum(['student', 'client'], {
    error: 'Pilih role terlebih dahulu',
  }),
})

export type RegisterInput = z.infer<typeof registerSchema>
