import { z } from 'zod';
import { isMockDataEnabled } from './mock-mode';

export { isMockDataEnabled } from './mock-mode';

const supabasePublicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const publicEnvSchema = supabasePublicSchema.extend({
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
});

function formatEnvError(scope: string, error: z.ZodError): Error {
  const names = error.issues.map((issue) => issue.path.join('.')).filter(Boolean);
  return new Error(`Invalid ${scope} environment configuration: ${names.join(', ')}`);
}

export function getAppEnvironment(): 'development' | 'test' | 'production' {
  const raw = process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development';
  return raw === 'production' || raw === 'test' ? raw : 'development';
}

export function isProductionEnvironment(): boolean {
  return process.env.NODE_ENV === 'production' || getAppEnvironment() === 'production';
}

export function assertMockDataSafety(): void {
  if (isProductionEnvironment() && isMockDataEnabled()) {
    throw new Error(
      'Unsafe configuration: ENABLE_MOCK_DATA=true is forbidden when NODE_ENV or APP_ENV is production.',
    );
  }
}

export function getSupabasePublicEnv() {
  const result = supabasePublicSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!result.success) throw formatEnvError('Supabase public', result.error);
  return result.data;
}

export function hasSupabasePublicEnv(): boolean {
  return supabasePublicSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }).success;
}

export function getPublicEnv() {
  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  });

  if (!result.success) throw formatEnvError('public', result.error);
  return result.data;
}
