create index if not exists idx_admin_profiles_user_id
  on public.admin_profiles (user_id);

create index if not exists idx_customers_email
  on public.customers (lower(email));

create index if not exists idx_service_zones_prefix_priority
  on public.service_zones (postcode_prefix, priority)
  where active = true;

create index if not exists idx_tyre_products_size
  on public.tyre_products (width, profile, rim)
  where active = true;

create index if not exists idx_inventory_product
  on public.inventory (tyre_product_id);

create index if not exists idx_booking_slots_date_active
  on public.booking_slots (date, active);

create index if not exists idx_slot_holds_slot
  on public.slot_holds (slot_id);

create index if not exists idx_slot_holds_expires_at
  on public.slot_holds (expires_at);

create index if not exists idx_inventory_holds_product
  on public.inventory_holds (tyre_product_id);

create index if not exists idx_inventory_holds_expires_at
  on public.inventory_holds (expires_at);

create index if not exists idx_bookings_reference
  on public.bookings (reference);

create index if not exists idx_bookings_slot_id
  on public.bookings (slot_id);

create index if not exists idx_bookings_status
  on public.bookings (status);

create index if not exists idx_bookings_created_at
  on public.bookings (created_at desc);

create index if not exists idx_booking_items_booking_id
  on public.booking_items (booking_id);

create index if not exists idx_payments_booking_id
  on public.payments (booking_id);

create index if not exists idx_audit_logs_created_at
  on public.audit_logs (created_at desc);

create index if not exists idx_vrm_cache_lookup_expires
  on public.vrm_cache (lookup_hash, expires_at);
