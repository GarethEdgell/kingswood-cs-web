import type { APIRoute } from 'astro';

// Supabase SSR reads cookies named sb-{projectRef}-auth-token
// The project ref is extracted from the Supabase URL
const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
const PROJECT_REF = SUPABASE_URL.replace('https://', '').split('.')[0];

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { access_token, refresh_token, expires_in, token_type, user } = body;

    if (!access_token) {
      return json({ error: 'No access token' }, 400);
    }

    const expiresIn = expires_in || 3600;

    // Store in the exact format @supabase/ssr expects
    // Cookie name: sb-{projectRef}-auth-token
    const sessionData = JSON.stringify({
      access_token,
      token_type: token_type ?? 'bearer',
      expires_in: expiresIn,
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
      refresh_token: refresh_token ?? '',
      user,
    });

    const cookieName = `sb-${PROJECT_REF}-auth-token`;

    cookies.set(cookieName, sessionData, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: expiresIn,
    });

    // Also set our legacy cookie so existing token checks still work
    cookies.set('sb-access-token', access_token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: expiresIn,
    });

    return json({ success: true });
  } catch (error) {
    console.error('Auth callback error:', error);
    return json({ error: 'Auth callback failed' }, 500);
  }
};

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
