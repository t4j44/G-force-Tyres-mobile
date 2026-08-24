create table if not exists public.slot_holds (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references public.booking_slots(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_holds (
  id uuid primary key default gen_random_uuid(),
  slot_hold_id uuid not null references public.slot_holds(id) on delete cascade,
  tyre_product_id uuid not null references public.tyre_products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (slot_hold_id, tyre_product_id)
);
