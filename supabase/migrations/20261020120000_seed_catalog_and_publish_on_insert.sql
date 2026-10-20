-- =============================================================
-- Seed katalog awal + published_at untuk job yang langsung dibuka
-- =============================================================
-- 1. Kategori dan skill awal supaya landing page, filter /jobs, dan form
--    pasang lowongan tidak kosong. Idempoten (on conflict do nothing).
-- 2. jobs_stamp_published sebelumnya hanya berjalan BEFORE UPDATE, sehingga
--    job yang di-insert langsung dengan status 'open' tidak pernah punya
--    published_at. stamp_published_at() aman untuk INSERT karena OLD bernilai
--    NULL dan `old.status is distinct from 'open'` bernilai true.

insert into public.categories (name, slug, description) values
  ('Desain & Grafis',          'desain-grafis',     'Logo, branding, UI/UX, ilustrasi'),
  ('Web & App Development',    'web-app-dev',       'Website, aplikasi mobile, landing page'),
  ('Penulisan & Penerjemahan', 'penulisan',         'Artikel, copywriting, terjemahan'),
  ('Digital Marketing',        'digital-marketing', 'Media sosial, SEO, iklan digital'),
  ('Video & Animasi',          'video-animasi',     'Editing video, motion graphic, animasi'),
  ('Fotografi & Editing',      'fotografi',         'Foto produk, retouch, editing foto'),
  ('Data Entry & Admin',       'data-entry',        'Input data, spreadsheet, asisten virtual'),
  ('Riset & Analisis Data',    'riset-data',        'Survei, analisis data, visualisasi')
on conflict (slug) do nothing;

insert into public.skills (name, slug) values
  ('Figma', 'figma'),
  ('UI/UX Design', 'ui-ux-design'),
  ('Adobe Illustrator', 'adobe-illustrator'),
  ('Adobe Photoshop', 'adobe-photoshop'),
  ('Canva', 'canva'),
  ('HTML & CSS', 'html-css'),
  ('JavaScript', 'javascript'),
  ('React', 'react'),
  ('Next.js', 'nextjs'),
  ('PHP', 'php'),
  ('Laravel', 'laravel'),
  ('Flutter', 'flutter'),
  ('WordPress', 'wordpress'),
  ('Copywriting', 'copywriting'),
  ('SEO', 'seo'),
  ('Penerjemahan Inggris', 'penerjemahan-inggris'),
  ('Social Media Management', 'social-media-management'),
  ('Video Editing', 'video-editing'),
  ('Premiere Pro', 'premiere-pro'),
  ('CapCut', 'capcut'),
  ('Fotografi Produk', 'fotografi-produk'),
  ('Microsoft Excel', 'microsoft-excel'),
  ('Google Sheets', 'google-sheets'),
  ('Python', 'python'),
  ('Analisis Data', 'analisis-data')
on conflict (slug) do nothing;

drop trigger if exists jobs_stamp_published on public.jobs;

create trigger jobs_stamp_published
before insert or update on public.jobs
for each row execute function public.stamp_published_at();

-- 3. Perbaikan hak akses kolom:
--    - is_verified tidak boleh diubah sendiri oleh client (hanya admin,
--      lewat policy "client_profiles: admin full access" / service role).
--    - Migration catalog_jobs memberi ulang grant profiles tanpa kolom
--      nickname, sehingga user tidak bisa mengganti nickname-nya.
revoke update on public.client_profiles from authenticated;
grant  update (company_name, client_kind, website, industry)
  on public.client_profiles to authenticated;

grant update (nickname) on public.profiles to authenticated;
