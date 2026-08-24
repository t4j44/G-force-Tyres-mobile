# Final Catalogue and Inventory Audit

## Readiness

CATALOGUE READY: 20%

Customer journey status: MOCK_ONLY.

V3 table status: IMPLEMENTED_NOT_LIVE_VERIFIED.

## Field/source inventory

| Data | V3 source | Current customer source | Status |
|---|---|---|---|
| SKU/slug/brand/model/size | tyre_products, 005_catalogue.sql:1-9 | MOCK_TYRES | MOCK_ONLY |
| load/speed/run-flat/XL/season/tier | tyre_products:10-15 | MOCK_TYRES | MOCK_ONLY |
| EU wet/fuel/noise/image | tyre_products:16-20 | MOCK_TYRES | MOCK_ONLY |
| cost/selling price | inventory:30-31 | LocalBookingStore Tyre object | MOCK_ONLY |
| stock/reserved stock | inventory:28-29 | single mock stock number | MOCK_ONLY |
| active flag | both product and zone records | mock fixture | MOCK_ONLY |

The schema properly separates public product specification from private
commercial inventory. RLS exposes product-safe tyre columns but does not expose
cost, selling price or inventory to anonymous users
(011_rls.sql:43-51). A server catalogue endpoint/view still has to join active
products to sell price and calculated available quantity without exposing cost.

Requirement source for the locked Budget / Standard / Premium names:
G Force Tyres Mobile — Master PRD, TRD & Production Architecture v3.0.md:12-44.

## Schema/code divergence

- Runtime Tyre uses is_run_flat, is_xl, cost_price, sell_price, stock,
  wet_grip and fuel_economy at src/types/index.ts:16-37.
- V3 uses run_flat, extra_load, cost_price_pence, selling_price_pence,
  stock_qty/reserved_qty, wet_grip_rating and fuel_efficiency_rating.
- Pricing queries tyre_inventory at src/lib/pricing.ts:74-83, a table that does
  not exist.
- The locked product tiers are Budget / Standard / Premium, while V3 and UI use
  budget / mid / premium and display Mid-Range
  (005_catalogue.sql:15; tyres/page.tsx:101-106).

Status: PARTIAL. Add an explicit database-to-domain mapper and adopt the locked
Standard label/enum consistently before importing real data.

## Public catalogue behavior

/tyres reads LocalBookingStore only when mock mode is on and otherwise returns
an empty product array (src/app/tyres/page.tsx:25-37). Filters and product cards
are present but do not prove a live catalogue. revalidate=60 at line 9 would
permit one-minute page caching; inventory availability must not rely on that
value for checkout.

## Stock correctness

The V3 inventory CHECK reserved_qty <= stock_qty is useful, but no transaction
updates reserved_qty and inventory_holds together. Customer cards use the mock
Tyre.stock field. Checkout pricing reads mock stock and performs an in-memory
comparison. Therefore:

- stale stock display: possible if a future cached catalogue is treated as
  authoritative;
- frontend manipulation: display values can be changed, though intended server
  calculation ignores client amounts;
- race overselling: unprevented;
- expired reservations: no cleanup job;
- reserved quantity drift: no reconciler.

All checkout availability must be revalidated under database row locks. Display
availability should be explicitly advisory.

## Import and owner operations

No CSV parser/import route, supplier feed, bulk validation, duplicate policy or
import audit exists. Admin inventory creates/updates only LocalBookingStore
(admin/(protected)/inventory/page.tsx:32-76). Product creation, price update,
stock adjustment and CSV import are MOCK_ONLY. Supplier authorization and the
initial product truth file are BLOCKED_OWNER_DECISION.
