<script lang="ts">
  import type { DFQuiz } from '../data/dfQuizzes';

  // `quiz` is required. `assignmentId` is set only when taken as an assignment —
  // in that case the score is recorded server-side via /api/submissions/submit.
  export let quiz: DFQuiz;
  export let assignmentId: string | null = null;
  export let courseId: string = 'digital-futures';

  let answers: Record<string, number> = {};
  let submitting = false;
  let submitted = false;
  let saveMessage = '';

  $: total = quiz.questions.length;
  $: answeredCount = Object.keys(answers).length;
  $: allAnswered = answeredCount === total;
  $: correctCount = quiz.questions.filter(q => answers[q.id] === q.correctIndex).length;
  $: scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  function choose(qId: string, optionIndex: number) {
    if (answers[qId] !== undefined || submitted) return;
    answers = { ...answers, [qId]: optionIndex };
  }

  function reset() {
    answers = {};
    submitted = false;
    saveMessage = '';
  }

  async function finish() {
    submitted = true;

    // Always bump aggregate progress for logged-in students.
    try {
      await fetch('/api/progress/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, lessonId: quiz.lessonId, score: scorePercent, type: 'quiz' }),
      });
    } catch { /* progress is best-effort */ }

    // If this is an assignment, submit answers for server-side grading + recording.
    if (assignmentId) {
      submitting = true;
      try {
        const res = await fetch('/api/submissions/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assignmentId, type: 'quiz', quizAnswers: answers }),
        });
        const data = await res.json();
        saveMessage = res.ok
          ? '✅ Submitted to your teacher.'
          : `⚠️ Could not submit: ${data.error ?? 'unknown error'}`;
      } catch {
        saveMessage = '⚠️ Could not reach the server. Your answers were not submitted.';
      } finally {
        submitting = false;
      }
    }
  }
</script>

<div class="space-y-4">
  <!-- Progress -->
  <div class="flex items-center justify-between text-sm">
    <span class="text-slate-400">{answeredCount} / {total} answered</span>
    {#if submitted}
      <span class="font-bold {scorePercent >= 70 ? 'text-green-400' : scorePercent >= 40 ? 'text-amber-400' : 'text-red-400'}">
        Score: {correctCount}/{total} ({scorePercent}%)
      </span>
    {/if}
  </div>

  {#each quiz.questions as q, qi (q.id)}
    <div class="rounded-xl border border-white/10 bg-white/5 p-5">
      <p class="text-white font-medium mb-4"><span class="text-cyan-400 font-bold mr-2">Q{qi + 1}.</span>{q.question}</p>

      <div class="space-y-2">
        {#each q.options as option, i}
          {@const answered = answers[q.id] !== undefined}
          {@const chosen = answers[q.id] === i}
          {@const isCorrect = i === q.correctIndex}
          <button
            class="w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all {
              !answered ? 'border-white/10 hover:border-white/30 hover:bg-white/5 text-slate-300' :
              isCorrect ? 'border-green-500/50 bg-green-500/15 text-green-300' :
              chosen ? 'border-red-500/50 bg-red-500/15 text-red-300' :
              'border-white/5 text-slate-500'
            }"
            disabled={answered || submitted}
            on:click={() => choose(q.id, i)}
          >
            <span class="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{option}
          </button>
        {/each}
      </div>

      {#if answers[q.id] !== undefined}
        <div class="mt-3 rounded-lg px-4 py-3 text-sm {answers[q.id] === q.correctIndex ? 'bg-green-500/10 border border-green-500/20 text-green-300' : 'bg-red-500/10 border border-red-500/20 text-red-300'}">
          {answers[q.id] === q.correctIndex ? '✅ Correct!' : `❌ Not quite — correct answer: ${q.options[q.correctIndex]}`}
          <p class="text-slate-300 mt-1">{q.explanation}</p>
        </div>
      {/if}
    </div>
  {/each}

  <!-- Actions -->
  <div class="flex items-center gap-3 pt-2">
    {#if !submitted}
      <button
        class="rounded-lg px-5 py-2.5 font-bold transition-colors {allAnswered ? 'bg-cyan-500 text-black hover:bg-cyan-400' : 'bg-white/10 text-slate-500 cursor-not-allowed'}"
        disabled={!allAnswered || submitting}
        on:click={finish}
      >
        {submitting ? 'Submitting…' : assignmentId ? 'Submit to teacher' : 'Finish quiz'}
      </button>
      {#if !allAnswered}
        <span class="text-xs text-slate-500">Answer all questions to finish.</span>
      {/if}
    {:else}
      <button class="rounded-lg px-5 py-2.5 font-bold border border-white/20 text-white hover:bg-white/10 transition-colors" on:click={reset}>
        Try again
      </button>
      {#if saveMessage}
        <span class="text-sm text-slate-300">{saveMessage}</span>
      {/if}
    {/if}
  </div>
</div>
