// GET /api/courses/my-access
// Get current user's accessible courses

import type { APIRoute } from 'astro';
import { getServerSupabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = getServerSupabase(request, cookies);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get courses this student has access to
    const { data, error } = await supabase
      .from('student_course_access')
      .select('course_id')
      .eq('student_id', user.id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const courseIds = data?.map(row => row.course_id) ?? [];

    return new Response(JSON.stringify({ courseIds }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
