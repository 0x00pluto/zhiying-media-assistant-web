-- user_profiles + app_config: 账号中心业务表与公测配置

create table public.app_config (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_config enable row level security;

create table public.user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  phone_e164 text not null,
  plan text not null,
  entitlement_status text not null default 'active',
  expires_at timestamptz,
  enrolled_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_profiles_plan_check check (
    plan in ('free', 'pro', 'enterprise')
  ),
  constraint user_profiles_entitlement_status_check check (
    entitlement_status in ('active', 'expired', 'revoked')
  )
);

alter table public.user_profiles enable row level security;

create policy "Users can read own profile"
  on public.user_profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.user_profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row
  execute function public.set_updated_at();

create trigger app_config_set_updated_at
  before update on public.app_config
  for each row
  execute function public.set_updated_at();

insert into public.app_config (key, value)
values
  ('beta_enrollment_ends_at', '"2026-12-31T23:59:59Z"'::jsonb),
  ('beta_pro_duration_days', '90'::jsonb);
