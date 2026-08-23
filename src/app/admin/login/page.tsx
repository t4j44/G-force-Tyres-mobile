'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, ShieldCheck, Wrench, AlertCircle } from 'lucide-react';
import MStripe from '@/components/ui/MStripe';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@gforcetyres.co.uk');
  const [password, setPassword] = useState('••••••••••••');
  const [error, setError] = useState<string | null>(null);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // For demo & local dev, authenticate directly
    router.push('/admin/bookings');
  }

  return (
    <div className="container-g section max-w-md">
      <MStripe className="mb-6 mx-auto" />

      <div className="text-center mb-8">
        <p className="label mb-1 text-brand">Internal Operations</p>
        <h1 className="display-1">ADMIN LOGIN</h1>
        <p className="text-xs text-ink-3">G Force Tyres Mobile Workshop Dispatch Portal</p>
      </div>

      <div className="card space-y-6 border-border-brand/40 shadow-2xl">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="adm-email" className="label mb-2 block">Operator Email</label>
            <input
              id="adm-email"
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="adm-pass" className="label mb-2 block">Password</label>
            <input
              id="adm-pass"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-danger/10 border border-danger/30 rounded text-danger text-xs flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full mt-4">
            Enter Dispatch Console <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-4 border-t border-line text-center">
          <button
            type="button"
            onClick={() => router.push('/admin/bookings')}
            className="text-xs text-brand hover:underline"
          >
            ⚡ 1-Click Demo Login (Instant Access)
          </button>
        </div>
      </div>
    </div>
  );
}
