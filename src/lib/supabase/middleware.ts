import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import type { Database } from '@/types/database.types'

// Rute yang hanya boleh diakses setelah login
const PROTECTED_PREFIXES = ['/student', '/client', '/admin', '/onboarding']

// Rute auth yang tidak masuk akal dibuka kalau sudah login.
const AUTH_ROUTES = ['/auth/login', '/auth/register']

const updateSession = async (request: NextRequest) => {
    let supabaseResponse = NextResponse.next({ request});

    const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
        cookies: {
            getAll() {
                return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => {
                    request.cookies.set(name, value)
                })
                supabaseResponse = NextResponse.next({ request })
                cookiesToSet.forEach(({ name, value, options}) => {
                    supabaseResponse.cookies.set(name, value, options)
                })
            },
        },
    },
)

  // JANGAN sisipkan kode apa pun di antara createServerClient dan getUser().
  // getUser() memvalidasi token ke server Supabase dan memicu refresh
  // kalau sudah kedaluwarsa. Kode di antaranya bisa membuat sesi
  // ter-refresh sebagian dan user logout secara acak.

    const { data: { user }, } = await supabase.auth.getUser();
    const { pathname } = request.nextUrl;

    const isProtected = PROTECTED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )

    if (!user && isProtected) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        url.searchParams.set('next', pathname)
        return NextResponse.redirect(url)
    }

    if (user && AUTH_ROUTES.includes(pathname)) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        url.search = ''
        return NextResponse.redirect(url)
    }

    // jika membuat nextresponse baru cookie sesi yang baru tidak akan tersimpan.
    // dan tidak ikut dikirim ke browser. dan user akan logout secara acak.
    return supabaseResponse
}

export default updateSession