create table if not exists public.fitters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  van_name text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'bookings_fitter_id_fkey'
  ) then
    alter table public.bookings
      add constraint bookings_fitter_id_fkey
      foreign key (fitter_id) references public.fitters(id) on delete set null;
  end if;
end;
$$;

create table if not exists public.business_settings (
  id smallint primary key default 1 check (id = 1),
  deposit_mode text not null default 'fixed' check (deposit_mode in ('fixed', 'percent')),
  deposit_value integer not null default 5000 check (deposit_value >= 0),
  slot_hold_minutes integer not null default 15 check (slot_hold_minutes between 1 and 60),
  same_day_enabled boolean not null default false,
  same_day_cutoff time,
  booking_horizon_days integer not null default 60 check (booking_horizon_days > 0),
  phone text,
  email text,
  whatsapp text,
  vat_registered boolean not null default false,
  vat_number text,
  cancellation_notice_hours integer not null default 48 check (cancellation_notice_hours >= 0),
  updated_at timestamptz not null default now()
);

insert into public.business_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.vrm_cache (
  id uuid primary key default gen_random_uuid(),
  lookup_hash text not null unique,
  encrypted_payload bytea not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.interest_registrations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  postcode text not null,
  source text,
  created_at timestamptz not null default now()
);

drop trigger if exists fitters_set_updated_at on public.fitters;
create trigger fitters_set_updated_at
before update on public.fitters
for each row execute function public.set_updated_at();

drop trigger if exists business_settings_set_updated_at on public.business_settings;
create trigger business_settings_set_updated_at
before update on public.business_settings
for each row execute function public.set_updated_at();
