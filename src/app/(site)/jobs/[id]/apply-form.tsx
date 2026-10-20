'use client'

import { useActionState } from 'react'

import { applyToJob } from '@/app/(site)/student/actions'
import type { ActionState } from '@/lib/action-state'
import { FieldError, FormMessage, Label, SubmitButton, inputClass, submitWithoutReset } from '@/components/ui/form'

export function ApplyForm({ jobId }: { jobId: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(applyToJob, null)

  if (state?.info) return <FormMessage info={state.info} />

  return (
    <form onSubmit={submitWithoutReset(formAction)} className="space-y-4">
      <input type="hidden" name="job_id" value={jobId} />
      <FormMessage error={state?.error} />

      <div>
        <Label htmlFor="cover_letter">Kenapa kamu cocok untuk proyek ini?</Label>
        <textarea
          id="cover_letter"
          name="cover_letter"
          rows={6}
          required
          minLength={30}
          maxLength={3000}
          placeholder="Ceritakan pengalaman, contoh karya, dan rencana pengerjaanmu."
          className={inputClass}
        />
        <FieldError errors={state?.fieldErrors?.cover_letter} />
      </div>

      <div>
        <Label htmlFor="proposed_rate">
          Tawaran harga (Rp) <span className="font-normal text-outline">(opsional)</span>
        </Label>
        <input id="proposed_rate" name="proposed_rate" type="number" min={0} step={1000} inputMode="numeric" className={inputClass} />
        <FieldError errors={state?.fieldErrors?.proposed_rate} />
      </div>

      <SubmitButton pending={pending} pendingText="Mengirim..." className="w-full">Kirim Lamaran</SubmitButton>
    </form>
  )
}
