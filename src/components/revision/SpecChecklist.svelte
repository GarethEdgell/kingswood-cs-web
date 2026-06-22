<script lang="ts">
  import { onMount } from 'svelte';
  import { SC_SPECS } from '../../data/scSpecs';

  // ── Types ────────────────────────────────────────────────────────────
  type Confidence = 0 | 1 | 2; // 0=not started, 1=amber, 2=green
  type Ratings = Record<string, Confidence>;

  // ── Board list ───────────────────────────────────────────────────────
  const boards = [
    { key: 'aqagcse',   label: 'AQA GCSE',         color: '#6c8cff', badge: 'GCSE' },
    { key: 'ocrgcse',   label: 'OCR GCSE',          color: '#34d399', badge: 'GCSE' },
    { key: 'camigcse',  label: 'Cambridge IGCSE',   color: '#fbbf24', badge: 'GCSE' },
    { key: 'aqaalevel', label: 'AQA A Level',       color: '#6c8cff', badge: 'A Level' },
    { key: 'ocralevel', label: 'OCR A Level',       color: '#34d399', badge: 'A Level' },
    { key: 'camalevel', label: 'Cambridge A Level', color: '#fbbf24', badge: 'A Level' },
  ] as const;

  type BoardKey = typeof boards[number]['key'];

  // ── State ────────────────────────────────────────────────────────────
  let activeBoard: BoardKey = 'aqagcse';
  let ratings: Ratings = {};
  let expandedTopics: Set<string> = new Set();

  const STORAGE_KEY = 'cst-spec-ratings';

  onMount(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) ratings = JSON.parse(saved);
    } catch {}
    // Expand first topic by default
    const first = SC_SPECS[activeBoard]?.topics?.[0]?.name;
    if (first) expandedTopics = new Set([topicKey(activeBoard, first)]);
  });

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings)); } catch {}
  }

  function topicKey(board: string, topic: string) {
    return `${board}::${topic}`;
  }

  function stmtKey(board: string, topic: string, idx: number) {
    return `${board}::${topic}::${idx}`;
  }

  function setRating(key: string, val: Confidence) {
    ratings = { ...ratings, [key]: val };
    save();
  }

  function toggleTopic(key: string) {
    const s = new Set(expandedTopics);
    if (s.has(key)) s.delete(key); else s.add(key);
    expandedTopics = s;
  }

  function selectBoard(key: BoardKey) {
    activeBoard = key;
    const first = SC_SPECS[key]?.topics?.[0]?.name;
    expandedTopics = first ? new Set([topicKey(key, first)]) : new Set();
  }

  // ── Progress helpers ─────────────────────────────────────────────────
  // ratings is passed explicitly so Svelte's static analyser sees it as a
  // reactive dependency and re-runs the statement whenever ratings changes.
  function topicProgress(boardKey: string, topic: { name: string; statements: string[] }, r: typeof ratings) {
    const total = topic.statements.length;
    let amber = 0, green = 0;
    topic.statements.forEach((_, i) => {
      const val = r[stmtKey(boardKey, topic.name, i)] ?? 0;
      if (val === 1) amber++;
      if (val === 2) green++;
    });
    return { total, amber, green, red: total - amber - green };
  }

  function boardProgress(boardKey: BoardKey, r: typeof ratings) {
    const spec = SC_SPECS[boardKey];
    if (!spec) return { total: 0, amber: 0, green: 0 };
    let total = 0, amber = 0, green = 0;
    spec.topics.forEach(t => {
      const p = topicProgress(boardKey, t, r);
      total += p.total; amber += p.amber; green += p.green;
    });
    return { total, amber, green };
  }

  $: currentSpec = SC_SPECS[activeBoard];
  $: currentBoard = boards.find(b => b.key === activeBoard)!;
  // Pass ratings explicitly — this makes Svelte track it as a dependency
  // so overallProgress recalculates whenever a rating button is clicked
  $: overallProgress = boardProgress(activeBoard, ratings);

  const labels = ['Not yet', 'Getting there', 'Confident'];
  const colours = ['#ef4444', '#f59e0b', '#34d399'];
  const icons   = ['✗', '~', '✓'];
</script>

<!-- Board selector -->
<div class="mb-6 flex flex-wrap gap-2">
  {#each boards as b}
    <button
      on:click={() => selectBoard(b.key)}
      class="rounded-full px-4 py-1.5 text-sm font-semibold transition-all border"
      style="
        background: {activeBoard === b.key ? b.color + '22' : 'transparent'};
        border-color: {activeBoard === b.key ? b.color : 'rgba(255,255,255,0.12)'};
        color: {activeBoard === b.key ? b.color : 'var(--text-3)'};
      "
    >
      {b.label}
    </button>
  {/each}
</div>

<!-- Overall progress bar -->
{#if overallProgress.total > 0}
  {@const pct = Math.round((overallProgress.green / overallProgress.total) * 100)}
  {@const amberPct = Math.round((overallProgress.amber / overallProgress.total) * 100)}
  <div class="mb-6 rounded-xl border border-white/8 bg-[var(--bg-card)] p-5">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-sm font-semibold text-white">{currentSpec.name} — Overall progress</h2>
      <span class="text-sm font-bold" style="color:{currentBoard.color}">{pct}% confident</span>
    </div>
    <div class="h-3 rounded-full bg-white/8 overflow-hidden flex">
      <div class="h-full bg-[#34d399] transition-all duration-500" style="width:{pct}%"></div>
      <div class="h-full bg-[#f59e0b] transition-all duration-500" style="width:{amberPct}%"></div>
    </div>
    <div class="mt-2 flex gap-4 text-xs text-slate-500">
      <span><span class="text-[#34d399]">✓</span> {overallProgress.green} confident</span>
      <span><span class="text-[#f59e0b]">~</span> {overallProgress.amber} getting there</span>
      <span><span class="text-red-400">✗</span> {overallProgress.total - overallProgress.green - overallProgress.amber} not yet</span>
      <span class="ml-auto">{overallProgress.total} total statements</span>
    </div>
  </div>
{/if}

<!-- Topics -->
<div class="space-y-3">
  {#each currentSpec.topics as topic}
    {@const tKey = topicKey(activeBoard, topic.name)}
    {@const prog = topicProgress(activeBoard, topic, ratings)}
    {@const open = expandedTopics.has(tKey)}
    {@const greenPct = Math.round((prog.green / prog.total) * 100)}
    {@const amberPct = Math.round((prog.amber / prog.total) * 100)}

    <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] overflow-hidden">

      <!-- Topic header -->
      <button
        on:click={() => toggleTopic(tKey)}
        class="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <span class="text-slate-400 text-sm shrink-0 transition-transform duration-200"
              style="transform: rotate({open ? 90 : 0}deg)">▶</span>

        <span class="flex-1 text-sm font-semibold text-white">{topic.name}</span>

        <!-- Mini progress bar -->
        <div class="hidden sm:flex items-center gap-3">
          <div class="w-28 h-2 rounded-full bg-white/8 overflow-hidden flex">
            <div class="h-full bg-[#34d399] transition-all" style="width:{greenPct}%"></div>
            <div class="h-full bg-[#f59e0b] transition-all" style="width:{amberPct}%"></div>
          </div>
          <span class="text-xs text-slate-500 w-12 text-right">{prog.green}/{prog.total}</span>
        </div>
      </button>

      <!-- Statements -->
      {#if open}
        <div class="border-t border-white/8 divide-y divide-white/5">
          {#each topic.statements as stmt, i}
            {@const sKey = stmtKey(activeBoard, topic.name, i)}
            {@const rating = (ratings[sKey] ?? 0) as Confidence}

            <div class="flex items-start gap-3 px-5 py-3">
              <p class="flex-1 text-sm text-slate-300 leading-relaxed pt-0.5">{stmt}</p>

              <!-- Rating buttons -->
              <div class="flex gap-1 shrink-0">
                {#each [0, 1, 2] as level}
                  <button
                    on:click={() => setRating(sKey, rating === level ? 0 : level as Confidence)}
                    title={labels[level]}
                    class="h-7 w-7 rounded-full text-xs font-bold transition-all border"
                    style="
                      background: {rating === level ? colours[level] + '33' : 'transparent'};
                      border-color: {rating === level ? colours[level] : 'rgba(255,255,255,0.12)'};
                      color: {rating === level ? colours[level] : 'var(--text-4)'};
                    "
                  >{icons[level]}</button>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/each}
</div>

<!-- Legend -->
<div class="mt-6 flex flex-wrap gap-4 text-xs text-slate-500">
  <span>Rate each statement:</span>
  {#each [0,1,2] as level}
    <span>
      <span style="color:{colours[level]}">{icons[level]}</span>
      {labels[level]}
    </span>
  {/each}
  <span class="ml-auto">Progress saves automatically in your browser</span>
</div>
