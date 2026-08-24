create table if not exists public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  day_of_week integer not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  slot_duration_minutes integer not null check (slot_duration_minutes > 0),
  capacity integer not null check (capacity > 0),
  active boolean not null default true,
  check (end_time > start_time)
);

create table if not exists public.booking_slots (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  start_at time not null,
  end_at time not null,
  capacity integer not null check (capacity > 0),
  active boolean not null default true,
  blocked_reason text,
  created_at timestamptz not null default now(),
  unique (date, start_at, end_at),
  check (end_at > start_at)
);

create table if not exists public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  reason text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
