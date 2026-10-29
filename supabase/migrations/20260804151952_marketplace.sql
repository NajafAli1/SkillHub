-- =============================================================
-- 0003 — Marketplace
--   applications, contracts, reviews, saved_jobs, notifications
--   + otomasi alur hire dan notifikasi
-- =============================================================

create type public.application_status as enum
  ('pending', 'accepted', 'rejected', 'withdrawn');

create type public.contract_status as enum
  ('active', 'submitted', 'completed', 'cancelled');

create type public.notification_type as enum (
  'application_received', 'application_accepted', 'application_rejected',
  'contract_started', 'contract_submitted', 'contract_completed',
  'review_received', 'system'
);

-- ---------- applications ----------
create table public.applications (
  id             uuid primary key default gen_random_uuid(),
  job_id         uuid not null references public.jobs(id) on delete cascade,
  student_id     uuid not null
                 references public.student_profiles(profile_id) on delete cascade,
  cover_letter   text check (cover_letter is null or char_length(cover_letter) <= 3000),
  proposed_rate  numeric(12,2) check (proposed_rate is null or proposed_rate >= 0),
  attachment_url text,
  status         public.application_status not null default 'pending',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint applications_unique_per_job unique (job_id, student_id)
);

create index applications_job_idx     on public.applications (job_id);
create index applications_student_idx on public.applications (student_id);
create index applications_status_idx  on public.applications (status);

create trigger applications_touch
before update on public.applications
for each row execute function public.touch_updated_at();

-- ---------- contracts ----------
create table public.contracts (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null unique
                 references public.applications(id) on delete cascade,
  agreed_rate    numeric(12,2) check (agreed_rate is null or agreed_rate >= 0),
  status         public.contract_status not null default 'active',
  started_at     timestamptz not null default now(),
  submitted_at   timestamptz,
  completed_at   timestamptz
);

-- ---------- reviews ----------
create table public.reviews (
  id          uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewee_id uuid not null references public.profiles(id) on delete cascade,
  rating      smallint not null check (rating between 1 and 5),
  comment     text check (comment is null or char_length(comment) <= 1000),
  created_at  timestamptz not null default now(),

  constraint reviews_one_per_reviewer unique (contract_id, reviewer_id),
  constraint reviews_no_self check (reviewer_id <> reviewee_id)
);

create index reviews_reviewee_idx on public.reviews (reviewee_id);

-- ---------- saved_jobs ----------
create table public.saved_jobs (
  student_id uuid not null
             references public.student_profiles(profile_id) on delete cascade,
  job_id     uuid not null references public.jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (student_id, job_id)
);

create index saved_jobs_job_idx on public.saved_jobs (job_id);

-- ---------- notifications ----------
create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  type       public.notification_type not null,
  title      text not null,
  body       text,
  link       text,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_idx
  on public.notifications (user_id, is_read, created_at desc);

-- =============================================================
-- Otomasi
-- =============================================================

-- Helper internal untuk membuat notifikasi dari dalam trigger.
create or replace function public.push_notification(
  p_user_id uuid,
  p_type    public.notification_type,
  p_title   text,
  p_body    text default null,
  p_link    text default null
)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.notifications (user_id, type, title, body, link)
  values (p_user_id, p_type, p_title, p_body, p_link);
$$;

-- Saat lamaran masuk: beri tahu pemilik job.
create or replace function public.on_application_created()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_client uuid;
  v_title  text;
begin
  select j.client_id, j.title into v_client, v_title
  from public.jobs j where j.id = new.job_id;

  perform public.push_notification(
    v_client,
    'application_received',
    'Lamaran baru masuk',
    'Ada pelamar baru untuk lowongan "' || v_title || '".',
    '/client/jobs/' || new.job_id || '/applications'
  );
  return new;
end;
$$;

create trigger applications_notify_client
after insert on public.applications
for each row execute function public.on_application_created();

-- Saat lamaran diterima: buat kontrak, tolak lamaran lain, ubah status job.
create or replace function public.on_application_accepted()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_title text;
begin
  if new.status = 'accepted' and old.status is distinct from 'accepted' then

    insert into public.contracts (application_id, agreed_rate)
    values (new.id, new.proposed_rate)
    on conflict (application_id) do nothing;

    update public.applications
    set status = 'rejected'
    where job_id = new.job_id
      and id <> new.id
      and status = 'pending';

    update public.jobs
    set status = 'in_progress'
    where id = new.job_id and status = 'open';

    select j.title into v_title from public.jobs j where j.id = new.job_id;

    perform public.push_notification(
      new.student_id,
      'application_accepted',
      'Lamaran kamu diterima',
      'Selamat! Lamaran untuk "' || v_title || '" diterima.',
      '/student/contracts'
    );

  elsif new.status = 'rejected' and old.status = 'pending' then

    select j.title into v_title from public.jobs j where j.id = new.job_id;

    perform public.push_notification(
      new.student_id,
      'application_rejected',
      'Lamaran belum berhasil',
      'Lamaran untuk "' || v_title || '" tidak dilanjutkan.',
      '/student/applications'
    );
  end if;

  return new;
end;
$$;

create trigger applications_handle_decision
after update on public.applications
for each row execute function public.on_application_accepted();

-- Saat kontrak selesai: tandai job completed dan beri tahu kedua pihak.
create or replace function public.on_contract_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_student uuid;
  v_client  uuid;
  v_job     uuid;
begin
  select a.student_id, j.client_id, j.id
    into v_student, v_client, v_job
  from public.applications a
  join public.jobs j on j.id = a.job_id
  where a.id = new.application_id;

  if new.status = 'submitted' and old.status is distinct from 'submitted' then
    new.submitted_at = now();
    perform public.push_notification(
      v_client, 'contract_submitted',
      'Pekerjaan ditandai selesai',
      'Mahasiswa menandai pekerjaan sebagai selesai. Mohon dikonfirmasi.',
      '/client/contracts'
    );

  elsif new.status = 'completed' and old.status is distinct from 'completed' then
    new.completed_at = now();
    update public.jobs set status = 'completed' where id = v_job;
    perform public.push_notification(
      v_student, 'contract_completed',
      'Kontrak selesai',
      'Pekerjaan telah dikonfirmasi selesai. Kamu bisa memberi ulasan sekarang.',
      '/student/contracts'
    );
  end if;

  return new;
end;
$$;

create trigger contracts_handle_status
before update on public.contracts
for each row execute function public.on_contract_status_change();

-- Saat review masuk: beri tahu yang dinilai.
create or replace function public.on_review_created()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.push_notification(
    new.reviewee_id, 'review_received',
    'Kamu menerima ulasan baru',
    'Seseorang memberi kamu rating ' || new.rating || ' dari 5.',
    '/profile'
  );
  return new;
end;
$$;

create trigger reviews_notify
after insert on public.reviews
for each row execute function public.on_review_created();

-- =============================================================
-- Row Level Security
-- =============================================================

alter table public.applications  enable row level security;
alter table public.contracts     enable row level security;
alter table public.reviews       enable row level security;
alter table public.saved_jobs    enable row level security;
alter table public.notifications enable row level security;

-- ---------- applications ----------
create policy "applications: visible to both parties"
  on public.applications for select to authenticated
  using (
    student_id = (select auth.uid())
    or exists (
      select 1 from public.jobs j
      where j.id = job_id and j.client_id = (select auth.uid())
    )
    or public.is_admin()
  );

-- Hanya mahasiswa, hanya untuk dirinya sendiri, hanya ke job yang terbuka.
create policy "applications: student applies to open job"
  on public.applications for insert to authenticated
  with check (
    student_id = (select auth.uid())
    and public.is_student()
    and exists (
      select 1 from public.jobs j
      where j.id = job_id
        and j.status = 'open'
        and (j.deadline is null or j.deadline >= current_date)
    )
  );

-- Mahasiswa boleh menarik lamaran, client boleh memutuskan.
create policy "applications: student can withdraw"
  on public.applications for update to authenticated
  using  (student_id = (select auth.uid()) and status = 'pending')
  with check (student_id = (select auth.uid()) and status = 'withdrawn');

create policy "applications: job owner decides"
  on public.applications for update to authenticated
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

-- ---------- contracts ----------
create policy "contracts: visible to both parties"
  on public.contracts for select to authenticated
  using (
    exists (
      select 1 from public.applications a
      join public.jobs j on j.id = a.job_id
      where a.id = application_id
        and (select auth.uid()) in (a.student_id, j.client_id)
    )
    or public.is_admin()
  );

create policy "contracts: parties can update"
  on public.contracts for update to authenticated
  using (
    exists (
      select 1 from public.applications a
      join public.jobs j on j.id = a.job_id
      where a.id = application_id
        and (select auth.uid()) in (a.student_id, j.client_id)
    )
    or public.is_admin()
  )
  with check (
    exists (
      select 1 from public.applications a
      join public.jobs j on j.id = a.job_id
      where a.id = application_id
        and (select auth.uid()) in (a.student_id, j.client_id)
    )
    or public.is_admin()
  );

-- Tidak ada policy INSERT: kontrak hanya lahir dari trigger.

-- ---------- reviews ----------
create policy "reviews: readable by anyone"
  on public.reviews for select using (true);

create policy "reviews: participant of completed contract"
  on public.reviews for insert to authenticated
  with check (
    reviewer_id = (select auth.uid())
    and exists (
      select 1 from public.contracts c
      join public.applications a on a.id = c.application_id
      join public.jobs j on j.id = a.job_id
      where c.id = contract_id
        and c.status = 'completed'
        and (select auth.uid()) in (a.student_id, j.client_id)
        and reviewee_id in (a.student_id, j.client_id)
    )
  );

create policy "reviews: author can edit"
  on public.reviews for update to authenticated
  using  (reviewer_id = (select auth.uid()) or public.is_admin())
  with check (reviewer_id = (select auth.uid()) or public.is_admin());

create policy "reviews: admin can delete"
  on public.reviews for delete to authenticated
  using (public.is_admin());

-- ---------- saved_jobs ----------
create policy "saved_jobs: owner only"
  on public.saved_jobs for all to authenticated
  using  (student_id = (select auth.uid()))
  with check (student_id = (select auth.uid()));

-- ---------- notifications ----------
create policy "notifications: owner reads"
  on public.notifications for select to authenticated
  using (user_id = (select auth.uid()));

create policy "notifications: owner marks read"
  on public.notifications for update to authenticated
  using  (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "notifications: owner deletes"
  on public.notifications for delete to authenticated
  using (user_id = (select auth.uid()));

-- Tidak ada policy INSERT: notifikasi hanya lahir dari trigger.

-- ---------- View agregat rating (aman dibaca publik) ----------
create or replace view public.profile_ratings
with (security_invoker = true) as
select
  reviewee_id      as profile_id,
  count(*)::int    as review_count,
  round(avg(rating)::numeric, 2) as average_rating
from public.reviews
group by reviewee_id;