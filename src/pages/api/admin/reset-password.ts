export const prerender = false;

// POST /api/admin/reset-password
// Body: { username: "ic1-3", newPassword?: "..." }  → reset one student
//   or: { classCode: "ic1", newPassword?: "..." }   → reset a whole class
// Only master teachers (role admin/teacher) may call this.
// Returns the new password(s) so the teacher can hand them out.

import { getUser, getProfile } from '../../../lib/supabase';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
const EMAIL_DOMAIN = 'students.kingswoodcomputerscience.com';

const WORDS = ['tiger','comet','maple','pixel','robot','delta','amber','quartz','falcon','cobalt',
  'willow','ember','orbit','cedar','vortex','lunar','onyx','breeze','flint','harbor'];
function makePassword() {
  const w = WORDS[Math.floor(Math.random() * WORDS.length)];
  const n = 10 + Math.floor(Math.random() * 89);
  return w.charAt(0).toUpperCase() + w.slice(1) + n;
}

export async function POST({ request, cookies }: { request: Request; cookies: any }) {
  const { user } = await getUser(request, cookies);
  if (!user) return json({ error: 'Unauthorised' }, 401);

  const accessToken = cookies.get('sb-access-token')?.value;
  const profile = await getProfile(user.id, null, accessToken);
  if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
    return json({ error: 'Forbidden — teachers only' }, 403);
  }

  if (!SERVICE_KEY) {
    return json({ error: 'Server not configured: SUPABASE_SERVICE_ROLE_KEY missing in Vercel.' }, 500);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
  const body = await request.json();

  // Build the list of usernames to reset
  let usernames: string[] = [];
  if (body.username) {
    usernames = [String(body.username).toLowerCase().trim()];
  } else if (body.classCode) {
    // reset every account whose username starts with the class code
    for (let n = 1; n <= 28; n++) usernames.push(`${String(body.classCode).toLowerCase().trim()}-${n}`);
  } else {
    return json({ error: 'Provide a username or a classCode.' }, 400);
  }

  const results: { username: string; password?: string; error?: string }[] = [];

  for (const username of usernames) {
    const email = `${username}@${EMAIL_DOMAIN}`;
    const newPassword = body.newPassword || makePassword();

    // Find the auth user id by email
    const { data: rows } = await admin.from('profiles').select('id').eq('email', email).limit(1);
    const id = rows?.[0]?.id;
    if (!id) { results.push({ username, error: 'not found' }); continue; }

    const { error } = await admin.auth.admin.updateUserById(id, { password: newPassword });
    if (error) results.push({ username, error: error.message });
    else results.push({ username, password: newPassword });
  }

  return json({ results });
}

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
}
