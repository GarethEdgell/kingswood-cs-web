import { createClient } from '@supabase/supabase-js';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getServerSupabase(request: Request, cookies: AstroCookies) {
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '');
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, options);
        });
      },
    },
  });
}

export function getServiceSupabase() {
  const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}

export async function getSession(request: Request, cookies: AstroCookies) {
  const client = getServerSupabase(request, cookies);
  const { data: { session } } = await client.auth.getSession();
  return { session, client };
}

export async function getUser(request: Request, cookies: AstroCookies) {
  const client = getServerSupabase(request, cookies);

  // Try to get user from Supabase session
  const { data: { user } } = await client.auth.getUser();

  if (user) {
    return { user, client };
  }

  // If no user in session, check for our custom token cookie
  const accessToken = cookies.get('sb-access-token')?.value;
  if (accessToken) {
    console.log('Found access token in cookie, verifying...');
    try {
      // Verify the token by calling the user endpoint
      const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          apikey: supabaseAnonKey,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        return { user: userData, client };
      }
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  }

  return { user: null, client };
}

export async function getProfile(userId: string, _supabaseClient?: any, accessToken?: string) {
  // Try service role key from both import.meta.env and process.env (Vercel sets both)
  const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (serviceKey) {
    try {
      const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
      const { data, error } = await admin
        .from('profiles')
        .select('full_name, role, subscription_status')
        .eq('id', userId)
        .single();
      if (!error) return data ?? null;
      console.error('Service role profile fetch error:', error.message);
    } catch (e) {
      console.error('Service role client error:', e);
    }
  }

  // Fallback: direct REST fetch with user's access token
  if (accessToken) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=full_name,role,subscription_status&limit=1`,
        {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      );
      if (res.ok) {
        const rows = await res.json();
        return rows[0] ?? null;
      }
    } catch (e) {
      console.error('Direct REST profile fetch error:', e);
    }
  }

  return null;
}
