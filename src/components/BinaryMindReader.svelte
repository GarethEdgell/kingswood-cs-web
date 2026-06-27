<script lang="ts">
  // ───────────────────────────────────────────────────────────────────
  // Binary Mind-Reader — the lesson hook. Think of a number 1–31, say
  // which cards it's on, and the computer "reads your mind"… because each
  // card is a binary place value. The reveal teaches base-2.
  // ───────────────────────────────────────────────────────────────────
  const BITS = [16, 8, 4, 2, 1];
  function cardNumbers(v: number): number[] {
    const out: number[] = [];
    for (let n = 1; n <= 31; n++) if (n & v) out.push(n);
    return out;
  }
  let answers: Record<number, boolean | null> = { 16: null, 8: null, 4: null, 2: null, 1: null };
  let revealed = false;

  $: allAnswered = BITS.every(b => answers[b] !== null);
  $: chosen = BITS.reduce((s, b) => s + (answers[b] ? b : 0), 0);
  $: binary = BITS.map(b => (answers[b] ? '1' : '0')).join('');
  $: parts = BITS.filter(b => answers[b]);

  function setAns(v: number, val: boolean) { answers = { ...answers, [v]: val }; revealed = false; }
  function reveal() { if (allAnswered) revealed = true; }
  function reset() { answers = { 16: null, 8: null, 4: null, 2: null, 1: null }; revealed = false; }
</script>

<div class="rounded-2xl border-2 p-5 sm:p-6" style="border-color:#7c3aed55; background:#7c3aed0d">
  <div class="flex items-center gap-2 mb-1">
    <span class="text-2xl">🔮</span>
    <h3 class="text-xl font-black text-white">The Mind-Reader</h3>
  </div>
  <p class="text-sm text-slate-300 mb-4">
    Think of a secret number from <strong>1 to 31</strong> — don't tell anyone! For each card below, say whether your number is on it.
    The computer will read your mind. 🧠
  </p>

  <div class="grid gap-3 sm:grid-cols-2">
    {#each BITS as v}
      <div class="rounded-xl border p-3" style="border-color:{answers[v] === true ? '#34d399' : answers[v] === false ? '#475569' : '#7c3aed44'}; background:{answers[v] === true ? '#34d39912' : '#7c3aed08'}">
        <div class="flex flex-wrap gap-1 mb-2.5">
          {#each cardNumbers(v) as n}
            <span class="inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold"
                  style="background:#7c3aed22; color:#c4b5fd">{n}</span>
          {/each}
        </div>
        <div class="flex gap-2">
          <button on:click={() => setAns(v, true)}
            class="flex-1 rounded-lg py-1.5 text-sm font-bold transition-all"
            style="background:{answers[v] === true ? '#34d399' : '#1e293b'}; color:{answers[v] === true ? '#052e16' : '#94a3b8'}">It's here ✓</button>
          <button on:click={() => setAns(v, false)}
            class="flex-1 rounded-lg py-1.5 text-sm font-bold transition-all"
            style="background:{answers[v] === false ? '#64748b' : '#1e293b'}; color:{answers[v] === false ? '#fff' : '#94a3b8'}">Not here ✗</button>
        </div>
      </div>
    {/each}
  </div>

  <div class="mt-4 flex items-center gap-3">
    <button on:click={reveal} disabled={!allAnswered}
      class="rounded-xl px-5 py-2.5 font-bold text-white transition-all disabled:opacity-40"
      style="background:linear-gradient(135deg,#7c3aed,#00d4ff)">🔮 Read my mind</button>
    {#if allAnswered}<button on:click={reset} class="text-sm text-slate-400 hover:text-white">Try again</button>{/if}
  </div>

  {#if revealed}
    <div class="mt-4 rounded-xl border-2 p-4 text-center cc-reveal" style="border-color:#00d4ff55; background:#00d4ff0d">
      <p class="text-sm text-slate-300">Your number is…</p>
      <p class="text-5xl font-black my-1" style="background:linear-gradient(135deg,#00d4ff,#7c3aed);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">{chosen}</p>
      <p class="text-sm text-slate-300 mt-2">
        ✨ No magic — that's <strong>binary</strong>! Each card is a place value.
      </p>
      <p class="font-mono text-base mt-1" style="color:#00d4ff">
        {parts.length ? parts.join(' + ') + ' = ' + chosen : '0 = 0'} &nbsp;→&nbsp; {binary}<sub>2</sub>
      </p>
      <p class="text-xs text-slate-500 mt-2">You just stored a number the exact way a computer does — as on/off bits.</p>
    </div>
  {/if}
</div>

<style>
  @keyframes ccreveal { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  .cc-reveal { animation: ccreveal 0.4s ease-out; }
</style>
