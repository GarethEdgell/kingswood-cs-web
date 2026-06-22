<script lang="ts">
  export let questions: any[] = [];
  export let topicName: string = '';

  let answers: Record<string, number | null> = {};
  let revealed: Record<string, boolean> = {};
  let difficultyFilter: 'all' | 'easy' | 'medium' | 'hard' = 'all';

  let sessionCorrect = 0;
  let sessionAnswered = 0;

  $: filtered = questions.filter(q => {
    if (difficultyFilter !== 'all' && q.difficulty !== difficultyFilter) return false;
    return true;
  });

  $: scorePercent = sessionAnswered > 0 ? Math.round((sessionCorrect / sessionAnswered) * 100) : null;

  function answerMCQ(qId: string, optionIndex: number, correct: number) {
    if (answers[qId] !== undefined) return;
    answers[qId] = optionIndex;
    answers = { ...answers };
    sessionAnswered++;
    if (optionIndex === correct) sessionCorrect++;
  }

  function revealMarkScheme(qId: string) {
    revealed[qId] = true;
    revealed = { ...revealed };
  }

  function difficultyClass(d: string) {
    return d === 'easy'   ? 'text-green-400 bg-green-400/10 border-green-400/20'
         : d === 'medium' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
         : 'text-red-400 bg-red-400/10 border-red-400/20';
  }

  function reset() {
    answers = {};
    revealed = {};
    sessionCorrect = 0;
    sessionAnswered = 0;
  }
</script>

<!-- Stats bar -->
<div class="flex items-center justify-between mb-6">
  <div class="flex items-center gap-4">
    <span class="text-slate-400 text-sm">{filtered.length} questions</span>
    {#if sessionAnswered > 0}
      <span class="text-sm font-bold" class:text-green-400={scorePercent >= 70} class:text-amber-400={scorePercent >= 40 && scorePercent < 70} class:text-red-400={scorePercent < 40}>
        {sessionCorrect}/{sessionAnswered} correct ({scorePercent}%)
      </span>
    {/if}
  </div>

  <div class="flex items-center gap-2">
    <!-- Difficulty filter -->
    <div class="flex rounded-lg border border-white/10 overflow-hidden text-xs">
      {#each ['all','easy','medium','hard'] as d}
        <button
          class="px-3 py-1.5 font-medium transition-colors {difficultyFilter === d ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}"
          on:click={() => { difficultyFilter = d; }}
        >
          {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
        </button>
      {/each}
    </div>

    {#if sessionAnswered > 0}
      <button on:click={reset} class="px-3 py-1.5 text-xs border border-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
        Reset
      </button>
    {/if}
  </div>
</div>

<!-- Questions -->
<div class="space-y-4">
  {#each filtered as q (q.id)}
    <div class="rounded-xl border border-white/10 bg-white/5 p-5">
      <!-- Question header -->
      <div class="flex items-start justify-between gap-3 mb-4">
        <p class="text-white font-medium whitespace-pre-line flex-1">{q.text}</p>
        <span class="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full border {difficultyClass(q.difficulty)}">
          {q.difficulty}
        </span>
      </div>

      {#if q.type === 'mcq'}
        <!-- MCQ Options -->
        <div class="space-y-2">
          {#each q.options as option, i}
            {@const answered = answers[q.id] !== undefined}
            {@const chosen = answers[q.id] === i}
            {@const correct = i === q.correct}
            <button
              class="w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all {
                !answered ? 'border-white/10 hover:border-white/30 hover:bg-white/5 text-slate-300' :
                correct ? 'border-green-500/50 bg-green-500/15 text-green-300' :
                chosen ? 'border-red-500/50 bg-red-500/15 text-red-300' :
                'border-white/5 text-slate-500'
              }"
              disabled={answered}
              on:click={() => answerMCQ(q.id, i, q.correct)}
            >
              <span class="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{option}
            </button>
          {/each}
        </div>

        {#if answers[q.id] !== undefined}
          <div class="mt-3 rounded-lg px-4 py-3 text-sm {answers[q.id] === q.correct ? 'bg-green-500/10 border border-green-500/20 text-green-300' : 'bg-red-500/10 border border-red-500/20 text-red-300'}">
            {answers[q.id] === q.correct ? '✅ Correct!' : `❌ Incorrect — correct answer: ${q.options[q.correct]}`}
            {#if q.explanation}
              <p class="text-slate-300 mt-1">{q.explanation}</p>
            {/if}
          </div>
        {/if}

      {:else}
        <!-- Short/Long answer -->
        {#if !revealed[q.id]}
          <button
            class="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm hover:bg-cyan-500/30 transition-colors"
            on:click={() => revealMarkScheme(q.id)}
          >
            Show Mark Scheme
          </button>
        {:else}
          <div class="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
            <p class="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Mark Scheme</p>
            <p class="text-slate-300 whitespace-pre-line">{q.markScheme}</p>
          </div>
        {/if}
      {/if}
    </div>
  {/each}
</div>

{#if filtered.length === 0}
  <div class="text-center py-12 text-slate-500">No questions match the current filter.</div>
{/if}
