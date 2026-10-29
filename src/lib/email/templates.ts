import type { EmailMessage } from './mailer'

// Semua teks dari user (nama, judul) di-escape supaya tidak bisa menyisipkan HTML.
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

type Section = { label: string; value: string }

// Layout email sederhana dengan inline style (klien email tidak membaca CSS eksternal).
function layout({
  heading,
  intro,
  details,
  note,
  buttonLabel,
  buttonUrl,
}: {
  heading: string
  intro: string
  details: Section[]
  note: string
  buttonLabel: string
  buttonUrl: string
}) {
  const rows = details
    .map(
      (d) => `
        <tr>
          <td style="padding:6px 0;color:#3f4942;font-size:13px;width:110px;vertical-align:top">${escapeHtml(d.label)}</td>
          <td style="padding:6px 0;color:#161e11;font-size:14px;font-weight:600;word-break:break-word">${escapeHtml(d.value)}</td>
        </tr>`,
    )
    .join('')

  return `<!doctype html>
<html lang="id">
  <body style="margin:0;padding:0;background:#f3fde8;font-family:Arial,Helvetica,sans-serif">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3fde8;padding:24px 12px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #e3e8de;border-radius:14px">
          <tr><td style="padding:24px 24px 0">
            <p style="margin:0;color:#00623f;font-size:20px;font-weight:700">SkillHub</p>
          </td></tr>
          <tr><td style="padding:16px 24px 0">
            <h1 style="margin:0 0 8px;color:#161e11;font-size:20px;line-height:1.3">${escapeHtml(heading)}</h1>
            <p style="margin:0;color:#3f4942;font-size:14px;line-height:1.6">${escapeHtml(intro)}</p>
          </td></tr>
          <tr><td style="padding:16px 24px 0">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3fde8;border-radius:10px;padding:8px 14px">${rows}</table>
          </td></tr>
          <tr><td style="padding:16px 24px 0">
            <p style="margin:0;color:#3f4942;font-size:14px;line-height:1.6">${escapeHtml(note)}</p>
          </td></tr>
          <tr><td style="padding:20px 24px 24px">
            <a href="${escapeHtml(buttonUrl)}" style="display:inline-block;background:#1c7c54;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:12px 20px;border-radius:10px">${escapeHtml(buttonLabel)}</a>
          </td></tr>
        </table>
        <p style="margin:16px 0 0;color:#6f7a72;font-size:12px">Email otomatis dari SkillHub. Balas email ini untuk menghubungi pihak terkait.</p>
      </td></tr>
    </table>
  </body>
</html>`
}

function plainText(heading: string, intro: string, details: Section[], note: string, buttonLabel: string, buttonUrl: string) {
  return [
    heading,
    '',
    intro,
    '',
    ...details.map((d) => `${d.label}: ${d.value}`),
    '',
    note,
    '',
    `${buttonLabel}: ${buttonUrl}`,
  ].join('\n')
}

type AcceptanceInfo = {
  jobTitle: string
  studentName: string
  studentEmail: string
  clientName: string
  clientEmail: string
  /** Origin situs, mis. http://localhost:3000 */
  siteUrl: string
  jobId: string
}

export function acceptedStudentEmail(info: AcceptanceInfo): EmailMessage {
  const heading = 'Selamat, lamaran kamu diterima! 🎉'
  const intro = `Halo ${info.studentName}, ${info.clientName} menerima lamaran kamu. Segera hubungi client untuk membahas detail pekerjaan.`
  const details = [
    { label: 'Proyek', value: info.jobTitle },
    { label: 'Client', value: info.clientName },
    { label: 'Email client', value: info.clientEmail },
  ]
  const note = 'Tekan "Balas" pada email ini untuk langsung mengirim pesan ke client.'
  const buttonLabel = 'Lihat dashboard'
  const buttonUrl = `${info.siteUrl}/student`

  return {
    to: info.studentEmail,
    replyTo: info.clientEmail,
    subject: `Lamaran kamu diterima: ${info.jobTitle}`,
    html: layout({ heading, intro, details, note, buttonLabel, buttonUrl }),
    text: plainText(heading, intro, details, note, buttonLabel, buttonUrl),
  }
}

export function acceptedClientEmail(info: AcceptanceInfo): EmailMessage {
  const heading = 'Kamu menerima pelamar baru'
  const intro = `Halo ${info.clientName}, kamu menerima ${info.studentName} untuk proyek ini. Lowongan otomatis ditutup dan pelamar lain ditolak.`
  const details = [
    { label: 'Proyek', value: info.jobTitle },
    { label: 'Mahasiswa', value: info.studentName },
    { label: 'Email', value: info.studentEmail },
  ]
  const note = 'Tekan "Balas" pada email ini untuk langsung mengirim pesan ke mahasiswa.'
  const buttonLabel = 'Kelola lowongan'
  const buttonUrl = `${info.siteUrl}/client/jobs/${info.jobId}`

  return {
    to: info.clientEmail,
    replyTo: info.studentEmail,
    subject: `Kamu menerima ${info.studentName}: ${info.jobTitle}`,
    html: layout({ heading, intro, details, note, buttonLabel, buttonUrl }),
    text: plainText(heading, intro, details, note, buttonLabel, buttonUrl),
  }
}
