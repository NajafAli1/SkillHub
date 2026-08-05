'use client'

import { useActionState } from 'react'
import Link from 'next/link'

import { register, type AuthActionState } from '@/app/auth/actions'

const initialState: AuthActionState = null

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, initialState)

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">Daftar SkillHub</h1>

      {state?.info ? (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          {state.info}
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Nama lengkap
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              autoComplete="name"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
            {state?.fieldErrors?.full_name && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.full_name[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
              Nickname <span className="text-gray-400">(opsional)</span>
            </label>
            <input
              id="nickname"
              name="nickname"
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
            {state?.fieldErrors?.nickname && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.nickname[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
            {state?.fieldErrors?.email && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.email[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
            {state?.fieldErrors?.password && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.password[0]}</p>
            )}
          </div>

          <fieldset>
            <legend className="block text-sm font-medium text-gray-700">Daftar sebagai</legend>
            <div className="mt-2 flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="radio" name="role" value="student" defaultChecked required />
                Mahasiswa
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="radio" name="role" value="client" required />
                Client
              </label>
            </div>
            {state?.fieldErrors?.role && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.role[0]}</p>
            )}
          </fieldset>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {pending ? 'Mendaftar...' : 'Daftar'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link href="/auth/login" className="font-medium text-gray-900 underline">
              Masuk
            </Link>
          </p>
        </form>
      )}
    </main>
  )
}
