-- ═══════════════════════════════════════════════════════════════════════
-- RLS RESET — drop ALL existing policies on these tables, then create clean
-- non-recursive ones. Run in Supabase SQL Editor.
-- ═══════════════════════════════════════════════════════════════════════

-- Drop every existing policy on the four tables
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('profiles', 'classes', 'class_students', 'student_progress')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- Make sure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- ── PROFILES ───────────────────────────────────────────────────────────
CREATE POLICY "read_profiles" ON profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── CLASSES ────────────────────────────────────────────────────────────
CREATE POLICY "read_classes" ON classes FOR SELECT
  USING (auth.uid() IS NOT NULL);
CREATE POLICY "manage_own_classes" ON classes FOR ALL
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- ── CLASS_STUDENTS ─────────────────────────────────────────────────────
CREATE POLICY "read_class_students" ON class_students FOR SELECT
  USING (auth.uid() IS NOT NULL);
CREATE POLICY "manage_class_students" ON class_students FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── STUDENT_PROGRESS ───────────────────────────────────────────────────
CREATE POLICY "read_progress" ON student_progress FOR SELECT
  USING (auth.uid() IS NOT NULL);
CREATE POLICY "manage_progress" ON student_progress FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── Verify ─────────────────────────────────────────────────────────────
SELECT tablename, policyname, cmd FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles','classes','class_students','student_progress')
ORDER BY tablename, policyname;
