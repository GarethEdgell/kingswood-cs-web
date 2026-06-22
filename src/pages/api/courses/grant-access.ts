// POST /api/courses/grant-access
// Grant a student access to one or more courses
// Teacher/admin only

import type { APIRoute } from 'astro';
import { getServiceSupabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { studentId, courseIds } = body;

    if (!studentId || !Array.isArray(courseIds) || courseIds.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = getServiceSupabase();

    // Grant access to each course
    const accessRecords = courseIds.map(courseId => ({
      student_id: studentId,
      course_id: courseId,
      granted_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('student_course_access')
      .upsert(accessRecords, { onConflict: 'student_id,course_id' });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
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
