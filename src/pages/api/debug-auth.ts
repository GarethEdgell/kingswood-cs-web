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
  if (user) {
    profile = await getProfile(user.id, null, accessToken);
  }

  return new Response(JSON.stringify({
    user: user ? { id: user.id, email: user.email } : null,
    profile,
    cookies: {
      hasAccessToken: !!accessToken,
      hasSessionCookie: !!sessionCookie,
      sessionCookieName,
    },
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
