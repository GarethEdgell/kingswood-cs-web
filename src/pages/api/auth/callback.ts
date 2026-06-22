import type { APIRoute } from 'astro';
import { getServiceSupabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { access_token, refresh_token, expires_in } = await request.json();

    if (!access_token) {
      return new Response(JSON.stringify({ error: 'No access token' }), {
        status: 400,
      });
    }

    // Set Supabase session cookies
    const expiresIn = expires_in || 3600;
    const now = new Date();
    const expires = new Date(now.getTime() + expiresIn * 1000);

    // Set auth token cookie
    cookies.set('sb-access-token', access_token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn,
    });

    if (refresh_token) {
      cookies.set('sb-refresh-token', refresh_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Auth callback error:', error);
    return new Response(JSON.stringify({ error: 'Auth callback failed' }), {
      status: 500,
    });
  }
};
