create or replace function public.is_active_admin(check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = check_user_id
      and active = true
      and role in ('owner', 'admin')
  );
$$;

revoke all on function public.is_active_admin(uuid) from public;
grant execute on function public.is_active_admin(uuid) to authenticated;

alter table public.admin_profiles enable row level security;
alter table public.customers enable row level security;
alter table public.service_zones enable row level security;
alter table public.tyre_products enable row level security;
alter table public.inventory enable row level security;
alter table public.availability_rules enable row level security;
alter table public.booking_slots enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.slot_holds enable row level security;
alter table public.inventory_holds enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_items enable row level security;
alter table public.payments enable row level security;
alter table public.webhook_events enable row level security;
alter table public.fitters enable row level security;
alter table public.business_settings enable row level security;
alter table public.audit_logs enable row level security;
alter table public.vrm_cache enable row level security;
alter table public.interest_registrations enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant usage on schema public to anon, authenticated;

-- Only product-safe columns are available to the anonymous catalogue.
grant select (
  id, sku, slug, brand, model, width, profile, rim, load_index, speed_rating,
  run_flat, extra_load, season, tier, wet_grip_rating,
  fuel_efficiency_rating, noise_db, image_url, active
) on public.tyre_products to anon;

grant select (id, name, postcode_prefix, callout_fee_pence, active, priority)
on public.service_zones to anon;

-- Authenticated users still need table privileges; RLS below restricts normal
-- users to their own profile and public-safe rows, while active admins may read.
grant select on all tables in schema public to authenticated;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;

drop policy if exists admin_profiles_self_read on public.admin_profiles;
create policy admin_profiles_self_read
on public.admin_profiles for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists admin_profiles_admin_read on public.admin_profiles;
create policy admin_profiles_admin_read
on public.admin_profiles for select to authenticated
using (public.is_active_admin((select auth.uid())));

drop policy if exists tyre_products_public_read on public.tyre_products;
create policy tyre_products_public_read
on public.tyre_products for select to anon, authenticated
using (active = true);

drop policy if exists tyre_products_admin_read on public.tyre_products;
create policy tyre_products_admin_read
on public.tyre_products for select to authenticated
using (public.is_active_admin((select auth.uid())));

drop policy if exists service_zones_public_read on public.service_zones;
create policy service_zones_public_read
on public.service_zones for select to anon, authenticated
using (active = true);

drop policy if exists service_zones_admin_read on public.service_zones;
create policy service_zones_admin_read
on public.service_zones for select to authenticated
using (public.is_active_admin((select auth.uid())));

do $$
declare
  protected_table text;
begin
  foreach protected_table in array array[
    'customers',
    'inventory',
    'availability_rules',
    'booking_slots',
    'blocked_dates',
    'slot_holds',
    'inventory_holds',
    'bookings',
    'booking_items',
    'payments',
    'webhook_events',
    'fitters',
    'business_settings',
    'audit_logs',
    'vrm_cache',
    'interest_registrations'
  ]
  loop
    execute format('drop policy if exists active_admin_read on public.%I', protected_table);
    execute format(
      'create policy active_admin_read on public.%I for select to authenticated using (public.is_active_admin((select auth.uid())))',
      protected_table
    );
  end loop;
end;
$$;
