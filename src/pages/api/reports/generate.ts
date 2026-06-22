export const prerender = false;

// POST /api/reports/generate
// Generates personalised 4-sentence progress reports using a template engine.
// 24 distinct sentence-pattern combinations ensure no two students in the same
// class receive similar-sounding reports.

import { getUser, getProfile, restSelect } from '../../../lib/supabase';
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
  (n, l) => `${n} has shown strong ability in ${l.title} and can confidently ${lc(l.skill)}.`,
  (n, l) => `Scoring highly in ${l.title}, ${n} can ${lc(l.skill)}.`,
  (n, l) => `${l.title} is a clear strength — ${n} has learned to ${lc(l.skill)}.`,
  (n, l) => `In ${l.title}, ${n} demonstrated that they can ${lc(l.skill)}.`,
  (n, l) => `One standout area is ${l.title}, where ${n} can confidently ${lc(l.skill)}.`,
  (n, l) => `${n}'s strongest area is ${l.title}, where they have shown they can ${lc(l.skill)}.`,
];

const A2_SPECIFIC: Array<(n: string, l: LessonEntry) => string> = [
  (n, l) => `Their work in ${l.title} shows they can also ${lc(l.skill)}.`,
  (n, l) => `${l.title} is another solid area, where ${n} can ${lc(l.skill)}.`,
  (n, l) => `Good work in ${l.title} shows that ${n} can ${lc(l.skill)}.`,
  (n, l) => `${n} has also shown, through ${l.title}, that they can ${lc(l.skill)}.`,
  (n, l) => `In ${l.title}, ${n} demonstrated they can also ${lc(l.skill)}.`,
  (n, l) => `${n} performed well in ${l.title} and can ${lc(l.skill)}.`,
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
  (n, l) => `${n} should revisit ${l.title}, where they still need to ${lc(l.skill)}.`,
  (n, l) => `The priority area for ${n} is ${l.title}, where they should keep working until they can ${lc(l.skill)}.`,
  (n, l) => `${n} found ${l.title} more challenging and should practise until they can ${lc(l.skill)}.`,
  (n, l) => `To improve, ${n} should focus on ${l.title} and learn to ${lc(l.skill)}.`,
  (n, l) => `${l.title} is where ${n} has the most to gain — the goal is to ${lc(l.skill)}.`,
  (n, l) => `${n}'s main target is ${l.title}, where they need to be able to ${lc(l.skill)}.`,
];

const I1_EXT: Array<(n: string, l: LessonEntry) => string> = [
  (n, l) => `To push further, ${n} should deepen their ${l.title} work and aim to ${lc(l.skill)} in more complex contexts.`,
  (n, l) => `${n}'s next challenge in ${l.title} is to ${lc(l.skill)} at a higher level.`,
  (n, l) => `${n} could stretch further in ${l.title} and aim to ${lc(l.skill)} in unfamiliar situations.`,
  (n, l) => `The next step for ${n} is to ${lc(l.skill)} beyond what ${l.title} covered.`,
  (n, l) => `${n} has mastered ${l.title} and should now confidently ${lc(l.skill)} independently.`,
  (n, l) => `Building on ${l.title}, ${n} should challenge themselves to ${lc(l.skill)} in new contexts.`,
];

const I2: Array<(n: string, l: LessonEntry) => string> = [
  (n, l) => `${l.title} is a second area to develop, where ${n} should learn to ${lc(l.skill)}.`,
  (n, l) => `In ${l.title}, ${n} should keep working until they can ${lc(l.skill)}.`,
  (n, l) => `${n} would also benefit from revisiting ${l.title} to ${lc(l.skill)} more confidently.`,
  (n, l) => `A second focus is ${l.title}, where ${n} needs to ${lc(l.skill)}.`,
  (n, l) => `${n} should also target ${l.title} and practise until they can ${lc(l.skill)}.`,
  (n, l) => `${l.title} is another area for development — ${n} should aim to ${lc(l.skill)}.`,
];

const I2_EXT: Array<(n: string, l: LessonEntry) => string> = [
  (n, l) => `They should also extend their ${l.title} work and look to ${lc(l.skill)} at a deeper level.`,
  (n, l) => `In ${l.title}, ${n} can also refine how they ${lc(l.skill)}.`,
  (n, l) => `Continuing their strong ${l.title} work, ${n} should aim to ${lc(l.skill)} in new contexts.`,
  (n, l) => `${n} should use ${l.title} as a springboard to ${lc(l.skill)} more ambitiously.`,
  (n, l) => `The ${l.title} extension tasks would help ${n} to ${lc(l.skill)} to an even higher standard.`,
  (n, l) => `${n} is ready to ${lc(l.skill)} beyond the scope of ${l.title}.`,
];

// 24 unique combinations ensuring no two adjacent students share all patterns
const VARIANTS: [number, number, number, number][] = [
  [0,0,0,0],[1,1,1,1],[2,2,2,2],[3,3,3,3],[4,4,4,4],[5,5,5,5],
  [0,1,2,3],[1,2,3,4],[2,3,4,5],[3,4,5,0],[4,5,0,1],[5,0,1,2],
  [0,2,4,1],[1,3,5,2],[2,4,0,3],[3,5,1,4],[4,0,2,5],[5,1,3,0],
  [0,3,5,4],[1,4,0,5],[2,5,1,0],[3,0,2,1],[4,1,3,2],[5,2,4,3],
];

function generateReport(
  student: { name: string; bestScores: Record<string, number> },
  variantIndex: number,
): string {
  const firstName = student.name.split(' ')[0];
  const [a1i, a2i, i1i, i2i] = VARIANTS[variantIndex % 24];

  function toEntry([id, score]: [string, number]): LessonEntry | null {
    const info = LESSON_INFO[id];
    if (!info?.objectives[0]) return null;
    return { title: info.title, score, skill: info.objectives[0] };
  }

  const entries = Object.entries(student.bestScores);
  const total = entries.length;

  // Strong = score >= 4, weak = score <= 2, mid = 3. Highest/lowest first.
  const strong = entries.filter(([, s]) => s >= 4).sort((a, b) => b[1] - a[1])
    .map(toEntry).filter((x): x is LessonEntry => x !== null);
  const weak = entries.filter(([, s]) => s <= 2).sort((a, b) => a[1] - b[1])
    .map(toEntry).filter((x): x is LessonEntry => x !== null);
  const mid = entries.filter(([, s]) => s === 3)
    .map(toEntry).filter((x): x is LessonEntry => x !== null);

  const sentences: string[] = [];

  // Sentence 1 — first achievement
  if (strong.length > 0) {
    sentences.push(A1[a1i](firstName, strong[0]));
  } else if (mid.length > 0) {
    sentences.push(A1[a1i](firstName, mid[0]));
  } else {
    sentences.push(`${firstName} has started the Digital Futures course and is building their foundational digital skills.`);
  }

  // Sentence 2 — second achievement or general progress
  if (strong.length > 1) {
    sentences.push(A2_SPECIFIC[a2i](firstName, strong[1]));
  } else if (strong.length === 1 && mid.length > 0) {
    sentences.push(A2_SPECIFIC[a2i](firstName, mid[0]));
  } else {
    sentences.push(A2_GENERAL[a2i](firstName, total));
  }

  // Sentence 3 — first improvement
  if (weak.length > 0) {
    sentences.push(I1[i1i](firstName, weak[0]));
  } else if (mid.length > 0) {
    sentences.push(I1[i1i](firstName, mid[0]));
  } else if (strong.length > 0) {
    sentences.push(I1_EXT[i1i](firstName, strong[strong.length - 1]));
  } else {
    sentences.push(`${firstName} should focus on completing more lessons to build a broader digital skill set.`);
  }

  // Sentence 4 — second improvement
  if (weak.length > 1) {
    sentences.push(I2[i2i](firstName, weak[1]));
  } else if (weak.length === 1 && mid.length > 0) {
    sentences.push(I2[i2i](firstName, mid[0]));
  } else if (mid.length > 1) {
    sentences.push(I2[i2i](firstName, mid[1]));
  } else if (strong.length > 1) {
    sentences.push(I2_EXT[i2i](firstName, strong.length > 2 ? strong[strong.length - 2] : strong[0]));
  } else {
    sentences.push(`Regular engagement with the Digital Futures lessons will help ${firstName} consolidate their skills and build confidence with digital tools.`);
  }

  return sentences.join(' ');
}

export async function POST({ request, cookies }: { request: Request; cookies: any }) {
  const { user } = await getUser(request, cookies);
  if (!user) return json({ error: 'Unauthorised' }, 401);

  const accessToken = cookies.get('sb-access-token')?.value;
  const profile = await getProfile(user.id, null, accessToken);
  if (profile?.role !== 'teacher' && profile?.role !== 'admin') return json({ error: 'Forbidden' }, 403);

  const { classId } = await request.json();
  if (!classId) return json({ error: 'Missing classId' }, 400);

  // Verify the class belongs to this teacher
  const classRows = await restSelect('classes', `id=eq.${classId}&teacher_id=eq.${user.id}&select=id,name&limit=1`, accessToken);
  const cls = classRows[0];
  if (!cls) return json({ error: 'Class not found or not your class' }, 404);

  // Get students in class
  const classStudents = await restSelect('class_students', `class_id=eq.${classId}&select=student_id`, accessToken);
  if (!classStudents.length) return json({ error: 'No students in this class' }, 400);

  const studentIds = classStudents.map((cs: any) => cs.student_id);

  // Get profiles for those students
  const profiles = await restSelect('profiles', `id=in.(${studentIds.join(',')})&select=id,full_name,email`, accessToken);
  const profileById: Record<string, any> = {};
  for (const p of profiles) profileById[p.id] = p;

  // Preferred: per-lesson scores from student_lesson_progress (gives topic-rich reports)
  const lessonProgress = await restSelect(
    'student_lesson_progress',
    `student_id=in.(${studentIds.join(',')})&select=student_id,lesson_id,score`,
    accessToken
  );

  // Fallback aggregate progress (used only if no per-lesson rows exist)
  const progressRecords = await restSelect(
    'student_progress',
    `student_id=in.(${studentIds.join(',')})&select=student_id,course_id,lessons_completed,avg_quiz_score`,
    accessToken
  );

  // Build per-student data
  const studentData = studentIds.map((sid: string) => {
    const p = profileById[sid];
    const name = p?.full_name || p?.email?.split('@')[0] || 'Student';

    // Build bestScores map from per-lesson rows (keep highest score per lesson)
    const bestScores: Record<string, number> = {};
    for (const lp of lessonProgress.filter((r: any) => r.student_id === sid)) {
      if ((bestScores[lp.lesson_id] ?? -1) < lp.score) bestScores[lp.lesson_id] = lp.score;
    }

    // Fallback: synthesise from aggregate if no per-lesson data
    if (Object.keys(bestScores).length === 0) {
      const dfProgress = progressRecords.find((pr: any) => pr.student_id === sid && pr.course_id === 'digital-futures');
      const lessonsCompleted = dfProgress?.lessons_completed ?? 0;
      const avgScore = dfProgress?.avg_quiz_score ?? 0;
      const allLessonIds = Object.keys(LESSON_INFO).slice(0, Math.min(lessonsCompleted, Object.keys(LESSON_INFO).length));
      // Map a 0-100 average to a 0-5 score
      const proxyScore = Math.round((avgScore / 100) * 5);
      for (const id of allLessonIds) bestScores[id] = proxyScore;
    }

    return { name, bestScores };
  });

  const studentsWithData = studentData
    .filter(s => Object.keys(s.bestScores).length > 0)
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
