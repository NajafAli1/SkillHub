import { MdEmail } from 'react-icons/md'
import { SiGmail } from 'react-icons/si'

type Props = {
  /** Email pihak lain; null bila belum boleh dilihat. */
  email: string | null
  /** Contoh: "client" atau "mahasiswa" */
  roleLabel: string
  name: string
  jobTitle: string
}

// Kontak lewat email setelah lamaran diterima. Chat di dalam SkillHub
// menyusul di pengembangan berikutnya.
export function EmailContact({ email, roleLabel, name, jobTitle }: Props) {
  if (!email) return null

  const subject = `[SkillHub] ${jobTitle}`
  const body = `Halo ${name},\n\nSaya menghubungi terkait proyek "${jobTitle}" di SkillHub.\n\n`
  const gmailUrl =
    'https://mail.google.com/mail/?view=cm&fs=1' +
    `&to=${encodeURIComponent(email)}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`
  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <div className="mt-3 rounded-[10px] border border-secondary-container bg-surface-container-low p-3 sm:p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Hubungi {roleLabel}</p>
      <p className="mt-1 break-all text-sm text-on-surface">
        <span className="font-semibold">{name}</span> · {email}
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <a
          href={gmailUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-[10px] bg-primary-container px-4 py-2 text-sm font-semibold text-white hover:bg-primary"
        >
          <SiGmail /> Kirim via Gmail
        </a>
        <a
          href={mailtoUrl}
          className="flex items-center justify-center gap-2 rounded-[10px] border border-outline-variant bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-surface-container"
        >
          <MdEmail /> Aplikasi email lain
        </a>
      </div>
    </div>
  )
}
