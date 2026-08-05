-- =============================================================
-- Fix handle_new_user(): baca nickname dari raw_user_meta_data
-- =============================================================
-- handle_new_user() awalnya hanya membaca role dan full_name dari
-- metadata signup, sehingga nickname yang dikirim lewat options.data
-- saat signUp tidak pernah tersimpan ke profiles. Redefinisi ini
-- menambahkan pembacaan nickname dengan pola yang sama seperti
-- full_name (nullif + trim, opsional).

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

  insert into public.profiles (id, role, full_name, nickname)
  values (
    new.id,
    resolved,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Pengguna Baru'),
    nullif(trim(new.raw_user_meta_data ->> 'nickname'), '')
  );

  if resolved = 'client' then
    insert into public.client_profiles (profile_id) values (new.id);
  else
    insert into public.student_profiles (profile_id) values (new.id);
  end if;

  return new;
end;
$$;
