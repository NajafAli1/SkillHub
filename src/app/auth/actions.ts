'use server'

import { redirect } from 'next/navigation'

import createClient from '@/lib/supabase/server'
import { dashboardPath } from '@/lib/auth'
import { safeNext } from '@/lib/utils'
import { loginSchema, registerSchema } from '@/lib/validations/auth'

export type AuthActionState = {
  error?: string
  fieldErrors?: Record<string, string[]>
  info?: string
} | null

export async function login(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: error.message }
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
    return { fieldErrors: parsed.error.flatten().fieldErrors }
  }

  const { email, password, full_name, nickname, role } = parsed.data

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        nickname: nickname || undefined,
        role,
      },
    },
  })

  if (error) {
    return { error: error.message }
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
