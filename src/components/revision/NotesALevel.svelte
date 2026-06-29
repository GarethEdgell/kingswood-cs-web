<script lang="ts">
  import { onMount } from 'svelte';
  import { ALEVEL_NOTES, type ALevelBoard } from '../../data/notes-alevel';

  // Accept external data (e.g. GCSE notes) or fall back to A Level default
  export let notesData: ALevelBoard[] = ALEVEL_NOTES;

  // When false, only the first topic of each board is fully unlocked —
  // every other spec point shows a teaser + upgrade prompt.
  export let isPro: boolean = true;

  // ── State ─────────────────────────────────────────────────────────
  let boards: ALevelBoard[]       = notesData;
  let activeBoardId               = boards[0]?.id ?? '';
  let activeTopicId               = '';
  let activeSpecPointId           = '';
  let sidebarOpen                 = false;

  $: activeBoard     = boards.find(b => b.id === activeBoardId);
  $: activeTopic     = activeBoard?.topics.find(t => t.id === activeTopicId);
  $: activeSpecPoint = activeTopic?.specPoints.find(s => s.id === activeSpecPointId);

  // Flat list of all spec points for prev/next
  $: allSpecPoints = (activeBoard?.topics ?? []).flatMap(t =>
    t.specPoints.map(s => ({ ...s, topicId: t.id, topicName: t.name }))
  );
  $: currentIdx = allSpecPoints.findIndex(s => s.id === activeSpecPointId);
  $: prevSP = currentIdx > 0 ? allSpecPoints[currentIdx - 1] : null;
  $: nextSP = currentIdx < allSpecPoints.length - 1 ? allSpecPoints[currentIdx + 1] : null;

  // First topic of each board is a free taster — everything else needs Pro.
  $: freeTopicId = activeBoard?.topics[0]?.id;
  $: isLocked = !isPro && !!activeTopic && activeTopic.id !== freeTopicId;

  // Expanded topics in sidebar
  let expandedTopics: Set<string> = new Set();

  // Sidebar search / filter
  let query = '';
  $: q = query.trim().toLowerCase();
  $: sidebarTopics = (activeBoard?.topics ?? []).map(topic => ({
    topic,
    points: q
      ? topic.specPoints.filter(sp => `${sp.id} ${sp.title}`.toLowerCase().includes(q))
      : topic.specPoints,
  })).filter(x => x.points.length > 0);

  function selectBoard(id: string) {
    activeBoardId = id;
    const board = boards.find(b => b.id === id);
    const firstTopic = board?.topics[0];
    activeTopicId     = firstTopic?.id ?? '';
    activeSpecPointId = firstTopic?.specPoints[0]?.id ?? '';
    expandedTopics    = new Set([activeTopicId]);
  }

  function selectSpecPoint(topicId: string, specId: string) {
    activeTopicId     = topicId;
    activeSpecPointId = specId;
    expandedTopics    = new Set([...expandedTopics, topicId]);
    sidebarOpen = false; // close on mobile
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  }

  function toggleTopic(topicId: string) {
    const s = new Set(expandedTopics);
    if (s.has(topicId)) s.delete(topicId); else s.add(topicId);
    expandedTopics = s;
  }

  onMount(() => {
    // Restore from hash or default to first spec point
    const hash = window.location.hash.slice(1);
    if (hash) {
      for (const board of boards) {
        for (const topic of board.topics) {
          const sp = topic.specPoints.find(s => s.id === hash);
          if (sp) {
            activeBoardId     = board.id;
            activeTopicId     = topic.id;
            activeSpecPointId = sp.id;
            expandedTopics    = new Set([topic.id]);
            return;
          }
        }
      }
    }
    // Default: first board, first topic, first spec point
    selectBoard(boards[0]?.id ?? '');
  });

  // Update hash on navigation
  function updateHash(id: string) {
    if (typeof window !== 'undefined')
      history.replaceState(null, '', '#' + id);
  }
  $: if (activeSpecPointId) updateHash(activeSpecPointId);

  // Render a section
  function sectionBg(type: string): string {
    switch (type) {
      case 'worked':  return 'bg-[#6c8cff]/8 border-[#6c8cff]/25';
      case 'tip':     return 'bg-[#34d399]/8 border-[#34d399]/25';
      case 'mistake': return 'bg-[#fb7185]/8 border-[#fb7185]/25';
      case 'keyterm': return 'bg-[var(--bg-hover)] border-white/8';
      default:        return '';
    }
  }
</script>

<!-- ── Board selector ────────────────────────────────────────────── -->
<div class="flex flex-wrap gap-2 mb-5">
  {#each boards as board}
    <button
      on:click={() => selectBoard(board.id)}
      class="rounded-full px-4 py-1.5 text-sm font-semibold transition-all border {activeBoardId === board.id
        ? 'bg-[#6c8cff]/20 border-[#6c8cff]/50 text-[#6c8cff]'
        : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'}"
    >{board.name}</button>
  {/each}
</div>

<!-- ── Main layout ───────────────────────────────────────────────── -->
<div class="flex gap-6 items-start">

  <!-- Sidebar toggle (mobile) -->
  <button
    on:click={() => sidebarOpen = !sidebarOpen}
    class="lg:hidden fixed bottom-6 right-6 z-50 rounded-full bg-[#6c8cff] text-white w-12 h-12 flex items-center justify-center shadow-lg shadow-[#6c8cff]/30 text-xl"
    aria-label="Toggle navigation"
  >{sidebarOpen ? '✕' : '☰'}</button>

  <!-- Sidebar -->
  <aside class="
    {sidebarOpen ? 'fixed inset-0 z-40 bg-[var(--bg-base)]/95 p-4 overflow-y-auto' : 'hidden'}
    lg:block lg:static lg:w-72 lg:shrink-0
  ">
    <div class="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto rounded-xl border border-white/8 bg-[var(--bg-card)] p-3">

      <!-- Search / filter -->
      <div class="relative mb-3">
        <input
          bind:value={query}
          placeholder="Search spec points…"
          class="w-full rounded-lg border border-white/10 bg-black/20 pl-8 pr-7 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#6c8cff]/50"
        />
        <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
        {#if query}
          <button on:click={() => query = ''} class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-sm" aria-label="Clear search">✕</button>
        {/if}
      </div>

      {#if activeBoard}
        {#if sidebarTopics.length === 0}
          <p class="px-3 py-4 text-sm text-slate-500 text-center">No spec points match “{query}”.</p>
        {/if}
        {#each sidebarTopics as { topic, points }}
          {@const isExpanded = q !== '' || expandedTopics.has(topic.id)}
          <!-- Topic header -->
          <button
            on:click={() => toggleTopic(topic.id)}
            class="w-full flex items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-white/5
              {activeTopicId === topic.id ? 'text-white' : 'text-slate-400'}"
          >
            <span class="text-xs transition-transform {isExpanded ? 'rotate-90' : ''} inline-block">▶</span>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-[#6c8cff]">{topic.number}</div>
              <div class="text-sm font-medium leading-tight truncate">{topic.name}</div>
            </div>
          </button>

          <!-- Spec points -->
          {#if isExpanded}
            <div class="ml-4 mb-1 border-l border-white/8 pl-2 space-y-0.5">
              {#each points as sp}
                <button
                  on:click={() => selectSpecPoint(topic.id, sp.id)}
                  class="w-full text-left rounded-lg px-2.5 py-1.5 text-xs transition-colors leading-snug
                    {activeSpecPointId === sp.id
                      ? 'bg-[#6c8cff]/20 text-[#6c8cff] font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}"
                >
                  <span class="font-mono mr-1.5 opacity-60">{sp.id}</span>{sp.title}
                </button>
              {/each}
            </div>
          {/if}
        {/each}
      {/if}

    </div>
  </aside>

  <!-- Content panel -->
  <div class="flex-1 min-w-0">
    {#if activeSpecPoint && activeTopic}

      <!-- Breadcrumb -->
      <div class="flex items-center gap-1.5 text-xs text-slate-500 mb-4 flex-wrap">
        <span>{activeBoard?.name}</span>
        <span>/</span>
        <span>{activeTopic.number} {activeTopic.name}</span>
        <span>/</span>
        <span class="text-slate-300">{activeSpecPoint.id} {activeSpecPoint.title}</span>
      </div>

      <!-- Spec point header -->
      <div class="mb-6">
        <div class="text-xs font-mono font-bold text-[#6c8cff] mb-1">{activeSpecPoint.id}</div>
        <h2 class="text-2xl font-extrabold text-white">{activeSpecPoint.title}</h2>
        {#if activeSpecPoint.examTip}
          <div class="mt-3 rounded-lg border border-[#fbbf24]/25 bg-[#fbbf24]/8 px-4 py-2.5 text-sm text-[#fbbf24] flex items-start gap-2">
            <span class="shrink-0">💡</span>
            <span>{activeSpecPoint.examTip}</span>
          </div>
        {/if}
      </div>

      {#if isLocked}
        <!-- Teaser: show the first text section, then an upgrade prompt -->
        {#each activeSpecPoint.sections.filter(s => s.type === 'text').slice(0, 1) as section}
          <div class="mb-4">
            {#if section.heading}
              <h3 class="text-lg font-bold text-white mb-2">{section.heading}</h3>
            {/if}
            <p class="text-slate-300 leading-relaxed">{@html section.body}</p>
          </div>
        {/each}

        <div class="relative">
          <div class="pointer-events-none select-none opacity-40 blur-[2px] space-y-4" aria-hidden="true">
            <div class="rounded-xl border border-white/8 bg-[var(--bg-hover)] p-4 h-24"></div>
            <div class="rounded-xl border border-white/8 bg-[var(--bg-hover)] p-4 h-24"></div>
            <div class="rounded-xl border border-white/8 bg-[var(--bg-hover)] p-4 h-16"></div>
          </div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="rounded-2xl border border-[#6c8cff]/30 bg-gradient-to-b from-[var(--bg-hover)] to-[var(--bg-card)] p-8 text-center max-w-sm shadow-xl">
              <div class="mb-3 text-4xl">🔒</div>
              <h3 class="text-lg font-bold text-white">Unlock the full notes</h3>
              <p class="mt-2 text-sm text-slate-400">
                You're viewing a free taster of A Level notes ({activeTopic.number} {activeTopic.name}).
                Upgrade to Pro for worked examples, key terms, exam tips and common mistakes across every spec point.
              </p>
              <a href="/pricing" class="mt-5 inline-block rounded-xl bg-[#6c8cff] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#4a6cf7] transition-colors">
                See Pro plans →
              </a>
            </div>
          </div>
        </div>
      {:else}
      <!-- Sections -->
      <div class="space-y-4">
        {#each activeSpecPoint.sections as section}
          {#if section.type === 'text'}
            <div>
              {#if section.heading}
                <h3 class="text-lg font-bold text-white mb-2">{section.heading}</h3>
              {/if}
              <p class="text-slate-300 leading-relaxed">{@html section.body}</p>
            </div>

          {:else if section.type === 'keyterm'}
            <div class="rounded-xl border border-white/8 bg-[var(--bg-hover)] p-4">
              <div class="text-xs font-semibold uppercase tracking-wider text-[#6c8cff] mb-1">Key term</div>
              <div class="font-bold text-white mb-1">{section.term}</div>
              <div class="text-sm text-slate-300 leading-relaxed">{section.def}</div>
            </div>

          {:else if section.type === 'worked'}
            <div class="rounded-xl border border-[#6c8cff]/25 bg-[#6c8cff]/8 overflow-hidden">
              <div class="px-4 py-2 border-b border-[#6c8cff]/15 text-xs font-semibold text-[#6c8cff]">{section.label}</div>
              <pre class="px-4 py-3 text-sm font-mono text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">{section.code}</pre>
            </div>

          {:else if section.type === 'tip'}
            <div class="rounded-xl border border-[#34d399]/25 bg-[#34d399]/8 px-4 py-3 flex gap-3">
              <span class="shrink-0 text-lg">✅</span>
              <p class="text-sm text-slate-300 leading-relaxed">{section.text}</p>
            </div>

          {:else if section.type === 'mistake'}
            <div class="rounded-xl border border-[#fb7185]/25 bg-[#fb7185]/8 px-4 py-3 flex gap-3">
              <span class="shrink-0 text-lg">⚠️</span>
              <p class="text-sm text-slate-300 leading-relaxed">{section.text}</p>
            </div>

          {:else if section.type === 'table'}
            <div class="overflow-x-auto rounded-xl border border-white/8">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-[#6c8cff]/15">
                    {#each section.headers as h}
                      <th class="px-4 py-2.5 text-left font-semibold text-white">{h}</th>
                    {/each}
                  </tr>
                </thead>
                <tbody>
                  {#each section.rows as row, i}
                    <tr class="border-t border-white/5 {i % 2 === 1 ? 'bg-white/2' : ''}">
                      {#each row as cell, j}
                        <td class="px-4 py-2.5 {j === 0 ? 'font-medium text-white' : 'text-slate-300'}">{@html cell}</td>
                      {/each}
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          {/if}
        {/each}
      </div>
      {/if}

      <!-- Prev / Next navigation -->
      <div class="mt-10 pt-6 border-t border-white/8 flex justify-between gap-4">
        {#if prevSP}
          <button
            on:click={() => selectSpecPoint(prevSP.topicId, prevSP.id)}
            class="flex-1 text-left rounded-xl border border-white/8 bg-[var(--bg-card)] px-4 py-3 hover:border-[#6c8cff]/40 transition-colors"
          >
            <div class="text-xs text-slate-500 mb-0.5">← Previous</div>
            <div class="text-sm font-semibold text-white">{prevSP.id} {prevSP.title}</div>
          </button>
        {:else}
          <div class="flex-1"></div>
        {/if}
        {#if nextSP}
          <button
            on:click={() => selectSpecPoint(nextSP.topicId, nextSP.id)}
            class="flex-1 text-right rounded-xl border border-white/8 bg-[var(--bg-card)] px-4 py-3 hover:border-[#6c8cff]/40 transition-colors"
          >
            <div class="text-xs text-slate-500 mb-0.5">Next →</div>
            <div class="text-sm font-semibold text-white">{nextSP.id} {nextSP.title}</div>
          </button>
        {:else}
          <div class="flex-1"></div>
        {/if}
      </div>

    {:else}
      <div class="rounded-2xl border border-white/8 bg-[var(--bg-card)] p-8 text-center text-slate-500">
        Select a spec point from the left menu to begin.
      </div>
    {/if}
  </div>

</div>
