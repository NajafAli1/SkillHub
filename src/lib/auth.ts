import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database.types'

export type UserRole = Database['public']['enum']['user_role']
export type Profile = Database['public']['Tables']['profiles']['Row']

