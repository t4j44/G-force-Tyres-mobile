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
              Mobile tyre fitting across London. We come to you.
            </p>
            <div className="text-xs text-ink-3">
              Direct Dispatch: <strong className="text-ink-1">020 7946 0991</strong>
            </div>
          </div>

          <div>
            <div className="label mb-4">Service</div>
            <ul className="space-y-2 text-sm text-ink-2">
              <li><Link href="/tyres" className="hover:text-ink-1">Browse Tyres</Link></li>
              <li><Link href="/booking" className="hover:text-ink-1">Book a Fitting</Link></li>
              <li><Link href="/#how" className="hover:text-ink-1">How It Works</Link></li>
              <li><Link href="/#coverage" className="hover:text-ink-1">Coverage Areas</Link></li>
            </ul>
          </div>

          <div>
            <div className="label mb-4">Operations</div>
            <ul className="space-y-2 text-sm text-ink-2">
              <li>Canary Wharf &amp; City</li>
              <li>Islington &amp; North London</li>
              <li>Southwark &amp; Westminster</li>
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
            © {new Date().getFullYear()} G Force Tyres Ltd. Mobile Tyre Fitting, London.
          </div>
          <div className="flex items-center gap-4">
            <span>24/7 Roadside &amp; Home Callouts</span>
            <span className="h-1 w-1 rounded-full bg-brand" />
            <Link href="/admin/login" className="hover:text-ink-1">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
