#!/usr/bin/env node

/**
 * Debug version of seed script - shows detailed output
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

console.log('🔍 Checking credentials...');
console.log('URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('Key:', SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing');

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('\n❌ Missing env vars! Run with:');
  console.error('SUPABASE_URL="https://xxx.supabase.co" SUPABASE_SERVICE_KEY="key" node scripts/seed-debug.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seedData() {
  console.log('\n✅ Supabase connected\n');

  // Try creating one teacher
  console.log('Creating test user...');
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test.teacher@kingswood.edu',
      password: 'Teacher123!',
      email_confirm: true,
    });

    if (error) {
      console.error('❌ Error:', error.message);
      console.error('Details:', JSON.stringify(error, null, 2));
      return;
    }

    console.log('✅ User created!', data.user.id);

    // Try creating profile
    console.log('\nCreating profile...');
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      email: 'test.teacher@kingswood.edu',
      full_name: 'Test Teacher',
      role: 'teacher',
    });

    if (profileError) {
      console.error('❌ Profile error:', profileError.message);
      return;
    }

    console.log('✅ Profile created!');
    console.log('\n🎉 Success! You can now log in with:');
    console.log('   Email: test.teacher@kingswood.edu');
    console.log('   Password: Teacher123!');
  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

seedData();
