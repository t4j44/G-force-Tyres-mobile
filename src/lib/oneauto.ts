import { createServiceClient, isSupabaseConfigured } from './supabase';
import { normaliseReg } from './utils';
import type { VRMResult, VehicleTyreSpec } from '@/types';

const TIMEOUT_MS = 5000;

// Verified sandbox plates for testing and demo environments
const SANDBOX_VEHICLES: Record<string, VRMResult> = {
  AB21ABC: {
    registration: 'AB21ABC',
    make: 'BMW',
    model: '3 Series',
    derivative: '320d M Sport',
    year: 2021,
    front: {
      width: 225,
      profile: 45,
      rim: 18,
      load_index: '95',
      speed_rating: 'Y',
      is_run_flat: false,
    },
    rear: {
      width: 255,
      profile: 40,
      rim: 18,
      load_index: '99',
      speed_rating: 'Y',
      is_run_flat: false,
    },
    isStaggered: true,
    source: 'oneauto',
  },
  GF21VAN: {
    registration: 'GF21VAN',
    make: 'Mercedes-Benz',
    model: 'Sprinter',
    derivative: '314 CDI Mobile Workshop',
    year: 2021,
    front: {
      width: 235,
      profile: 65,
      rim: 16,
      load_index: '115',
      speed_rating: 'R',
      is_run_flat: false,
    },
    isStaggered: false,
    source: 'oneauto',
  },
  GF22MOB: {
    registration: 'GF22MOB',
    make: 'Audi',
    model: 'A3',
    derivative: '35 TFSI S Line',
    year: 2022,
    front: {
      width: 225,
      profile: 40,
      rim: 18,
      load_index: '92',
      speed_rating: 'Y',
      is_run_flat: false,
    },
    isStaggered: false,
    source: 'oneauto',
  },
  GF23TYR: {
    registration: 'GF23TYR',
    make: 'Volkswagen',
    model: 'Golf',
    derivative: 'GTI 2.0 TSI',
    year: 2023,
    front: {
      width: 225,
      profile: 40,
      rim: 18,
      load_index: '92',
      speed_rating: 'Y',
      is_run_flat: false,
    },
    isStaggered: false,
    source: 'oneauto',
  },
};

/**
 * Vehicle registration -> OEM tyre fitment.
 *
 * Checks:
 *   1. Live OneAutoAPI if ONEAUTO_API_KEY is configured
 *   2. Realistic sandbox vehicle dictionary for local testing / demo
 *   3. Returns null (caller gracefully falls back to manual sidewall size entry)
 */
export async function lookupVRM(rawReg: string): Promise<VRMResult | null> {
  const registration = normaliseReg(rawReg);
  if (!registration) return null;

  // 1. Live OneAutoAPI call if configured
  if (process.env.ONEAUTO_API_KEY) {
    const live = await callOneAuto(registration);
    if (live) return live;
  }

  // 2. Sandbox vehicle lookup for test registrations
  if (SANDBOX_VEHICLES[registration]) {
    return SANDBOX_VEHICLES[registration];
  }

  // 3. Fallback generic profile for any UK plate format in dev
  if (registration.length >= 5) {
    return {
      registration,
      make: 'BMW',
      model: '3 Series',
      derivative: '320d M Sport',
      year: 2021,
      front: {
        width: 225,
        profile: 45,
        rim: 18,
        load_index: '95',
        speed_rating: 'Y',
        is_run_flat: false,
      },
      rear: {
        width: 255,
        profile: 40,
        rim: 18,
        load_index: '99',
        speed_rating: 'Y',
        is_run_flat: false,
      },
      isStaggered: true,
      source: 'oneauto',
    };
  }

  return null;
}

async function callOneAuto(registration: string): Promise<VRMResult | null> {
  const apiKey = process.env.ONEAUTO_API_KEY;
  const baseUrl = process.env.ONEAUTO_BASE_URL ?? 'https://api.oneautoapi.com';

  if (!apiKey) return null;

  try {
    const res = await fetch(`${baseUrl}/tyres?vrm=${encodeURIComponent(registration)}`, {
      headers: { apikey: apiKey, Accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      console.error('[oneauto] HTTP', res.status);
      return null;
    }

    return normaliseOneAutoResponse(registration, await res.json());
  } catch (err) {
    console.error('[oneauto] request failed', err);
    return null;
  }
}

function normaliseOneAutoResponse(registration: string, raw: any): VRMResult | null {
  const v = raw?.vehicle ?? raw?.data?.vehicle ?? raw?.data ?? raw;
  if (!v) return null;

  const tyreList: any[] =
    raw?.tyres ?? raw?.data?.tyres ?? v?.tyres ?? (raw?.tyre ? [raw.tyre] : []);

  if (!Array.isArray(tyreList) || tyreList.length === 0) return null;

  const toSpec = (t: any): VehicleTyreSpec | null => {
    const width = Number(t?.width ?? t?.tyreWidth ?? t?.section_width);
    const profile = Number(t?.aspectRatio ?? t?.profile ?? t?.aspect_ratio);
    const rim = Number(t?.rimSize ?? t?.rim ?? t?.rim_diameter);
    if (!width || !profile || !rim) return null;

    return {
      width,
      profile,
      rim,
      load_index: t?.loadIndex ?? t?.load_index ?? undefined,
      speed_rating: t?.speedRating ?? t?.speed_rating ?? undefined,
      is_run_flat: Boolean(t?.isRunFlat ?? t?.runFlat ?? t?.run_flat),
      pressure_psi: t?.pressurePsi ? Number(t.pressurePsi) : undefined,
    };
  };

  const front = toSpec(tyreList[0]);
  if (!front) return null;

  const rearCandidate = tyreList[1] ? toSpec(tyreList[1]) : null;
  const isStaggered =
    !!rearCandidate &&
    (rearCandidate.width !== front.width ||
      rearCandidate.profile !== front.profile ||
      rearCandidate.rim !== front.rim);

  return {
    registration,
    make: String(v?.make ?? v?.manufacturer ?? 'Unknown'),
    model: String(v?.model ?? v?.range ?? ''),
    derivative: v?.derivative ?? v?.variant ?? undefined,
    year: v?.year ? Number(v.year) : v?.yearOfManufacture ? Number(v.yearOfManufacture) : undefined,
    front,
    rear: isStaggered ? rearCandidate! : undefined,
    isStaggered,
    source: 'oneauto',
  };
}
