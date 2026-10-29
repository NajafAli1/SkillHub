-- =============================================================
-- Email kontak setelah lamaran diterima
-- =============================================================
-- Email user ada di auth.users yang tidak bisa dibaca client. Fungsi ini
-- mengembalikan email PIHAK LAIN dari sebuah lamaran, hanya jika:
--   - lamaran berstatus 'accepted', dan
--   - pemanggil adalah mahasiswa pelamar atau client pemilik job.
-- Selain itu mengembalikan NULL, jadi email tidak bisa dipanen.

create or replace function public.get_counterpart_email(p_application_id uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select u.email::text
  from public.applications a
  join public.jobs j on j.id = a.job_id
  join auth.users u
    on u.id = case when a.student_id = (select auth.uid()) then j.client_id else a.student_id end
  where a.id = p_application_id
    and a.status = 'accepted'
    and (select auth.uid()) in (a.student_id, j.client_id);
$$;

revoke execute on function public.get_counterpart_email(uuid) from public, anon;
grant execute on function public.get_counterpart_email(uuid) to authenticated;
