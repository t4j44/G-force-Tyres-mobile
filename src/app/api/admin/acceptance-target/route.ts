import { createHash, createHmac } from 'node:crypto';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CONFIRMATION = 'I_CONFIRM_THIS_PROJECT_IS_DISPOSABLE';

function unavailable() {
  return NextResponse.json({ ok: false }, { status: 404 });
}

export async function GET(request: Request) {
  const token = process.env.PHASE1_ACCEPTANCE_TOKEN?.trim();
  const projectRef = process.env.PHASE1_DISPOSABLE_PROJECT_REF?.trim();
  const appUrl = process.env.PHASE1_APP_URL?.trim();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (
    process.env.PHASE1_CONFIRM_DISPOSABLE !== CONFIRMATION ||
    !token || token.length < 32 ||
    !projectRef || !appUrl || !supabaseUrl || !anonKey
  ) {
    return unavailable();
  }

  const requestUrl = new URL(request.url);
  const nonce = requestUrl.searchParams.get('nonce') ?? '';
  if (!/^[a-f0-9]{64}$/.test(nonce)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  let appOrigin: string;
  try {
    const parsed = new URL(supabaseUrl);
    if (parsed.protocol !== 'https:' || parsed.hostname !== `${projectRef}.supabase.co`) {
      return unavailable();
    }

    const parsedApp = new URL(appUrl);
    const validProtocol = parsedApp.protocol === 'https:' ||
      (parsedApp.protocol === 'http:' &&
        ['127.0.0.1', 'localhost', '[::1]'].includes(parsedApp.hostname));
    if (
      !validProtocol || parsedApp.username || parsedApp.password ||
      parsedApp.search || parsedApp.hash || parsedApp.pathname !== '/'
    ) {
      return unavailable();
    }
    appOrigin = parsedApp.origin;
  } catch {
    return unavailable();
  }

  const targetFingerprint = createHash('sha256')
    .update(`${supabaseUrl}\0${anonKey}\0${projectRef}`)
    .digest('hex');
  const proof = createHmac('sha256', token)
    .update(`${nonce}\0${targetFingerprint}\0${appOrigin}`)
    .digest('hex');

  return NextResponse.json({ ok: true, targetFingerprint, proof });
}
