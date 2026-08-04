-- =============================================================
-- 0001 — Identity: profiles, subtypes, auto-provisioning, RLS
-- =============================================================

-- ---------- Enums ----------
create type public.user_role   as enum ('student', 'client', 'admin');
create type public.client_kind as enum ('individual', 'company');

-- ---------- Utility: updated_at ----------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- profiles ----------
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       public.user_role not null default 'student',
  full_name  text not null check (char_length(full_name) between 2 and 100),
  nickname   text check (nickname is null or char_length(nickname) between 2 and 50),
  avatar_url text,
  bio        text check (char_length(bio) <= 1000),
  phone      text check (phone is null or phone ~ '^[0-9+() -]{8,20}$'),
  location   text check (location is null or char_length(location) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);

create trigger profiles_touch
before update on public.profiles
for each row execute function public.touch_updated_at();

-- ---------- student_profiles ----------
create table public.student_profiles (
  profile_id    uuid primary key references public.profiles(id) on delete cascade,
  university    text check (university is null or char_length(university) <= 150),
  major         text check (major is null or char_length(major) <= 100),
  semester      smallint check (semester is null or semester between 1 and 16),
  portfolio_url text,
  resume_url    text,
  hourly_rate   numeric(12,2) check (hourly_rate is null or hourly_rate >= 0),
  updated_at    timestamptz not null default now()
);

create trigger student_profiles_touch
before update on public.student_profiles
for each row execute function public.touch_updated_at();

-- ---------- client_profiles ----------
create table public.client_profiles (
  profile_id   uuid primary key references public.profiles(id) on delete cascade,
  company_name text check (company_name is null or char_length(company_name) <= 150),
  client_kind  public.client_kind not null default 'individual',
  website      text,
  industry     text check (industry is null or char_length(industry) <= 100),
  is_verified  boolean not null default false,
  updated_at   timestamptz not null default now()
);

create trigger client_profiles_touch
before update on public.client_profiles
for each row execute function public.touch_updated_at();

-- ---------- Helper: role pemanggil saat ini ----------
-- SECURITY DEFINER supaya bisa dipakai di dalam policy tanpa
-- memicu rekursi RLS pada tabel profiles itu sendiri.
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = (select auth.uid());
$$;

-- ---------- Auto-provisioning saat signup ----------
-- Dipanggil oleh trigger pada auth.users. Role diambil dari metadata
-- signup, TAPI hanya 'student' | 'client' yang diterima — 'admin'
-- tidak akan pernah bisa dibuat dari sisi klien.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested text := coalesce(new.raw_user_meta_data ->> 'role', 'student');
  resolved  public.user_role;
begin
  resolved := case when requested = 'client' then 'client'::public.user_role
                   else 'student'::public.user_role end;

  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    resolved,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Pengguna Baru')
  );

  if resolved = 'client' then
    insert into public.client_profiles (profile_id) values (new.id);
  else
    insert into public.student_profiles (profile_id) values (new.id);
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =============================================================
-- Row Level Security
-- =============================================================

alter table public.profiles         enable row level security;
alter table public.student_profiles enable row level security;
alter table public.client_profiles  enable row level security;

-- profiles: publik bisa baca (dibutuhkan untuk menampilkan nama
-- pemberi kerja / pelamar), tapi hanya pemilik yang bisa mengubah.
create policy "profiles: readable by anyone"
  on public.profiles for select
  using (true);

create policy "profiles: owner can update"
  on public.profiles for update
  using  ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- INSERT sengaja tidak diberi policy: baris hanya boleh lahir dari
-- trigger handle_new_user(). DELETE mengikuti cascade auth.users.

-- Kunci kolom sensitif. Tanpa ini, user bisa UPDATE role-nya sendiri
-- menjadi 'admin' — policy di atas mengizinkan update baris miliknya.
revoke update on public.profiles from authenticated;
grant  update (full_name, nickname, avatar_url, bio, phone, location)
  on public.profiles to authenticated;

-- student_profiles
create policy "student_profiles: readable by anyone"
  on public.student_profiles for select
  using (true);

create policy "student_profiles: owner can update"
  on public.student_profiles for update
  using  ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

-- client_profiles
create policy "client_profiles: readable by anyone"
  on public.client_profiles for select
  using (true);

create policy "client_profiles: owner can update"
  on public.client_profiles for update
  using  ((select auth.uid()) = profile_id)
  with check ((select auth.uid()) = profile_id);

-- is_verified hanya boleh diubah admin / service role.
revoke update on public.client_profiles from authenticated;
grant  update (company_name, client_kind, website, industry, is_verified)
  on public.client_profiles to authenticated;