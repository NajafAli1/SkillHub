'use client'

import { Suspense, useActionState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { login, type AuthActionState } from '@/app/auth/actions'
import { FieldError, FormMessage, Label, SubmitButton, inputClass, submitWithoutReset } from '@/components/ui/form'

const initialState: AuthActionState = null

function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? ''
  // Teks dari URL tidak ditampilkan apa adanya supaya link tidak bisa dipakai
  // untuk menyisipkan pesan palsu.
  const callbackError = searchParams.has('error')
    ? 'Tautan konfirmasi tidak valid atau sudah kedaluwarsa. Silakan masuk atau daftar ulang.'
    : undefined
  const [state, formAction, pending] = useActionState(login, initialState)

  return (
    <form onSubmit={submitWithoutReset(formAction)} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <FormMessage error={state?.error ?? (state ? undefined : callbackError)} />

      <div>
        <Label htmlFor="email">Email</Label>
        <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
        <FieldError errors={state?.fieldErrors?.email} />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
        <FieldError errors={state?.fieldErrors?.password} />
      </div>

      <SubmitButton pending={pending} pendingText="Masuk..." className="w-full">Masuk</SubmitButton>

      <p className="text-center text-sm text-on-surface-variant">
        Belum punya akun?{' '}
        <Link href="/auth/register" className="font-semibold text-primary hover:underline">
          Daftar
        </Link>
      </p>
    </form>
  )
}

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-on-surface">Masuk ke SkillHub</h1>
      <p className="mb-6 mt-1 text-sm text-on-surface-variant">Lanjutkan proyek dan lamaranmu.</p>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </>
  )
}
