export const prerender = false;

// GET /api/me — tiny endpoint the Nav calls from the browser so the logged-in
// state is correct even on statically pre-rendered pages.

import { getUser, getProfile } from '../../lib/supabase';

export async function GET({ request, cookies }: { request: Request; cookies: any }) {
  const { user } = await getUser(request, cookies);
  if (!user) return json({ loggedIn: false });

  const accessToken = cookies.get('sb-access-token')?.value;
  const profile = await getProfile(user.id, null, accessToken);
  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin';

  return json({
    loggedIn: true,
    isTeacher,
    name: profile?.full_name || user.email?.split('@')[0] || 'Account',
  });
}

function json(body: object) {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
