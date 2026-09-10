#!/usr/bin/env node
/**
 * seed-school.mjs — create anonymised student accounts + master teachers.
 *
 * Creates:
 *   • 5 master teacher accounts (role: admin — can see every class + reset passwords)
 *   • 7 classes (9A…9G, codes ic1…ic7)
 *   • 28 anonymised student accounts per class (usernames ic1-1 … ic7-28)
 *
 * Each student's login is JUST a username (class code + number). No name, no
 * real email is stored. The synthetic email is only an internal identifier.
 *
 * Credentials are written to credentials/*.csv for you to print and hand out.
 *
 * RUN (PowerShell):
 *   $env:SUPABASE_URL="https://fwudtosslyvtzqxztohl.supabase.co"
 *   $env:SUPABASE_SERVICE_KEY="<service_role key from Supabase > Settings > API>"
 *   node scripts/seed-school.mjs
 *
 * Safe to re-run: existing accounts are skipped (their passwords are NOT changed).
 * Use scripts/reset-passwords.mjs (or the teacher UI) to rotate passwords.
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { randomInt } from 'node:crypto';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;
const EMAIL_DOMAIN = 'students.kingswoodcomputerscience.com';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables first.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Config ───────────────────────────────────────────────────────────────
const CLASSES = [
  // Year 9
  { name: '9A', code: 'ic1', year: 9 },
  { name: '9B', code: 'ic2', year: 9 },
  { name: '9C', code: 'ic3', year: 9 },
  { name: '9D', code: 'ic4', year: 9 },
  { name: '9E', code: 'ic5', year: 9 },
  { name: '9F', code: 'ic6', year: 9 },
  { name: '9G', code: 'ic7', year: 9 },
  // Year 8
  { name: '8A', code: 'ic8', year: 8 },
  { name: '8B', code: 'ic9', year: 8 },
  { name: '8C', code: 'ic10', year: 8 },
  { name: '8D', code: 'ic11', year: 8 },
  { name: '8E', code: 'ic12', year: 8 },
  { name: '8F', code: 'ic13', year: 8 },
];
const STUDENTS_PER_CLASS = 28;
const TEACHER_COUNT = 5;

// ── Password generator — readable but not guessable ──────────────────────
const WORDS = ['tiger','comet','maple','pixel','robot','delta','amber','quartz','falcon','cobalt',
  'willow','ember','orbit','cedar','vortex','lunar','onyx','breeze','flint','harbor',
  'jasper','mango','nebula','opal','pepper','raven','sienna','topaz','umber','zephyr'];
function makePassword() {
  const w = WORDS[randomInt(WORDS.length)];
  const n = randomInt(10, 99);
  return `${w.charAt(0).toUpperCase()}${w.slice(1)}${n}`;   // e.g. Tiger57
}

async function findUserByEmail(email) {
  // Paginate through users to find a match (admin API has no direct get-by-email)
  let page = 1;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const hit = data.users.find(u => u.email === email);
    if (hit) return hit;
    if (data.users.length < 1000) return null;
    page++;
  }
}

async function ensureUser(email, password, fullName, role) {
  let user = await findUserByEmail(email);
  let created = false, pw = password;
  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { display_name: fullName },
    });
    if (error) { console.warn(`   ⚠️  ${email}: ${error.message}`); return null; }
    user = data.user;
    created = true;
  } else {
    pw = '(existing — unchanged)';
  }
  // Upsert profile (anonymised: full_name holds the username, not a real name)
  await supabase.from('profiles').upsert({
    id: user.id, email, full_name: fullName, role,
  }, { onConflict: 'id' });
  return { id: user.id, email, password: pw, created };
}

async function ensureClass(name, code, teacherId, year) {
  const { data: existing } = await supabase.from('classes').select('id').eq('code', code).limit(1);
  if (existing && existing.length) return existing[0].id;
  const { data, error } = await supabase.from('classes').insert({
    name, code, teacher_id: teacherId, year_group: year,
    description: `Digital Futures — ${name}`,
  }).select('id').single();
  if (error) { console.warn(`   ⚠️  class ${code}: ${error.message}`); return null; }
  return data.id;
}

async function main() {
  mkdirSync('credentials', { recursive: true });
  console.log('🌱 Seeding school accounts…\n');

  // 1) Master teachers
  console.log('👩‍🏫 Master teachers (role: admin)…');
  const teacherRows = [['username','password','role']];
  const teacherIds = [];
  for (let i = 1; i <= TEACHER_COUNT; i++) {
    const username = `teacher${i}`;
    const email = `${username}@${EMAIL_DOMAIN}`;
    const password = makePassword() + makePassword().slice(-2); // a bit longer for staff
    const res = await ensureUser(email, password, username, 'admin');
    if (res) {
      teacherIds.push(res.id);
      teacherRows.push([username, res.password, 'admin (master)']);
      console.log(`   ✅ ${username}`);
    }
  }
  writeFileSync('credentials/teachers.csv', teacherRows.map(r => r.join(',')).join('\n'));

  const ownerTeacherId = teacherIds[0]; // classes are owned by teacher1; all admins see all

  // 2) Classes + students
  const summary = [];
  for (const cls of CLASSES) {
    console.log(`\n🏫 ${cls.name}  (code ${cls.code})…`);
    const classId = await ensureClass(cls.name, cls.code, ownerTeacherId, cls.year);
    if (!classId) continue;

    const rows = [['username','password','class']];
    let made = 0;
    for (let n = 1; n <= STUDENTS_PER_CLASS; n++) {
      const username = `${cls.code}-${n}`;               // ic1-1 … ic1-28
      const email = `${username}@${EMAIL_DOMAIN}`;
      const password = makePassword();
      const res = await ensureUser(email, password, username.toUpperCase(), 'student');
      if (!res) continue;
      if (res.created) made++;
      rows.push([username, res.password, cls.name]);
      // Enrol in the class
      await supabase.from('class_students')
        .upsert({ class_id: classId, student_id: res.id }, { onConflict: 'class_id,student_id' });
    }
    writeFileSync(`credentials/${cls.code}-${cls.name}.csv`, rows.map(r => r.join(',')).join('\n'));
    console.log(`   ✅ ${STUDENTS_PER_CLASS} students (${made} new). → credentials/${cls.code}-${cls.name}.csv`);
    summary.push(`${cls.name} (${cls.code}): 28 students`);
  }

  console.log('\n✨ Done.\n');
  console.log('📋 Credentials written to the credentials/ folder:');
  console.log('   • teachers.csv  — the 5 master teacher logins');
  CLASSES.forEach(c => console.log(`   • ${c.code}-${c.name}.csv`));
  console.log('\n⚠️  Keep the credentials folder private. It is git-ignored by default.');
}

main().catch(e => { console.error(e); process.exit(1); });
