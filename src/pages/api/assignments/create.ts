// POST /api/assignments/create
// Teacher-gated. Creates an assignment (quiz / ai-task / work) for a class
// the teacher owns.

import type { APIRoute } from 'astro';
import { getUser, getProfile, serviceSelect, serviceWrite } from '../../../lib/supabase';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { user } = await getUser(request, cookies);
    if (!user) return json({ error: 'Not authenticated' }, 401);

    const accessToken = cookies.get('sb-access-token')?.value;
    const profile = await getProfile(user.id, null, accessToken);
    if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
      return json({ error: 'Teachers only' }, 403);
    }

    const body = await request.json();
    const { classId, type, lessonId, quizId, title, instructions, promptGuidance, aiSystemPrompt, dueDate } = body;

    if (!classId || !type || !title) return json({ error: 'Missing classId, type or title' }, 400);
    if (!['quiz', 'ai-task', 'work'].includes(type)) return json({ error: 'Invalid type' }, 400);

    // Verify the teacher owns this class.
    const owned = await serviceSelect(
      'classes',
      `id=eq.${classId}&teacher_id=eq.${user.id}&select=id&limit=1`
    );
    if (owned.length === 0) return json({ error: 'You do not own this class' }, 403);

    const row: Record<string, any> = {
      class_id: classId,
      teacher_id: user.id,
      type,
      lesson_id: lessonId ?? null,
      quiz_id: type === 'quiz' ? (quizId ?? lessonId ?? null) : null,
      title,
      instructions: instructions ?? null,
      prompt_guidance: promptGuidance ?? null,
      ai_system_prompt: aiSystemPrompt ?? null,
      due_date: dueDate || null,
    };

    const result = await serviceWrite('assignments', row);
    if (!result.ok) return json({ error: 'Could not create assignment' }, 500);

    return json({ success: true, assignment: result.data[0] ?? null });
  } catch (err) {
    console.error('create assignment error', err);
    return json({ error: 'Server error' }, 500);
  }
};
