import { createServiceClient, isSupabaseConfigured } from './supabase';
import { formatTyreSize } from './utils';
import { MOCK_SETTINGS, localStore } from './mockData';
import type { AppSettings, CartLine, PriceBreakdown, Tyre } from '@/types';

/**
 * ══════════════════════════════════════════════════════════════
 * THE SINGLE MOST SECURITY-CRITICAL FILE IN THIS CODEBASE.
 * ══════════════════════════════════════════════════════════════
 *
 * The browser sends only tyre IDs and quantities. It never sends a price.
 * Every figure that reaches Stripe is computed here, from the database,
 * on the server.
 *
 * If you ever find yourself accepting a price from the client — stop.
 * That is how someone pays £1 for four Michelins.
 */

export async function getSettings(): Promise<AppSettings> {
  if (isSupabaseConfigured()) {
    try {
      const db = createServiceClient();
      const { data } = await db.from('app_settings').select('*').eq('id', 1).single();
      if (data) {
        return {
          deposit_mode: data?.deposit_mode ?? 'fixed',
          deposit_fixed: data?.deposit_fixed ?? 5000,
          deposit_percent: data?.deposit_percent ?? 20,
          fitting_fee: data?.fitting_fee ?? 2000,
          job_duration_mins: data?.job_duration_mins ?? 60,
          cancellation_policy:
            data?.cancellation_policy ?? 'Free cancellation up to 48 hours before your appointment.',
          business_phone: data?.business_phone ?? null,
        };
      }
    } catch {
      // Fallback to MOCK_SETTINGS below
    }
  }

  return MOCK_SETTINGS;
}

export class PricingError extends Error {
  constructor(
    public code: 'TYRE_NOT_FOUND' | 'OUT_OF_STOCK' | 'EMPTY_CART',
    message: string
  ) {
    super(message);
    this.name = 'PricingError';
  }
}

/**
 * Recalculate an entire order from scratch.
 *
 * @param lines          tyre_id + quantity, straight from the client
 * @param calloutCharge  pence, resolved from the service zone (never client-supplied)
 * @throws PricingError  when a tyre is missing, inactive, or understocked
 */
export async function calculatePrice(
  lines: CartLine[],
  calloutCharge: number
): Promise<PriceBreakdown> {
  if (!lines.length) {
    throw new PricingError('EMPTY_CART', 'No tyres selected.');
  }

  const settings = await getSettings();
  const ids = Array.from(new Set(lines.map((l) => l.tyre_id)));

  let tyres: Tyre[] | null = null;

  if (isSupabaseConfigured()) {
    try {
      const db = createServiceClient();
      const res = await db
        .from('tyre_inventory')
        .select('*')
        .in('id', ids)
        .eq('active', true)
        .returns<Tyre[]>();
      tyres = res.data;
    } catch {
      tyres = null;
    }
  }

  // If Supabase is unconfigured or returned no data, search local store
  if (!tyres || tyres.length === 0) {
    tyres = ids
      .map((id) => localStore.getTyreById(id))
      .filter((t): t is Tyre => !!t && t.active);
  }

  const byId = new Map((tyres ?? []).map((t) => [t.id, t]));

  const priced = lines.map((line) => {
    const tyre = byId.get(line.tyre_id);

    if (!tyre) {
      throw new PricingError(
        'TYRE_NOT_FOUND',
        'One of the selected tyres is no longer available.'
      );
    }

    if (tyre.stock < line.quantity) {
      throw new PricingError(
        'OUT_OF_STOCK',
        `Only ${tyre.stock} of the ${tyre.brand} ${tyre.model} left in stock.`
      );
    }

    // ← price comes from the DB row, NOT from the request
    const unit_price = tyre.sell_price;

    return {
      tyre_id: tyre.id,
      label: `${tyre.brand} ${tyre.model} ${formatTyreSize(tyre)}`,
      quantity: line.quantity,
      unit_price,
      line_total: unit_price * line.quantity,
    };
  });

  const tyres_total = priced.reduce((sum, l) => sum + l.line_total, 0);
  const fitting_fee = settings.fitting_fee;
  const total_amount = tyres_total + fitting_fee + calloutCharge;

  const deposit_amount =
    settings.deposit_mode === 'fixed'
      ? Math.min(settings.deposit_fixed, total_amount)
      : Math.round((total_amount * settings.deposit_percent) / 100);

  return {
    lines: priced,
    tyres_total,
    fitting_fee,
    callout_charge: calloutCharge,
    total_amount,
    deposit_amount,
    balance_due: total_amount - deposit_amount,
  };
}

/**
 * Client-side estimate for the live order summary.
 * Display only — the server figure always wins at checkout.
 */
export function estimateTotal(
  tyres: Array<{ sell_price: number; quantity: number }>,
  fittingFee: number,
  calloutCharge: number,
  depositFixed = 5000
): { total: number; deposit: number; balance: number } {
  const tyresTotal = tyres.reduce((s, t) => s + t.sell_price * t.quantity, 0);
  const total = tyresTotal + fittingFee + calloutCharge;
  const deposit = Math.min(depositFixed, total);
  return { total, deposit, balance: total - deposit };
}
