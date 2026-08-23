-- ═══════════════════════════════════════════════════════════════
-- SEED DATA — run after schema.sql so you have something to click.
-- Replace with real inventory before launch.
-- All money in PENCE.
-- ═══════════════════════════════════════════════════════════════

-- ── Service zones (East / Central London sample) ──
insert into service_zones (postcode_prefix, zone_name, callout_charge) values
  ('E1',  'Whitechapel',    0),
  ('E14', 'Canary Wharf',   0),
  ('E2',  'Bethnal Green',  0),
  ('EC1', 'Clerkenwell',    0),
  ('EC2', 'City of London', 0),
  ('N1',  'Islington',      0),
  ('SE1', 'Southwark',      0),
  ('SW1', 'Westminster',    1500),
  ('W1',  'West End',       1500),
  ('RM1', 'Romford',        2000)
on conflict (postcode_prefix) do nothing;

-- ── Fitters ──
insert into fitters (name, phone) values
  ('Dave Mitchell', '07700 900123'),
  ('Sam Okafor',    '07700 900456')
on conflict do nothing;

-- ── Tyre inventory: 225/45 R18 (BMW 3 Series, Audi A4 etc.) ──
insert into tyre_inventory
  (brand, model, sku, width, profile, rim, load_index, speed_rating,
   is_run_flat, is_xl, season, tier, cost_price, sell_price, stock,
   wet_grip, fuel_economy, noise_db)
values
  ('Michelin',    'Pilot Sport 5',   'MICH-PS5-2254518',  225,45,18,'95','Y', false,true,  'summer','premium', 9200, 14900, 12, 'A','B',71),
  ('Continental', 'PremiumContact 7','CONT-PC7-2254518',  225,45,18,'95','Y', false,true,  'summer','premium', 8600, 13900, 8,  'A','B',72),
  ('Pirelli',     'P Zero PZ4',      'PIRE-PZ4-2254518',  225,45,18,'95','Y', true, true,  'summer','premium', 9800, 15900, 6,  'A','C',72),
  ('Goodyear',    'EfficientGrip 2', 'GOOD-EG2-2254518',  225,45,18,'95','W', false,false, 'summer','mid',     6400, 10900, 15, 'B','B',70),
  ('Bridgestone', 'Turanza T005',    'BRID-T05-2254518',  225,45,18,'95','Y', false,true,  'summer','mid',     6900, 11500, 10, 'A','B',71),
  ('Falken',      'Azenis FK510',    'FALK-510-2254518',  225,45,18,'95','Y', false,true,  'summer','mid',     5400,  9200, 14, 'A','C',71),
  ('Nankang',     'NS-25',           'NANK-N25-2254518',  225,45,18,'95','W', false,false, 'summer','budget',  3600,  6500, 20, 'C','C',72),
  ('Landsail',    'LS588',           'LAND-588-2254518',  225,45,18,'95','W', false,false, 'summer','budget',  3200,  5900, 18, 'C','D',72),
  ('Michelin',    'CrossClimate 2',  'MICH-CC2-2254518',  225,45,18,'95','Y', false,true,  'all-season','premium', 9900, 15900, 7, 'A','B',70),

  -- 205/55 R16 (Golf, Focus, Astra — highest volume UK size)
  ('Michelin',    'Primacy 4+',      'MICH-PR4-2055516',  205,55,16,'91','V', false,false, 'summer','premium', 7400, 11900, 16, 'A','B',69),
  ('Continental', 'EcoContact 6',    'CONT-EC6-2055516',  205,55,16,'91','V', false,false, 'summer','premium', 6800, 10900, 14, 'B','A',71),
  ('Goodyear',    'EfficientGrip 2', 'GOOD-EG2-2055516',  205,55,16,'91','V', false,false, 'summer','mid',     5200,  8500, 22, 'B','B',70),
  ('Falken',      'Ziex ZE310',      'FALK-310-2055516',  205,55,16,'91','V', false,false, 'summer','mid',     4200,  7200, 25, 'B','C',70),
  ('Nankang',     'NA-1',            'NANK-NA1-2055516',  205,55,16,'91','V', false,false, 'summer','budget',  2900,  5200, 30, 'C','C',71),
  ('Landsail',    'LS388',           'LAND-388-2055516',  205,55,16,'91','V', false,false, 'summer','budget',  2600,  4800, 28, 'C','D',71),

  -- 195/65 R15 (older Focus, Corolla, Astra)
  ('Michelin',    'Energy Saver+',   'MICH-ESP-1956515',  195,65,15,'91','H', false,false, 'summer','premium', 6200,  9900, 12, 'B','A',70),
  ('Goodyear',    'Vector 4Seasons', 'GOOD-V4S-1956515',  195,65,15,'91','H', false,false, 'all-season','mid',  5600,  8900, 10, 'B','C',70),
  ('Nankang',     'NA-1',            'NANK-NA1-1956515',  195,65,15,'91','H', false,false, 'summer','budget',  2400,  4400, 26, 'C','C',70),

  -- 255/40 R18 (staggered rear — BMW M Sport)
  ('Michelin',    'Pilot Sport 5',   'MICH-PS5-2554018',  255,40,18,'99','Y', false,true,  'summer','premium',10400, 16900, 6,  'A','B',72),
  ('Pirelli',     'P Zero PZ4',      'PIRE-PZ4-2554018',  255,40,18,'99','Y', true, true,  'summer','premium',11200, 17900, 4,  'A','C',73)
on conflict (sku) do nothing;

-- ── Booking slots: weekdays for the next 21 days, 4 slots/day ──
insert into booking_slots (slot_date, start_time, end_time, max_bookings)
select d::date, s.start_t, s.end_t, 2
from generate_series(current_date, current_date + interval '21 days', interval '1 day') d
cross join (values
  ('09:00'::time, '11:00'::time),
  ('11:00'::time, '13:00'::time),
  ('13:00'::time, '15:00'::time),
  ('15:00'::time, '17:00'::time)
) as s(start_t, end_t)
where extract(dow from d) between 1 and 5   -- Mon–Fri only
on conflict (slot_date, start_time) do nothing;
