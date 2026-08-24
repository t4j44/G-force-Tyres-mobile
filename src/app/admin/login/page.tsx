'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import MStripe from '@/components/ui/MStripe';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        setError(payload?.message ?? 'Unable to sign in with those credentials.');
        return;
      }

      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Sign in is temporarily unavailable. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="btn btn-primary w-full mt-4 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            {isSubmitting ? 'Signing in…' : 'Enter Dispatch Console'}
          </button>
        </form>
      </div>
    </div>
  );
}
