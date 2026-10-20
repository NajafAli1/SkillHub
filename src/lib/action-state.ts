// Bentuk hasil server action yang dipakai bersama oleh form (useActionState).
export type ActionState = {
  error?: string
  fieldErrors?: Record<string, string[] | undefined>
  info?: string
} | null

// Kode error PostgreSQL yang relevan untuk pesan ke user.
export const PG_UNIQUE_VIOLATION = '23505'
export const PG_RLS_VIOLATION = '42501'
