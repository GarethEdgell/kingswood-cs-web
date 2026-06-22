export const prerender = false;

import { getUser, getProfile } from '../../lib/supabase';

export async function GET({ request, cookies }: { request: Request; cookies: any }) {
  const { user } = await getUser(request, cookies);
  const accessToken = cookies.get('sb-access-token')?.value;

  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
  const projectRef = supabaseUrl.replace('https://', '').split('.')[0];
  const sessionCookieName = `sb-${projectRef}-auth-token`;
  const sessionCookie = cookies.get(sessionCookieName)?.value;

  let profile = null;
  let profileError = null;
  let directFetchResult = null;
  if (user) {
    profile = await getProfile(user.id, null, accessToken);

    // Try direct REST fetch with access token
    try {
      const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
      const res = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${user.id}&select=full_name,role&limit=1`,
        {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      );
      const text = await res.text();
      directFetchResult = { status: res.status, body: text };
    } catch (e: any) {
      profileError = e.message;
    }
  }

  return new Response(JSON.stringify({
    user: user ? { id: user.id, email: user.email } : null,
    profile,
    profileError,
    directFetchResult,
    cookies: {
      hasAccessToken: !!accessToken,
      hasSessionCookie: !!sessionCookie,
      sessionCookieName,
    },
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
