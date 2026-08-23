import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import MStripe from '@/components/ui/MStripe';

export default function CancellationPage() {
  return (
    <div className="container-g section max-w-3xl">
      <MStripe className="mb-6" />

      <div className="mb-8">
        <p className="label mb-2 text-brand">Fair Customer Policy</p>
        <h1 className="display-1">CANCELLATION &amp; REFUND POLICY</h1>
        <p className="text-xs text-ink-3">Transparent, fair, zero-fuss cancellations</p>
      </div>

      <div className="card space-y-6 text-sm text-ink-2 leading-relaxed">
        {/* Highlight Banner */}
        <div className="p-4 bg-ok/10 border border-ok/30 rounded flex items-start gap-3 text-ink-1">
          <CheckCircle2 size={20} className="text-ok shrink-0 mt-0.5" />
          <div>
            <strong className="block text-ok font-bold mb-1">100% Full Refund up to 48 Hours Before Fitting</strong>
            <span>
              If your plans change or you no longer require a tyre fitting, you can cancel or reschedule anytime up to 48 hours before your slot for an instant, full refund of your £50 deposit.
            </span>
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink-1 uppercase tracking-wider">1. Cancellation Timelines</h2>
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-surface-3 rounded border border-line">
              <div className="text-xs uppercase font-bold text-ok flex items-center gap-1.5 mb-1">
                <Clock size={14} /> More than 48h before slot
              </div>
              <p className="text-xs text-ink-2">100% deposit refunded immediately to original payment card.</p>
            </div>
            <div className="p-3 bg-surface-3 rounded border border-line">
              <div className="text-xs uppercase font-bold text-warning flex items-center gap-1.5 mb-1">
                <Clock size={14} /> Less than 48h before slot
              </div>
              <p className="text-xs text-ink-2">Deposit may be held towards warehouse stocking and van dispatch scheduling.</p>
            </div>
          </div>
        </section>

        <section className="space-y-2 border-t border-line pt-4">
          <h2 className="text-base font-bold text-ink-1 uppercase tracking-wider">2. Rescheduling</h2>
          <p>
            Rescheduling your appointment to another date or 2-hour window is completely free of charge when requested before our van is dispatched.
          </p>
        </section>

        <section className="space-y-2 border-t border-line pt-4">
          <h2 className="text-base font-bold text-ink-1 uppercase tracking-wider">3. How to Cancel or Reschedule</h2>
          <p>
            Simply open your booking management link (available on your confirmation page or in your email) or contact our operations team at <strong>020 7946 0991</strong>.
          </p>
        </section>

        <div className="pt-4 border-t border-line">
          <Link href="/" className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
