import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, Clock, MapPin, Car, ShieldCheck, PhoneCall, Calendar } from 'lucide-react';
import { createServiceClient, isSupabaseConfigured } from '@/lib/supabase';
import { localStore } from '@/lib/mockData';
import { formatPrice, formatSlotTime, formatReg } from '@/lib/utils';
import MStripe from '@/components/ui/MStripe';
import type { BookingWithDetails } from '@/types';
import { isMockDataEnabled } from '@/lib/mock-mode';

export const dynamic = 'force-dynamic';

export default async function ConfirmationPage({
  params,
}: {
  // Next 15: dynamic route params arrive as a Promise.
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  let booking: BookingWithDetails | null = null;

  if (isSupabaseConfigured()) {
    try {
      const db = createServiceClient();
      const { data } = await db
        .from('bookings')
        .select('*, customer:customers(*), slot:booking_slots(*), items:booking_items(*)')
        .eq('booking_ref', ref)
        .maybeSingle();
      if (data) {
        booking = data as unknown as BookingWithDetails;
      }
    } catch {
      // fallback
    }
  }

  if (!booking && isMockDataEnabled()) {
    booking = localStore.getBookingByRef(ref) ?? null;
  }

  if (!booking) notFound();
  const b = booking;

  const when = b.slot
    ? `${new Date(b.slot.slot_date).toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long',
      })}, ${formatSlotTime(b.slot.start_time)}–${formatSlotTime(b.slot.end_time)}`
    : 'To be confirmed';

  const paid = b.status !== 'pending_payment' && b.status !== 'payment_failed';

  return (
    <div className="container-g section max-w-3xl">
      <MStripe className="mb-6" />

      {/* Success banner */}
      <div className="mb-8 flex items-center gap-4">
        {paid ? (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ok/10 text-ok border border-ok/30 shrink-0">
            <Check size={28} />
          </span>
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-warning/10 text-warning border border-warning/30 shrink-0">
            <Clock size={28} />
          </span>
        )}
        <div>
          <h1 className="display-2 leading-none">{paid ? 'YOU ARE BOOKED' : 'PAYMENT PENDING'}</h1>
          <p className="text-sm text-ink-2 mt-1">
            Booking Reference: <strong className="mono text-brand text-base">{b.booking_ref}</strong>
          </p>
        </div>
      </div>

      {/* Booking summary card */}
      <div className="card space-y-5 border-border-brand/40 shadow-2xl">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <span className="label text-brand">Appointment Overview</span>
          <span className={`badge ${paid ? 'badge-success' : 'badge-warning'}`}>
            {paid ? 'Confirmed & Reserved' : 'Deposit Pending'}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm bg-surface-3/50 p-4 rounded border border-line/60">
          <div className="space-y-1">
            <div className="text-xs uppercase text-ink-3 font-semibold flex items-center gap-1.5">
              <Calendar size={13} className="text-brand" /> Date &amp; Window
            </div>
            <div className="font-bold text-ink-1">{when}</div>
          </div>

          <div className="space-y-1">
            <div className="text-xs uppercase text-ink-3 font-semibold flex items-center gap-1.5">
              <MapPin size={13} className="text-brand" /> Fitting Location
            </div>
            <div className="font-bold text-ink-1">{b.fitting_address || 'Address on file'}</div>
            {b.fitting_postcode && <div className="text-xs text-ink-3">{b.fitting_postcode}</div>}
          </div>

          {b.vehicle_reg && (
            <div className="space-y-1">
              <div className="text-xs uppercase text-ink-3 font-semibold flex items-center gap-1.5">
                <Car size={13} className="text-brand" /> Vehicle
              </div>
              <div className="font-bold text-ink-1">
                {formatReg(b.vehicle_reg)} · {[b.vehicle_make, b.vehicle_model].filter(Boolean).join(' ')}
              </div>
            </div>
          )}

          {b.customer && (
            <div className="space-y-1">
              <div className="text-xs uppercase text-ink-3 font-semibold flex items-center gap-1.5">
                <PhoneCall size={13} className="text-brand" /> Contact
              </div>
              <div className="font-bold text-ink-1">{b.customer.name}</div>
              <div className="text-xs text-ink-3">{b.customer.phone} · {b.customer.email}</div>
            </div>
          )}
        </div>

        {/* Itemized Line Items */}
        <div className="border-t border-line pt-4 space-y-2">
          <span className="text-xs uppercase font-bold tracking-wider text-ink-3 block mb-2">Selected Items</span>
          {b.items.map((i) => (
            <Row key={i.id} label={`${i.quantity} × ${i.tyre_label}`} value={formatPrice(i.line_total)} />
          ))}
          <Row label="Mobile Fitting &amp; Electronic Wheel Balance" value={formatPrice(b.fitting_fee)} />
          {b.callout_charge > 0 && <Row label="London Area Call-Out" value={formatPrice(b.callout_charge)} />}
        </div>

        {/* Financial Summary */}
        <div className="border-t border-line pt-4 space-y-2">
          <Row label="Total Amount" value={formatPrice(b.total_amount)} strong />
          <Row label="Deposit Paid (Card)" value={formatPrice(b.deposit_amount)} accent="ok" />
          <div className="p-3 bg-surface-3 rounded border border-line mt-3 flex items-baseline justify-between">
            <span className="font-bold text-sm text-ink-1">Remaining Balance (Due on Fitting Day)</span>
            <span className="price-display text-xl text-brand">{formatPrice(b.balance_due)}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link href={`/manage/${b.manage_token}`} className="btn btn-primary flex-1">
          Manage This Booking
        </Link>
        <Link href="/" className="btn btn-secondary flex-1">
          Back to Homepage
        </Link>
      </div>

      {/* Next steps notice */}
      <div className="mt-10 p-5 bg-surface-2 border border-line rounded space-y-2 text-xs text-ink-2">
        <div className="flex items-center gap-2 font-bold text-ink-1 text-sm">
          <ShieldCheck size={16} className="text-brand" /> What happens next?
        </div>
        <p>1. A confirmation receipt and calendar invite have been sent to <strong>{b.customer?.email ?? 'your email'}</strong>.</p>
        <p>2. Our technician will review your vehicle fitment specs and load your tyres into our mobile workshop van.</p>
        <p>3. Use the verified contact route shown with the booking if an appointment update is needed.</p>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
  accent,
}: {
  label: string;
  value: string;
  strong?: boolean;
  accent?: 'ok';
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1 text-sm">
      <span className="text-ink-2">{label}</span>
      <span
        className={[
          'text-right mono',
          strong ? 'font-bold text-ink-1' : 'font-semibold',
          accent === 'ok' ? 'text-ok font-bold' : '',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  );
}
