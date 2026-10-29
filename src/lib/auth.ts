import { cache } from 'react'
import { redirect } from 'next/navigation'
import createClient from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'

export type UserRole = Database['public']['Enums']['user_role']
export type Profile = Database['public']['Tables']['profiles']['Row']

export const getUser = cache(async () => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()
    return user
})

export const getProfile = cache(async (): Promise<Profile | null> => {
    const user = await getUser ()
    if (!user) return null

    const supabase = await createClient()
    const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

    return data
})

// nama nickname yang akan di tampilkan dan kalau ada
export function displayName(profile: Pick<Profile, 'full_name' | 'nickname'>) {
    return profile.nickname?.trim() || profile.full_name
}

// validasi user login
export async function requireUser() {
    const user = await getUser()
    if (!user) redirect('/auth/login')
    return user
}

// validasi user sesuai role
export async function requireRole(...allowed: UserRole[]) {
    const profile = await getProfile()
    if (!profile) redirect('/auth/login')
    if (!allowed.includes(profile.role)) {
        redirect (dashboardPath(profile.role))
    }

    return profile
}

export function dashboardPath(role: UserRole) {
    switch (role) {
        case 'client':
            return '/client'
        case 'admin':
            return '/admin'
        default:
            return '/student'    
    }
}