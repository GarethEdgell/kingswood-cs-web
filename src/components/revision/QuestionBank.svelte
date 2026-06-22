<script lang="ts">
  import { onMount } from 'svelte';
  import AchievementToast from '../AchievementToast.svelte';
  import { SPECS } from '../../data/specs.ts';
  import { QUESTIONS } from '../../data/questions.ts';
  import { SC_SPECS } from '../../data/scSpecs.ts';

  // ── Types ────────────────────────────────────────────────────────────────
  type MCQQuestion = { id: string; text: string; type: 'mcq'; difficulty: string; statement?: number; options: string[]; correct: number; explanation: string };
  type ShortQuestion = { id: string; text: string; type: 'short'; difficulty: string; statement?: number; markScheme: string };
  type Question = MCQQuestion | ShortQuestion;

  // Maps topic-id prefix → SC_SPECS key
  const SPEC_KEY_MAP: Record<string, string> = {
    'aqag': 'aqagcse',
    'ocrg': 'ocrgcse',
    'camg': 'camigcse',
    'aqa':  'aqaalevel',
    'ocr':  'ocralevel',
    'cam':  'camalevel',
  };

  function topicStatements(topicId: string | null): string[] {
    if (!topicId) return [];
    // Match longest prefix first (aqa before aqag, ocr before ocrg, cam before camg)
    const prefix = ['aqag','ocrg','camg','aqa','ocr','cam'].find(p => topicId.startsWith(p + '-'));
    if (!prefix) return [];
    const scKey = SPEC_KEY_MAP[prefix];
    const scSpec = (SC_SPECS as any)[scKey];
    if (!scSpec) return [];
    // topic index from the number suffix
    const idx = parseInt(topicId.split('-')[1], 10) - 1;
    return scSpec.topics[idx]?.statements ?? [];
  }

  // ── State ────────────────────────────────────────────────────────────────
  let selectedSpec = 'AQA GCSE';
  let selectedTopicId: string | null = null;
  let difficultyFilter: 'all' | 'easy' | 'medium' | 'hard' = 'all';
  let selectedStatement: number | null = null;

  // Per-question state
  let answers: Record<string, number | null> = {};
  let revealed: Record<string, boolean> = {};
  // Gamification toast state
  let toastAchievement: any = null;
  let toastXp = 0;
  let toastLevelUp = false;
  let toastLevel = 1;
  let flagged: Record<string, boolean> = {};

  // Session stats
  let sessionCorrect = 0;
  let sessionAnswered = 0;

  // ── Computed ────────────────────────────────────────────────────────────
  $: specData = (SPECS as any)[selectedSpec];
  $: topics = specData?.topics ?? [];

  $: selectedTopic = selectedTopicId
    ? topics.find((t: any) => t.id === selectedTopicId)
    : null;

  $: statements = topicStatements(selectedTopicId);

  $: rawQuestions = (selectedTopicId ? (QUESTIONS as any)[selectedTopicId] ?? [] : []) as Question[];

  $: filteredQuestions = rawQuestions.filter(q => {
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
    if (selectedStatement !== null && (q as any).statement !== selectedStatement) return false;
    return true;
  });

  $: specGroups = {
    gcse: Object.entries(SPECS).filter(([, v]: [string, any]) => v.level === 'gcse').map(([k]) => k),
    alevel: Object.entries(SPECS).filter(([, v]: [string, any]) => !v.level).map(([k]) => k),
  };

  // ── Helpers ────────────────────────────────────────────────────────────
  function selectTopic(id: string) {
    selectedTopicId = id;
    selectedStatement = null;
    answers = {};
    revealed = {};
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function answerMCQ(qId: string, optionIndex: number, correct: number) {
    if (answers[qId] !== undefined) return; // already answered
    answers[qId] = optionIndex;
    answers = { ...answers };
    sessionAnswered++;
    const isCorrect = optionIndex === correct;
    if (isCorrect) sessionCorrect++;

    // Save to DB + handle gamification response
    fetch('/api/progress/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question_id: qId, correct: isCorrect }),
    }).then(r => r.json()).then(data => {
      if (data.xpGained) {
        toastXp = data.xpGained;
        toastLevelUp = data.levelUp ?? false;
        toastLevel   = data.newLevel ?? 1;
        toastAchievement = data.newAchievements?.[0] ?? null;
        // Show next achievement after first one clears
        if (data.newAchievements?.length > 1) {
          setTimeout(() => { toastAchievement = data.newAchievements[1]; }, 4200);
        }
      }
    }).catch(() => {});
  }

  function revealMarkScheme(qId: string) {
    revealed[qId] = true;
    revealed = { ...revealed };
  }

  function toggleFlag(qId: string) {
    flagged[qId] = !flagged[qId];
    flagged = { ...flagged };
  }

  function difficultyClass(d: string) {
    return d === 'easy' ? 'text-[#34d399] bg-[#34d399]/10 border-[#34d399]/20'
         : d === 'medium' ? 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20'
         : 'text-[#fb7185] bg-[#fb7185]/10 border-[#fb7185]/20';
  }

  function resetTopic() {
    answers = {};
    revealed = {};
    sessionCorrect = 0;
    sessionAnswered = 0;
  }
</script>

<div class="flex min-h-screen flex-col">

  <!-- Spec selector tabs -->
  <div class="border-b border-white/8 bg-[var(--bg-card)] px-4 py-3 sm:px-6">
    <div class="mx-auto max-w-7xl">
      <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">GCSE</div>
      <div class="flex flex-wrap gap-2 mb-4">
        {#each specGroups.gcse as spec}
          <button
            on:click={() => { selectedSpec = spec; selectedTopicId = null; }}
            class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {selectedSpec === spec ? 'bg-[#6c8cff] text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}"
          >
            {spec}
          </button>
        {/each}
      </div>
      <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">A Level</div>
      <div class="flex flex-wrap gap-2">
        {#each specGroups.alevel as spec}
          <button
            on:click={() => { selectedSpec = spec; selectedTopicId = null; }}
            class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {selectedSpec === spec ? 'bg-[#6c8cff] text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}"
          >
            {spec}
          </button>
        {/each}
      </div>
    </div>
  </div>

  <div class="flex flex-1">

    <!-- Sidebar: topic list -->
    <aside class="hidden w-72 shrink-0 border-r border-white/8 bg-[var(--bg-card)] md:block">
      <div class="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto p-4">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{selectedSpec} Topics</h2>
        <nav class="space-y-1">
          {#each topics as topic}
            <button
              on:click={() => selectTopic(topic.id)}
              class="w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors {selectedTopicId === topic.id ? 'bg-[#6c8cff]/20 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}"
            >
              <div class="flex items-center justify-between">
                <span>
                  <span class="mr-1.5 text-xs font-medium text-[#6c8cff]">{topic.num}</span>
                  {topic.name}
                </span>
                <span class="ml-2 shrink-0 rounded-full bg-white/5 px-1.5 py-0.5 text-xs text-slate-500">{topic.qCount}</span>
              </div>
            </button>
          {/each}
        </nav>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 px-4 py-6 sm:px-6">
      <div class="mx-auto max-w-3xl">

        {#if !selectedTopicId}
          <!-- Landing: pick a topic -->
          <div class="mb-8">
            <h1 class="text-2xl font-bold text-white">{selectedSpec} Question Bank</h1>
            <p class="mt-2 text-slate-400">Select a topic from the sidebar to start practising.</p>
          </div>

          <!-- Mobile topic grid -->
          <div class="grid gap-3 sm:grid-cols-2 md:hidden">
            {#each topics as topic}
              <button
                on:click={() => selectTopic(topic.id)}
                class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4 text-left transition-all hover:border-white/20"
              >
                <div class="text-xs font-medium text-[#6c8cff]">{topic.num}</div>
                <div class="mt-1 font-medium text-white">{topic.name}</div>
                <div class="mt-1.5 text-xs text-slate-500">{topic.qCount} questions</div>
              </button>
            {/each}
          </div>

          <!-- Desktop overview -->
          <div class="hidden md:block">
            <div class="grid gap-3 sm:grid-cols-2">
              {#each topics as topic}
                <button
                  on:click={() => selectTopic(topic.id)}
                  class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4 text-left transition-all hover:border-[#6c8cff]/40 hover:bg-[var(--bg-hover)]"
                >
                  <div class="text-xs font-medium text-[#6c8cff]">Topic {topic.num}</div>
                  <div class="mt-1 font-medium text-white">{topic.name}</div>
                  <div class="mt-2 text-xs text-slate-500">{topic.qCount} questions →</div>
                </button>
              {/each}
            </div>
          </div>

        {:else}
          <!-- Topic header -->
          <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <button on:click={() => { selectedTopicId = null; }} class="mb-2 flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors">
                ← Back to topics
              </button>
              <h1 class="text-2xl font-bold text-white">{selectedTopic?.name}</h1>
              <p class="mt-1 text-sm text-slate-400">{selectedSpec} · Topic {selectedTopic?.num} · {filteredQuestions.length} questions</p>
            </div>
            <div class="flex items-center gap-2">
              {#if sessionAnswered > 0}
                <div class="rounded-lg bg-[var(--bg-card)] border border-white/8 px-4 py-2 text-center">
                  <div class="text-lg font-bold text-white">{sessionCorrect}/{sessionAnswered}</div>
                  <div class="text-xs text-slate-500">correct</div>
                </div>
              {/if}
              <button on:click={resetTopic} class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
                Reset
              </button>
            </div>
          </div>

          <!-- Difficulty filter -->
          <div class="mb-3 flex gap-2 flex-wrap">
            {#each ['all', 'easy', 'medium', 'hard'] as diff}
              <button
                on:click={() => difficultyFilter = diff as any}
                class="rounded-full px-3 py-1 text-xs font-medium transition-colors capitalize {difficultyFilter === diff ? 'bg-[#6c8cff] text-white' : 'bg-white/5 text-slate-400 hover:text-white'}"
              >
                {diff}
              </button>
            {/each}
          </div>

          <!-- Spec point filter -->
          {#if statements.length > 0}
            <div class="mb-6 rounded-xl border border-white/8 bg-[var(--bg-card)] p-3">
              <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Filter by spec point</div>
              <div class="flex flex-col gap-1">
                <button
                  on:click={() => selectedStatement = null}
                  class="rounded-lg px-3 py-1.5 text-left text-xs transition-colors {selectedStatement === null ? 'bg-[#6c8cff]/20 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}"
                >
                  All spec points
                </button>
                {#each statements as stmt, i}
                  <button
                    on:click={() => selectedStatement = i}
                    class="rounded-lg px-3 py-1.5 text-left text-xs leading-snug transition-colors {selectedStatement === i ? 'bg-[#6c8cff]/20 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}"
                  >
                    <span class="font-semibold text-[#6c8cff] mr-1">{i + 1}.</span>{stmt}
                  </button>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Questions -->
          <div class="space-y-6">
            {#each filteredQuestions as q, i}
              {@const answered = q.type === 'mcq' ? answers[q.id] !== undefined : revealed[q.id]}
              {@const chosenAnswer = q.type === 'mcq' ? answers[q.id] : null}
              {@const isCorrect = q.type === 'mcq' && chosenAnswer === (q as MCQQuestion).correct}

              <div class="rounded-xl border {answered ? (q.type === 'mcq' && isCorrect ? 'border-[#34d399]/40' : q.type === 'mcq' ? 'border-[#fb7185]/40' : 'border-white/20') : 'border-white/8'} bg-[var(--bg-card)] p-5 transition-all">

                <!-- Question header -->
                <div class="mb-3 flex items-start justify-between gap-3">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-bold text-slate-400">{i + 1}</span>
                    <span class="rounded-full border px-2 py-0.5 text-xs font-semibold capitalize {difficultyClass(q.difficulty)}">{q.difficulty}</span>
                    <span class="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-500">{q.type === 'mcq' ? 'Multiple choice' : 'Short answer'}</span>
                    {#if (q as any).statement !== undefined && statements[(q as any).statement]}
                      <span class="rounded-full bg-[#6c8cff]/10 border border-[#6c8cff]/20 px-2 py-0.5 text-xs text-[#6c8cff]" title={statements[(q as any).statement]}>
                        Spec point {(q as any).statement + 1}
                      </span>
                    {/if}
                  </div>
                  <button on:click={() => toggleFlag(q.id)} class="shrink-0 text-base transition-opacity {flagged[q.id] ? 'opacity-100' : 'opacity-30 hover:opacity-60'}" title="Flag for review">
                    {flagged[q.id] ? '🚩' : '⚑'}
                  </button>
                </div>

                <!-- Question text -->
                <p class="mb-4 whitespace-pre-wrap text-white leading-relaxed">{q.text}</p>

                <!-- MCQ options -->
                {#if q.type === 'mcq'}
                  {@const mcq = q as MCQQuestion}
                  <div class="space-y-2">
                    {#each mcq.options as option, oi}
                      {@const isChosen = chosenAnswer === oi}
                      {@const isCorrectOpt = oi === mcq.correct}
                      {@const showResult = answered}
                      <button
                        on:click={() => answerMCQ(q.id, oi, mcq.correct)}
                        disabled={answered}
                        class="w-full rounded-lg border px-4 py-3 text-left text-sm transition-all disabled:cursor-default
                          {showResult && isCorrectOpt ? 'border-[#34d399]/60 bg-[#34d399]/10 text-[#34d399]' :
                           showResult && isChosen && !isCorrectOpt ? 'border-[#fb7185]/60 bg-[#fb7185]/10 text-[#fb7185]' :
                           !answered ? 'border-white/10 bg-white/5 text-slate-300 hover:border-[#6c8cff]/40 hover:bg-[#6c8cff]/10 hover:text-white' :
                           'border-white/5 bg-white/2 text-slate-500'}"
                      >
                        <span class="mr-2 font-semibold">{String.fromCharCode(65 + oi)}.</span>{option}
                      </button>
                    {/each}
                  </div>

                  {#if answered}
                    <div class="mt-4 rounded-lg {isCorrect ? 'bg-[#34d399]/10 border border-[#34d399]/20' : 'bg-[#fb7185]/10 border border-[#fb7185]/20'} p-4">
                      <div class="mb-1 font-semibold {isCorrect ? 'text-[#34d399]' : 'text-[#fb7185]'}">
                        {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                      </div>
                      <p class="text-sm text-slate-300">{mcq.explanation}</p>
                    </div>
                  {/if}

                <!-- Short answer -->
                {:else}
                  {@const sa = q as ShortQuestion}
                  {#if !revealed[q.id]}
                    <button
                      on:click={() => revealMarkScheme(q.id)}
                      class="rounded-lg border border-[#6c8cff]/30 bg-[#6c8cff]/10 px-4 py-2.5 text-sm font-medium text-[#6c8cff] transition-colors hover:bg-[#6c8cff]/20"
                    >
                      Reveal mark scheme
                    </button>
                  {:else}
                    <div class="rounded-lg border border-white/10 bg-[var(--bg-base)] p-4">
                      <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Mark Scheme</div>
                      <div class="whitespace-pre-line text-sm text-slate-300 leading-relaxed">{sa.markScheme}</div>
                    </div>
                  {/if}
                {/if}

              </div>
            {/each}
          </div>

          {#if filteredQuestions.length === 0}
            <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-12 text-center">
              <p class="text-slate-400">No questions match the selected difficulty.</p>
            </div>
          {/if}

        {/if}
      </div>
    </main>
  </div>
</div>


