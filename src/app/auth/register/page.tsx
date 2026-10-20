'use client'

import { Suspense, useActionState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { register, type AuthActionState } from '@/app/auth/actions'
import { FieldError, FormMessage, Label, SubmitButton, inputClass, submitWithoutReset } from '@/components/ui/form'

const initialState: AuthActionState = null

const ROLES = [
  { value: 'student', title: 'Mahasiswa', desc: 'Cari proyek & bangun portofolio' },
  { value: 'client', title: 'Client', desc: 'Pasang lowongan & cari talenta' },
] as const

function RegisterForm() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'client' ? 'client' : 'student'
  const [state, formAction, pending] = useActionState(register, initialState)

  if (state?.info) {
    return (
      <div className="space-y-4">
        <FormMessage info={state.info} />
        <Link href="/auth/login" className="block text-center text-sm font-semibold text-primary hover:underline">
          Ke halaman masuk
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={submitWithoutReset(formAction)} className="space-y-4">
      <FormMessage error={state?.error} />

      <fieldset>
        <legend className="text-sm font-medium text-on-surface">Daftar sebagai</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {ROLES.map((role) => (
            <label
              key={role.value}
              className="cursor-pointer rounded-[10px] border border-outline-variant p-3 transition-colors has-checked:border-primary-container has-checked:bg-surface-container-low has-focus-visible:ring-2 has-focus-visible:ring-primary-container/40"
            >
              <input
                type="radio"
                name="role"
                value={role.value}
                defaultChecked={role.value === defaultRole}
                required
                className="sr-only"
              />
              <span className="block text-sm font-semibold text-on-surface">{role.title}</span>
              <span className="mt-0.5 block text-xs leading-snug text-on-surface-variant">{role.desc}</span>
            </label>
          ))}
        </div>
        <FieldError errors={state?.fieldErrors?.role} />
      </fieldset>

      <div>
        <Label htmlFor="full_name">Nama lengkap</Label>
        <input id="full_name" name="full_name" type="text" required autoComplete="name" className={inputClass} />
        <FieldError errors={state?.fieldErrors?.full_name} />
      </div>

      <div>
        <Label htmlFor="nickname">
          Nickname <span className="font-normal text-outline">(opsional)</span>
        </Label>
        <input id="nickname" name="nickname" type="text" className={inputClass} />
        <FieldError errors={state?.fieldErrors?.nickname} />
      </div>

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
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-outline">Minimal 8 karakter.</p>
        <FieldError errors={state?.fieldErrors?.password} />
      </div>

      <SubmitButton pending={pending} pendingText="Mendaftar..." className="w-full">Daftar</SubmitButton>

      <p className="text-center text-sm text-on-surface-variant">
        Sudah punya akun?{' '}
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
          Masuk
        </Link>
      </p>
    </form>
  )
}

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-on-surface">Daftar SkillHub</h1>
      <p className="mb-6 mt-1 text-sm text-on-surface-variant">Gratis, cukup satu menit.</p>
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </>
  )
}
