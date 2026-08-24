'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Calendar, Package, Clock, LogOut, Wrench } from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function signOut() {
    if (isSigningOut) return;
    setIsSigningOut(true);
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => null);
    router.replace('/admin/login');
    router.refresh();
  }

  const links = [
    { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { href: '/admin/inventory', label: 'Tyre Inventory', icon: Package },
    { href: '/admin/slots', label: 'Slot Schedule', icon: Clock },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4 mb-8">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded bg-brand/10 text-brand border border-brand/30">
          <Wrench size={18} />
        </span>
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-3 font-bold">Dispatch Console</div>
          <div className="text-base font-bold text-ink-1">G Force Operations</div>
        </div>
      </div>

      <nav className="flex items-center gap-2">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors ${
                isActive
                  ? 'bg-brand text-ink-inverse'
                  : 'bg-surface-3 text-ink-2 hover:text-ink-1 hover:bg-surface-4'
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={signOut}
          disabled={isSigningOut}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase text-ink-3 hover:text-danger rounded transition-colors ml-2 disabled:opacity-60"
        >
          <LogOut size={14} /> {isSigningOut ? 'Signing out…' : 'Sign out'}
        </button>
      </nav>
    </div>
  );
}
