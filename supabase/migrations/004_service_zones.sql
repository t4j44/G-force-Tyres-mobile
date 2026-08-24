create table if not exists public.service_zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  postcode_prefix text not null unique,
  callout_fee_pence integer not null default 0 check (callout_fee_pence >= 0),
  active boolean not null default true,
  priority integer not null default 100,
  created_at timestamptz not null default now()
);
