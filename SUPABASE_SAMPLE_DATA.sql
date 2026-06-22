-- ═══════════════════════════════════════════════════════════════════════
-- SAMPLE DATA FOR KINGSWOOD COMPUTER SCIENCE
-- Run this in Supabase SQL Editor AFTER running SUPABASE_SETUP.sql
--
-- This creates:
-- - 3 teacher accounts
-- - 10 student accounts
-- - 3 sample classes
-- - Course access assignments
-- - Sample progress records
-- ═══════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════
-- SAMPLE PROFILES
-- ═══════════════════════════════════════════════════════════════════════

-- Teachers
INSERT INTO profiles (id, email, full_name, role) VALUES
-- Teacher 1: Year 9 Digital Futures
('11111111-1111-1111-1111-111111111111', 'ms.taylor@kingswood.edu', 'Ms. Emma Taylor', 'teacher'),
-- Teacher 2: Year 10 GCSE
('22222222-2222-2222-2222-222222222222', 'mr.johnson@kingswood.edu', 'Mr. David Johnson', 'teacher'),
-- Teacher 3: Year 12 A-Level
('33333333-3333-3333-3333-333333333333', 'dr.smith@kingswood.edu', 'Dr. Sarah Smith', 'teacher'),
-- Admin
('44444444-4444-4444-4444-444444444444', 'admin@kingswood.edu', 'Admin User', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Students
INSERT INTO profiles (id, email, full_name, role) VALUES
-- Year 9 students (Digital Futures)
('55555555-5555-5555-5555-555555555551', 'aisha.patel@student.kingswood.edu', 'Aisha Patel', 'student'),
('55555555-5555-5555-5555-555555555552', 'ben.chen@student.kingswood.edu', 'Ben Chen', 'student'),
('55555555-5555-5555-5555-555555555553', 'clara.williams@student.kingswood.edu', 'Clara Williams', 'student'),
-- Year 10 students (GCSE)
('55555555-5555-5555-5555-555555555554', 'david.brown@student.kingswood.edu', 'David Brown', 'student'),
('55555555-5555-5555-5555-555555555555', 'emma.garcia@student.kingswood.edu', 'Emma Garcia', 'student'),
('55555555-5555-5555-5555-555555555556', 'farah.khan@student.kingswood.edu', 'Farah Khan', 'student'),
-- Year 12 students (A-Level)
('55555555-5555-5555-5555-555555555557', 'george.miller@student.kingswood.edu', 'George Miller', 'student'),
('55555555-5555-5555-5555-555555555558', 'hannah.jones@student.kingswood.edu', 'Hannah Jones', 'student'),
('55555555-5555-5555-5555-555555555559', 'isaac.lee@student.kingswood.edu', 'Isaac Lee', 'student'),
('55555555-5555-5555-5555-555555555560', 'julia.martin@student.kingswood.edu', 'Julia Martin', 'student')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- SAMPLE CLASSES
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO classes (id, name, code, teacher_id, year_group, description) VALUES
-- Ms. Taylor's Year 9 Digital Futures class
('66666666-6666-6666-6666-666666666661',
 'Year 9 Digital Futures - Group A',
 'DF9A',
 '11111111-1111-1111-1111-111111111111',
 9,
 'Introduction to AI and digital skills using Microsoft 365'),

-- Mr. Johnson's Year 10 GCSE Computer Science class
('66666666-6666-6666-6666-666666666662',
 'Year 10 GCSE Computer Science',
 'GCSE10',
 '22222222-2222-2222-2222-222222222222',
 10,
 'OCR J277 GCSE Computer Science preparation'),

-- Dr. Smith's Year 12 A-Level Computer Science class
('66666666-6666-6666-6666-666666666663',
 'Year 12 A-Level Computer Science',
 'ALEVEL12',
 '33333333-3333-3333-3333-333333333333',
 12,
 'OCR H446 A-Level Computer Science - First year')
ON CONFLICT (id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- ENROLL STUDENTS IN CLASSES
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO class_students (class_id, student_id) VALUES
-- Year 9 Digital Futures class
('66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555551'),
('66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555552'),
('66666666-6666-6666-6666-666666666661', '55555555-5555-5555-5555-555555555553'),
-- Year 10 GCSE class
('66666666-6666-6666-6666-666666666662', '55555555-5555-5555-5555-555555555554'),
('66666666-6666-6666-6666-666666666662', '55555555-5555-5555-5555-555555555555'),
('66666666-6666-6666-6666-666666666662', '55555555-5555-5555-5555-555555555556'),
-- Year 12 A-Level class
('66666666-6666-6666-6666-666666666663', '55555555-5555-5555-5555-555555555557'),
('66666666-6666-6666-6666-666666666663', '55555555-5555-5555-5555-555555555558'),
('66666666-6666-6666-6666-666666666663', '55555555-5555-5555-5555-555555555559'),
('66666666-6666-6666-6666-666666666663', '55555555-5555-5555-5555-555555555560')
ON CONFLICT (class_id, student_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- GRANT COURSE ACCESS
-- ═══════════════════════════════════════════════════════════════════════

-- Year 9 students get Digital Futures access
INSERT INTO student_course_access (student_id, course_id, granted_by) VALUES
('55555555-5555-5555-5555-555555555551', 'digital-futures', '11111111-1111-1111-1111-111111111111'),
('55555555-5555-5555-5555-555555555552', 'digital-futures', '11111111-1111-1111-1111-111111111111'),
('55555555-5555-5555-5555-555555555553', 'digital-futures', '11111111-1111-1111-1111-111111111111'),
-- Year 10 students get OCR GCSE access
('55555555-5555-5555-5555-555555555554', 'ocr-gcse', '22222222-2222-2222-2222-222222222222'),
('55555555-5555-5555-5555-555555555555', 'ocr-gcse', '22222222-2222-2222-2222-222222222222'),
('55555555-5555-5555-5555-555555555556', 'ocr-gcse', '22222222-2222-2222-2222-222222222222'),
-- Year 12 students get OCR A-Level access
('55555555-5555-5555-5555-555555555557', 'ocr-alevel', '33333333-3333-3333-3333-333333333333'),
('55555555-5555-5555-5555-555555555558', 'ocr-alevel', '33333333-3333-3333-3333-333333333333'),
('55555555-5555-5555-5555-555555555559', 'ocr-alevel', '33333333-3333-3333-3333-333333333333'),
('55555555-5555-5555-5555-555555555560', 'ocr-alevel', '33333333-3333-3333-3333-333333333333')
ON CONFLICT (student_id, course_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- SAMPLE PROGRESS RECORDS
-- ═══════════════════════════════════════════════════════════════════════

INSERT INTO student_progress (student_id, course_id, lessons_completed, quizzes_taken, avg_quiz_score) VALUES
-- Year 9 - Digital Futures progress
('55555555-5555-5555-5555-555555555551', 'digital-futures', 5, 3, 85.50),
('55555555-5555-5555-5555-555555555552', 'digital-futures', 3, 2, 78.00),
('55555555-5555-5555-5555-555555555553', 'digital-futures', 8, 6, 92.33),
-- Year 10 - GCSE progress
('55555555-5555-5555-5555-555555555554', 'ocr-gcse', 12, 8, 81.25),
('55555555-5555-5555-5555-555555555555', 'ocr-gcse', 15, 10, 88.40),
('55555555-5555-5555-5555-555555555556', 'ocr-gcse', 10, 6, 75.67),
-- Year 12 - A-Level progress
('55555555-5555-5555-5555-555555555557', 'ocr-alevel', 8, 5, 79.80),
('55555555-5555-5555-5555-555555555558', 'ocr-alevel', 12, 8, 85.50),
('55555555-5555-5555-5555-555555555559', 'ocr-alevel', 6, 3, 72.33),
('55555555-5555-5555-5555-555555555560', 'ocr-alevel', 10, 7, 91.14)
ON CONFLICT (student_id, course_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════
-- DONE!
-- ═══════════════════════════════════════════════════════════════════════
-- Sample data is now ready. You can log in with any of these accounts.
--
-- STUDENT TEST ACCOUNTS:
-- Email: aisha.patel@student.kingswood.edu (Year 9 - Digital Futures)
-- Email: david.brown@student.kingswood.edu (Year 10 - GCSE)
-- Email: george.miller@student.kingswood.edu (Year 12 - A-Level)
--
-- TEACHER TEST ACCOUNTS:
-- Email: ms.taylor@kingswood.edu (Year 9 Teacher)
-- Email: mr.johnson@kingswood.edu (Year 10 Teacher)
-- Email: dr.smith@kingswood.edu (Year 12 Teacher)
--
-- Note: You'll need to set up authentication to log in.
-- For now, you can test via Supabase Dashboard > Authentication
