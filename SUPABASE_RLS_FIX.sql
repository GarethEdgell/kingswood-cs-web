-- ═══════════════════════════════════════════════════════════════════════
-- RLS FIX — replace recursive policies with simple single-table ones.
-- Run this in Supabase SQL Editor. Removes all cross-table subqueries that
-- caused "infinite recursion detected in policy".
-- ═══════════════════════════════════════════════════════════════════════

-- ── PROFILES ───────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Teachers read student profiles" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can see own profile" ON profiles;

-- Any logged-in user can read profiles (names/roles only — not sensitive here)
CREATE POLICY "Authenticated read profiles"
ON profiles FOR SELECT
USING (auth.uid() IS NOT NULL);

-- ── CLASSES ────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Teachers read own classes" ON classes;
DROP POLICY IF EXISTS "Teachers manage own classes" ON classes;

CREATE POLICY "Teachers read own classes"
ON classes FOR SELECT
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers manage own classes"
ON classes FOR ALL
USING (teacher_id = auth.uid())
WITH CHECK (teacher_id = auth.uid());

-- ── CLASS_STUDENTS ─────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Teachers read class enrollments" ON class_students;
DROP POLICY IF EXISTS "Students read own enrollment" ON class_students;

CREATE POLICY "Authenticated read enrollments"
ON class_students FOR SELECT
USING (auth.uid() IS NOT NULL);

-- ── STUDENT_PROGRESS ───────────────────────────────────────────────────
DROP POLICY IF EXISTS "Teachers read student progress" ON student_progress;
DROP POLICY IF EXISTS "Students read own progress" ON student_progress;

CREATE POLICY "Authenticated read progress"
ON student_progress FOR SELECT
USING (auth.uid() IS NOT NULL);
