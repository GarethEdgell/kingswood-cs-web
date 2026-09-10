#!/usr/bin/env node
/**
 * regen-passwords.mjs — assign fresh, RECORDED passwords to accounts whose
 * passwords were lost, and write clean CSVs so login cards can be printed.
 *
 * By default it resets: Year 9 classes (ic1-ic7) + the 5 teacher accounts.
 * It does NOT touch Year 8 (their CSVs already hold real passwords).
 *
 * RUN (PowerShell), same keys as the seeder:
 *   $env:SUPABASE_URL="https://fwudtosslyvtzqxztohl.supabase.co"
 *   $env:SUPABASE_SERVICE_KEY="<service_role key>"
 *   node scripts/regen-passwords.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { randomInt } from 'node:crypto';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;
const EMAIL_DOMAIN = 'students.kingswoodcomputerscience.com';

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Set SUPABASE_URL and SUPABASE_SERVICE_KEY first.');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// What to reset
const CLASSES = [
  { name: '9A', code: 'ic1' }, { name: '9B', code: 'ic2' }, { name: '9C', code: 'ic3' },
  { name: '9D', code: 'ic4' }, { name: '9E', code: 'ic5' }, { name: '9F', code: 'ic6' },
  { name: '9G', code: 'ic7' },
];
const STUDENTS_PER_CLASS = 28;
const TEACHER_COUNT = 5;

const WORDS = ['tiger','comet','maple','pixel','robot','delta','amber','quartz','falcon','cobalt',
  'willow','ember','orbit','cedar','vortex','lunar','onyx','breeze','flint','harbor',
  'jasper','mango','nebula','opal','pepper','raven','sienna','topaz','umber','zephyr'];
const pw = () => { const w = WORDS[randomInt(WORDS.length)]; return w[0].toUpperCase()+w.slice(1)+randomInt(10,99); };

async function idFor(email) {
  const { data } = await supabase.from('profiles').select('id').eq('email', email).limit(1);
  return data?.[0]?.id ?? null;
}

async function reset(username, longer = false) {
  const email = `${username}@${EMAIL_DOMAIN}`;
  const id = await idFor(email);
  if (!id) return { username, error: 'not found' };
  const password = longer ? pw() + pw().slice(-2) : pw();
  const { error } = await supabase.auth.admin.updateUserById(id, { password });
  if (error) return { username, error: error.message };
  return { username, password };
}

async function main() {
  mkdirSync('credentials', { recursive: true });
  console.log('🔑 Regenerating passwords…\n');

  // Teachers
  console.log('👩‍🏫 Teachers…');
  const trows = [['username','password','role']];
  for (let i = 1; i <= TEACHER_COUNT; i++) {
    const r = await reset(`teacher${i}`, true);
    trows.push([r.username, r.password ?? r.error, 'admin (master)']);
    console.log(`   ${r.password ? '✅' : '⚠️'} ${r.username}`);
  }
  writeFileSync('credentials/teachers.csv', trows.map(r => r.join(',')).join('\n'));

  // Year 9 classes
  for (const cls of CLASSES) {
    console.log(`\n🏫 ${cls.name} (${cls.code})…`);
    const rows = [['username','password','class']];
    for (let n = 1; n <= STUDENTS_PER_CLASS; n++) {
      const r = await reset(`${cls.code}-${n}`);
      rows.push([r.username, r.password ?? r.error, cls.name]);
    }
    writeFileSync(`credentials/${cls.code}-${cls.name}.csv`, rows.map(r => r.join(',')).join('\n'));
    console.log(`   ✅ 28 passwords → credentials/${cls.code}-${cls.name}.csv`);
  }

  console.log('\n✨ Done. Now run:  python scripts/make-cards.py');
}

main().catch(e => { console.error(e); process.exit(1); });
