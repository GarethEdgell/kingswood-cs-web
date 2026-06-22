#!/usr/bin/env node

/**
 * Supabase Sample Data Seeder
 * Creates users, profiles, classes, and sample data
 *
 * Usage:
 *   node scripts/seed-sample-data.js
 *
 * Requires environment variables:
 *   SUPABASE_URL: Your Supabase project URL
 *   SUPABASE_SERVICE_KEY: Your Supabase service role key (from Settings > API)
 */

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Missing environment variables');
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_KEY');
  process.exit(1);
}

// Initialize Supabase Admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Sample data
const TEACHERS = [
  { email: 'ms.taylor@kingswood.edu', name: 'Ms. Emma Taylor', password: 'Teacher123!' },
  { email: 'mr.johnson@kingswood.edu', name: 'Mr. David Johnson', password: 'Teacher123!' },
  { email: 'dr.smith@kingswood.edu', name: 'Dr. Sarah Smith', password: 'Teacher123!' },
];

const STUDENTS = [
  { email: 'aisha.patel@student.kingswood.edu', name: 'Aisha Patel', year: 9 },
  { email: 'ben.chen@student.kingswood.edu', name: 'Ben Chen', year: 9 },
  { email: 'clara.williams@student.kingswood.edu', name: 'Clara Williams', year: 9 },
  { email: 'david.brown@student.kingswood.edu', name: 'David Brown', year: 10 },
  { email: 'emma.garcia@student.kingswood.edu', name: 'Emma Garcia', year: 10 },
  { email: 'farah.khan@student.kingswood.edu', name: 'Farah Khan', year: 10 },
  { email: 'george.miller@student.kingswood.edu', name: 'George Miller', year: 12 },
  { email: 'hannah.jones@student.kingswood.edu', name: 'Hannah Jones', year: 12 },
  { email: 'isaac.lee@student.kingswood.edu', name: 'Isaac Lee', year: 12 },
  { email: 'julia.martin@student.kingswood.edu', name: 'Julia Martin', year: 12 },
];

async function seedData() {
  console.log('🌱 Starting Supabase sample data seed...\n');

  try {
    // Create teachers
    console.log('👨‍🏫 Creating teacher accounts...');
    const teacherIds = {};
    for (const teacher of TEACHERS) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: teacher.email,
        password: teacher.password,
        email_confirm: true,
      });

      if (error) {
        console.warn(`   ⚠️  ${teacher.email}: ${error.message}`);
        continue;
      }

      teacherIds[teacher.email] = data.user.id;

      // Create profile
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: teacher.email,
        full_name: teacher.name,
        role: 'teacher',
      });

      console.log(`   ✅ ${teacher.email} (ID: ${data.user.id})`);
    }

    // Create students
    console.log('\n👨‍🎓 Creating student accounts...');
    const studentIds = {};
    for (const student of STUDENTS) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: student.email,
        password: 'Student123!',
        email_confirm: true,
      });

      if (error) {
        console.warn(`   ⚠️  ${student.email}: ${error.message}`);
        continue;
      }

      studentIds[student.email] = { id: data.user.id, year: student.year };

      // Create profile
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: student.email,
        full_name: student.name,
        role: 'student',
      });

      console.log(`   ✅ ${student.email} (Year ${student.year})`);
    }

    // Create classes
    console.log('\n🏫 Creating classes...');
    const teacherEmails = Object.keys(teacherIds);

    const classes = [
      {
        name: 'Year 9 Digital Futures - Group A',
        code: 'DF9A',
        teacher_email: teacherEmails[0],
        year_group: 9,
        description: 'Introduction to AI and digital skills using Microsoft 365',
        course: 'digital-futures',
        students: [
          'aisha.patel@student.kingswood.edu',
          'ben.chen@student.kingswood.edu',
          'clara.williams@student.kingswood.edu',
        ],
      },
      {
        name: 'Year 10 GCSE Computer Science',
        code: 'GCSE10',
        teacher_email: teacherEmails[1],
        year_group: 10,
        description: 'OCR J277 GCSE Computer Science preparation',
        course: 'ocr-gcse',
        students: [
          'david.brown@student.kingswood.edu',
          'emma.garcia@student.kingswood.edu',
          'farah.khan@student.kingswood.edu',
        ],
      },
      {
        name: 'Year 12 A-Level Computer Science',
        code: 'ALEVEL12',
        teacher_email: teacherEmails[2],
        year_group: 12,
        description: 'OCR H446 A-Level Computer Science - First year',
        course: 'ocr-alevel',
        students: [
          'george.miller@student.kingswood.edu',
          'hannah.jones@student.kingswood.edu',
          'isaac.lee@student.kingswood.edu',
          'julia.martin@student.kingswood.edu',
        ],
      },
    ];

    const classIds = {};

    for (const classData of classes) {
      const { data, error } = await supabase.from('classes').insert({
        name: classData.name,
        code: classData.code,
        teacher_id: teacherIds[classData.teacher_email],
        year_group: classData.year_group,
        description: classData.description,
      }).select();

      if (error) {
        console.warn(`   ⚠️  ${classData.name}: ${error.message}`);
        continue;
      }

      classIds[classData.code] = data[0].id;
      console.log(`   ✅ ${classData.name} (Code: ${classData.code})`);

      // Enroll students
      for (const studentEmail of classData.students) {
        const studentId = studentIds[studentEmail]?.id;
        if (studentId) {
          await supabase.from('class_students').insert({
            class_id: data[0].id,
            student_id: studentId,
          });

          // Grant course access
          await supabase.from('student_course_access').insert({
            student_id: studentId,
            course_id: classData.course,
            granted_by: teacherIds[classData.teacher_email],
          }).on('CONFLICT', () => {
            // Ignore if already exists
          });
        }
      }
    }

    // Add sample progress
    console.log('\n📊 Adding sample progress records...');
    const progressData = [
      { email: 'aisha.patel@student.kingswood.edu', course: 'digital-futures', lessons: 5, quizzes: 3, score: 85.50 },
      { email: 'ben.chen@student.kingswood.edu', course: 'digital-futures', lessons: 3, quizzes: 2, score: 78.00 },
      { email: 'clara.williams@student.kingswood.edu', course: 'digital-futures', lessons: 8, quizzes: 6, score: 92.33 },
      { email: 'david.brown@student.kingswood.edu', course: 'ocr-gcse', lessons: 12, quizzes: 8, score: 81.25 },
      { email: 'emma.garcia@student.kingswood.edu', course: 'ocr-gcse', lessons: 15, quizzes: 10, score: 88.40 },
      { email: 'farah.khan@student.kingswood.edu', course: 'ocr-gcse', lessons: 10, quizzes: 6, score: 75.67 },
      { email: 'george.miller@student.kingswood.edu', course: 'ocr-alevel', lessons: 8, quizzes: 5, score: 79.80 },
      { email: 'hannah.jones@student.kingswood.edu', course: 'ocr-alevel', lessons: 12, quizzes: 8, score: 85.50 },
      { email: 'isaac.lee@student.kingswood.edu', course: 'ocr-alevel', lessons: 6, quizzes: 3, score: 72.33 },
      { email: 'julia.martin@student.kingswood.edu', course: 'ocr-alevel', lessons: 10, quizzes: 7, score: 91.14 },
    ];

    for (const progress of progressData) {
      const studentId = studentIds[progress.email]?.id;
      if (studentId) {
        await supabase.from('student_progress').insert({
          student_id: studentId,
          course_id: progress.course,
          lessons_completed: progress.lessons,
          quizzes_taken: progress.quizzes,
          avg_quiz_score: progress.score,
        });
        console.log(`   ✅ ${progress.email}`);
      }
    }

    console.log('\n✨ Sample data seeding complete!\n');
    console.log('📋 TEST ACCOUNTS:');
    console.log('\n👨‍🏫 Teachers:');
    TEACHERS.forEach(t => console.log(`   ${t.email} / Teacher123!`));
    console.log('\n👨‍🎓 Students:');
    STUDENTS.forEach(s => console.log(`   ${s.email} / Student123! (Year ${s.year})`));
    console.log('\n🚀 You can now log in at: https://kingswoodcomputerscience.com/login');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seedData();
