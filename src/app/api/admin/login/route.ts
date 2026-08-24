import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(256),
});

const denied = () =>
  NextResponse.json(
    { ok: false, error: 'invalid_credentials', message: 'Unable to sign in with those credentials.' },
    { status: 401 },
  );

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return denied();

  try {
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword(parsed.data);
    if (authError || !authData.user) return denied();

    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('role,active')
      .eq('user_id', authData.user.id)
      .maybeSingle();

    if (
      profileError ||
      !profile ||
      !profile.active ||
      !['owner', 'admin'].includes(profile.role)
    ) {
      await supabase.auth.signOut();
      return denied();
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'auth_unavailable', message: 'Sign in is temporarily unavailable.' },
      { status: 503 },
    );
  }
}
