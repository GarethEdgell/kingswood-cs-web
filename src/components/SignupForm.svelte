<script>
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  let email = '';
  let password = '';
  let error = '';
  let success = '';
  let loading = false;

  async function handleSubmit() {
    console.log('📝 Signup form submitted');
    error = '';
    success = '';
    loading = true;

    if (password.length < 8) {
      error = 'Password must be at least 8 characters';
      loading = false;
      return;
    }

    try {
      console.log('🔄 Calling supabase.auth.signUp...');
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      console.log('Response - Data:', data, 'Error:', signupError);

      if (signupError) {
        console.error('❌ Signup error:', signupError.message);
        error = signupError.message;
        loading = false;
        return;
      }

      console.log('✅ Signup successful');
      success = 'Account created! Redirecting to login...';

      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      console.error('❌ Exception:', err);
      error = 'An error occurred. Please try again.';
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
      minlength="8"
      disabled={loading}
      class="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
      placeholder="At least 8 characters"
    />
  </div>

  <button
    type="submit"
    disabled={loading}
    class="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold py-3 hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? 'Creating account...' : 'Create Account'}
  </button>

  {#if error}
    <div class="text-red-400 text-sm text-center">{error}</div>
  {/if}

  {#if success}
    <div class="text-green-400 text-sm text-center">{success}</div>
  {/if}
</form>

<div class="mt-6 pt-6 border-t border-white/8 text-center">
  <p class="text-slate-400 text-sm">Already have an account?</p>
  <a href="/login" class="text-cyan-400 hover:text-cyan-300 font-semibold">Log in →</a>
</div>
