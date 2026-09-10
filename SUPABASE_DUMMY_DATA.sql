-- ═══════════════════════════════════════════════════════════════════════
-- DUMMY DATA — classes, enrollments and progress
-- Run in Supabase SQL Editor. Safe to re-run (uses ON CONFLICT / cleanup).
-- Looks up real auth.users IDs by email so foreign keys are correct.
-- ═══════════════════════════════════════════════════════════════════════

-- Clean out any previous dummy rows so this is idempotent
DELETE FROM student_progress;
DELETE FROM class_students;
DELETE FROM classes;

-- ───────────────────────────────────────────────────────────────────────
-- 1. CREATE CLASSES (linked to teachers by email)
-- ───────────────────────────────────────────────────────────────────────
INSERT INTO classes (name, code, teacher_id, year_group, description) VALUES
('Year 9 Digital Futures - Group A', 'DF9A',
  (SELECT id FROM auth.users WHERE email = 'ms.taylor@kingswood.edu'), 9,
  'Introduction to AI and digital skills using Microsoft 365'),
('Year 10 GCSE Computer Science', 'GCSE10',
  (SELECT id FROM auth.users WHERE email = 'mr.johnson@kingswood.edu'), 10,
  'OCR J277 GCSE Computer Science preparation'),
('Year 12 A-Level Computer Science', 'ALEVEL12',
  (SELECT id FROM auth.users WHERE email = 'dr.smith@kingswood.edu'), 12,
  'OCR H446 A-Level Computer Science - First year');

-- ───────────────────────────────────────────────────────────────────────
-- 2. ENROLL STUDENTS
-- ───────────────────────────────────────────────────────────────────────
-- Year 9 Digital Futures
INSERT INTO class_students (class_id, student_id)
SELECT c.id, u.id FROM classes c, auth.users u
WHERE c.code = 'DF9A' AND u.email IN (
  'aisha.patel@student.kingswood.edu',
  'ben.chen@student.kingswood.edu',
  'clara.williams@student.kingswood.edu'
);

-- Year 10 GCSE
INSERT INTO class_students (class_id, student_id)
SELECT c.id, u.id FROM classes c, auth.users u
WHERE c.code = 'GCSE10' AND u.email IN (
  'david.brown@student.kingswood.edu',
  'emma.garcia@student.kingswood.edu',
  'farah.khan@student.kingswood.edu'
);

-- Year 12 A-Level
INSERT INTO class_students (class_id, student_id)
SELECT c.id, u.id FROM classes c, auth.users u
WHERE c.code = 'ALEVEL12' AND u.email IN (
  'george.miller@student.kingswood.edu',
  'hannah.jones@student.kingswood.edu',
  'isaac.lee@student.kingswood.edu',
  'julia.martin@student.kingswood.edu'
);

-- ───────────────────────────────────────────────────────────────────────
-- 3. PROGRESS RECORDS (so reports and stats have data)
-- ───────────────────────────────────────────────────────────────────────
INSERT INTO student_progress (student_id, course_id, lessons_completed, quizzes_taken, avg_quiz_score) VALUES
-- Year 9 Digital Futures
((SELECT id FROM auth.users WHERE email = 'aisha.patel@student.kingswood.edu'), 'digital-futures', 8, 6, 88.50),
((SELECT id FROM auth.users WHERE email = 'ben.chen@student.kingswood.edu'), 'digital-futures', 5, 3, 72.00),
((SELECT id FROM auth.users WHERE email = 'clara.williams@student.kingswood.edu'), 'digital-futures', 11, 9, 91.30),
-- Year 10 GCSE
((SELECT id FROM auth.users WHERE email = 'david.brown@student.kingswood.edu'), 'ocr-gcse', 12, 8, 81.25),
((SELECT id FROM auth.users WHERE email = 'emma.garcia@student.kingswood.edu'), 'ocr-gcse', 15, 10, 88.40),
((SELECT id FROM auth.users WHERE email = 'farah.khan@student.kingswood.edu'), 'ocr-gcse', 9, 6, 64.67),
-- Year 12 A-Level
((SELECT id FROM auth.users WHERE email = 'george.miller@student.kingswood.edu'), 'ocr-alevel', 8, 5, 79.80),
((SELECT id FROM auth.users WHERE email = 'hannah.jones@student.kingswood.edu'), 'ocr-alevel', 12, 8, 85.50),
((SELECT id FROM auth.users WHERE email = 'isaac.lee@student.kingswood.edu'), 'ocr-alevel', 6, 3, 58.33),
((SELECT id FROM auth.users WHERE email = 'julia.martin@student.kingswood.edu'), 'ocr-alevel', 10, 7, 91.14);

-- ───────────────────────────────────────────────────────────────────────
-- DONE — verify
-- ───────────────────────────────────────────────────────────────────────
SELECT c.name, c.code, COUNT(cs.student_id) AS students
FROM classes c
LEFT JOIN class_students cs ON cs.class_id = c.id
GROUP BY c.id, c.name, c.code
ORDER BY c.year_group;
