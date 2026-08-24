create table if not exists public.tyre_products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  slug text not null unique,
  brand text not null,
  model text not null,
  width integer not null check (width > 0),
  profile integer not null check (profile > 0),
  rim integer not null check (rim > 0),
  load_index text,
  speed_rating text,
  run_flat boolean not null default false,
  extra_load boolean not null default false,
  season text not null check (season in ('summer', 'all-season', 'winter')),
  tier text not null check (tier in ('budget', 'mid', 'premium')),
  wet_grip_rating text,
  fuel_efficiency_rating text,
  noise_db integer check (noise_db is null or noise_db >= 0),
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  tyre_product_id uuid not null unique references public.tyre_products(id) on delete cascade,
  stock_qty integer not null default 0 check (stock_qty >= 0),
  reserved_qty integer not null default 0 check (reserved_qty >= 0 and reserved_qty <= stock_qty),
  cost_price_pence integer not null check (cost_price_pence >= 0),
  selling_price_pence integer not null check (selling_price_pence >= 0),
  supplier_sku text,
  low_stock_threshold integer not null default 2 check (low_stock_threshold >= 0),
  updated_at timestamptz not null default now()
);

drop trigger if exists tyre_products_set_updated_at on public.tyre_products;
create trigger tyre_products_set_updated_at
before update on public.tyre_products
for each row execute function public.set_updated_at();

drop trigger if exists inventory_set_updated_at on public.inventory;
create trigger inventory_set_updated_at
before update on public.inventory
for each row execute function public.set_updated_at();
