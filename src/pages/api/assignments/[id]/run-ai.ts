// POST /api/assignments/[id]/run-ai
// Teacher-gated. THE teacher-mediated AI step (under-13 safe): batch-runs every
// pending submission for this assignment through the AI server-side, under the
// teacher's session, and writes each response back to its submission row.
//
// Students never call the AI themselves — this endpoint is the only caller of
// runPrompt(), and it requires the teacher who owns the assignment.

import type { APIRoute } from 'astro';
import { getUser, getProfile, serviceSelect, servicePatch } from '../../../../lib/supabase';
import { runPrompt } from '../../../../lib/ai';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function buildPrompt(promptText?: string, workText?: string): string {
  const parts: string[] = [];
  if (promptText?.trim()) parts.push(promptText.trim());
  if (workText?.trim()) {
    parts.push('\n\n--- STUDENT WORK ---\n');
    parts.push(workText.trim());
  }
  return parts.join('') || '(No prompt or work was submitted.)';
}

export const POST: APIRoute = async ({ request, cookies, params }) => {
  try {
    const { user } = await getUser(request, cookies);
    if (!user) return json({ error: 'Not authenticated' }, 401);

    const accessToken = cookies.get('sb-access-token')?.value;
    const profile = await getProfile(user.id, null, accessToken);
    if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
      return json({ error: 'Teachers only' }, 403);
    }

    const assignmentId = params.id;
    if (!assignmentId) return json({ error: 'Missing assignment id' }, 400);

    // Verify the teacher owns this assignment.
    const assignments = await serviceSelect(
      'assignments',
      `id=eq.${assignmentId}&teacher_id=eq.${user.id}&select=id,ai_system_prompt&limit=1`
    );
    const assignment = assignments[0];
    if (!assignment) return json({ error: 'Assignment not found or not yours' }, 404);

    // Load pending submissions.
    const pending = await serviceSelect(
      'submissions',
      `assignment_id=eq.${assignmentId}&ai_status=eq.pending&select=id,prompt_text,work_text`
    );

    let done = 0;
    let failed = 0;

    for (const sub of pending) {
      await servicePatch('submissions', `id=eq.${sub.id}`, { ai_status: 'processing' });
      try {
        const response = await runPrompt({
          system: assignment.ai_system_prompt || undefined,
          prompt: buildPrompt(sub.prompt_text, sub.work_text),
        });
        await servicePatch('submissions', `id=eq.${sub.id}`, {
          ai_response: response,
          ai_status: 'done',
          updated_at: new Date().toISOString(),
        });
        done++;
      } catch (e) {
        console.error(`run-ai failed for submission ${sub.id}`, e);
        await servicePatch('submissions', `id=eq.${sub.id}`, {
          ai_status: 'error',
          ai_response: 'The AI run failed for this submission. Try again.',
          updated_at: new Date().toISOString(),
        });
        failed++;
      }
    }

    return json({ success: true, processed: pending.length, done, failed });
  } catch (err) {
    console.error('run-ai error', err);
    return json({ error: 'Server error' }, 500);
  }
};
