<script lang="ts">
  // Teacher tool to create an assignment for a class.
  export let classId: string;
  // [{ id, title, year, hasQuiz }]
  export let lessons: { id: string; title: string; year: number; hasQuiz: boolean }[] = [];

  let open = false;
  let type: 'quiz' | 'ai-task' | 'work' = 'quiz';
  let lessonId = lessons[0]?.id ?? '';
  let title = '';
  let instructions = '';
  let promptGuidance = '';
  let aiSystemPrompt = 'You are a supportive teacher giving feedback to a school student. Be encouraging, specific and age-appropriate. Do not write the work for them — guide them to improve it themselves.';
  let dueDate = '';
  let saving = false;
  let message = '';

  $: selectedLesson = lessons.find(l => l.id === lessonId);
  // Default the title from the chosen lesson + type.
  $: if (selectedLesson && !titleEdited) {
    title = type === 'quiz' ? `Quiz: ${selectedLesson.title}` : `${selectedLesson.title} — ${type === 'ai-task' ? 'AI Task' : 'Task'}`;
  }
  let titleEdited = false;

  $: quizMissing = type === 'quiz' && selectedLesson && !selectedLesson.hasQuiz;

  async function create() {
    if (!title.trim()) { message = 'Give the assignment a title.'; return; }
    if (quizMissing) { message = 'That lesson has no quiz yet. Pick a different lesson or type.'; return; }
    saving = true;
    message = '';
    try {
      const res = await fetch('/api/assignments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId, type, lessonId,
          quizId: type === 'quiz' ? lessonId : null,
          title, instructions, promptGuidance,
          aiSystemPrompt: type === 'ai-task' ? aiSystemPrompt : null,
          dueDate: dueDate || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        message = '✅ Assignment created.';
        setTimeout(() => window.location.reload(), 600);
      } else {
        message = `⚠️ ${data.error ?? 'Could not create assignment.'}`;
      }
    } catch {
      message = '⚠️ Could not reach the server.';
    } finally {
      saving = false;
    }
  }
</script>

{#if !open}
  <button on:click={() => (open = true)}
    class="rounded-lg px-4 py-2 text-sm font-bold bg-cyan-500 text-black hover:bg-cyan-400 transition-colors">
    ➕ New assignment
  </button>
{:else}
  <div class="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-bold text-white">New assignment</h3>
      <button on:click={() => (open = false)} class="text-slate-400 hover:text-white text-sm">✕ Close</button>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <label class="block text-xs font-bold text-slate-400 mb-1" for="type">Type</label>
        <select id="type" bind:value={type} class="w-full rounded-lg border border-white/10 bg-slate-900 p-2 text-sm text-white">
          <option value="quiz">Quiz (auto-graded)</option>
          <option value="ai-task">AI Task (teacher-run AI)</option>
          <option value="work">Work submission (no AI)</option>
        </select>
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-400 mb-1" for="lesson">Lesson</label>
        <select id="lesson" bind:value={lessonId} class="w-full rounded-lg border border-white/10 bg-slate-900 p-2 text-sm text-white">
          {#each lessons as l}
            <option value={l.id}>Y{l.year} · {l.title}{l.hasQuiz ? '' : ' (no quiz)'}</option>
          {/each}
        </select>
      </div>
    </div>

    <div>
      <label class="block text-xs font-bold text-slate-400 mb-1" for="title">Title</label>
      <input id="title" bind:value={title} on:input={() => (titleEdited = true)}
        class="w-full rounded-lg border border-white/10 bg-slate-900 p-2 text-sm text-white" />
    </div>

    <div>
      <label class="block text-xs font-bold text-slate-400 mb-1" for="instructions">Instructions (shown to students)</label>
      <textarea id="instructions" bind:value={instructions} rows="2"
        class="w-full rounded-lg border border-white/10 bg-slate-900 p-2 text-sm text-white"></textarea>
    </div>

    {#if type === 'ai-task'}
      <div>
        <label class="block text-xs font-bold text-slate-400 mb-1" for="guidance">Prompt guidance (helps students write their prompt)</label>
        <textarea id="guidance" bind:value={promptGuidance} rows="2"
          placeholder="e.g. Ask the AI to act as a GCSE English teacher and give 3 specific improvements."
          class="w-full rounded-lg border border-white/10 bg-slate-900 p-2 text-sm text-white"></textarea>
      </div>
      <div>
        <label class="block text-xs font-bold text-slate-400 mb-1" for="system">AI system prompt (controls how the AI responds for the whole class)</label>
        <textarea id="system" bind:value={aiSystemPrompt} rows="3"
          class="w-full rounded-lg border border-white/10 bg-slate-900 p-2 text-sm text-white"></textarea>
      </div>
    {/if}

    <div>
      <label class="block text-xs font-bold text-slate-400 mb-1" for="due">Due date (optional)</label>
      <input id="due" type="datetime-local" bind:value={dueDate}
        class="rounded-lg border border-white/10 bg-slate-900 p-2 text-sm text-white" />
    </div>

    {#if quizMissing}
      <p class="text-xs text-amber-400">⚠️ This lesson has no quiz yet — choose another lesson or a different type.</p>
    {/if}

    <div class="flex items-center gap-3">
      <button on:click={create} disabled={saving}
        class="rounded-lg px-5 py-2 text-sm font-bold bg-cyan-500 text-black hover:bg-cyan-400 transition-colors disabled:opacity-60">
        {saving ? 'Creating…' : 'Create assignment'}
      </button>
      {#if message}<span class="text-sm text-slate-300">{message}</span>{/if}
    </div>
  </div>
{/if}
