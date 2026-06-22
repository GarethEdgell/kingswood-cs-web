// POST /api/progress/record
// Record student progress on a quiz or lesson

import type { APIRoute } from 'astro';
import { getServerSupabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { courseId, lessonId, score, type } = body; // type: 'lesson' or 'quiz'

    const supabase = getServerSupabase(request, cookies);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update or create progress record
    const { data, error } = await supabase
      .from('student_progress')
      .upsert({
        student_id: user.id,
        course_id: courseId,
        last_accessed: new Date().toISOString(),
        // In a real app, you'd track individual lesson/quiz results
        // For now, we just update aggregate stats
      }, { onConflict: 'student_id,course_id' });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
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
