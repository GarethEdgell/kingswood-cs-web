export const prerender = false;

// GET /api/keep-alive
// Runs a trivial query so the Supabase project registers activity and the free
// tier does NOT pause it after 7 days of inactivity.
// Hit automatically by Vercel Cron (see vercel.json) once a day.

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const ANON = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export async function GET() {
  try {
    // A cheap, always-valid request that touches the database.
    const res = await fetch(`${SUPABASE_URL}/rest/v1/classes?select=id&limit=1`, {
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
    });
    return new Response(JSON.stringify({
      ok: res.ok,
      status: res.status,
      at: new Date().toISOString(),
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
