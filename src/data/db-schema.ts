// Database schema definitions for Kingswood CS Web
// These define the table structure in Supabase

export interface Profile {
  id: string; // User ID from auth
  email: string;
  full_name: string;
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
}

export interface StudentCourseAccess {
  id: string;
  student_id: string;
  course_id: 'ocr-gcse' | 'ocr-alevel' | 'digital-futures';
  granted_by: string; // Teacher/admin ID
  granted_at: string;
  expires_at?: string;
}

export interface Class {
  id: string;
  name: string;
  code: string; // Unique enrollment code
  teacher_id: string;
  year_group: number;
  created_at: string;
}

export interface ClassStudent {
  id: string;
  class_id: string;
  student_id: string;
  joined_at: string;
}

export interface StudentProgress {
  id: string;
  student_id: string;
  course_id: 'ocr-gcse' | 'ocr-alevel' | 'digital-futures';
  lessons_completed: number;
  quizzes_taken: number;
  avg_quiz_score: number;
  last_accessed: string;
}

// SQL for creating tables (reference for Supabase setup)
export const SQL_CREATE_TABLES = `
-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Student course access
CREATE TABLE student_course_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL CHECK (course_id IN ('ocr-gcse', 'ocr-alevel', 'digital-futures')),
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  UNIQUE(student_id, course_id)
);

-- Classes
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  teacher_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  year_group INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Class memberships
CREATE TABLE class_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(class_id, student_id)
);

-- Student progress tracking
CREATE TABLE student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id TEXT NOT NULL CHECK (course_id IN ('ocr-gcse', 'ocr-alevel', 'digital-futures')),
  lessons_completed INTEGER DEFAULT 0,
  quizzes_taken INTEGER DEFAULT 0,
  avg_quiz_score DECIMAL DEFAULT 0,
  last_accessed TIMESTAMP,
  UNIQUE(student_id, course_id)
);

-- Row-level security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_course_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
`;
