# Final Admin Operations Audit

## Founder summary

ADMIN READY: 20%

The login/authorization shell exists, but the console is not an operating
system. In production mode bookings, inventory and slots show an honest pending
state. Zones, fitters and settings screens do not exist. No ordinary client
operation currently persists through the admin UI.

## Screen matrix

| Screen | UI | Real Supabase read | Persistent mutation | Server auth | Audit log | Status |
|---|---|---|---|---|---|---|
| /admin | redirect hub | no | no | protected layout | no | PARTIAL |
| /admin/bookings | yes | no | no | yes | no | MOCK_ONLY |
| /admin/inventory | yes | no | no | yes | no | MOCK_ONLY |
| /admin/slots | yes | no | no | yes | mock API attempts log | MOCK_ONLY |
| /admin/zones | no | no | no | n/a | no | MISSING |
| /admin/fitters | no | no | no | n/a | no | MISSING |
| /admin/settings | no | no | no | n/a | no | MISSING |

Evidence: protected layout calls requireAdminPage
(admin/(protected)/layout.tsx:1-9); each existing screen returns
AdminDataPending with mock mode off; local operations call LocalBookingStore.

## Owner action classification

| Required action | Status | Evidence/action |
|---|---|---|
| Booking search/filter | MOCK_ONLY | bookings page local array |
| Status update | MOCK_ONLY | localStore.updateBookingStatus |
| Fitter assignment | MOCK_ONLY | MOCK_FITTERS |
| Reschedule | MISSING | no persistent route |
| Cancel/refund | MISSING | decorative/preview actions only |
| Stock update | MOCK_ONLY | localStore.updateTyreStock |
| Price update | MOCK_ONLY | create form has price but no persistence |
| Product creation | MOCK_ONLY | localStore.addTyre |
| CSV import | MISSING | no parser/route |
| Slot/day block | MOCK_ONLY | admin slots APIs return 501 in real mode |
| Capacity change | MOCK_ONLY | same |
| Recurring availability | MOCK_ONLY | hardcoded UI windows; no DB writer |
| Zone enable/disable/callout fee | MISSING | no screen/API |
| Fitter CRUD/offboarding | MISSING | no screen/API |
| Business settings | MISSING | no screen/API |
| Admin access/offboarding | MISSING | bootstrap is manual SQL/docs only |

## Authorization and mutation safety

Authentication is server-side, not UI-only. requireAdmin verifies the current
Supabase user and an active owner/admin profile at
src/lib/auth/admin.ts:34-63. Both slot mutation routes call requireAdmin before
parsing/mutating. This is IMPLEMENTED_NOT_LIVE_VERIFIED until live identities
and RLS pass.

The UI does not consistently inspect mutation responses before updating its
mock state, and production-quality retry/conflict/error states are absent.
Optimistic behavior must use row versions or returned authoritative records
where concurrent operators can conflict.

## Hardcoded business settings

| Setting | Current hardcode | Evidence | Owner editable |
|---|---|---|---|
| Deposit | £50 / 20% mock | mockData.ts:5-7; booking/page.tsx:196 | NO |
| Fitting fee | £20 | mockData.ts:8; booking/page.tsx:190 | NO |
| Cancellation | 48 hours / full refund claim | mockData.ts:10; booking/page.tsx:870 | NO |
| Working windows | 09:00–17:00 fixed blocks | mockData.ts:514-517; admin slots page:27-30 | NO |
| Hold timer | 15 minutes | pay/page.tsx:30; holds route | NO effective production setting |
| Slot capacity | mock defaults | slots generator UI/API | NO persistent |
| Service zones/fees | mock prefixes/fees | mockData.ts:15-28 | NO |
| Phone | placeholder-style number | mockData.ts:11 | NO |
| Email/WhatsApp/VAT/horizon | columns exist only | 010_operations.sql:23-37 | NO UI |

Gate 4 acceptance requires every ordinary operation above to persist, produce an
audit record, expose truthful loading/error/empty/conflict state and pass role
tests.
