'use client'

import { useActionState } from 'react'

import { createJob } from '@/app/(site)/client/actions'
import type { ActionState } from '@/lib/action-state'
import type { Category, Skill } from '@/lib/queries/jobs'
import { FieldError, FormMessage, Label, SubmitButton, inputClass, submitWithoutReset } from '@/components/ui/form'

export function JobForm({ categories, skills }: { categories: Category[]; skills: Skill[] }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createJob, null)
  const errors = state?.fieldErrors

  return (
    <form onSubmit={submitWithoutReset(formAction)} className="space-y-5">
      <FormMessage error={state?.error} />

      <div>
        <Label htmlFor="title">Judul proyek</Label>
        <input
          id="title"
          name="title"
          required
          minLength={5}
          maxLength={150}
          placeholder="Contoh: Desain logo untuk usaha kopi"
          className={inputClass}
        />
        <FieldError errors={errors?.title} />
      </div>

      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <textarea
          id="description"
          name="description"
          rows={7}
          required
          minLength={20}
          maxLength={5000}
          placeholder="Jelaskan kebutuhan, hasil akhir yang diharapkan, dan kriteria pelamar."
          className={inputClass}
        />
        <FieldError errors={errors?.description} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="category_id">Kategori</Label>
          <select id="category_id" name="category_id" required defaultValue="" className={inputClass}>
            <option value="" disabled>Pilih kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <FieldError errors={errors?.category_id} />
        </div>

        <div>
          <Label htmlFor="deadline">
            Deadline <span className="font-normal text-outline">(opsional)</span>
          </Label>
          <input id="deadline" name="deadline" type="date" className={inputClass} />
          <FieldError errors={errors?.deadline} />
        </div>
      </div>

      <fieldset className="grid gap-5 sm:grid-cols-3">
        <legend className="sr-only">Budget</legend>
        <div>
          <Label htmlFor="payment_type">Tipe pembayaran</Label>
          <select id="payment_type" name="payment_type" defaultValue="fixed" className={inputClass}>
            <option value="fixed">Per proyek</option>
            <option value="hourly">Per jam</option>
          </select>
        </div>
        <div>
          <Label htmlFor="budget_min">Budget min (Rp)</Label>
          <input id="budget_min" name="budget_min" type="number" min={0} step={1000} inputMode="numeric" className={inputClass} />
          <FieldError errors={errors?.budget_min} />
        </div>
        <div>
          <Label htmlFor="budget_max">Budget maks (Rp)</Label>
          <input id="budget_max" name="budget_max" type="number" min={0} step={1000} inputMode="numeric" className={inputClass} />
          <FieldError errors={errors?.budget_max} />
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="location_type">Lokasi kerja</Label>
          <select id="location_type" name="location_type" defaultValue="remote" className={inputClass}>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>
        </div>
        <div>
          <Label htmlFor="location_detail">
            Kota / detail lokasi <span className="font-normal text-outline">(opsional)</span>
          </Label>
          <input id="location_detail" name="location_detail" maxLength={120} placeholder="Contoh: Bandung" className={inputClass} />
        </div>
      </div>

      {skills.length > 0 && (
        <fieldset>
          <legend className="text-sm font-medium text-on-surface">
            Skill yang dibutuhkan <span className="font-normal text-outline">(maks. 10)</span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <label
                key={skill.id}
                className="cursor-pointer rounded-full border border-outline-variant px-3 py-1.5 text-xs font-medium text-on-surface-variant transition-colors has-checked:border-primary-container has-checked:bg-chip-bg has-checked:text-chip-text has-focus-visible:ring-2 has-focus-visible:ring-primary-container/40"
              >
                <input type="checkbox" name="skill_ids" value={skill.id} className="sr-only" />
                {skill.name}
              </label>
            ))}
          </div>
          <FieldError errors={errors?.skill_ids} />
        </fieldset>
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-border-card pt-5 sm:flex-row sm:justify-end">
        <SubmitButton pending={pending} name="intent" value="draft" variant="outline">
          Simpan Draft
        </SubmitButton>
        <SubmitButton pending={pending} name="intent" value="open" pendingText="Menyimpan...">
          Publikasikan
        </SubmitButton>
      </div>
    </form>
  )
}
