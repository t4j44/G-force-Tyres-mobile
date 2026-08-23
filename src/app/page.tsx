import Link from 'next/link';
import { ShieldCheck, Clock, MapPin, Wrench } from 'lucide-react';
import MStripe from '@/components/ui/MStripe';
import ScrollReveal from '@/components/animations/ScrollReveal';
import TyreFinder from '@/components/booking/TyreFinder';
import TyreScene from '@/components/3d/TyreSceneClient';

const STEPS = [
  {
    n: '01',
    title: 'Tell us your postcode and reg',
    body: 'We check we cover you, then pull the exact tyre size your vehicle left the factory on.',
  },
  {
    n: '02',
    title: 'Pick your tyres',
    body: 'Only tyres that actually fit. Budget to premium, with the price you pay shown fitted.',
  },
  {
    n: '03',
    title: 'Choose a slot, pay a deposit',
    body: 'Two-hour windows, seven days out. £50 holds it. The balance is due on the day.',
  },
];

const TRUST = [
  { icon: Clock,       label: 'Same-day slots',    sub: 'Book before 11am' },
  { icon: MapPin,      label: 'We come to you',    sub: 'Home, work, roadside' },
  { icon: ShieldCheck, label: 'Fully insured',     sub: 'Every fitting covered' },
  { icon: Wrench,      label: 'OEM-spec fitment',  sub: 'Manufacturer sizes' },
];

export default function HomePage() {
  return (
    <>
      {/* ══════════════ HERO ══════════════ */}
      <section className="relative overflow-hidden bg-void">
        <div className="container-g grid min-h-[calc(100svh-68px)] items-center gap-8 py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:py-0">
          {/* Copy */}
          <div className="order-2 lg:order-1">
            <MStripe className="mb-6" />

            <p className="label mb-4">London mobile tyre fitting</p>

            <h1 className="display-hero mb-6 max-w-[14ch]">
              Tyres fitted
              <br />
              <span className="text-brand">where you are</span>
            </h1>

            <p className="mb-10 max-w-[46ch] text-lg text-ink-2">
              No garage. No waiting room. No lifting the car onto a trolley jack in
              the rain. Tell us where you are and we bring the workshop.
            </p>

            <TyreFinder />
          </div>

          {/* 3D */}
          <div className="order-1 h-[42svh] lg:order-2 lg:h-[calc(100svh-68px)]">
            <TyreScene className="h-full w-full" />
          </div>
        </div>

        {/* Ambient brand glow behind the tyre */}
        <div
          className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[520px] w-[520px] -translate-y-1/2 translate-x-1/4 rounded-full blur-[140px]"
          style={{ background: 'rgba(56,189,248,0.10)' }}
          aria-hidden="true"
        />
      </section>

      {/* ══════════════ TRUST STRIP ══════════════ */}
      <section className="border-y border-line bg-surface-2">
        <div className="container-g">
          <ScrollReveal stagger={0.08} className="grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x">
            {TRUST.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 px-2 py-6 md:justify-center md:px-6">
                <Icon size={20} className="shrink-0 text-brand" strokeWidth={1.5} />
                <div>
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-xs text-ink-3">{sub}</div>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section id="how" className="section">
        <div className="container-g">
          <ScrollReveal>
            <MStripe className="mb-6" />
            <p className="label mb-3">The process</p>
            <h2 className="display-1 mb-4 max-w-[16ch]">Three steps, about two minutes</h2>
            <p className="mb-14 max-w-readable text-ink-2">
              Most people are booked before the kettle boils.
            </p>
          </ScrollReveal>

          <ScrollReveal stagger={0.12} className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="card card-hover">
                <div className="display-2 mb-4 text-brand">{s.n}</div>
                <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-ink-2">{s.body}</p>
              </div>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════ COVERAGE ══════════════ */}
      <section id="coverage" className="section border-t border-line bg-surface-2">
        <div className="container-g grid gap-12 lg:grid-cols-2 lg:items-center">
          <ScrollReveal>
            <MStripe className="mb-6" />
            <p className="label mb-3">Where we work</p>
            <h2 className="display-1 mb-5 max-w-[14ch]">Across London, van-ready</h2>
            <p className="mb-8 max-w-readable text-ink-2">
              Our fitters carry everything on board: balancer, torque wrench, valve
              stems, TPMS kit. If we cover your postcode, we can fit on your
              driveway, in your office car park, or at the roadside.
            </p>
            <Link href="/booking" className="btn btn-secondary">
              Check your postcode
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="card">
              <div className="label mb-5">Current service areas</div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                {[
                  'E1 Whitechapel', 'E2 Bethnal Green', 'E14 Canary Wharf',
                  'EC1 Clerkenwell', 'EC2 City', 'N1 Islington',
                  'SE1 Southwark', 'SW1 Westminster', 'W1 West End',
                ].map((a) => (
                  <div key={a} className="flex items-center gap-2 text-ink-2">
                    <span className="h-1 w-1 shrink-0 bg-brand" aria-hidden="true" />
                    {a}
                  </div>
                ))}
              </div>
              <p className="mt-6 border-t border-line pt-4 text-xs text-ink-3">
                Outside these areas? Enter your postcode above and we will tell you
                when we get there.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════ CLOSING CTA ══════════════ */}
      <section className="section bg-void">
        <div className="container-g text-center">
          <ScrollReveal>
            <MStripe className="mx-auto mb-8" />
            <h2 className="display-1 mx-auto mb-6 max-w-[18ch]">
              Flat tyre now? We can be there today.
            </h2>
            <p className="mx-auto mb-10 max-w-[44ch] text-ink-2">
              Book before 11am and there is usually an afternoon slot free.
            </p>
            <Link href="/booking" className="btn btn-primary">
              Book a fitting
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
