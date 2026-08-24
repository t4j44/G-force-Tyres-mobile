import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), 'utf8');

const expectedMigrations = [
  '001_extensions.sql',
  '002_admin_profiles.sql',
  '003_customers.sql',
  '004_service_zones.sql',
  '005_catalogue.sql',
  '006_availability.sql',
  '007_booking_resources.sql',
  '008_bookings.sql',
  '009_payments.sql',
  '010_operations.sql',
  '011_rls.sql',
  '012_indexes.sql',
];

assert.deepEqual(
  readdirSync(join(root, 'supabase', 'migrations')).sort(),
  expectedMigrations,
  'Migration set or order differs from the approved Phase 1 plan.',
);

const allSql = expectedMigrations.map((name) => read(`supabase/migrations/${name}`)).join('\n');
const requiredTables = [
  'admin_profiles', 'customers', 'service_zones', 'tyre_products', 'inventory',
  'availability_rules', 'booking_slots', 'blocked_dates', 'slot_holds',
  'inventory_holds', 'bookings', 'booking_items', 'payments', 'webhook_events',
  'fitters', 'business_settings', 'audit_logs', 'vrm_cache', 'interest_registrations',
];

for (const table of requiredTables) {
  assert.match(allSql, new RegExp(`create table if not exists public\\.${table}\\b`, 'i'));
  assert.match(
    read('supabase/migrations/011_rls.sql'),
    new RegExp(`alter table public\\.${table} enable row level security`, 'i'),
  );
}

for (const route of [
  'src/app/api/admin/slots/generate/route.ts',
  'src/app/api/admin/slots/update/route.ts',
]) {
  assert.match(read(route), /await requireAdmin\(\)/, `${route} does not independently authorize.`);
}

const login = read('src/app/admin/login/page.tsx');
assert.doesNotMatch(login, /1-Click Demo Login|admin@gforcetyres|automatic redirect/i);
assert.match(login, /\/api\/admin\/login/);

const mockConfirmation = read('src/app/api/checkout/confirm-mock/route.ts');
assert.match(mockConfirmation, /if \(!isMockDataEnabled\(\)\)/);

const unsafeConfig = spawnSync(
  process.execPath,
  ['-e', "import('./next.config.mjs')"],
  {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, APP_ENV: 'production', ENABLE_MOCK_DATA: 'true' },
  },
);
assert.notEqual(unsafeConfig.status, 0, 'Production mock mode did not fail configuration load.');
assert.match(`${unsafeConfig.stdout}${unsafeConfig.stderr}`, /Unsafe configuration/);

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

for (const file of walk(join(root, 'src')).filter((path) => /\.(ts|tsx)$/.test(path))) {
  const source = readFileSync(file, 'utf8');
  if (/^[\s]*['\"]use client['\"];/.test(source)) {
    assert.doesNotMatch(source, /SUPABASE_SERVICE_ROLE_KEY/);
  }
}

const staticRoot = join(root, '.next', 'static');
if (existsSync(staticRoot)) {
  for (const file of walk(staticRoot).filter((path) => path.endsWith('.js'))) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /SUPABASE_SERVICE_ROLE_KEY/);
  }
}

console.log('Security structure checks passed. Live Supabase role scenarios remain manual integration tests.');
