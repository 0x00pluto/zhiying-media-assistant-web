-- grant account tables to service_role (BFF uses SUPABASE_SECRET_KEY)

grant select, insert, update on public.user_profiles to service_role;
grant select on public.app_config to service_role;
