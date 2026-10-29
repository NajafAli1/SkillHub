-- =============================================================
-- 0002 — Catalog & Jobs
--   categories, skills, jobs, job_skills, student_skills
--   + helper admin dan policy override
-- =============================================================

-- ---------- Helper: apakah pemanggil seorang admin ----------
-- SECURITY DEFINER supaya bisa membaca public.profiles dari dalam
-- policy tanpa memicu rekursi RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.is_client()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'client'
  );
$$;

create or replace function public.is_student()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'student'
  );
$$;

-- ---------- Policy override untuk admin di tabel identitas ----------
create policy "profiles: admin full access"
  on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());

create policy "student_profiles: admin full access"
  on public.student_profiles for all
  using (public.is_admin()) with check (public.is_admin());

create policy "client_profiles: admin full access"
  on public.client_profiles for all
  using (public.is_admin()) with check (public.is_admin());

-- Admin butuh hak update penuh yang tadi dicabut di migration 0001.
grant update on public.profiles        to authenticated;
revoke update on public.profiles       from authenticated;
grant update (full_name, avatar_url, bio, phone, location)
  on public.profiles to authenticated;
-- Catatan: kolom `role` dan `is_verified` tetap hanya bisa diubah lewat
-- service_role key (dipakai di Route Handler admin), bukan lewat sesi
-- browser. Ini disengaja — lihat DATABASE.md bagian "Prinsip desain".

-- ---------- Enum untuk jobs ----------
create type public.payment_type  as enum ('fixed', 'hourly');
create type public.location_type as enum ('remote', 'onsite', 'hybrid');
create type public.job_status    as enum
  ('draft', 'open', 'in_progress', 'closed', 'completed', 'cancelled');
create type public.proficiency   as enum
  ('beginner', 'intermediate', 'advanced', 'expert');

-- ---------- categories ----------
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique check (char_length(name) between 2 and 60),
  slug        text not null unique check (slug ~ '^[a-z0-9-]+$'),
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------- skills ----------
create table public.skills (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique check (char_length(name) between 1 and 60),
  slug       text not null unique check (slug ~ '^[a-z0-9-]+$'),
  created_at timestamptz not null default now()
);

-- ---------- jobs ----------
create table public.jobs (
  id              uuid primary key default gen_random_uuid(),
  client_id       uuid not null
                  references public.client_profiles(profile_id) on delete cascade,
  category_id     uuid references public.categories(id) on delete set null,
  title           text not null check (char_length(title) between 5 and 150),
  description     text not null check (char_length(description) >= 20),
  payment_type    public.payment_type  not null default 'fixed',
  budget_min      numeric(12,2) check (budget_min is null or budget_min >= 0),
  budget_max      numeric(12,2) check (budget_max is null or budget_max >= 0),
  location_type   public.location_type not null default 'remote',
  location_detail text,
  deadline        date,
  status          public.job_status not null default 'draft',
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint jobs_budget_range
    check (budget_min is null or budget_max is null or budget_max >= budget_min),
  constraint jobs_location_detail_required
    check (location_type = 'remote' or location_detail is not null)
);

create index jobs_client_idx    on public.jobs (client_id);
create index jobs_category_idx  on public.jobs (category_id);
create index jobs_status_idx    on public.jobs (status);
create index jobs_created_idx   on public.jobs (created_at desc);

-- Full-text search sederhana untuk pencarian lowongan.
create index jobs_search_idx on public.jobs
  using gin (to_tsvector('simple', title || ' ' || description));

create trigger jobs_touch
before update on public.jobs
for each row execute function public.touch_updated_at();

-- Isi published_at otomatis saat job pertama kali dibuka.
create or replace function public.stamp_published_at()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'open' and old.status is distinct from 'open'
     and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;

create trigger jobs_stamp_published
before update on public.jobs
for each row execute function public.stamp_published_at();

-- ---------- job_skills ----------
create table public.job_skills (
  job_id   uuid not null references public.jobs(id)   on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  primary key (job_id, skill_id)
);

create index job_skills_skill_idx on public.job_skills (skill_id);

-- ---------- student_skills ----------
create table public.student_skills (
  student_id uuid not null
             references public.student_profiles(profile_id) on delete cascade,
  skill_id   uuid not null references public.skills(id) on delete cascade,
  level      public.proficiency not null default 'intermediate',
  primary key (student_id, skill_id)
);

create index student_skills_skill_idx on public.student_skills (skill_id);

-- =============================================================
-- Row Level Security
-- =============================================================

alter table public.categories     enable row level security;
alter table public.skills         enable row level security;
alter table public.jobs           enable row level security;
alter table public.job_skills     enable row level security;
alter table public.student_skills enable row level security;

-- ---------- categories & skills: baca publik, tulis admin ----------
create policy "categories: readable by anyone"
  on public.categories for select using (true);

create policy "categories: admin writes"
  on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

create policy "skills: readable by anyone"
  on public.skills for select using (true);

create policy "skills: admin writes"
  on public.skills for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- jobs ----------
-- Publik hanya melihat job yang sudah dipublikasikan.
-- Pemilik melihat seluruh job-nya termasuk draft.
create policy "jobs: published are public"
  on public.jobs for select
  using (
    status in ('open', 'in_progress', 'completed', 'closed')
    or client_id = (select auth.uid())
    or public.is_admin()
  );

create policy "jobs: client can create own"
  on public.jobs for insert to authenticated
  with check (client_id = (select auth.uid()) and public.is_client());

create policy "jobs: owner can update"
  on public.jobs for update to authenticated
  using  (client_id = (select auth.uid()) or public.is_admin())
  with check (client_id = (select auth.uid()) or public.is_admin());

-- Hapus hanya boleh saat masih draft. Job yang sudah tayang di-cancel,
-- bukan dihapus, supaya riwayat lamaran tidak ikut hilang.
create policy "jobs: owner can delete draft"
  on public.jobs for delete to authenticated
  using (
    (client_id = (select auth.uid()) and status = 'draft')
    or public.is_admin()
  );

-- ---------- job_skills: mengikuti kepemilikan job ----------
create policy "job_skills: readable by anyone"
  on public.job_skills for select using (true);

create policy "job_skills: job owner manages"
  on public.job_skills for all to authenticated
  using (
    exists (
      select 1 from public.jobs j
      where j.id = job_id and j.client_id = (select auth.uid())
    ) or public.is_admin()
  )
  with check (
    exists (
      select 1 from public.jobs j
      where j.id = job_id and j.client_id = (select auth.uid())
    ) or public.is_admin()
  );

-- ---------- student_skills ----------
create policy "student_skills: readable by anyone"
  on public.student_skills for select using (true);

create policy "student_skills: owner manages"
  on public.student_skills for all to authenticated
  using  (student_id = (select auth.uid()) or public.is_admin())
  with check (student_id = (select auth.uid()) or public.is_admin());