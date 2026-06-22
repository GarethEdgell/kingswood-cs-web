<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  type ExamEntry = {
    board: string;
    level: 'GCSE' | 'A Level' | 'IGCSE';
    spec: string;
    paper: string;
    date: string; // ISO YYYY-MM-DD
  };

  // Summer 2026 exam dates — always verify on your board's official website
  const EXAMS: ExamEntry[] = [
    // AQA GCSE 8525 — both papers now past
    { board: 'AQA', level: 'GCSE', spec: '8525', paper: 'Paper 1 — Computer Systems', date: '2026-05-21' },
    { board: 'AQA', level: 'GCSE', spec: '8525', paper: 'Paper 2 — Algorithms & Programming', date: '2026-05-22' },
    // AQA A Level 7517 — confirmed dates
    { board: 'AQA', level: 'A Level', spec: '7517', paper: 'Paper 1 — Computer Systems', date: '2026-06-10' },
    { board: 'AQA', level: 'A Level', spec: '7517', paper: 'Paper 2 — Algorithms & Programming', date: '2026-06-17' },
    // OCR GCSE J277 — both papers now past
    { board: 'OCR', level: 'GCSE', spec: 'J277', paper: 'Component 01 — Computer Systems', date: '2026-05-18' },
    { board: 'OCR', level: 'GCSE', spec: 'J277', paper: 'Component 02 — Computational Thinking', date: '2026-05-22' },
    // OCR A Level H446 — confirmed dates
    { board: 'OCR', level: 'A Level', spec: 'H446', paper: 'Paper 1 — Computer Systems', date: '2026-06-10' },
    { board: 'OCR', level: 'A Level', spec: 'H446', paper: 'Paper 2 — Algorithms & Programming', date: '2026-06-17' },
    // Cambridge IGCSE 0478 — both papers now past
    { board: 'Cambridge', level: 'IGCSE', spec: '0478', paper: 'Paper 1 — Theory', date: '2026-05-20' },
    { board: 'Cambridge', level: 'IGCSE', spec: '0478', paper: 'Paper 2 — Problem-solving', date: '2026-05-28' },
    // Cambridge A Level 9618
    { board: 'Cambridge', level: 'A Level', spec: '9618', paper: 'Paper 1 — Theory Fundamentals', date: '2026-06-10' },
    { board: 'Cambridge', level: 'A Level', spec: '9618', paper: 'Paper 2 — Fundamental Problem-solving', date: '2026-06-17' },
    // Eduqas GCSE C500 — both papers now past
    { board: 'Eduqas', level: 'GCSE', spec: 'C500', paper: 'Unit 1 — Computer Systems', date: '2026-05-19' },
    { board: 'Eduqas', level: 'GCSE', spec: 'C500', paper: 'Unit 2 — Computational Thinking', date: '2026-05-27' },
  ];

  let boards = [...new Set(EXAMS.map(e => e.board))];
  let levels = ['GCSE', 'A Level', 'IGCSE'];

  let selectedBoard = 'AQA';
  let selectedLevel = 'GCSE';
  let now = new Date();
  let ticker: ReturnType<typeof setInterval>;

  onMount(() => {
    ticker = setInterval(() => { now = new Date(); }, 60000); // update every minute
  });
  onDestroy(() => clearInterval(ticker));

  $: filteredExams = EXAMS.filter(
    e => e.board === selectedBoard && e.level === selectedLevel
  ).sort((a, b) => a.date.localeCompare(b.date));

  function daysUntil(dateStr: string) {
    const exam = new Date(dateStr + 'T09:00:00');
    const diff = exam.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function urgencyClass(days: number) {
    if (days < 0) return 'text-slate-600';
    if (days <= 14) return 'text-red-400';
    if (days <= 30) return 'text-[#f59e0b]';
    return 'text-[#34d399]';
  }

  function urgencyBg(days: number) {
    if (days < 0) return 'border-white/5 bg-white/2 opacity-50';
    if (days <= 14) return 'border-red-500/30 bg-red-500/5';
    if (days <= 30) return 'border-[#f59e0b]/30 bg-[#f59e0b]/5';
    return 'border-[#34d399]/20 bg-[#34d399]/5';
  }

  function weeksLabel(days: number) {
    if (days < 0) return 'Past';
    if (days === 0) return 'Today!';
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    const weeks = Math.floor(days / 7);
    const rem = days % 7;
    return `${weeks}w ${rem}d`;
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr + 'T09:00:00').toLocaleDateString('en-GB', {
      weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
    });
  }
</script>

<div class="space-y-6">

  <!-- Board + level picker -->
  <div class="grid gap-4 sm:grid-cols-2">
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Exam board</p>
      <div class="flex flex-wrap gap-2">
        {#each boards as b}
          <button
            on:click={() => selectedBoard = b}
            class="rounded-lg border px-4 py-2 text-sm font-semibold transition-colors {
              selectedBoard === b
                ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]'
                : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
            }"
          >
            {b}
          </button>
        {/each}
      </div>
    </div>
    <div>
      <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Level</p>
      <div class="flex flex-wrap gap-2">
        {#each levels as l}
          <button
            on:click={() => selectedLevel = l}
            class="rounded-lg border px-4 py-2 text-sm font-semibold transition-colors {
              selectedLevel === l
                ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]'
                : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
            }"
          >
            {l}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Exam cards -->
  {#if filteredExams.length === 0}
    <p class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-6 text-center text-slate-400">
      No exams found for {selectedBoard} {selectedLevel}
    </p>
  {:else}
    <div class="space-y-3">
      {#each filteredExams as exam}
        {@const days = daysUntil(exam.date)}
        <div class="rounded-xl border {urgencyBg(days)} p-5 transition-all">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="rounded-full bg-white/8 px-2.5 py-0.5 text-xs font-semibold text-slate-400">{exam.board} {exam.spec}</span>
                <span class="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-slate-500">{exam.level}</span>
              </div>
              <h3 class="mt-2 font-semibold text-white">{exam.paper}</h3>
              <p class="mt-0.5 text-sm text-slate-400">{formatDate(exam.date)}</p>
            </div>
            <div class="text-right">
              <div class="text-3xl font-extrabold {urgencyClass(days)} leading-none">
                {weeksLabel(days)}
              </div>
              {#if days > 0}
                <div class="mt-1 text-xs text-slate-500">{days} days total</div>
              {/if}
            </div>
          </div>

          <!-- Progress bar -->
          {#if days > 0 && days <= 90}
            {@const pct = Math.max(0, Math.min(100, Math.round((1 - days/90) * 100)))}
            <div class="mt-3 h-1.5 w-full rounded-full bg-white/5">
              <div
                class="h-1.5 rounded-full transition-all {days <= 14 ? 'bg-red-400' : days <= 30 ? 'bg-[#f59e0b]' : 'bg-[#34d399]'}"
                style="width: {pct}%"
              ></div>
            </div>
            <div class="mt-1 flex justify-between text-xs text-slate-600">
              <span>90 days out</span>
              <span class="{urgencyClass(days)}">{pct}% of the way there</span>
              <span>Exam day</span>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <!-- Study tips -->
  <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-5">
    <h3 class="mb-3 text-sm font-semibold text-white">Revision timeline guide</h3>
    <div class="space-y-2 text-sm">
      {#each [
        { range: '12+ weeks', colour: 'text-[#34d399]', tip: 'Cover all topics at least once using notes and flashcards. Identify weak areas.' },
        { range: '8–12 weeks', colour: 'text-[#34d399]', tip: 'Begin past paper practice. Focus extra time on weak topics from the question bank.' },
        { range: '4–8 weeks', colour: 'text-[#f59e0b]', tip: 'Timed paper practice under exam conditions. Review mark schemes carefully.' },
        { range: '1–4 weeks', colour: 'text-[#f59e0b]', tip: 'Focus on high-mark topics, algorithms, and programming questions. Review cheat sheets.' },
        { range: 'Final week', colour: 'text-red-400', tip: 'Light revision only — cheat sheets and key definitions. Get good sleep.' },
      ] as tip}
        <div class="flex gap-3">
          <span class="w-24 shrink-0 text-xs font-semibold {tip.colour}">{tip.range}</span>
          <span class="text-slate-400">{tip.tip}</span>
        </div>
      {/each}
    </div>
  </div>

  <p class="text-xs text-slate-600">
    ⚠️ Dates shown are estimates for the 2026 summer series. Always confirm exact dates on your exam board's official website.
  </p>
</div>
