<script lang="ts">
  const CLASSES = [
    { name: '9A', code: 'ic1' }, { name: '9B', code: 'ic2' }, { name: '9C', code: 'ic3' },
    { name: '9D', code: 'ic4' }, { name: '9E', code: 'ic5' }, { name: '9F', code: 'ic6' },
    { name: '9G', code: 'ic7' },
    { name: '8A', code: 'ic8' }, { name: '8B', code: 'ic9' }, { name: '8C', code: 'ic10' },
    { name: '8D', code: 'ic11' }, { name: '8E', code: 'ic12' }, { name: '8F', code: 'ic13' },
  ];

  let username = '';
  let busy = false;
  let error = '';
  let results: { username: string; password?: string; error?: string }[] = [];
  let lastAction = '';

  async function reset(body: object, label: string) {
    if (busy) return;
    busy = true; error = ''; results = []; lastAction = label;
    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { error = data.error || 'Reset failed'; }
      else { results = data.results || []; }
    } catch (e: any) {
      error = e.message || 'Network error';
    }
    busy = false;
  }

  function resetOne() {
    const u = username.trim().toLowerCase();
    if (!u) { error = 'Enter a username, e.g. ic1-3'; return; }
    reset({ username: u }, `Reset ${u}`);
  }

  function resetClass(code: string, name: string) {
    if (!confirm(`Reset ALL 28 passwords for ${name}? Every pupil in ${name} will need their new password.`)) return;
    reset({ classCode: code }, `Reset whole class ${name}`);
  }

  function copyTable() {
    const text = results.filter(r => r.password).map(r => `${r.username}\t${r.password}`).join('\n');
    navigator.clipboard.writeText(text);
  }
</script>

<div class="space-y-8">

  <!-- Reset one student -->
  <div class="rounded-2xl border border-white/10 bg-white/5 p-6">
    <h2 class="text-lg font-black text-white mb-1">Reset one pupil</h2>
    <p class="text-sm text-slate-400 mb-4">Type the pupil's username (class code + number).</p>
    <div class="flex gap-2 flex-wrap">
      <input bind:value={username} placeholder="e.g. ic1-3"
        class="flex-1 min-w-[160px] rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none" />
      <button on:click={resetOne} disabled={busy}
        class="rounded-lg bg-cyan-500 text-black font-bold px-5 py-2 hover:bg-cyan-400 disabled:opacity-50">
        {busy ? 'Working…' : 'Reset password'}
      </button>
    </div>
  </div>

  <!-- Reset a whole class -->
  <div class="rounded-2xl border border-white/10 bg-white/5 p-6">
    <h2 class="text-lg font-black text-white mb-1">Reset a whole class</h2>
    <p class="text-sm text-slate-400 mb-4">Generates fresh passwords for all 28 pupils in the class.</p>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {#each CLASSES as c}
        <button on:click={() => resetClass(c.code, c.name)} disabled={busy}
          class="rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-center hover:border-purple-500/50 hover:bg-purple-500/10 disabled:opacity-50 transition-colors">
          <div class="font-black text-white">{c.name}</div>
          <div class="text-xs text-slate-500">{c.code}</div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Results -->
  {#if error}
    <div class="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-300 text-sm">{error}</div>
  {/if}

  {#if results.length}
    <div class="rounded-2xl border border-green-500/30 bg-green-500/5 p-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-black text-white">✅ {lastAction} — new passwords</h3>
        <button on:click={copyTable} class="text-xs font-semibold text-cyan-400 hover:text-cyan-300">Copy all</button>
      </div>
      <p class="text-xs text-amber-300 mb-3">⚠️ Note these down now — they are shown only once.</p>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="border-b border-white/10 text-slate-400">
            <th class="text-left py-2 px-2">Username</th><th class="text-left py-2 px-2">New password</th>
          </tr></thead>
          <tbody>
            {#each results as r}
              <tr class="border-b border-white/5">
                <td class="py-1.5 px-2 font-mono text-white">{r.username}</td>
                <td class="py-1.5 px-2 font-mono {r.password ? 'text-green-300' : 'text-red-400'}">{r.password || r.error}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}
</div>
