import 'server-only';

import { z } from 'zod';
import { assertMockDataSafety, getPublicEnv, isProductionEnvironment } from './env';

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  ONEAUTO_API_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  VRM_CACHE_ENCRYPTION_KEY: z.string().min(32),
  APP_URL: z.string().url(),
});

const supabaseServiceSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

function formatEnvError(scope: string, error: z.ZodError): Error {
  const names = error.issues.map((issue) => issue.path.join('.')).filter(Boolean);
  return new Error(`Invalid ${scope} environment configuration: ${names.join(', ')}`);
}

export function getServerEnv() {
  const result = serverEnvSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ONEAUTO_API_KEY: process.env.ONEAUTO_API_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    VRM_CACHE_ENCRYPTION_KEY: process.env.VRM_CACHE_ENCRYPTION_KEY,
    APP_URL: process.env.APP_URL,
  });

  if (!result.success) throw formatEnvError('server-only', result.error);
  return result.data;
}

export function getSupabaseServiceEnv() {
  const result = supabaseServiceSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  if (!result.success) throw formatEnvError('Supabase service-role', result.error);
  return result.data;
}

export function validateProductionEnvironment(): void {
  assertMockDataSafety();
  if (!isProductionEnvironment()) return;
  getPublicEnv();
  getServerEnv();
}
