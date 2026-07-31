# SkillHub

Platform pencarian kerja part-time yang menghubungkan **mahasiswa** dengan **client** (perusahaan/individu) yang butuh bantuan pekerjaan lepas — dari desain, penulisan konten, sampai pengembangan web.

> 🔗 **Live demo:** _tambahkan link setelah deploy_
> 🖼️ **Screenshot:** _tambahkan setelah screenshot final diambil_

---

## ✨ Fitur

**Untuk Mahasiswa**
- Jelajahi daftar lowongan dengan **pencarian real-time** dan **filter status**
- Lamar pekerjaan langsung dari daftar lowongan
- Pantau status lamaran (menunggu / diterima / ditolak)

**Untuk Client**
- Posting lowongan kerja baru
- Kelola (edit/hapus) lowongan yang sudah diposting
- Tinjau dan terima/tolak lamaran yang masuk

**Pengalaman Pengguna**
- 🌙 Dark mode dengan preferensi tersimpan (tanpa flash saat reload)
- 🔔 Notifikasi toast untuk setiap aksi (bukan pesan statis)
- 💀 Skeleton loading saat data sedang dimuat
- 🔍 Pencarian dengan debounce, empty-state yang informatif

---

## 🔒 Keamanan

Dibangun dengan beberapa praktik keamanan standar, bukan cuma CRUD biasa:

- **Autentikasi berbasis session** (PHP `$_SESSION`) — identitas pengguna tidak pernah dipercaya dari input client
- **Validasi role di server**, bukan hanya di sisi klien
- **Password di-hash dengan bcrypt**, sesi diregenerasi saat login (mencegah session fixation)
- **Proteksi XSS** — semua data dinamis di-escape sebelum dirender ke DOM
- **Prepared statements** di seluruh query database (aman dari SQL injection)
- **Rate limiting** pada percobaan login (mencegah brute-force)
- **Validasi upload file** (tipe MIME asli, ukuran, nama file acak) + eksekusi PHP diblokir di folder upload
- Proteksi dasar CSRF (validasi Origin/Referer) dan validasi panjang input di sisi server

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Backend | PHP native (mysqli) |
| Database | MySQL |
| Frontend | HTML, CSS, JavaScript (vanilla, tanpa framework) |
| Server lokal | Laragon (Apache) |

Dibuat tanpa framework secara sengaja — untuk menunjukkan pemahaman fundamental terhadap PHP, keamanan web, dan JavaScript murni sebelum bergantung pada abstraksi framework.

---

## 🚀 Menjalankan secara lokal

1. Clone/download repo ini ke folder `www` server lokal kamu (Laragon/XAMPP)
2. Buat database `skillhub`, import skema di [`skillhub.sql`](./skillhub.sql)
3. Sesuaikan kredensial di `koneksi.php` jika perlu
4. Jalankan Apache & MySQL, buka `http://localhost/SkillHub/index.html`

**Catatan:** Project ini menggunakan fitur PHP 8.1+ (`mysqli_sql_exception`). Pastikan server menjalankan PHP 8.1 atau lebih baru.

---

## 📁 Struktur Proyek

```
SkillHub/
├── api/              # Endpoint backend (auth, CRUD pekerjaan & lamaran)
│   └── bootstrap.php # Setup session, proteksi CSRF, error handling terpusat
├── css/style.css      # Styling + dark mode via CSS custom properties
├── js/                # Logic frontend per halaman
├── uploads/           # Foto profil pengguna
├── index.html          # Halaman login/register
├── client.html          # Dashboard client
└── mahasiswa.html        # Dashboard mahasiswa
```

---

## 💡 Yang Dipelajari / Ditekankan dalam Proyek Ini

Proyek ini sengaja dikembangkan lewat siklus **build → audit → perbaiki** yang berulang: mulai dari fungsionalitas dasar, lalu diperkuat lewat audit keamanan yang menemukan dan memperbaiki celah nyata (XSS, akses folder `.git` yang tidak sengaja terekspos, kebocoran data sensitif). Pendekatan ini mencerminkan proses pengembangan yang lebih realistis dibanding sekadar membuat fitur yang "terlihat jalan".

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan portofolio/pembelajaran.
