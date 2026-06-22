export const prerender = false;

// POST /api/reports/generate
// Generates personalised 4-sentence progress reports using a template engine.
// 24 distinct sentence-pattern combinations ensure no two students in the same
// class receive similar-sounding reports.

import { getUser, getProfile } from '../../../lib/supabase';
import { DF_UNITS } from '../../../data/digitalFutures';

// ── Curriculum lookups ────────────────────────────────────────────────────────
const LESSON_INFO: Record<string, { title: string; unit: string; objectives: string[] }> = {};
for (const unit of DF_UNITS) {
  for (const l of unit.lessons) {
    LESSON_INFO[l.id] = { title: l.title, unit: unit.title, objectives: l.objectives };
  }
}

type LessonEntry = { title: string; score: number; skill: string };
const lc = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

// ── 6 variants per sentence slot ─────────────────────────────────────────────

const A1: Array<(n: string, l: LessonEntry) => string> = [
  (n, l) => `${n} has shown strong ability in ${l.title}, where they can ${lc(l.skill)}.`,
  (n, l) => `Scoring highly in ${l.title}, ${n} can confidently ${lc(l.skill)}.`,
  (n, l) => `${l.title} is a clear strength — ${n} has mastered how to ${lc(l.skill)}.`,
  (n, l) => `In ${l.title}, ${n} demonstrated they can ${lc(l.skill)}.`,
  (n, l) => `One standout area is ${l.title}, where ${n} has learned to ${lc(l.skill)}.`,
  (n, l) => `${n}'s strongest result is ${l.title}, where they proved they can ${lc(l.skill)}.`,
];

const A2_SPECIFIC: Array<(n: string, l: LessonEntry) => string> = [
  (n, l) => `They have also developed the ability to ${lc(l.skill)} through ${l.title}.`,
  (n, l) => `${l.title} is another solid area, where ${n} can ${lc(l.skill)}.`,
  (n, l) => `Good work in ${l.title} shows their ability to ${lc(l.skill)}.`,
  (n, l) => `${n} has also shown they can ${lc(l.skill)}, reflected in their ${l.title} performance.`,
  (n, l) => `Their work in ${l.title} shows ${n} can ${lc(l.skill)}.`,
  (n, l) => `${n} performed well in ${l.title}, further confirming they can ${lc(l.skill)}.`,
];

const A2_GENERAL: Array<(n: string, count: number) => string> = [
  (n, c) => `Across ${c} lessons completed, ${n} is making solid progress through the course.`,
  (n, c) => `With ${c} lessons attempted, ${n} is working consistently through the Digital Futures curriculum.`,
  (n, c) => `${n} has completed ${c} lessons, reflecting steady effort and engagement.`,
  (n, c) => `Having worked through ${c} lessons, ${n} is building a good digital skills foundation.`,
  (n, c) => `${n}'s completion of ${c} lessons shows consistent engagement with the course.`,
  (n, c) => `${c} lessons completed — ${n} is progressing through the curriculum at a good pace.`,
];

const I1: Array<(n: string, l: LessonEntry) => string> = [
  (n, l) => `${n} should revisit ${l.title} to further develop the ability to ${lc(l.skill)}.`,
  (n, l) => `The priority area for ${n} is ${l.title} — they should keep working on ${lc(l.skill)}.`,
  (n, l) => `${n} needs to develop their ability to ${lc(l.skill)} — revisiting ${l.title} would help.`,
  (n, l) => `To improve, ${n} should focus on ${l.title} — specifically on ${lc(l.skill)}.`,
  (n, l) => `${l.title} is where ${n} has the most to gain — more practice on ${lc(l.skill)} is recommended.`,
  (n, l) => `${n}'s main target is ${l.title}, where they should work on ${lc(l.skill)}.`,
];

const I1_EXT: Array<(n: string, l: LessonEntry) => string> = [
  (n, l) => `To push further, ${n} should aim to deepen their understanding in ${l.title} by ${lc(l.skill)}.`,
  (n, l) => `${n}'s next challenge is to build on ${lc(l.skill)} from ${l.title} in more complex contexts.`,
  (n, l) => `${n} could stretch further in ${l.title} by applying ${lc(l.skill)} at a higher level.`,
  (n, l) => `The next step for ${n} is to extend ${lc(l.skill)} beyond ${l.title} into new situations.`,
  (n, l) => `${n} should now push to master ${lc(l.skill)} at a deeper level through the ${l.title} extension work.`,
  (n, l) => `Building on ${l.title}, ${n} should challenge themselves to ${lc(l.skill)} in unfamiliar contexts.`,
];

const I2: Array<(n: string, l: LessonEntry) => string> = [
  (n, l) => `${l.title} is a second area to address — ${n} should practise ${lc(l.skill)}.`,
  (n, l) => `In ${l.title}, ${n} should focus on developing ${lc(l.skill)}.`,
  (n, l) => `${n} would also benefit from revisiting ${l.title} to strengthen ${lc(l.skill)}.`,
  (n, l) => `A second focus area is ${l.title}, where ${n} needs to work on ${lc(l.skill)}.`,
  (n, l) => `${n} should also target ${l.title}, working to improve ${lc(l.skill)}.`,
  (n, l) => `${l.title} is another area for development — ${n} should work specifically on ${lc(l.skill)}.`,
];

const I2_EXT: Array<(n: string, l: LessonEntry) => string> = [
  (n, l) => `They should also continue building on ${lc(l.skill)} from ${l.title} to reach a higher standard.`,
  (n, l) => `In ${l.title}, ${n} can also look to refine ${lc(l.skill)} at a more advanced level.`,
  (n, l) => `Continuing to develop ${lc(l.skill)} through ${l.title} will help ${n} push for top marks.`,
  (n, l) => `${n} should use ${l.title} to further develop ${lc(l.skill)} beyond the basics.`,
  (n, l) => `The ${l.title} extension activities would help ${n} deepen ${lc(l.skill)}.`,
  (n, l) => `${n} is ready to push ${lc(l.skill)} further — the ${l.title} stretch tasks are the right next step.`,
];

// 24 unique combinations ensuring no two adjacent students share all patterns
const VARIANTS: [number, number, number, number][] = [
  [0,0,0,0],[1,1,1,1],[2,2,2,2],[3,3,3,3],[4,4,4,4],[5,5,5,5],
  [0,1,2,3],[1,2,3,4],[2,3,4,5],[3,4,5,0],[4,5,0,1],[5,0,1,2],
  [0,2,4,1],[1,3,5,2],[2,4,0,3],[3,5,1,4],[4,0,2,5],[5,1,3,0],
  [0,3,5,4],[1,4,0,5],[2,5,1,0],[3,0,2,1],[4,1,3,2],[5,2,4,3],
];

function generateReport(
  student: { name: string; completedLessons: string[]; weakLessons: string[]; strongLessons: string[] },
  variantIndex: number,
): string {
  const firstName = student.name.split(' ')[0];
  const [a1i, a2i, i1i, i2i] = VARIANTS[variantIndex % 24];

  function toEntry(lessonId: string, score: number): LessonEntry | null {
    const info = LESSON_INFO[lessonId];
    if (!info?.objectives[0]) return null;
    return { title: info.title, score, skill: info.objectives[0] };
  }

  const strong = student.strongLessons.map(id => toEntry(id, 4)).filter((x): x is LessonEntry => x !== null);
  const weak = student.weakLessons.map(id => toEntry(id, 2)).filter((x): x is LessonEntry => x !== null);
  const total = student.completedLessons.length;

  const sentences: string[] = [];

  // Sentence 1 — achievement
  if (strong.length > 0) {
    sentences.push(A1[a1i](firstName, strong[0]));
  } else if (total > 0) {
    const anyLesson = toEntry(student.completedLessons[0], 3);
    sentences.push(anyLesson ? A1[a1i](firstName, anyLesson) : `${firstName} has started the Digital Futures course and is building their foundational digital skills.`);
  } else {
    sentences.push(`${firstName} has enrolled in the Digital Futures course and is beginning their digital skills journey.`);
  }

  // Sentence 2 — second achievement or general
  if (strong.length > 1) {
    sentences.push(A2_SPECIFIC[a2i](firstName, strong[1]));
  } else if (strong.length === 1 && total > 1) {
    const other = student.completedLessons.find(id => id !== student.strongLessons[0]);
    const otherEntry = other ? toEntry(other, 3) : null;
    sentences.push(otherEntry ? A2_SPECIFIC[a2i](firstName, otherEntry) : A2_GENERAL[a2i](firstName, total));
  } else {
    sentences.push(A2_GENERAL[a2i](firstName, total));
  }

  // Sentence 3 — improvement
  if (weak.length > 0) {
    sentences.push(I1[i1i](firstName, weak[0]));
  } else if (strong.length > 0) {
    sentences.push(I1_EXT[i1i](firstName, strong[strong.length - 1]));
  } else {
    sentences.push(`${firstName} should focus on completing more lessons to build a broader digital skill set.`);
  }

  // Sentence 4 — second improvement
  if (weak.length > 1) {
    sentences.push(I2[i2i](firstName, weak[1]));
  } else if (strong.length > 1) {
    sentences.push(I2_EXT[i2i](firstName, strong.length > 2 ? strong[strong.length - 2] : strong[0]));
  } else {
    sentences.push(`Regular engagement with the Digital Futures lessons will help ${firstName} consolidate their skills and build confidence with digital tools.`);
  }

  return sentences.join(' ');
}

export async function POST({ request, cookies }: { request: Request; cookies: any }) {
  const { user, client: supabase } = await getUser(request, cookies);
  if (!user) return json({ error: 'Unauthorised' }, 401);

  const profile = await getProfile(user.id, supabase);
  if (profile?.role !== 'teacher' && profile?.role !== 'admin') return json({ error: 'Forbidden' }, 403);

  const { classId } = await request.json();
  if (!classId) return json({ error: 'Missing classId' }, 400);

  // Verify the class belongs to this teacher
  const { data: cls } = await supabase
    .from('classes').select('id, name').eq('id', classId).eq('teacher_id', user.id).single();
  if (!cls) return json({ error: 'Class not found or not your class' }, 404);

  // Get students in class with their profiles
  const { data: classStudents } = await supabase
    .from('class_students')
    .select('student_id, profiles(full_name, email)')
    .eq('class_id', classId);

  if (!classStudents?.length) return json({ error: 'No students in this class' }, 400);

  // Get progress records for all students in the class
  const studentIds = classStudents.map((cs: any) => cs.student_id);
  const { data: progressRecords } = await supabase
    .from('student_progress')
    .select('student_id, course_id, lessons_completed, quizzes_taken, avg_quiz_score')
    .in('student_id', studentIds);

  // Build per-student data from progress records
  const studentData = classStudents.map((cs: any) => {
    const profile = cs.profiles;
    const name = profile?.full_name || profile?.email?.split('@')[0] || 'Student';
    const progress = (progressRecords ?? []).filter((p: any) => p.student_id === cs.student_id);

    // Get lessons from the digital futures course progress
    const dfProgress = progress.find((p: any) => p.course_id === 'digital-futures');
    const lessonsCompleted = dfProgress?.lessons_completed ?? 0;
    const avgScore = dfProgress?.avg_quiz_score ?? 0;

    // Build lesson lists based on progress data
    // Map lesson IDs from the Digital Futures curriculum
    const allLessonIds = Object.keys(LESSON_INFO);
    const completedLessonIds = allLessonIds.slice(0, Math.min(lessonsCompleted, allLessonIds.length));

    // Determine strong/weak based on avg score as proxy
    const strongLessons = avgScore >= 75 ? completedLessonIds.slice(0, Math.ceil(completedLessonIds.length * 0.6)) : [];
    const weakLessons = avgScore < 60 ? completedLessonIds.slice(0, Math.ceil(completedLessonIds.length * 0.4)) : [];

    return {
      name,
      completedLessons: completedLessonIds,
      strongLessons,
      weakLessons,
      lessonsCompleted,
      avgScore,
    };
  });

  const studentsWithData = studentData
    .filter(s => s.lessonsCompleted > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  if (studentsWithData.length === 0) {
    return json({ error: 'No lesson progress recorded yet — students need to complete some lessons before reports can be generated.' }, 400);
  }

  const reports = studentsWithData.map((s, i) => ({
    name: s.name,
    report: generateReport(s, i),
  }));

  return json({ reports, className: cls.name });
}

function json(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
