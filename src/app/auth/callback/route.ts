import { type NextRequest, NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

import { dashboardPath } from '@/lib/auth'
import createClient from '@/lib/supabase/server'
import { safeNext } from '@/lib/utils'

// Menangani dua alur konfirmasi Supabase:
// - token_hash + type: link konfirmasi email (verifyOtp) — dipakai signup,
//   ganti email, recovery.
// - code: PKCE / OAuth (exchangeCodeForSession).
// Jangan asumsikan hanya salah satu yang akan dipakai.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const next = safeNext(searchParams.get('next'))

  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  const supabase = await createClient()

  const { error } = tokenHash && type
    ? await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    : code
      ? await supabase.auth.exchangeCodeForSession(code)
      : { error: { message: 'Tautan konfirmasi tidak valid.' } }

  if (error) {
    const url = new URL('/auth/login', origin)
    url.searchParams.set('error', error.message)
    return NextResponse.redirect(url)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('role').eq('id', user.id).single()
    : { data: null }

  return NextResponse.redirect(
    new URL(next ?? dashboardPath(profile?.role ?? 'student'), origin),
  )
}
