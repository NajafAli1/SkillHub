# SkillHub

Marketplace freelance yang menghubungkan mahasiswa dengan client.
Dibangun dengan **Next.js 16** (App Router), **Supabase** (Postgres + Auth), Tailwind CSS v4, dan daisyUI.

## Menjalankan di lokal

1. Install dependency:
   ```bash
   npm install
   ```
2. Buat file `.env.local` di root project. Nilainya diambil dari Supabase Dashboard → Project Settings → API:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...   # rahasia, jangan di-commit

   # Email notifikasi (lamaran diterima) lewat Gmail SMTP
   GMAIL_USER=akun@gmail.com
   GMAIL_APP_PASSWORD=...          # App Password 16 huruf, BUKAN password Gmail
   ```
   App Password dibuat di https://myaccount.google.com/apppasswords (verifikasi 2 langkah harus aktif).
   Kalau dua variabel Gmail dikosongkan, aplikasi tetap jalan, hanya email notifikasi yang dilewati.
3. Jalankan dev server:
   ```bash
   npm run dev
   ```
   Lalu buka http://localhost:3000.

## Database

Seluruh skema ada di `supabase/migrations/` dan **harus diterapkan berurutan**.

- **Lewat CLI:**
  ```bash
  npx supabase login
  npx supabase link --project-ref <ref>
  npx supabase db push
  ```
- **Lewat dashboard:** buka SQL Editor, lalu jalankan isi setiap file migration sesuai urutan nama file.

Aturan tim: setiap perubahan database dibuat sebagai file migration baru. Jangan edit tabel langsung di dashboard.

Generate ulang tipe TypeScript setelah skema berubah. Jalankan dari **Git Bash**, karena `>` di Windows PowerShell 5.1 menyimpan file sebagai UTF-16 dan membuat ESLint gagal:
```bash
npx supabase gen types typescript --project-id <ref> > src/types/database.types.ts
```

## Struktur

| Path | Isi |
|---|---|
| `src/app/(site)/` | Halaman dengan navbar + footer: beranda, `/jobs`, dashboard `/student` dan `/client` |
| `src/app/auth/` | Login, daftar, callback konfirmasi email, server action auth |
| `src/proxy.ts` | Refresh sesi Supabase + proteksi route (di Next 16 namanya *proxy*, bukan *middleware*) |
| `src/lib/queries/` | Query baca data yang dipakai bersama |
| `src/lib/validations/` | Skema zod untuk semua form |
| `supabase/migrations/` | Skema database, RLS, trigger |

## Checklist sebelum deploy

- [ ] Semua migration sudah diterapkan ke project Supabase produksi.
- [ ] Supabase → Authentication → URL Configuration:
  - **Site URL** = domain produksi.
  - **Redirect URLs** berisi `https://<domain>/auth/callback`.
- [ ] Putuskan apakah *Confirm email* aktif. Kalau aktif, siapkan SMTP sendiri, karena SMTP bawaan Supabase sangat terbatas.
- [ ] Environment variable di hosting sama dengan isi `.env.local` (termasuk `GMAIL_USER` dan `GMAIL_APP_PASSWORD`).
- [ ] Batas Gmail SMTP sekitar 500 email/hari. Kalau sudah ramai, pindah ke layanan email dengan domain sendiri (Resend/SES).
- [ ] `npm run lint` dan `npm run build` lolos.
