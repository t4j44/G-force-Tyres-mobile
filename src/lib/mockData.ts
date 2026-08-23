import type { Tyre, ServiceZone, BookingSlot, BookingWithDetails, AppSettings, SlotWithAvailability } from '@/types';

// ── Default Mock Settings ──────────────────────────────────────
export const MOCK_SETTINGS: AppSettings = {
  deposit_mode: 'fixed',
  deposit_fixed: 5000, // £50.00
  deposit_percent: 20,
  fitting_fee: 2000,   // £20.00 mobile fitting
  job_duration_mins: 60,
  cancellation_policy: 'Free cancellation up to 48 hours before your appointment.',
  business_phone: '020 7946 0991',
};

// ── Default Service Zones (London Coverage) ────────────────────
export const MOCK_SERVICE_ZONES: ServiceZone[] = [
  { id: 'zone-e14', postcode_prefix: 'E14', zone_name: 'Canary Wharf & Isle of Dogs', callout_charge: 0, active: true },
  { id: 'zone-e15', postcode_prefix: 'E15', zone_name: 'Stratford & Olympic Park', callout_charge: 0, active: true },
  { id: 'zone-br1', postcode_prefix: 'BR1', zone_name: 'Bromley & Outer South London', callout_charge: 1500, active: true },
  { id: 'zone-e1',  postcode_prefix: 'E1',  zone_name: 'Whitechapel & Spitalfields', callout_charge: 0, active: true },
  { id: 'zone-e2',  postcode_prefix: 'E2',  zone_name: 'Bethnal Green & Shoreditch', callout_charge: 0, active: true },
  { id: 'zone-ec1', postcode_prefix: 'EC1', zone_name: 'Clerkenwell & Farringdon',   callout_charge: 0, active: true },
  { id: 'zone-ec2', postcode_prefix: 'EC2', zone_name: 'City of London & Broadgate', callout_charge: 0, active: true },
  { id: 'zone-n1',  postcode_prefix: 'N1',  zone_name: 'Islington & Angel',           callout_charge: 0, active: true },
  { id: 'zone-nw1', postcode_prefix: 'NW1', zone_name: 'Camden & Regent’s Park',     callout_charge: 0, active: true },
  { id: 'zone-se1', postcode_prefix: 'SE1', zone_name: 'Southwark & London Bridge',  callout_charge: 0, active: true },
  { id: 'zone-sw1', postcode_prefix: 'SW1', zone_name: 'Westminster & Victoria',     callout_charge: 0, active: true },
  { id: 'zone-w1',  postcode_prefix: 'W1',  zone_name: 'Mayfair & West End',         callout_charge: 0, active: true },
  { id: 'zone-rm1', postcode_prefix: 'RM1', zone_name: 'Romford (Outer Ring)',       callout_charge: 2000, active: true },
];

// ── Fitters ───────────────────────────────────────────────────
export const MOCK_FITTERS = [
  { id: 'fitter-1', name: 'Dave Mitchell', phone: '07700 900123', van_reg: 'GF21 VAN', active: true },
  { id: 'fitter-2', name: 'Sam Okafor',    phone: '07700 900456', van_reg: 'GF22 MOB', active: true },
  { id: 'fitter-3', name: 'Marcus Vance',  phone: '07700 900789', van_reg: 'GF23 TYR', active: true },
];

// ── Tyre Inventory ─────────────────────────────────────────────
export const MOCK_TYRES: Tyre[] = [
  // ── 225/45 R18 (BMW 3 Series Front, Audi A4, Mercedes C-Class) ──
  {
    id: 'tyre-225-45-18-mich-ps5',
    brand: 'Michelin',
    model: 'Pilot Sport 5',
    sku: 'MICH-PS5-2254518',
    width: 225,
    profile: 45,
    rim: 18,
    load_index: '95',
    speed_rating: 'Y',
    is_run_flat: false,
    is_xl: true,
    season: 'summer',
    tier: 'premium',
    cost_price: 9200,
    sell_price: 14900,
    stock: 6,
    wet_grip: 'A',
    fuel_economy: 'B',
    noise_db: 71,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tyre-225-45-18-hank-s1',
    brand: 'Hankook',
    model: 'Ventus S1 Evo 3',
    sku: 'HANK-S1E-2254518',
    width: 225,
    profile: 45,
    rim: 18,
    load_index: '95',
    speed_rating: 'Y',
    is_run_flat: false,
    is_xl: true,
    season: 'summer',
    tier: 'mid',
    cost_price: 7200,
    sell_price: 11900,
    stock: 8,
    wet_grip: 'A',
    fuel_economy: 'C',
    noise_db: 70,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tyre-225-45-18-road-s04',
    brand: 'Roadstone',
    model: 'Eurovis Sport 04',
    sku: 'ROAD-S04-2254518',
    width: 225,
    profile: 45,
    rim: 18,
    load_index: '95',
    speed_rating: 'W',
    is_run_flat: false,
    is_xl: true,
    season: 'summer',
    tier: 'budget',
    cost_price: 4900,
    sell_price: 8900,
    stock: 10,
    wet_grip: 'B',
    fuel_economy: 'C',
    noise_db: 72,
    active: true,
    created_at: new Date().toISOString(),
  },
  // ── 255/40 R18 (BMW 3 Series Staggered Rear) ──
  {
    id: 'tyre-255-40-18-mich-ps5',
    brand: 'Michelin',
    model: 'Pilot Sport 5 (Rear)',
    sku: 'MICH-PS5-2554018',
    width: 255,
    profile: 40,
    rim: 18,
    load_index: '99',
    speed_rating: 'Y',
    is_run_flat: false,
    is_xl: true,
    season: 'summer',
    tier: 'premium',
    cost_price: 10800,
    sell_price: 16900,
    stock: 6,
    wet_grip: 'A',
    fuel_economy: 'B',
    noise_db: 72,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tyre-255-40-18-hank-s1',
    brand: 'Hankook',
    model: 'Ventus S1 Evo 3 (Rear)',
    sku: 'HANK-S1E-2554018',
    width: 255,
    profile: 40,
    rim: 18,
    load_index: '99',
    speed_rating: 'Y',
    is_run_flat: false,
    is_xl: true,
    season: 'summer',
    tier: 'mid',
    cost_price: 8400,
    sell_price: 13900,
    stock: 8,
    wet_grip: 'A',
    fuel_economy: 'C',
    noise_db: 71,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tyre-255-40-18-road-s04',
    brand: 'Roadstone',
    model: 'Eurovis Sport 04 (Rear)',
    sku: 'ROAD-S04-2554018',
    width: 255,
    profile: 40,
    rim: 18,
    load_index: '99',
    speed_rating: 'W',
    is_run_flat: false,
    is_xl: true,
    season: 'summer',
    tier: 'budget',
    cost_price: 5800,
    sell_price: 9900,
    stock: 10,
    wet_grip: 'B',
    fuel_economy: 'C',
    noise_db: 73,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tyre-225-45-18-falk-510',
    brand: 'Falken',
    model: 'Azenis FK510',
    sku: 'FALK-510-2254518',
    width: 225,
    profile: 45,
    rim: 18,
    load_index: '95',
    speed_rating: 'Y',
    is_run_flat: false,
    is_xl: true,
    season: 'summer',
    tier: 'mid',
    cost_price: 5400,
    sell_price: 9200,
    stock: 18,
    wet_grip: 'A',
    fuel_economy: 'C',
    noise_db: 71,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tyre-225-45-18-nank-n25',
    brand: 'Nankang',
    model: 'Noble Sport NS-25',
    sku: 'NANK-N25-2254518',
    width: 225,
    profile: 45,
    rim: 18,
    load_index: '95',
    speed_rating: 'W',
    is_run_flat: false,
    is_xl: false,
    season: 'summer',
    tier: 'budget',
    cost_price: 3600,
    sell_price: 6500,
    stock: 24,
    wet_grip: 'C',
    fuel_economy: 'C',
    noise_db: 72,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tyre-225-45-18-land-588',
    brand: 'Landsail',
    model: 'Sentury LS588 UHP',
    sku: 'LAND-588-2254518',
    width: 225,
    profile: 45,
    rim: 18,
    load_index: '95',
    speed_rating: 'W',
    is_run_flat: false,
    is_xl: false,
    season: 'summer',
    tier: 'budget',
    cost_price: 3200,
    sell_price: 5900,
    stock: 20,
    wet_grip: 'C',
    fuel_economy: 'D',
    noise_db: 72,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tyre-225-45-18-mich-cc2',
    brand: 'Michelin',
    model: 'CrossClimate 2',
    sku: 'MICH-CC2-2254518',
    width: 225,
    profile: 45,
    rim: 18,
    load_index: '95',
    speed_rating: 'Y',
    is_run_flat: false,
    is_xl: true,
    season: 'all-season',
    tier: 'premium',
    cost_price: 9900,
    sell_price: 15900,
    stock: 10,
    wet_grip: 'A',
    fuel_economy: 'B',
    noise_db: 70,
    active: true,
    created_at: new Date().toISOString(),
  },

  // ── 255/40 R18 (BMW M Sport rear staggered fitment) ──
  {
    id: 'tyre-255-40-18-mich-ps5',
    brand: 'Michelin',
    model: 'Pilot Sport 5',
    sku: 'MICH-PS5-2554018',
    width: 255,
    profile: 40,
    rim: 18,
    load_index: '99',
    speed_rating: 'Y',
    is_run_flat: false,
    is_xl: true,
    season: 'summer',
    tier: 'premium',
    cost_price: 10400,
    sell_price: 16900,
    stock: 8,
    wet_grip: 'A',
    fuel_economy: 'B',
    noise_db: 72,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tyre-255-40-18-pire-pz4',
    brand: 'Pirelli',
    model: 'P Zero PZ4',
    sku: 'PIRE-PZ4-2554018',
    width: 255,
    profile: 40,
    rim: 18,
    load_index: '99',
    speed_rating: 'Y',
    is_run_flat: true,
    is_xl: true,
    season: 'summer',
    tier: 'premium',
    cost_price: 11200,
    sell_price: 17900,
    stock: 6,
    wet_grip: 'A',
    fuel_economy: 'C',
    noise_db: 73,
    active: true,
    created_at: new Date().toISOString(),
  },

  // ── 205/55 R16 (Volkswagen Golf, Ford Focus, Vauxhall Astra) ──
  {
    id: 'tyre-205-55-16-mich-pr4',
    brand: 'Michelin',
    model: 'Primacy 4+',
    sku: 'MICH-PR4-2055516',
    width: 205,
    profile: 55,
    rim: 16,
    load_index: '91',
    speed_rating: 'V',
    is_run_flat: false,
    is_xl: false,
    season: 'summer',
    tier: 'premium',
    cost_price: 7400,
    sell_price: 11900,
    stock: 20,
    wet_grip: 'A',
    fuel_economy: 'B',
    noise_db: 69,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tyre-205-55-16-cont-ec6',
    brand: 'Continental',
    model: 'EcoContact 6',
    sku: 'CONT-EC6-2055516',
    width: 205,
    profile: 55,
    rim: 16,
    load_index: '91',
    speed_rating: 'V',
    is_run_flat: false,
    is_xl: false,
    season: 'summer',
    tier: 'premium',
    cost_price: 6800,
    sell_price: 10900,
    stock: 18,
    wet_grip: 'B',
    fuel_economy: 'A',
    noise_db: 71,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tyre-205-55-16-good-eg2',
    brand: 'Goodyear',
    model: 'EfficientGrip Performance 2',
    sku: 'GOOD-EG2-2055516',
    width: 205,
    profile: 55,
    rim: 16,
    load_index: '91',
    speed_rating: 'V',
    is_run_flat: false,
    is_xl: false,
    season: 'summer',
    tier: 'mid',
    cost_price: 5200,
    sell_price: 8500,
    stock: 25,
    wet_grip: 'B',
    fuel_economy: 'B',
    noise_db: 70,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tyre-205-55-16-falk-310',
    brand: 'Falken',
    model: 'Ziex ZE310 EcoRun',
    sku: 'FALK-310-2055516',
    width: 205,
    profile: 55,
    rim: 16,
    load_index: '91',
    speed_rating: 'V',
    is_run_flat: false,
    is_xl: false,
    season: 'summer',
    tier: 'mid',
    cost_price: 4200,
    sell_price: 7200,
    stock: 28,
    wet_grip: 'B',
    fuel_economy: 'C',
    noise_db: 70,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tyre-205-55-16-nank-na1',
    brand: 'Nankang',
    model: 'NA-1',
    sku: 'NANK-NA1-2055516',
    width: 205,
    profile: 55,
    rim: 16,
    load_index: '91',
    speed_rating: 'V',
    is_run_flat: false,
    is_xl: false,
    season: 'summer',
    tier: 'budget',
    cost_price: 2900,
    sell_price: 5200,
    stock: 35,
    wet_grip: 'C',
    fuel_economy: 'C',
    noise_db: 71,
    active: true,
    created_at: new Date().toISOString(),
  },

  // ── 195/65 R15 (Toyota Corolla, Ford Fiesta/Focus, VW Golf) ──
  {
    id: 'tyre-195-65-15-mich-esp',
    brand: 'Michelin',
    model: 'Energy Saver+',
    sku: 'MICH-ESP-1956515',
    width: 195,
    profile: 65,
    rim: 15,
    load_index: '91',
    speed_rating: 'H',
    is_run_flat: false,
    is_xl: false,
    season: 'summer',
    tier: 'premium',
    cost_price: 6200,
    sell_price: 9900,
    stock: 15,
    wet_grip: 'B',
    fuel_economy: 'A',
    noise_db: 70,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tyre-195-65-15-good-v4s',
    brand: 'Goodyear',
    model: 'Vector 4Seasons Gen-3',
    sku: 'GOOD-V4S-1956515',
    width: 195,
    profile: 65,
    rim: 15,
    load_index: '91',
    speed_rating: 'H',
    is_run_flat: false,
    is_xl: false,
    season: 'all-season',
    tier: 'mid',
    cost_price: 5600,
    sell_price: 8900,
    stock: 14,
    wet_grip: 'B',
    fuel_economy: 'C',
    noise_db: 70,
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'tyre-195-65-15-nank-na1',
    brand: 'Nankang',
    model: 'NA-1',
    sku: 'NANK-NA1-1956515',
    width: 195,
    profile: 65,
    rim: 15,
    load_index: '91',
    speed_rating: 'H',
    is_run_flat: false,
    is_xl: false,
    season: 'summer',
    tier: 'budget',
    cost_price: 2400,
    sell_price: 4400,
    stock: 30,
    wet_grip: 'C',
    fuel_economy: 'C',
    noise_db: 70,
    active: true,
    created_at: new Date().toISOString(),
  },
];

// ── Generate 21 Days of Slots ──────────────────────────────────
export function generateMockSlots(): BookingSlot[] {
  const slots: BookingSlot[] = [];
  const times = [
    { start: '09:00:00', end: '11:00:00' },
    { start: '11:00:00', end: '13:00:00' },
    { start: '13:00:00', end: '15:00:00' },
    { start: '15:00:00', end: '17:00:00' },
  ];

  const now = new Date();
  for (let i = 0; i < 21; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const day = d.getDay(); // 0 = Sun, 6 = Sat
    if (day === 0) continue; // Skip Sunday, keep Saturday open for mobile service

    const dateStr = d.toISOString().split('T')[0];
    times.forEach((t, idx) => {
      slots.push({
        id: `slot-${dateStr}-${t.start.slice(0, 2)}`,
        slot_date: dateStr,
        start_time: t.start,
        end_time: t.end,
        max_bookings: 2,
        active: true,
      });
    });
  }
  return slots;
}

// ── In-Memory Store for Local State ─────────────────────────────
class LocalBookingStore {
  private tyres = [...MOCK_TYRES];
  private slots = generateMockSlots();
  private holds: Map<string, { slot_id: string; session_token: string; expires_at: string }> = new Map();
  private bookings: Map<string, BookingWithDetails> = new Map();

  constructor() {
    // Seed initial demo booking
    const demoRef = 'GF-842910';
    const demoToken = 'demo-token-123';
    const firstSlot = this.slots[0];

    const demoBooking: BookingWithDetails = {
      id: 'booking-demo-1',
      booking_ref: demoRef,
      manage_token: demoToken,
      customer_id: 'cust-demo-1',
      slot_id: firstSlot?.id ?? null,
      fitter_id: 'fitter-1',
      vehicle_reg: 'AB21 ABC',
      vehicle_make: 'BMW',
      vehicle_model: '320i M Sport',
      vehicle_derivative: '2.0 TwinPower Turbo',
      fitting_address: '42 Bank Street, Canary Wharf, London',
      fitting_postcode: 'E14 5AB',
      customer_notes: 'Office underground car park, bay 14. Keys at reception.',
      admin_notes: 'Standard fitment, check lock nut key in boot.',
      status: 'confirmed',
      tyres_total: 29800, // 2 x Michelin PS5 @ £149
      fitting_fee: 2000,
      callout_charge: 0,
      total_amount: 31800,
      deposit_amount: 5000,
      balance_due: 26800,
      stripe_payment_intent_id: 'pi_demo_test123',
      stripe_charge_id: 'ch_demo_test123',
      deposit_paid_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer: {
        id: 'cust-demo-1',
        name: 'James Harrison',
        email: 'james.harrison@example.com',
        phone: '07700 900888',
        address_line1: '42 Bank Street',
        address_line2: 'Canary Wharf',
        city: 'London',
        postcode: 'E14 5AB',
        created_at: new Date().toISOString(),
      },
      slot: firstSlot ?? null,
      items: [
        {
          id: 'item-1',
          booking_id: 'booking-demo-1',
          tyre_id: 'tyre-225-45-18-mich-ps5',
          tyre_label: 'Michelin Pilot Sport 5 225/45 R18 95Y XL',
          quantity: 2,
          unit_price: 14900,
          line_total: 29800,
        },
      ],
    };

    this.bookings.set(demoRef, demoBooking);
    this.bookings.set(demoToken, demoBooking);
  }

  getTyres(width?: number, profile?: number, rim?: number): Tyre[] {
    if (!width || !profile || !rim) return this.tyres;
    return this.tyres.filter(
      (t) => t.width === width && t.profile === profile && t.rim === rim && t.active && t.stock > 0
    );
  }

  getAllTyres(): Tyre[] {
    return this.tyres;
  }

  getTyreById(id: string): Tyre | undefined {
    return this.tyres.find((t) => t.id === id);
  }

  updateTyreStock(id: string, newStock: number): boolean {
    const t = this.tyres.find((item) => item.id === id);
    if (t) {
      t.stock = newStock;
      return true;
    }
    return false;
  }

  addTyre(tyre: Tyre): void {
    this.tyres.unshift(tyre);
  }

  getSlots(date?: string): SlotWithAvailability[] {
    const now = new Date().toISOString();
    return this.slots
      .filter((s) => (!date || s.slot_date === date) && s.active)
      .map((s) => {
        // Count active bookings + live holds for this slot
        let taken = 0;
        for (const b of this.bookings.values()) {
          if (b.slot_id === s.id && b.status !== 'cancelled' && b.status !== 'refunded') {
            taken++;
          }
        }
        for (const h of this.holds.values()) {
          if (h.slot_id === s.id && h.expires_at > now) {
            taken++;
          }
        }
        const remaining = Math.max(0, s.max_bookings - taken);
        return {
          ...s,
          remaining,
          available: remaining > 0,
        };
      });
  }

  getSlotById(id: string): BookingSlot | undefined {
    return this.slots.find((s) => s.id === id);
  }

  setSlotCapacity(slotId: string, capacity: number): boolean {
    const slot = this.slots.find((s) => s.id === slotId);
    if (slot) {
      slot.max_bookings = Math.max(1, capacity);
      return true;
    }
    return false;
  }

  toggleSlotActive(slotId: string): boolean {
    const slot = this.slots.find((s) => s.id === slotId);
    if (slot) {
      slot.active = !slot.active;
      return true;
    }
    return false;
  }

  blockDate(date: string): boolean {
    let affected = 0;
    this.slots.forEach((s) => {
      if (s.slot_date === date) {
        s.active = false;
        affected++;
      }
    });
    return affected > 0;
  }

  unblockDate(date: string): boolean {
    let affected = 0;
    this.slots.forEach((s) => {
      if (s.slot_date === date) {
        s.active = true;
        affected++;
      }
    });
    return affected > 0;
  }

  generateRecurringSlots(
    startDate: string,
    weeks: number,
    days: number[], // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    timeWindows: Array<{ start: string; end: string }>,
    capacity: number
  ): number {
    let count = 0;
    const start = new Date(startDate);

    for (let w = 0; w < weeks; w++) {
      for (const dayOfWeek of days) {
        const d = new Date(start);
        const currentDay = d.getDay();
        const diff = (dayOfWeek - currentDay + 7) % 7;
        d.setDate(d.getDate() + w * 7 + diff);
        const dateStr = d.toISOString().split('T')[0];

        for (const tw of timeWindows) {
          // Check if slot already exists
          const existing = this.slots.find(
            (s) => s.slot_date === dateStr && s.start_time.startsWith(tw.start)
          );
          if (existing) {
            existing.max_bookings = capacity;
            existing.active = true;
          } else {
            this.slots.push({
              id: `slot-gen-${dateStr}-${tw.start.replace(':', '')}`,
              slot_date: dateStr,
              start_time: tw.start.length === 5 ? `${tw.start}:00` : tw.start,
              end_time: tw.end.length === 5 ? `${tw.end}:00` : tw.end,
              max_bookings: capacity,
              active: true,
              created_at: new Date().toISOString(),
            });
            count++;
          }
        }
      }
    }

    // Sort slots by date and start_time
    this.slots.sort((a, b) => {
      const cmp = a.slot_date.localeCompare(b.slot_date);
      if (cmp !== 0) return cmp;
      return a.start_time.localeCompare(b.start_time);
    });

    return count;
  }

  createHold(slotId: string, sessionToken: string, minutes = 15): { hold_id: string; expires_at: string } | null {
    const slot = this.getSlotById(slotId);
    if (!slot) return null;

    const expiresAt = new Date(Date.now() + minutes * 60_000).toISOString();
    const holdId = `hold-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    this.holds.set(sessionToken, { slot_id: slotId, session_token: sessionToken, expires_at: expiresAt });
    return { hold_id: holdId, expires_at: expiresAt };
  }

  isHoldValid(slotId: string, sessionToken: string): boolean {
    const hold = this.holds.get(sessionToken);
    if (!hold) return false;
    return hold.slot_id === slotId && hold.expires_at > new Date().toISOString();
  }

  releaseHold(slotId: string, sessionToken: string): boolean {
    const hold = this.holds.get(sessionToken);
    if (hold && hold.slot_id === slotId) {
      this.holds.delete(sessionToken);
      return true;
    }
    return false;
  }

  createBooking(booking: BookingWithDetails): void {
    this.bookings.set(booking.booking_ref, booking);
    this.bookings.set(booking.manage_token, booking);
    // Deduct tyre stock
    booking.items.forEach((item) => {
      if (item.tyre_id) {
        const tyre = this.getTyreById(item.tyre_id);
        if (tyre) {
          tyre.stock = Math.max(0, tyre.stock - item.quantity);
        }
      }
    });
  }

  getBookingByRef(ref: string): BookingWithDetails | undefined {
    return this.bookings.get(ref);
  }

  getBookingByToken(token: string): BookingWithDetails | undefined {
    return this.bookings.get(token);
  }

  getAllBookings(): BookingWithDetails[] {
    const unique = new Map<string, BookingWithDetails>();
    for (const b of this.bookings.values()) {
      unique.set(b.id, b);
    }
    return Array.from(unique.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  updateBookingStatus(id: string, status: BookingWithDetails['status'], fitterId?: string): boolean {
    for (const b of this.bookings.values()) {
      if (b.id === id) {
        b.status = status;
        if (fitterId !== undefined) b.fitter_id = fitterId;
        b.updated_at = new Date().toISOString();
        return true;
      }
    }
    return false;
  }
}

// Global singleton instance
export const localStore = new LocalBookingStore();
