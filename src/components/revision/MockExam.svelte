<script lang="ts">
  import { onDestroy } from 'svelte';
  import { QUESTIONS, type Question } from '../../data/questions';
  import { SPECS } from '../../data/specs';

  // ───────────────────────────────────────────────────────────────────
  // Mock exam: a timed, mixed-topic paper drawn from the OCR question bank.
  // MCQs are auto-marked; written questions are self-marked against the
  // mark scheme. Ends with a score and a weak-area breakdown by topic.
  // ───────────────────────────────────────────────────────────────────

  type Level = 'gcse' | 'alevel';
  const TOPIClists = {
    gcse: (SPECS as any)['OCR GCSE'].topics as { id: string; num: string; name: string }[],
    alevel: (SPECS as any).OCR.topics as { id: string; num: string; name: string }[],
  };
  const LEVEL_LABEL = { gcse: 'OCR GCSE J277', alevel: 'OCR A Level H446' };

  let phase: 'setup' | 'exam' | 'results' = 'setup';
  let level: Level = 'gcse';
  let count = 20;
  const COUNTS = [10, 20, 30];

  let paper: (Question & { topicId: string })[] = [];
  let selected: Record<number, number> = {};   // mcq option index
  let selfMarks: Record<number, number> = {};   // written marks awarded
  let revealed: Record<number, boolean> = {};
  let secondsLeft = 0;
  let timer: ReturnType<typeof setInterval> | null = null;
  let best: Record<string, number> = {};

  try { best = JSON.parse(localStorage.getItem('mock-exam-best') || '{}'); } catch {}

  function topicName(id: string): string {
    const all = [...TOPIClists.gcse, ...TOPIClists.alevel];
    const tp = all.find(t => t.id === id);
    return tp ? `${tp.num} ${tp.name}` : id;
  }

  function isMcq(q: Question): boolean {
    return q.type === 'mcq' || (typeof q.correct === 'number' && Array.isArray(q.options));
  }
  function maxMarks(q: Question): number {
    if (isMcq(q)) return 1;
    const ms = q.markScheme || '';
    const ones = (ms.match(/\(1\)/g) || []).length;
    if (ones > 0) return Math.min(ones, 6);
    const lines = ms.split('\n').filter(l => l.trim().length > 0).length;
    return Math.max(1, Math.min(lines, 6));
  }

  function shuffle<T>(a: T[]): T[] {
    const r = [...a];
    for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
    return r;
  }

  function start() {
    const pool: (Question & { topicId: string })[] = [];
    for (const tp of TOPIClists[level]) {
      const qs = (QUESTIONS as any)[tp.id] as Question[] | undefined;
      if (!qs) continue;
      for (const q of qs) if (isMcq(q) || q.markScheme) pool.push({ ...q, topicId: tp.id });
    }
    paper = shuffle(pool).slice(0, count);
    selected = {}; selfMarks = {}; revealed = {};
    secondsLeft = Math.round(paper.length * 1.5) * 60; // ~90s per question
    phase = 'exam';
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) { secondsLeft = 0; finish(); }
    }, 1000);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }

  function finish() {
    if (timer) { clearInterval(timer); timer = null; }
    phase = 'results';
    const pct = totalMax ? Math.round((totalScored / totalMax) * 100) : 0;
    if (pct > (best[level] ?? -1)) { best = { ...best, [level]: pct }; try { localStorage.setItem('mock-exam-best', JSON.stringify(best)); } catch {} }
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }
  onDestroy(() => { if (timer) clearInterval(timer); });

  function scoreFor(i: number): number {
    const q = paper[i];
    if (isMcq(q)) return selected[i] === q.correct ? 1 : 0;
    return selfMarks[i] ?? 0;
  }
  $: totalMax = paper.reduce((s, q) => s + maxMarks(q), 0);
  // reference selected & selfMarks so Svelte tracks them (scoreFor reads them internally)
  $: totalScored = (selected, selfMarks, paper.reduce((s, _, i) => s + scoreFor(i), 0));
  $: answeredCount = (selected, revealed, paper.filter((q, i) => isMcq(q) ? selected[i] !== undefined : revealed[i]).length);
  $: pct = totalMax ? Math.round((totalScored / totalMax) * 100) : 0;

  $: band = pct >= 80 ? { t: 'Outstanding 🌟', c: '#34d399' }
          : pct >= 65 ? { t: 'Strong ✅', c: '#34d399' }
          : pct >= 50 ? { t: 'Solid 👍', c: '#fbbf24' }
          : pct >= 35 ? { t: 'Getting there 📈', c: '#fbbf24' }
          : { t: 'Keep practising 💪', c: '#fb7185' };

  // per-topic breakdown for results (selected/selfMarks referenced so it re-tracks)
  $: byTopic = (selected, selfMarks, (() => {
    const m: Record<string, { scored: number; max: number }> = {};
    paper.forEach((q, i) => {
      const k = q.topicId;
      if (!m[k]) m[k] = { scored: 0, max: 0 };
      m[k].scored += scoreFor(i);
      m[k].max += maxMarks(q);
    });
    return Object.entries(m).map(([id, v]) => ({ id, ...v, pct: Math.round((v.scored / v.max) * 100) }))
      .sort((a, b) => a.pct - b.pct);
  })());

  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  $: lowTime = secondsLeft <= 60;
  const accent = '#6c8cff';
</script>

<div class="mx-auto max-w-3xl">

  {#if phase === 'setup'}
    <!-- ══════════ SETUP ══════════ -->
    <div class="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-6 sm:p-8">
      <h2 class="text-2xl font-black text-white mb-1">📝 Mock exam</h2>
      <p class="text-slate-400 text-sm mb-6">A timed, mixed-topic paper from the OCR question bank. Multiple-choice questions mark themselves; written questions reveal a mark scheme for you to self-mark.</p>

      <div class="mb-5">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Specification</p>
        <div class="flex gap-2">
          {#each ['gcse','alevel'] as lv}
            <button on:click={() => level = lv}
              class="flex-1 rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all"
              style="border-color:{level === lv ? accent : 'rgba(255,255,255,0.1)'}; background:{level === lv ? accent + '20' : 'transparent'}; color:{level === lv ? accent : '#94a3b8'}">
              {LEVEL_LABEL[lv]}
            </button>
          {/each}
        </div>
      </div>

      <div class="mb-6">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Number of questions</p>
        <div class="flex gap-2">
          {#each COUNTS as c}
            <button on:click={() => count = c}
              class="flex-1 rounded-xl border-2 px-4 py-3 text-sm font-bold transition-all"
              style="border-color:{count === c ? accent : 'rgba(255,255,255,0.1)'}; background:{count === c ? accent + '20' : 'transparent'}; color:{count === c ? accent : '#94a3b8'}">
              {c} <span class="font-normal text-xs">· {Math.round(c * 1.5)} min</span>
            </button>
          {/each}
        </div>
      </div>

      {#if best[level] !== undefined}
        <p class="text-sm text-slate-400 mb-4">Your best {LEVEL_LABEL[level]} score: <span class="font-bold" style="color:{accent}">{best[level]}%</span></p>
      {/if}

      <button on:click={start} class="w-full rounded-xl py-3.5 font-bold text-white transition-all hover:opacity-90" style="background:linear-gradient(135deg,#6c8cff,#7c3aed)">
        Start mock exam →
      </button>
    </div>

  {:else if phase === 'exam'}
    <!-- ══════════ EXAM ══════════ -->
    <div class="sticky top-16 z-30 -mx-4 px-4 py-3 mb-5 border-b border-white/8 backdrop-blur-md" style="background:var(--nav-bg)">
      <div class="flex items-center justify-between gap-3">
        <div class="text-sm text-slate-400">{LEVEL_LABEL[level]} · {answeredCount}/{paper.length} done</div>
        <div class="flex items-center gap-3">
          <div class="font-mono font-bold text-lg" style="color:{lowTime ? '#fb7185' : '#fff'}">⏱ {mmss(secondsLeft)}</div>
          <button on:click={finish} class="rounded-lg px-4 py-2 text-sm font-bold text-white" style="background:#7c3aed">Finish &amp; mark</button>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      {#each paper as q, i}
        <div class="rounded-2xl border border-white/8 bg-[var(--bg-card)] p-5">
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-2 text-xs">
              <span class="font-bold rounded px-2 py-0.5" style="background:{accent}20; color:{accent}">Q{i + 1}</span>
              <span class="text-slate-500">{topicName(q.topicId).split(' ').slice(0,1)} · {isMcq(q) ? 'multiple choice' : 'written'}</span>
            </div>
            <span class="shrink-0 text-xs font-bold rounded-full px-2 py-0.5" style="background:#fbbf2415; color:#fbbf24">[{maxMarks(q)}]</span>
          </div>
          <p class="text-slate-200 font-medium mb-3 leading-relaxed">{q.text}</p>

          {#if isMcq(q)}
            <div class="space-y-2">
              {#each q.options ?? [] as opt, oi}
                <button on:click={() => selected = { ...selected, [i]: oi }}
                  class="w-full text-left rounded-lg border px-3 py-2 text-sm transition-all"
                  style="border-color:{selected[i] === oi ? accent : 'rgba(255,255,255,0.1)'}; background:{selected[i] === oi ? accent + '18' : 'transparent'}; color:{selected[i] === oi ? '#fff' : '#cbd5e1'}">
                  <span class="font-bold mr-1.5">{String.fromCharCode(65 + oi)}.</span>{opt}
                </button>
              {/each}
            </div>
          {:else}
            {#if revealed[i]}
              <div class="rounded-lg bg-[#34d399]/8 border border-[#34d399]/20 p-3 mb-3">
                <div class="text-xs font-semibold uppercase tracking-wider text-[#34d399] mb-1.5">Mark scheme</div>
                <pre class="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{q.markScheme}</pre>
              </div>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs text-slate-400">Marks you earned:</span>
                {#each Array(maxMarks(q) + 1) as _, mk}
                  <button on:click={() => selfMarks = { ...selfMarks, [i]: mk }}
                    class="h-8 w-8 rounded-lg text-sm font-bold transition-all"
                    style="background:{selfMarks[i] === mk ? '#34d399' : 'rgba(255,255,255,0.06)'}; color:{selfMarks[i] === mk ? '#052e16' : '#94a3b8'}">{mk}</button>
                {/each}
              </div>
            {:else}
              <button on:click={() => revealed = { ...revealed, [i]: true }} class="text-sm font-semibold" style="color:{accent}">Reveal mark scheme →</button>
            {/if}
          {/if}
        </div>
      {/each}
    </div>

    <button on:click={finish} class="w-full mt-6 rounded-xl py-3.5 font-bold text-white" style="background:#7c3aed">Finish &amp; mark →</button>

  {:else}
    <!-- ══════════ RESULTS ══════════ -->
    <div class="rounded-2xl border-2 p-6 sm:p-8 text-center mb-5" style="border-color:{band.c}55; background:{band.c}10">
      <div class="text-sm text-slate-400">{LEVEL_LABEL[level]} mock · {paper.length} questions</div>
      <div class="text-6xl font-black my-2" style="color:{band.c}">{pct}%</div>
      <div class="text-lg font-bold text-white">{band.t}</div>
      <div class="text-sm text-slate-400 mt-1">{totalScored} / {totalMax} marks{best[level] === pct ? ' · new best! 🎉' : ''}</div>
    </div>

    <div class="rounded-2xl border border-white/8 bg-[var(--bg-card)] p-5 mb-5">
      <h3 class="font-bold text-white mb-3">By topic — focus your revision on the lowest</h3>
      <div class="space-y-2.5">
        {#each byTopic as tp}
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="text-slate-300">{topicName(tp.id)}</span>
              <span class="font-bold" style="color:{tp.pct >= 65 ? '#34d399' : tp.pct >= 40 ? '#fbbf24' : '#fb7185'}">{tp.scored}/{tp.max}</span>
            </div>
            <div class="h-2 rounded-full bg-white/5 overflow-hidden">
              <div class="h-2 rounded-full" style="width:{tp.pct}%; background:{tp.pct >= 65 ? '#34d399' : tp.pct >= 40 ? '#fbbf24' : '#fb7185'}"></div>
            </div>
          </div>
        {/each}
      </div>
      <p class="text-xs text-slate-500 mt-4">Open the <a href={level === 'alevel' ? '/revision/notes?level=alevel' : '/revision/notes'} class="underline" style="color:{accent}">revision notes</a> for your weakest topics, then try another paper.</p>
    </div>

    <div class="flex gap-3">
      <button on:click={() => { phase = 'setup'; }} class="flex-1 rounded-xl border border-white/10 py-3 font-bold text-slate-200 hover:bg-white/5">Change settings</button>
      <button on:click={start} class="flex-1 rounded-xl py-3 font-bold text-white" style="background:linear-gradient(135deg,#6c8cff,#7c3aed)">New paper →</button>
    </div>
  {/if}
</div>
