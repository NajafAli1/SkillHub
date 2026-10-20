'use client'

import { startTransition } from 'react'
import { useFormStatus } from 'react-dom'

// React 19 mengosongkan form setelah `<form action>` selesai, termasuk saat
// validasi gagal. Handler ini mengirim lewat onSubmit supaya isian user tetap
// ada ketika server mengembalikan error. Tombol submit (name/value) ikut terkirim.
export function submitWithoutReset(formAction: (formData: FormData) => void) {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const submitter = (event.nativeEvent as SubmitEvent).submitter
    const formData = new FormData(event.currentTarget, submitter)
    startTransition(() => formAction(formData))
  }
}

export const inputClass =
  'mt-1 w-full rounded-[10px] border border-outline-variant bg-white px-3 py-2.5 text-sm text-on-surface placeholder:text-outline focus:border-primary-container focus:outline-none focus:ring-2 focus:ring-primary-container/20'

export function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-on-surface">
      {children}
    </label>
  )
}

export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null
  return <p className="mt-1 text-sm text-error">{errors[0]}</p>
}

export function FormMessage({ error, info }: { error?: string; info?: string }) {
  if (error) {
    return (
      <p role="alert" className="rounded-[10px] border border-error-container bg-error-container/40 px-3 py-2 text-sm text-on-error-container">
        {error}
      </p>
    )
  }
  if (info) {
    return (
      <p role="status" className="rounded-[10px] border border-secondary-container bg-secondary-container/40 px-3 py-2 text-sm text-on-secondary-fixed-variant">
        {info}
      </p>
    )
  }
  return null
}

type SubmitButtonProps = {
  children: React.ReactNode
  pendingText?: string
  variant?: 'primary' | 'outline' | 'danger'
  name?: string
  value?: string
  className?: string
  /** Wajib diisi bila form memakai submitWithoutReset (useFormStatus tidak aktif). */
  pending?: boolean
}

const VARIANTS = {
  primary: 'bg-primary-container text-white hover:bg-primary',
  outline: 'border border-outline-variant bg-white text-primary hover:bg-surface-container',
  danger: 'border border-error/40 bg-white text-error hover:bg-error-container/40',
}

export function SubmitButton({ children, pendingText, variant = 'primary', name, value, className = '', pending: pendingProp }: SubmitButtonProps) {
  const status = useFormStatus()
  const pending = pendingProp ?? status.pending
  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending}
      className={`rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
    >
      {pending && pendingText ? pendingText : children}
    </button>
  )
}
