# Final Supabase, Authentication and RLS Audit

## Gate status

BLOCKED_EXTERNAL — NOT LIVE VERIFIED.

The V3 SQL is a credible structural foundation and the local verifier is
substantial, but no authorized disposable project was reset and migrated.
docs/LIVE_SUPABASE_VERIFICATION.md:7-9 and 118-129 records every live migration,
role, RLS and actual-secret bundle case as NOT RUN.

## Exact V3 table inventory

| Table | Important columns and constraints | Status |
|---|---|---|
| admin_profiles | uuid PK; unique auth.users user_id; name; role owner/admin CHECK; active; timestamps | IMPLEMENTED_NOT_LIVE_VERIFIED |
| customers | uuid PK; first/last/email/phone; created/updated | IMPLEMENTED_NOT_LIVE_VERIFIED |
| service_zones | uuid PK; unique postcode_prefix; callout_fee_pence integer >=0; active; priority | IMPLEMENTED_NOT_LIVE_VERIFIED |
| tyre_products | uuid PK; unique sku/slug; size; run_flat/extra_load; season CHECK; tier budget/mid/premium; ratings; active; timestamps | IMPLEMENTED_NOT_LIVE_VERIFIED |
| inventory | uuid PK; unique product FK; stock/reserved quantities; cost/selling integer pence; thresholds | IMPLEMENTED_NOT_LIVE_VERIFIED |
| availability_rules | uuid PK; day 0-6; start/end; duration; capacity; active; end > start | IMPLEMENTED_NOT_LIVE_VERIFIED |
| booking_slots | uuid PK; date/start_at/end_at; capacity; active; reason; unique interval | IMPLEMENTED_NOT_LIVE_VERIFIED |
| blocked_dates | uuid PK; unique date; reason; creator auth FK | IMPLEMENTED_NOT_LIVE_VERIFIED |
| slot_holds | uuid PK; slot FK; unique token; expires_at | IMPLEMENTED_NOT_LIVE_VERIFIED |
| inventory_holds | uuid PK; hold/product FKs; quantity >0; expires_at; unique pair | IMPLEMENTED_NOT_LIVE_VERIFIED |
| bookings | uuid PK; unique reference/manage_token; customer/slot/fitter/zone FKs; vehicle/address; status CHECK; pence totals; notes; timestamps | IMPLEMENTED_NOT_LIVE_VERIFIED |
| booking_items | uuid PK; booking/product FKs; immutable SKU/brand/model/size snapshots; quantity; unit/line pence | IMPLEMENTED_NOT_LIVE_VERIFIED |
| payments | uuid PK; booking FK; unique Stripe session/intent IDs; type/status CHECK; amount pence; created_at | IMPLEMENTED_NOT_LIVE_VERIFIED |
| webhook_events | uuid PK; provider/event/type; unique provider+event; processed_at | IMPLEMENTED_NOT_LIVE_VERIFIED |
| fitters | uuid PK; name/phone/van/active; timestamps | IMPLEMENTED_NOT_LIVE_VERIFIED |
| business_settings | singleton PK; deposit; hold; same-day; horizon; contacts; VAT; cancellation; updated_at | IMPLEMENTED_NOT_LIVE_VERIFIED |
| audit_logs | uuid PK; admin auth FK; action/resource/metadata; created_at | IMPLEMENTED_NOT_LIVE_VERIFIED |
| vrm_cache | uuid PK; unique lookup_hash; encrypted bytea payload; expiry; created_at | IMPLEMENTED_NOT_LIVE_VERIFIED |
| interest_registrations | uuid PK; email/postcode/source/created_at | IMPLEMENTED_NOT_LIVE_VERIFIED |

Sources: supabase/migrations/002 through 010. Money columns are integer pence
with non-negative CHECK constraints. Booking item price snapshots satisfy the
immutable line-price foundation.

## Exact column/type and relational appendix

Defaults shown as now or UUID mean now() or gen_random_uuid(). NOT NULL applies
unless nullable is stated.

- admin_profiles: id uuid PK default UUID; user_id uuid UNIQUE FK
  auth.users(id) ON DELETE CASCADE; name text; role text CHECK owner/admin;
  active boolean default true; created_at timestamptz default now; updated_at
  timestamptz default now.
- customers: id uuid PK default UUID; first_name text; last_name text; email
  text; phone text; created_at timestamptz default now; updated_at timestamptz
  default now.
- service_zones: id uuid PK default UUID; name text; postcode_prefix text
  UNIQUE; callout_fee_pence integer default 0 CHECK >=0; active boolean default
  true; priority integer default 100; created_at timestamptz default now.
- tyre_products: id uuid PK default UUID; sku text UNIQUE; slug text UNIQUE;
  brand text; model text; width/profile/rim integer each CHECK >0; load_index
  text nullable; speed_rating text nullable; run_flat boolean default false;
  extra_load boolean default false; season text CHECK summer/all-season/winter;
  tier text CHECK budget/mid/premium; wet_grip_rating text nullable;
  fuel_efficiency_rating text nullable; noise_db integer nullable CHECK null or
  >=0; image_url text nullable; active boolean default true; created_at and
  updated_at timestamptz default now.
- inventory: id uuid PK default UUID; tyre_product_id uuid UNIQUE FK
  tyre_products(id) ON DELETE CASCADE; stock_qty integer default 0 CHECK >=0;
  reserved_qty integer default 0 CHECK >=0 and <=stock_qty; cost_price_pence and
  selling_price_pence integer CHECK >=0; supplier_sku text nullable;
  low_stock_threshold integer default 2 CHECK >=0; updated_at timestamptz
  default now.
- availability_rules: id uuid PK default UUID; day_of_week integer CHECK 0..6;
  start_time time; end_time time; slot_duration_minutes integer CHECK >0;
  capacity integer CHECK >0; active boolean default true; CHECK end_time >
  start_time.
- booking_slots: id uuid PK default UUID; date date; start_at time; end_at time;
  capacity integer CHECK >0; active boolean default true; blocked_reason text
  nullable; created_at timestamptz default now; UNIQUE(date,start_at,end_at);
  CHECK end_at > start_at.
- blocked_dates: id uuid PK default UUID; date date UNIQUE; reason text nullable;
  created_by uuid nullable FK auth.users(id) ON DELETE SET NULL; created_at
  timestamptz default now.
- slot_holds: id uuid PK default UUID; slot_id uuid FK booking_slots(id) ON
  DELETE CASCADE; token text UNIQUE; expires_at timestamptz; created_at
  timestamptz default now.
- inventory_holds: id uuid PK default UUID; slot_hold_id uuid FK slot_holds(id)
  ON DELETE CASCADE; tyre_product_id uuid FK tyre_products(id) ON DELETE CASCADE;
  quantity integer CHECK >0; expires_at timestamptz; created_at timestamptz
  default now; UNIQUE(slot_hold_id,tyre_product_id).
- bookings: id uuid PK default UUID; reference text UNIQUE; manage_token uuid
  UNIQUE default UUID; customer_id uuid nullable FK customers(id) ON DELETE SET
  NULL; slot_id uuid nullable FK booking_slots(id) ON DELETE RESTRICT; fitter_id
  uuid nullable with FK to fitters added in migration 010 ON DELETE SET NULL;
  service_zone_id uuid nullable FK service_zones(id) ON DELETE SET NULL;
  registration/vehicle_make/vehicle_model/vehicle_derivative text nullable;
  fitting_address text; postcode text; status text default pending_payment CHECK
  pending_payment/confirmed/tyres_reserved/fitter_assigned/en_route/completed/
  cancelled/refunded/payment_failed; subtotal_pence, fitting_fee_pence,
  callout_fee_pence, total_pence, deposit_pence and balance_pence integer default
  0 CHECK >=0; customer_notes/admin_notes text nullable; created_at and
  updated_at timestamptz default now.
- booking_items: id uuid PK default UUID; booking_id uuid FK bookings(id) ON
  DELETE CASCADE; tyre_product_id uuid nullable FK tyre_products(id) ON DELETE
  SET NULL; sku_snapshot/brand_snapshot/model_snapshot/size_snapshot text;
  quantity integer CHECK >0; unit_price_pence and line_total_pence integer CHECK
  >=0. It has no timestamp or uniqueness constraint.
- payments: id uuid PK default UUID; booking_id uuid FK bookings(id) ON DELETE
  RESTRICT; provider text default stripe; stripe_checkout_session_id text
  nullable UNIQUE; stripe_payment_intent_id text nullable UNIQUE; type text CHECK
  deposit/balance/refund; status text CHECK pending/succeeded/failed/cancelled/
  refunded; amount_pence integer CHECK >=0; currency text default gbp;
  created_at timestamptz default now.
- webhook_events: id uuid PK default UUID; provider text; event_id text;
  event_type text; processed_at timestamptz default now;
  UNIQUE(provider,event_id).
- fitters: id uuid PK default UUID; name text; phone text nullable; van_name text
  nullable; active boolean default true; created_at and updated_at timestamptz
  default now.
- business_settings: id smallint PK default 1 CHECK id=1; deposit_mode text
  default fixed CHECK fixed/percent; deposit_value integer default 5000 CHECK
  >=0; slot_hold_minutes integer default 15 CHECK 1..60; same_day_enabled boolean
  default false; same_day_cutoff time nullable; booking_horizon_days integer
  default 60 CHECK >0; phone/email/whatsapp text nullable; vat_registered boolean
  default false; vat_number text nullable; cancellation_notice_hours integer
  default 48 CHECK >=0; updated_at timestamptz default now.
- audit_logs: id uuid PK default UUID; admin_user_id uuid nullable FK
  auth.users(id) ON DELETE SET NULL; action text; resource_type text; resource_id
  uuid nullable; metadata jsonb default empty object; created_at timestamptz
  default now.
- vrm_cache: id uuid PK default UUID; lookup_hash text UNIQUE; encrypted_payload
  bytea; expires_at timestamptz; created_at timestamptz default now.
- interest_registrations: id uuid PK default UUID; email text; postcode text;
  source text nullable; created_at timestamptz default now.

## Index, trigger and function inventory

- Updated-at triggers: admin_profiles, customers, tyre_products, inventory,
  bookings, fitters and business_settings.
- Explicit indexes: 18 in 012_indexes.sql:1-55 covering admin user, customer
  email, active zones/product sizes, inventory product, slot date, hold
  product/expiry, booking reference/slot/status/created, booking items,
  payments, audit time and VRM cache lookup/expiry.
- Migration functions: set_updated_at (001_extensions.sql:4-13) and
  is_active_admin(uuid) (011_rls.sql:1-18).
- Required transactional RPCs create_slot_hold, reserve_inventory,
  create_pending_booking, confirm_booking_paid, release_expired_resources and
  refund_booking: MISSING.

## RLS and grants

011_rls.sql:20-38 enables RLS on all 19 tables. Lines 40-57 revoke broad
anon/authenticated rights, grant only product-safe anonymous catalogue/zone
columns, authenticated SELECT plus RLS, and service-role access. Lines 59-87
create self/admin profile and public product/zone read policies. Lines 89-118
generate admin-read policies for 16 protected tables. The verifier expects
exactly 22 policies.

Status: IMPLEMENTED_NOT_LIVE_VERIFIED. Static structure passed
npm run test:security, but live denial for customers, payments, private
bookings, audit logs, holds and VRM cache remains unproven.

## Auth and role separation

| Identity | Code result | Evidence | Status |
|---|---|---|---|
| Anonymous | protected layout redirects via requireAdminPage | auth/admin.ts:34-75 | LOCAL_VERIFIED |
| Normal user | no qualifying profile → 403 | auth/admin.ts:48-60 | IMPLEMENTED_NOT_LIVE_VERIFIED |
| Inactive admin | active false → 403 | auth/admin.ts:58-60 | IMPLEMENTED_NOT_LIVE_VERIFIED |
| Active admin | owner/admin active allowed | auth/admin.ts:58-63 | IMPLEMENTED_NOT_LIVE_VERIFIED |
| Owner | same authorization class as admin | auth/admin.ts:59 | IMPLEMENTED_NOT_LIVE_VERIFIED |

Local unauthenticated /admin returned 307 to /admin/login in prior recorded
evidence. Live password login, refresh, persistence, logout, global revocation
and immediate deactivation denial are BLOCKED_EXTERNAL.

## Schema production gaps

- No cancellation/refund ledger or reason/timestamp fields beyond booking
  status and refund-type payment rows.
- Manage token is stored in plaintext UUID form with no expiry, hash, rotation
  or revocation field.
- No status-history table; audit logs cover admin actions only if application
  code calls them.
- No database functions enforce slot capacity, inventory availability, booking
  creation or webhook idempotency as one transaction.
- No rate-limit table/function.
- No reminder/outbox/job table for durable email.

## Required Gate 0 action

Reset an authorized disposable Supabase project; apply 001-012 exactly; run
phase1_catalog_checks.sql and scripts/phase1-live-acceptance.mjs with normal,
inactive-admin and active-owner identities; record sanitized evidence; reset and
repeat after any SQL fix. Phase 1 may become LIVE_VERIFIED only when every case
passes.
