-- ═══════════════════════════════════════════════════════════════════════
-- KINGSWOOD COMPUTER SCIENCE DATABASE SCHEMA
-- Run this in Supabase SQL Editor (copy entire block)
-- ═══════════════════════════════════════════════════════════════════════

-- 1. PROFILES TABLE (extends auth.users)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. STUDENT COURSE ACCESS TABLE
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_course_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL CHECK (course_id IN ('ocr-gcse', 'ocr-alevel', 'digital-futures')),
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(student_id, course_id)
);

-- 3. CLASSES TABLE
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  year_group INTEGER CHECK (year_group >= 7 AND year_group <= 13),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CLASS STUDENTS (enrollment)
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS class_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

-- 5. STUDENT PROGRESS TABLE
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL CHECK (course_id IN ('ocr-gcse', 'ocr-alevel', 'digital-futures')),
  lessons_completed INTEGER DEFAULT 0,
  quizzes_taken INTEGER DEFAULT 0,
  avg_quiz_score DECIMAL(5, 2) DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- ═══════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_course_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can see their own profile, admins see all
CREATE POLICY "Users can see own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- STUDENT_COURSE_ACCESS: Students see their own, teachers see their students'
CREATE POLICY "Students see own course access"
  ON student_course_access FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers see their class students' course access"
  ON student_course_access FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher' OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' OR
    auth.uid() = student_id
  );

CREATE POLICY "Teachers can grant course access to their students"
  ON student_course_access FOR INSERT
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) IN ('teacher', 'admin'));

-- CLASSES: Students see classes they're in, teachers see their own
CREATE POLICY "Teachers see own classes"
  ON classes FOR SELECT
  USING (teacher_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Students see classes they're enrolled in"
  ON classes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM class_students
      WHERE class_students.class_id = classes.id
      AND class_students.student_id = auth.uid()
    ) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Teachers can insert classes"
  ON classes FOR INSERT
  WITH CHECK (teacher_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- CLASS_STUDENTS: Teachers manage their classes, students see own enrollments
CREATE POLICY "Teachers see students in their classes"
  ON class_students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = class_students.class_id
      AND classes.teacher_id = auth.uid()
    ) OR
    class_students.student_id = auth.uid() OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Teachers can manage class enrollments"
  ON class_students FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = class_students.class_id
      AND classes.teacher_id = auth.uid()
    ) OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- STUDENT_PROGRESS: Students see own, teachers see their students'
CREATE POLICY "Students see own progress"
  ON student_progress FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Teachers see students' progress"
  ON student_progress FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'teacher' OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' OR
    auth.uid() = student_id
  );

CREATE POLICY "Students can update own progress"
  ON student_progress FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert progress"
  ON student_progress FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- ═══════════════════════════════════════════════════════════════════════
-- INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_student_course_access_student
  ON student_course_access(student_id);

CREATE INDEX IF NOT EXISTS idx_student_course_access_course
  ON student_course_access(course_id);

CREATE INDEX IF NOT EXISTS idx_classes_teacher
  ON classes(teacher_id);

CREATE INDEX IF NOT EXISTS idx_class_students_class
  ON class_students(class_id);

CREATE INDEX IF NOT EXISTS idx_class_students_student
  ON class_students(student_id);

CREATE INDEX IF NOT EXISTS idx_student_progress_student
  ON student_progress(student_id);

CREATE INDEX IF NOT EXISTS idx_student_progress_course
  ON student_progress(course_id);

-- ═══════════════════════════════════════════════════════════════════════
-- DONE!
-- ═══════════════════════════════════════════════════════════════════════
-- All tables, policies, and indexes are now set up.
-- Your Supabase backend is ready for course access and progress tracking.
