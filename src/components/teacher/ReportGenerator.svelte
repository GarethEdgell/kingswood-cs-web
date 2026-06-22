<script lang="ts">
  import { onMount } from 'svelte';

  export let classId: string;
  export let className: string = '';
  export let studentCount: number = 0;

  type Report = { name: string; report: string };

  let reports: Report[] = [];
  let loading = false;
  let error = '';
  let copied = '';
  let copiedAll = false;
  let generated = false;

  let isDark = true;
  onMount(() => {
    isDark = document.documentElement.dataset.theme !== 'light';
    const obs = new MutationObserver(() => { isDark = document.documentElement.dataset.theme !== 'light'; });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  });

  function tc(hex: string): string {
    if (isDark) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.round(r * .52)},${Math.round(g * .52)},${Math.round(b * .52)})`;
  }

  async function generate() {
    loading = true;
    error = '';
    reports = [];
    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId }),
      });
      const data = await res.json();
      if (!res.ok) {
        error = data.error ?? 'Report generation failed.';
      } else {
        reports = data.reports ?? [];
        generated = true;
        if (data.generationError) {
          error = `Some reports could not be generated. Detail: ${data.generationError}`;
        }
      }
    } catch {
      error = 'Network error — please try again.';
    }
    loading = false;
  }

  async function copyOne(report: Report) {
    const text = `${report.name}\n${report.report}`;
    await navigator.clipboard.writeText(text);
    copied = report.name;
    setTimeout(() => { copied = ''; }, 2000);
  }

  async function copyAll() {
    const text = reports
      .map(r => `${r.name}\n${r.report}`)
      .join('\n\n---\n\n');
    await navigator.clipboard.writeText(text);
    copiedAll = true;
    setTimeout(() => { copiedAll = false; }, 2500);
  }
</script>

<div>
  <!-- Header row -->
  <div class="flex items-center justify-between gap-4 mb-4 flex-wrap">
    <div>
      <h2 class="text-sm font-bold uppercase tracking-wider" style="color:var(--text-4)">
        ✍️ Progress Reports
      </h2>
      {#if !generated}
        <p class="text-xs text-slate-600 mt-0.5">
          AI-assisted · personalised from each student's actual quiz data
        </p>
      {/if}
    </div>

    <div class="flex items-center gap-2">
      {#if generated && reports.length > 0}
        <button
          on:click={copyAll}
          class="rounded-xl px-4 py-2 text-xs font-semibold border transition-colors"
          style={copiedAll
            ? 'border-color:rgba(52,211,153,0.4); background:rgba(52,211,153,0.1); color:#34d399'
            : 'border-color:var(--border); color:var(--text-3)'}>
          {copiedAll ? '✓ Copied all' : 'Copy all reports'}
        </button>
      {/if}

      <button
        on:click={generate}
        disabled={loading}
        class="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90"
        style="background: linear-gradient(135deg, #00d4ff, #7c3aed)">
        {#if loading}
          <span class="flex items-center gap-2">
            <svg class="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Generating…
          </span>
        {:else}
          {generated ? '↺ Regenerate' : '✍️ Generate Reports'}
        {/if}
      </button>
    </div>
  </div>

  <!-- Loading state -->
  {#if loading}
    <div class="rounded-2xl border border-white/8 bg-[var(--bg-card)] px-6 py-10 text-center">
      <div class="flex justify-center mb-4">
        <svg class="animate-spin h-8 w-8" style="color:{tc('#00d4ff')}" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
          <path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-white">Generating personalised reports…</p>
      <p class="text-xs text-slate-500 mt-1">
        Reading quiz scores and achievements for {studentCount} student{studentCount !== 1 ? 's' : ''} · this takes 10–20 seconds
      </p>
    </div>

  <!-- Error -->
  {:else if error}
    <div class="rounded-xl border px-4 py-3 text-sm"
         style="border-color:rgba(248,113,113,0.3); background:rgba(248,113,113,0.07); color:#f87171">
      {error}
    </div>

  <!-- Pre-generate prompt -->
  {:else if !generated}
    <div class="rounded-2xl border border-white/8 bg-[var(--bg-card)] px-6 py-8 text-center">
      <div class="text-3xl mb-3">✍️</div>
      <p class="text-sm font-semibold text-white mb-1">One click to generate {studentCount} personalised report{studentCount !== 1 ? 's' : ''}</p>
      <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
        Each report is written from the student's actual quiz scores, the specific lessons they've completed, and any achievements earned.
        Two sentences of achievement, two sentences of targeted next steps.
      </p>
    </div>

  <!-- Reports -->
  {:else if reports.length > 0}
    <div class="space-y-3">
      {#each reports as r}
        <div class="rounded-2xl border border-white/8 bg-[var(--bg-card)] px-5 py-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-sm font-bold" style="color:{tc('#00d4ff')}">{r.name}</span>
              </div>
              <p class="text-sm leading-relaxed" style="color:var(--text-2)">{r.report}</p>
            </div>
            <button
              on:click={() => copyOne(r)}
              class="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-colors mt-0.5"
              style={copied === r.name
                ? 'border-color:rgba(52,211,153,0.4); background:rgba(52,211,153,0.1); color:#34d399'
                : 'border-color:var(--border); color:var(--text-4)'}>
              {copied === r.name ? '✓' : 'Copy'}
            </button>
          </div>
        </div>
      {/each}
    </div>

    <p class="text-xs text-slate-600 mt-4">
      Reports are generated fresh each time — regenerating will produce new wording based on the same data.
      Always review before sending to parents.
    </p>
  {/if}
</div>

<style>
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .animate-spin { animation: spin 1s linear infinite; }
</style>
