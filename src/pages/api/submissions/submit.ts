// POST /api/submissions/submit
// Student-gated. Upserts the caller's submission for an assignment.
//  - type 'quiz'    : answers are graded SERVER-SIDE against dfQuizzes (the
//                     client is never trusted with the score).
//  - type 'ai-task' : stores work_text + prompt_text and marks ai_status
//                     'pending' so the teacher's runner can pick it up.
//  - type 'work'    : stores work_text only.

import type { APIRoute } from 'astro';
import { getUser, serviceSelect, serviceWrite } from '../../../lib/supabase';
import { getQuizForLesson } from '../../../data/dfQuizzes';

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

    const body = await request.json();
    const { assignmentId, type, quizAnswers, workText, promptText } = body;
    if (!assignmentId || !type) return json({ error: 'Missing assignmentId or type' }, 400);

    // Confirm the assignment exists and the student is enrolled in its class.
    const assignments = await serviceSelect(
      'assignments',
      `id=eq.${assignmentId}&select=id,class_id,type,quiz_id,lesson_id&limit=1`
    );
    const assignment = assignments[0];
    if (!assignment) return json({ error: 'Assignment not found' }, 404);

    const enrolled = await serviceSelect(
      'class_students',
      `class_id=eq.${assignment.class_id}&student_id=eq.${user.id}&select=id&limit=1`
    );
    if (enrolled.length === 0) return json({ error: 'Not enrolled in this class' }, 403);

    const row: Record<string, any> = {
      assignment_id: assignmentId,
      student_id: user.id,
      updated_at: new Date().toISOString(),
    };

    if (type === 'quiz') {
      // Server-side grading against the authoritative answer key.
      const quizId = assignment.quiz_id || assignment.lesson_id;
      const quiz = quizId ? getQuizForLesson(quizId) : undefined;
      if (!quiz) return json({ error: 'Quiz not found for this assignment' }, 400);
      const answers: Record<string, number> = quizAnswers ?? {};
      const correct = quiz.questions.filter(q => answers[q.id] === q.correctIndex).length;
      row.quiz_answers = answers;
      row.score = Math.round((correct / quiz.questions.length) * 100);
      row.ai_status = 'none';
    } else if (type === 'ai-task') {
      row.work_text = workText ?? '';
      row.prompt_text = promptText ?? '';
      row.ai_status = 'pending';
    } else if (type === 'work') {
      row.work_text = workText ?? '';
      row.ai_status = 'none';
    } else {
      return json({ error: 'Invalid type' }, 400);
    }

    const result = await serviceWrite('submissions', row, { onConflict: 'assignment_id,student_id' });
    if (!result.ok) return json({ error: 'Could not save submission' }, 500);

    const saved = result.data[0] ?? {};
    return json({ success: true, score: saved.score ?? null, aiStatus: saved.ai_status ?? null });
  } catch (err) {
    console.error('submit error', err);
    return json({ error: 'Server error' }, 500);
  }
};
