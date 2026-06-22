-- ═══════════════════════════════════════════════════════════════════════
-- ASSIGN ROLES AND SET UP CLASSES
-- Run this in Supabase SQL Editor AFTER creating all users manually
-- ═══════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════
-- 1. CREATE PROFILES FOR TEACHERS
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO profiles (id, email, full_name, role) VALUES
((SELECT id FROM auth.users WHERE email = 'ms.taylor@kingswood.edu'), 'ms.taylor@kingswood.edu', 'Ms. Emma Taylor', 'teacher'),
((SELECT id FROM auth.users WHERE email = 'mr.johnson@kingswood.edu'), 'mr.johnson@kingswood.edu', 'Mr. David Johnson', 'teacher'),
((SELECT id FROM auth.users WHERE email = 'dr.smith@kingswood.edu'), 'dr.smith@kingswood.edu', 'Dr. Sarah Smith', 'teacher')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- 2. CREATE PROFILES FOR STUDENTS
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO profiles (id, email, full_name, role) VALUES
((SELECT id FROM auth.users WHERE email = 'aisha.patel@student.kingswood.edu'), 'aisha.patel@student.kingswood.edu', 'Aisha Patel', 'student'),
((SELECT id FROM auth.users WHERE email = 'ben.chen@student.kingswood.edu'), 'ben.chen@student.kingswood.edu', 'Ben Chen', 'student'),
((SELECT id FROM auth.users WHERE email = 'clara.williams@student.kingswood.edu'), 'clara.williams@student.kingswood.edu', 'Clara Williams', 'student'),
((SELECT id FROM auth.users WHERE email = 'david.brown@student.kingswood.edu'), 'david.brown@student.kingswood.edu', 'David Brown', 'student'),
((SELECT id FROM auth.users WHERE email = 'emma.garcia@student.kingswood.edu'), 'emma.garcia@student.kingswood.edu', 'Emma Garcia', 'student'),
((SELECT id FROM auth.users WHERE email = 'farah.khan@student.kingswood.edu'), 'farah.khan@student.kingswood.edu', 'Farah Khan', 'student'),
((SELECT id FROM auth.users WHERE email = 'george.miller@student.kingswood.edu'), 'george.miller@student.kingswood.edu', 'George Miller', 'student'),
((SELECT id FROM auth.users WHERE email = 'hannah.jones@student.kingswood.edu'), 'hannah.jones@student.kingswood.edu', 'Hannah Jones', 'student'),
((SELECT id FROM auth.users WHERE email = 'isaac.lee@student.kingswood.edu'), 'isaac.lee@student.kingswood.edu', 'Isaac Lee', 'student'),
((SELECT id FROM auth.users WHERE email = 'julia.martin@student.kingswood.edu'), 'julia.martin@student.kingswood.edu', 'Julia Martin', 'student')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- 3. CREATE CLASSES
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO classes (name, code, teacher_id, year_group, description) VALUES
('Year 9 Digital Futures - Group A', 'DF9A', (SELECT id FROM auth.users WHERE email = 'ms.taylor@kingswood.edu'), 9, 'Introduction to AI and digital skills'),
('Year 10 GCSE Computer Science', 'GCSE10', (SELECT id FROM auth.users WHERE email = 'mr.johnson@kingswood.edu'), 10, 'OCR J277 GCSE Computer Science'),
('Year 12 A-Level Computer Science', 'ALEVEL12', (SELECT id FROM auth.users WHERE email = 'dr.smith@kingswood.edu'), 12, 'OCR H446 A-Level Computer Science')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- 4. ENROLL STUDENTS IN CLASSES
-- ═══════════════════════════════════════════════════════════════════════

-- Year 9 Digital Futures students
INSERT INTO class_students (class_id, student_id)
SELECT c.id, u.id FROM classes c, auth.users u
WHERE c.code = 'DF9A' AND u.email IN ('aisha.patel@student.kingswood.edu', 'ben.chen@student.kingswood.edu', 'clara.williams@student.kingswood.edu')
ON CONFLICT DO NOTHING;

-- Year 10 GCSE students
INSERT INTO class_students (class_id, student_id)
SELECT c.id, u.id FROM classes c, auth.users u
WHERE c.code = 'GCSE10' AND u.email IN ('david.brown@student.kingswood.edu', 'emma.garcia@student.kingswood.edu', 'farah.khan@student.kingswood.edu')
ON CONFLICT DO NOTHING;

-- Year 12 A-Level students
INSERT INTO class_students (class_id, student_id)
SELECT c.id, u.id FROM classes c, auth.users u
WHERE c.code = 'ALEVEL12' AND u.email IN ('george.miller@student.kingswood.edu', 'hannah.jones@student.kingswood.edu', 'isaac.lee@student.kingswood.edu', 'julia.martin@student.kingswood.edu')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- 5. GRANT COURSE ACCESS
-- ═══════════════════════════════════════════════════════════════════════

-- Year 9 students get Digital Futures
INSERT INTO student_course_access (student_id, course_id, granted_by)
SELECT u.id, 'digital-futures', t.id
FROM auth.users u, auth.users t
WHERE u.email IN ('aisha.patel@student.kingswood.edu', 'ben.chen@student.kingswood.edu', 'clara.williams@student.kingswood.edu')
AND t.email = 'ms.taylor@kingswood.edu'
ON CONFLICT DO NOTHING;

-- Year 10 students get GCSE
INSERT INTO student_course_access (student_id, course_id, granted_by)
SELECT u.id, 'ocr-gcse', t.id
FROM auth.users u, auth.users t
WHERE u.email IN ('david.brown@student.kingswood.edu', 'emma.garcia@student.kingswood.edu', 'farah.khan@student.kingswood.edu')
AND t.email = 'mr.johnson@kingswood.edu'
ON CONFLICT DO NOTHING;

-- Year 12 students get A-Level
INSERT INTO student_course_access (student_id, course_id, granted_by)
SELECT u.id, 'ocr-alevel', t.id
FROM auth.users u, auth.users t
WHERE u.email IN ('george.miller@student.kingswood.edu', 'hannah.jones@student.kingswood.edu', 'isaac.lee@student.kingswood.edu', 'julia.martin@student.kingswood.edu')
AND t.email = 'dr.smith@kingswood.edu'
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- 6. ADD SAMPLE PROGRESS
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO student_progress (student_id, course_id, lessons_completed, quizzes_taken, avg_quiz_score) VALUES
-- Year 9 Digital Futures
((SELECT id FROM auth.users WHERE email = 'aisha.patel@student.kingswood.edu'), 'digital-futures', 5, 3, 85.50),
((SELECT id FROM auth.users WHERE email = 'ben.chen@student.kingswood.edu'), 'digital-futures', 3, 2, 78.00),
((SELECT id FROM auth.users WHERE email = 'clara.williams@student.kingswood.edu'), 'digital-futures', 8, 6, 92.33),
-- Year 10 GCSE
((SELECT id FROM auth.users WHERE email = 'david.brown@student.kingswood.edu'), 'ocr-gcse', 12, 8, 81.25),
((SELECT id FROM auth.users WHERE email = 'emma.garcia@student.kingswood.edu'), 'ocr-gcse', 15, 10, 88.40),
((SELECT id FROM auth.users WHERE email = 'farah.khan@student.kingswood.edu'), 'ocr-gcse', 10, 6, 75.67),
-- Year 12 A-Level
((SELECT id FROM auth.users WHERE email = 'george.miller@student.kingswood.edu'), 'ocr-alevel', 8, 5, 79.80),
((SELECT id FROM auth.users WHERE email = 'hannah.jones@student.kingswood.edu'), 'ocr-alevel', 12, 8, 85.50),
((SELECT id FROM auth.users WHERE email = 'isaac.lee@student.kingswood.edu'), 'ocr-alevel', 6, 3, 72.33),
((SELECT id FROM auth.users WHERE email = 'julia.martin@student.kingswood.edu'), 'ocr-alevel', 10, 7, 91.14)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- DONE! You can now log in with any of the test accounts
-- ═══════════════════════════════════════════════════════════════════════
