-- ═══════════════════════════════════════════════════════════════════════
-- RLS POLICIES — allow teachers to read their classes and student data
-- Run in Supabase SQL Editor if classes/students aren't showing.
-- These avoid the recursive-policy problem (no self-referencing subqueries).
-- ═══════════════════════════════════════════════════════════════════════

-- ── CLASSES ────────────────────────────────────────────────────────────
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Teachers read own classes" ON classes;
CREATE POLICY "Teachers read own classes"
ON classes FOR SELECT
USING (teacher_id = auth.uid());

DROP POLICY IF EXISTS "Teachers manage own classes" ON classes;
CREATE POLICY "Teachers manage own classes"
ON classes FOR ALL
USING (teacher_id = auth.uid())
WITH CHECK (teacher_id = auth.uid());

-- ── CLASS_STUDENTS ─────────────────────────────────────────────────────
ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;

-- Teachers can read enrollments for classes they own
DROP POLICY IF EXISTS "Teachers read class enrollments" ON class_students;
CREATE POLICY "Teachers read class enrollments"
ON class_students FOR SELECT
USING (
  class_id IN (SELECT id FROM classes WHERE teacher_id = auth.uid())
);

-- Students can read their own enrollment
DROP POLICY IF EXISTS "Students read own enrollment" ON class_students;
CREATE POLICY "Students read own enrollment"
ON class_students FOR SELECT
USING (student_id = auth.uid());

-- ── STUDENT_PROGRESS ───────────────────────────────────────────────────
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- Teachers can read progress of students in their classes
DROP POLICY IF EXISTS "Teachers read student progress" ON student_progress;
CREATE POLICY "Teachers read student progress"
ON student_progress FOR SELECT
USING (
  student_id IN (
    SELECT cs.student_id FROM class_students cs
    JOIN classes c ON c.id = cs.class_id
    WHERE c.teacher_id = auth.uid()
  )
);

-- Students can read their own progress
DROP POLICY IF EXISTS "Students read own progress" ON student_progress;
CREATE POLICY "Students read own progress"
ON student_progress FOR SELECT
USING (student_id = auth.uid());

-- ── PROFILES (teachers need to read their students' names) ──────────────
DROP POLICY IF EXISTS "Teachers read student profiles" ON profiles;
CREATE POLICY "Teachers read student profiles"
ON profiles FOR SELECT
USING (
  id IN (
    SELECT cs.student_id FROM class_students cs
    JOIN classes c ON c.id = cs.class_id
    WHERE c.teacher_id = auth.uid()
  )
);
