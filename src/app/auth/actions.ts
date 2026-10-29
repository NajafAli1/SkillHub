'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import createClient from '@/lib/supabase/server'
import { dashboardPath } from '@/lib/auth'
import { safeNext } from '@/lib/utils'
import { loginSchema, registerSchema } from '@/lib/validations/auth'

export type AuthActionState = {
  error?: string
  fieldErrors?: Record<string, string[]>
  info?: string
} | null

// Pesan error Supabase Auth berbahasa Inggris; terjemahkan yang umum
// dan beri pesan generik untuk sisanya.
function translateAuthError(error: { code?: string; message: string; status?: number }): string {
  switch (error.code) {
    case 'invalid_credentials':
      return 'Email atau password salah.'
    case 'email_not_confirmed':
      return 'Email belum dikonfirmasi. Cek kotak masuk email kamu.'
    case 'user_already_exists':
    case 'email_exists':
      return 'Email ini sudah terdaftar. Silakan masuk.'
    case 'weak_password':
      return 'Password terlalu lemah. Gunakan kombinasi huruf dan angka.'
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.'
    case 'signup_disabled':
      return 'Pendaftaran sedang ditutup.'
  }
  if (error.status === 429) return 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.'
  console.error('Supabase auth error:', error.code, error.message)
  return 'Terjadi kesalahan. Silakan coba lagi.'
}

export async function login(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: translateAuthError(error) }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  const role = profile?.role ?? 'student'
  const next = safeNext(formData.get('next') as string | null)

  redirect(next ?? dashboardPath(role))
}

export async function register(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    full_name: formData.get('full_name'),
    nickname: formData.get('nickname'),
    role: formData.get('role'),
  })

  if (!parsed.success) {
    return { fieldErrors: z.flattenError(parsed.error).fieldErrors }
  }

  const { email, password, full_name, nickname, role } = parsed.data

  const supabase = await createClient()
  const origin = (await headers()).get('origin')
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Link konfirmasi email kembali ke route callback supaya sesi dibuat.
      emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
      data: {
        full_name,
        nickname: nickname || undefined,
        role,
      },
    },
  })

  if (error) {
    return { error: translateAuthError(error) }
  }

  // Confirmasi email aktif di project ini: signUp tidak langsung memberi
  // session. Kalau suatu saat confirmasi dimatikan, data.session akan
  // langsung terisi dan user bisa langsung diarahkan ke dashboard.
  if (!data.session) {
    return { info: 'Akun dibuat. Cek email kamu untuk konfirmasi sebelum login.' }
  }

  redirect(dashboardPath(role))
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}
