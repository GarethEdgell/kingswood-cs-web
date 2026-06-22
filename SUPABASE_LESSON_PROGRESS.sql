-- ═══════════════════════════════════════════════════════════════════════
-- PER-LESSON PROGRESS — gives the report generator topic-rich data so each
-- student's report covers a wide range of different lessons.
-- Run in Supabase SQL Editor.
-- ═══════════════════════════════════════════════════════════════════════

-- 1. Table
CREATE TABLE IF NOT EXISTS student_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  score int NOT NULL CHECK (score BETWEEN 0 AND 5),
  completed_at timestamptz DEFAULT now(),
  UNIQUE (student_id, lesson_id)
);

-- 2. RLS (simple, non-recursive)
ALTER TABLE student_lesson_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_lesson_progress" ON student_lesson_progress;
CREATE POLICY "read_lesson_progress" ON student_lesson_progress FOR SELECT
  USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "manage_lesson_progress" ON student_lesson_progress;
CREATE POLICY "manage_lesson_progress" ON student_lesson_progress FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Clear any previous sample rows
DELETE FROM student_lesson_progress;

-- 4. Seed varied per-lesson scores (Year 9 lessons df-9-1 … df-9-16)
-- Aisha — strong creative/AI, weaker on data & spreadsheets
INSERT INTO student_lesson_progress (student_id, lesson_id, score)
SELECT (SELECT id FROM auth.users WHERE email='aisha.patel@student.kingswood.edu'), lesson_id, score
FROM (VALUES
  ('df-9-1', 5), ('df-9-2', 4), ('df-9-3', 5), ('df-9-4', 3),
  ('df-9-5', 2), ('df-9-6', 5), ('df-9-7', 4), ('df-9-8', 2),
  ('df-9-9', 3), ('df-9-10', 5), ('df-9-12', 4), ('df-9-14', 5)
) AS t(lesson_id, score);

-- Ben — mixed, several areas needing work
INSERT INTO student_lesson_progress (student_id, lesson_id, score)
SELECT (SELECT id FROM auth.users WHERE email='ben.chen@student.kingswood.edu'), lesson_id, score
FROM (VALUES
  ('df-9-1', 3), ('df-9-2', 2), ('df-9-3', 4), ('df-9-4', 2),
  ('df-9-5', 3), ('df-9-6', 2), ('df-9-7', 5), ('df-9-8', 1),
  ('df-9-9', 4), ('df-9-11', 2), ('df-9-13', 3)
) AS t(lesson_id, score);

-- Clara — high achiever across the board, ready for extension
INSERT INTO student_lesson_progress (student_id, lesson_id, score)
SELECT (SELECT id FROM auth.users WHERE email='clara.williams@student.kingswood.edu'), lesson_id, score
FROM (VALUES
  ('df-9-1', 5), ('df-9-2', 5), ('df-9-3', 4), ('df-9-4', 5),
  ('df-9-5', 4), ('df-9-6', 5), ('df-9-7', 5), ('df-9-8', 4),
  ('df-9-9', 5), ('df-9-10', 5), ('df-9-11', 4), ('df-9-12', 5),
  ('df-9-13', 4), ('df-9-14', 5), ('df-9-15', 5), ('df-9-16', 4)
) AS t(lesson_id, score);

-- 5. Verify
SELECT u.email, COUNT(*) AS lessons, ROUND(AVG(slp.score),1) AS avg_score
FROM student_lesson_progress slp
JOIN auth.users u ON u.id = slp.student_id
GROUP BY u.email
ORDER BY u.email;
