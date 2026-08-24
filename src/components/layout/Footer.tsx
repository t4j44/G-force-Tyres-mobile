import Link from 'next/link';
import MStripe from '@/components/ui/MStripe';

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-void">
      <div className="container-g py-16">
        <MStripe className="mb-8" />

        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="mb-3 text-lg font-bold">
              G FORCE <span className="text-brand">TYRES</span>
            </div>
            <p className="max-w-[28ch] text-sm text-ink-2 mb-4">
              A focused, location-first booking journey for mobile tyre fitting.
            </p>
            <Link href="/#tyre-finder" className="text-xs font-semibold text-brand hover:underline">
              Start tyre search &rarr;
            </Link>
          </div>

          <div>
            <div className="label mb-4">Service</div>
            <ul className="space-y-2 text-sm text-ink-2">
              <li><Link href="/#tyre-finder" className="hover:text-ink-1">Find Your Tyre Size</Link></li>
              <li><Link href="/tyres" className="hover:text-ink-1">Browse Tyres</Link></li>
              <li><Link href="/#how" className="hover:text-ink-1">How It Works</Link></li>
              <li><Link href="/#coverage" className="hover:text-ink-1">Fitting Locations</Link></li>
            </ul>
          </div>

          <div>
            <div className="label mb-4">Search options</div>
            <ul className="space-y-2 text-sm text-ink-2">
              <li>Postcode service check</li>
              <li>Vehicle registration lookup</li>
              <li>Manual tyre-size entry</li>
              <li className="pt-2"><Link href="/admin/login" className="text-xs text-brand hover:underline font-semibold">&rarr; Admin Dispatch Console</Link></li>
            </ul>
          </div>

          <div>
            <div className="label mb-4">Legal &amp; Policy</div>
            <ul className="space-y-2 text-sm text-ink-2">
              <li><Link href="/privacy" className="hover:text-ink-1">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-ink-1">Terms of Service</Link></li>
              <li><Link href="/cancellation" className="hover:text-ink-1">Cancellation &amp; Refunds</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-3">
          <div>
            © {new Date().getFullYear()} G Force Tyres. Mobile tyre fitting.
          </div>
          <div className="flex items-center gap-4">
            <span>Location-first booking</span>
            <span className="h-1 w-1 rounded-full bg-brand" />
            <Link href="/admin/login" className="hover:text-ink-1">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
