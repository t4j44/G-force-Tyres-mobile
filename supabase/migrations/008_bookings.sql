create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  manage_token uuid not null unique default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  slot_id uuid references public.booking_slots(id) on delete restrict,
  fitter_id uuid,
  service_zone_id uuid references public.service_zones(id) on delete set null,
  registration text,
  vehicle_make text,
  vehicle_model text,
  vehicle_derivative text,
  fitting_address text not null,
  postcode text not null,
  status text not null default 'pending_payment' check (
    status in (
      'pending_payment', 'confirmed', 'tyres_reserved', 'fitter_assigned',
      'en_route', 'completed', 'cancelled', 'refunded', 'payment_failed'
    )
  ),
  subtotal_pence integer not null default 0 check (subtotal_pence >= 0),
  fitting_fee_pence integer not null default 0 check (fitting_fee_pence >= 0),
  callout_fee_pence integer not null default 0 check (callout_fee_pence >= 0),
  total_pence integer not null default 0 check (total_pence >= 0),
  deposit_pence integer not null default 0 check (deposit_pence >= 0),
  balance_pence integer not null default 0 check (balance_pence >= 0),
  customer_notes text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.booking_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  tyre_product_id uuid references public.tyre_products(id) on delete set null,
  sku_snapshot text not null,
  brand_snapshot text not null,
  model_snapshot text not null,
  size_snapshot text not null,
  quantity integer not null check (quantity > 0),
  unit_price_pence integer not null check (unit_price_pence >= 0),
  line_total_pence integer not null check (line_total_pence >= 0)
);

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();
