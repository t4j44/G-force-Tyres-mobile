import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MStripe from '@/components/ui/MStripe';

export default function TermsPage() {
  return (
    <div className="container-g section max-w-3xl">
      <MStripe className="mb-6" />

      <div className="mb-8">
        <p className="label mb-2 text-brand">Customer Contract</p>
        <h1 className="display-1">TERMS &amp; CONDITIONS</h1>
        <p className="text-xs text-ink-3">Last updated: August 2026</p>
      </div>

      <div className="card space-y-6 text-sm text-ink-2 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-ink-1 uppercase tracking-wider">1. Service Scope</h2>
          <p>
            G Force Tyres provides on-site mobile tyre replacement, wheel balancing, valve replacement, and eco-disposal of old tyres across our designated service zones in London.
          </p>
        </section>

        <section className="space-y-2 border-t border-line pt-4">
          <h2 className="text-base font-bold text-ink-1 uppercase tracking-wider">2. Customer Responsibilities</h2>
          <p>The customer agrees to ensure that:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>The vehicle is parked on a firm, level surface with safe working clearance (at least 1 meter around the vehicle).</li>
            <li>The locking wheel nut key is present and accessible in the vehicle if locking nuts are installed.</li>
            <li>The tyre size selected matches the actual physical tyre size currently fitted on the vehicle sidewall.</li>
          </ul>
        </section>

        <section className="space-y-2 border-t border-line pt-4">
          <h2 className="text-base font-bold text-ink-1 uppercase tracking-wider">3. Pricing &amp; Payment</h2>
          <p>
            A £50.00 deposit holds your requested fitting slot. The remaining balance is payable upon successful fitting completion via our mobile chip &amp; pin reader or card payment.
          </p>
        </section>

        <section className="space-y-2 border-t border-line pt-4">
          <h2 className="text-base font-bold text-ink-1 uppercase tracking-wider">4. Workmanship Guarantee</h2>
          <p>
            All tyre fittings are carried out to manufacturer OEM torque specifications. We recommend checking wheel nut torques within 50 miles of fitting.
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
