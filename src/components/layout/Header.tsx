'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, Wrench, PhoneCall } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/#how',      label: 'How it works' },
  { href: '/#coverage', label: 'Coverage' },
  { href: '/tyres',     label: 'Tyres' },
  { href: '/#contact',  label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 border-b transition-colors duration-200',
          scrolled ? 'border-line' : 'border-transparent'
        )}
        style={{ background: 'rgba(13,13,13,0.88)', backdropFilter: 'blur(20px) saturate(180%)' }}
      >
        <div className="container-g flex h-[68px] items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight flex items-center gap-1.5 focus:outline-none">
            <span>G FORCE</span>
            <span className="text-brand">TYRES</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-ink-2 transition-colors hover:text-ink-1 focus:text-brand"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/admin/bookings" className="text-xs text-ink-3 hover:text-brand flex items-center gap-1">
              <Wrench size={13} /> Staff
            </Link>
            <Link href="/booking" className="btn btn-primary btn-sm">
              Book now
            </Link>
          </nav>

          <button
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center md:hidden text-ink-1 rounded focus:ring-2 focus:ring-brand"
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-surface flex flex-col justify-between md:hidden animate-in fade-in duration-200">
          <div>
            <div className="container-g flex h-[68px] items-center justify-between border-b border-line">
              <span className="text-lg font-bold">G FORCE <span className="text-brand">TYRES</span></span>
              <button
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center text-ink-1 rounded focus:ring-2 focus:ring-brand"
                aria-label="Close navigation menu"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="container-g flex flex-col gap-2 pt-8">
              {NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="display-2 py-3 transition-colors hover:text-brand"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/booking"
                onClick={() => setOpen(false)}
                className="btn btn-primary mt-6 w-full"
              >
                Book now
              </Link>
            </nav>
          </div>

          <div className="container-g pb-8 border-t border-line pt-6 text-xs text-ink-3 space-y-3">
            <div className="flex items-center justify-between">
              <a href="tel:02079460991" className="flex items-center gap-1.5 text-ink-1 font-semibold">
                <PhoneCall size={14} className="text-brand" /> 020 7946 0991
              </a>
              <Link
                href="/admin/login"
                onClick={() => setOpen(false)}
                className="text-brand font-semibold hover:underline"
              >
                Operator Login &rarr;
              </Link>
            </div>
            <div>London Mobile Tyre Fitting · Home, Work &amp; Roadside</div>
          </div>
        </div>
      )}
    </>
  );
}
