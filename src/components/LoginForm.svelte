<script>
  import { createClient } from '@supabase/supabase-js';

  export let supabaseUrl = '';
  export let supabaseAnonKey = '';

  let supabase;

  $: if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleSubmit() {
    console.log('📝 Form submitted');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    console.log('Supabase client:', supabase);

    error = '';
    loading = true;

    if (!supabase) {
      console.error('❌ Supabase client not initialized!');
      console.log('supabaseUrl:', supabaseUrl);
      console.log('supabaseAnonKey:', supabaseAnonKey);
      error = 'Supabase not initialized';
      loading = false;
      return;
    }

    try {
      console.log('🔄 Calling supabase.auth.signInWithPassword...');
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Full response:', response);
      console.log('Response - Data:', response.data, 'Error:', response.error);

      if (response.error) {
        console.error('❌ Auth error:', response.error.message);
        error = response.error.message;
        loading = false;
        return;
      }

      if (!response.data?.session) {
        console.error('❌ No session returned');
        error = 'Login failed - no session';
        loading = false;
        return;
      }

      console.log('✅ Login successful, redirecting...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (err) {
      console.error('❌ Exception:', err);
      console.error('Error details:', err.message, err.stack);
      error = err.message || 'An error occurred. Please try again.';
      loading = false;
    }
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <div>
    <label for="email" class="block text-sm font-semibold text-slate-300 mb-2">Email</label>
    <input
      type="email"
      id="email"
      bind:value={email}
      required
      disabled={loading}
      class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
      placeholder="name@student.kingswood.edu"
    />
  </div>

  <div>
    <label for="password" class="block text-sm font-semibold text-slate-300 mb-2">Password</label>
    <input
      type="password"
      id="password"
      bind:value={password}
      required
      disabled={loading}
      class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
      placeholder="••••••••"
    />
  </div>

  <button
    type="submit"
    disabled={loading}
    class="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold py-3 hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? 'Signing in...' : 'Sign In'}
  </button>

  {#if error}
    <div class="text-red-400 text-sm text-center">{error}</div>
  {/if}
</form>

<div class="mt-6 pt-6 border-t border-white/8 text-center">
  <p class="text-slate-400 text-sm">Don't have an account?</p>
  <a href="/signup" class="text-cyan-400 hover:text-cyan-300 font-semibold">Sign up →</a>
</div>
