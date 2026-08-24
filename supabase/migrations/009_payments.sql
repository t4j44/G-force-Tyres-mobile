create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete restrict,
  provider text not null default 'stripe',
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text unique,
  type text not null check (type in ('deposit', 'balance', 'refund')),
  status text not null check (status in ('pending', 'succeeded', 'failed', 'cancelled', 'refunded')),
  amount_pence integer not null check (amount_pence >= 0),
  currency text not null default 'gbp',
  created_at timestamptz not null default now()
);

create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_id text not null,
  event_type text not null,
  processed_at timestamptz not null default now(),
  unique (provider, event_id)
);
