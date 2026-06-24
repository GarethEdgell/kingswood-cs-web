-- ═══════════════════════════════════════════════════════════════════════
-- ASSIGNMENTS & SUBMISSIONS — quizzes, work tasks, and teacher-mediated AI
-- Run once in the Supabase SQL Editor.
--
-- Powers:
--   • Assignable lesson quizzes (auto-graded server-side)
--   • Student work/prompt submissions
--   • The teacher-mediated AI pipeline (under-13 safe): students never call
--     the AI directly — the teacher batch-runs submissions server-side and
--     responses are written back per submission.
-- ═══════════════════════════════════════════════════════════════════════

-- ── ASSIGNMENTS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('quiz', 'ai-task', 'work')),
  lesson_id TEXT,                 -- e.g. 'df-8-7' (matches digitalFutures ids)
  quiz_id TEXT,                   -- matches dfQuizzes id (= lesson id); null for ai-task/work
  title TEXT NOT NULL,
  instructions TEXT,
  prompt_guidance TEXT,           -- guidance shown to students for ai-task
  ai_system_prompt TEXT,          -- teacher-controlled system prompt for the AI runner
  due_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── SUBMISSIONS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  work_text TEXT,                 -- student's own work (ai-task / work)
  prompt_text TEXT,               -- student's prompt (ai-task)
  quiz_answers JSONB,             -- { questionId: chosenIndex } (quiz)
  score INTEGER,                  -- auto-graded % (quiz)
  ai_response TEXT,               -- filled by the teacher AI runner
  ai_status TEXT DEFAULT 'none' CHECK (ai_status IN ('none', 'pending', 'processing', 'done', 'error')),
  submitted_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(assignment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON assignments(class_id);

-- ═══════════════════════════════════════════════════════════════════════
-- ROW-LEVEL SECURITY
-- (Non-recursive policies, matching SUPABASE_RLS_POLICIES.sql style.)
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- ── ASSIGNMENTS ──────────────────────────────────────────────────────
-- Teachers manage assignments for classes they own
DROP POLICY IF EXISTS "Teachers manage own assignments" ON assignments;
CREATE POLICY "Teachers manage own assignments"
ON assignments FOR ALL
USING (teacher_id = auth.uid())
WITH CHECK (teacher_id = auth.uid());

-- Students can read assignments for classes they are enrolled in
DROP POLICY IF EXISTS "Students read class assignments" ON assignments;
CREATE POLICY "Students read class assignments"
ON assignments FOR SELECT
USING (
  class_id IN (SELECT class_id FROM class_students WHERE student_id = auth.uid())
);

-- ── SUBMISSIONS ──────────────────────────────────────────────────────
-- Students read/insert/update their own submissions
DROP POLICY IF EXISTS "Students read own submissions" ON submissions;
CREATE POLICY "Students read own submissions"
ON submissions FOR SELECT
USING (student_id = auth.uid());

DROP POLICY IF EXISTS "Students insert own submissions" ON submissions;
CREATE POLICY "Students insert own submissions"
ON submissions FOR INSERT
WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Students update own submissions" ON submissions;
CREATE POLICY "Students update own submissions"
ON submissions FOR UPDATE
USING (student_id = auth.uid())
WITH CHECK (student_id = auth.uid());

-- Teachers can read submissions for assignments they own
DROP POLICY IF EXISTS "Teachers read class submissions" ON submissions;
CREATE POLICY "Teachers read class submissions"
ON submissions FOR SELECT
USING (
  assignment_id IN (SELECT id FROM assignments WHERE teacher_id = auth.uid())
);

-- NOTE: the AI runner endpoint writes ai_response/ai_status back using the
-- service-role key, which bypasses RLS. Students therefore cannot self-write
-- AI responses — only the teacher-triggered server action can.
