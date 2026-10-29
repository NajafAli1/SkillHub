import 'server-only'
import nodemailer, { type Transporter } from 'nodemailer'

export type EmailMessage = {
  to: string
  subject: string
  html: string
  text: string
  /** Tombol "Balas" di Gmail langsung mengarah ke alamat ini. */
  replyTo?: string
}

let transporter: Transporter | null = null

function getTransporter(): Transporter | null {
  const user = process.env.GMAIL_USER
  // App Password ditampilkan Google dengan spasi ("abcd efgh ..."); buang spasinya.
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '')
  if (!user || !pass) return null

  transporter ??= nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  })
  return transporter
}

// Mengirim email lewat Gmail SMTP. Tidak pernah melempar error: email adalah
// pelengkap, jadi kegagalan cukup dicatat dan alur utama tetap berjalan.
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const smtp = getTransporter()
  if (!smtp) {
    console.warn('sendEmail: GMAIL_USER / GMAIL_APP_PASSWORD belum diisi, email dilewati.')
    return false
  }

  try {
    const info = await smtp.sendMail({
      from: `"SkillHub" <${process.env.GMAIL_USER}>`,
      ...message,
    })
    const ok = (info.accepted?.length ?? 0) > 0
    if (ok) console.info(`sendEmail: terkirim ke ${message.to} (${message.subject})`)
    return ok
  } catch (error) {
    console.error(`sendEmail: gagal ke ${message.to}:`, error instanceof Error ? error.message : error)
    return false
  }
}
