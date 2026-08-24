import 'server-only';

import { forbidden, redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';

export type AdminRole = 'owner' | 'admin';

export interface AdminProfile {
  id: string;
  user_id: string;
  name: string;
  role: AdminRole;
  active: boolean;
}

export interface AdminContext {
  user: User;
  profile: AdminProfile;
  supabase: SupabaseClient;
}

export class AdminAccessError extends Error {
  constructor(
    public readonly status: 401 | 403 | 503,
    message: string,
  ) {
    super(message);
    this.name = 'AdminAccessError';
  }
}

export async function requireAdmin(): Promise<AdminContext> {
  let supabase: SupabaseClient;

  try {
    supabase = await createClient();
  } catch {
    throw new AdminAccessError(503, 'Admin authentication is not configured.');
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    throw new AdminAccessError(401, 'Authentication required.');
  }

  const { data, error } = await supabase
    .from('admin_profiles')
    .select('id,user_id,name,role,active')
    .eq('user_id', authData.user.id)
    .maybeSingle();

  if (error) {
    throw new AdminAccessError(503, 'Admin authorization is temporarily unavailable.');
  }

  const profile = data as AdminProfile | null;
  if (!profile || !profile.active || !['owner', 'admin'].includes(profile.role)) {
    throw new AdminAccessError(403, 'Access denied.');
  }

  return { user: authData.user, profile, supabase };
}

export async function requireAdminPage(): Promise<AdminContext> {
  try {
    return await requireAdmin();
  } catch (error) {
    if (error instanceof AdminAccessError) {
      if (error.status === 401 || error.status === 503) redirect('/admin/login');
      forbidden();
    }
    throw error;
  }
}

export function adminErrorResponse(error: unknown): NextResponse {
  if (error instanceof AdminAccessError) {
    return NextResponse.json(
      { ok: false, error: error.status === 401 ? 'unauthorized' : 'forbidden' },
      { status: error.status },
    );
  }

  return NextResponse.json(
    { ok: false, error: 'server_error', message: 'The request could not be completed.' },
    { status: 500 },
  );
}
