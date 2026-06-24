<script lang="ts">
  // Student AI-task submission. Students write their own work + a prompt, then
  // submit to the teacher. They NEVER call the AI directly — the teacher runs
  // the class's submissions and the response appears here once done.
  export let assignmentId: string;
  export let promptGuidance: string = '';
  export let initialWork: string = '';
  export let initialPrompt: string = '';
  export let aiStatus: string = 'none'; // none | pending | processing | done | error
  export let aiResponse: string = '';
  export let submitType: 'ai-task' | 'work' = 'ai-task';

  $: isAiTask = submitType === 'ai-task';

  let work = initialWork;
  let prompt = initialPrompt;
  let saving = false;
  let message = '';
  let status = aiStatus;
  let response = aiResponse;

  $: locked = status === 'pending' || status === 'processing' || status === 'done';

  async function submit() {
    if (!work.trim() && (!isAiTask || !prompt.trim())) {
      message = isAiTask ? 'Add your work and a prompt before submitting.' : 'Add your work before submitting.';
      return;
    }
    saving = true;
    message = '';
    try {
      const res = await fetch('/api/submissions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId, type: submitType, workText: work, promptText: prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        status = isAiTask ? 'pending' : 'none';
        message = isAiTask
          ? '✅ Submitted! Your teacher will run this through the AI. Check back soon.'
          : '✅ Submitted to your teacher.';
      } else {
        message = `⚠️ ${data.error ?? 'Could not submit.'}`;
      }
    } catch {
      message = '⚠️ Could not reach the server.';
    } finally {
      saving = false;
    }
  }
</script>

<div class="space-y-5">
  {#if promptGuidance}
    <div class="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-sm text-purple-200">
      <span class="font-bold">Guidance:</span> {promptGuidance}
    </div>
  {/if}

  <div>
    <label class="block text-sm font-bold text-white mb-2" for="work">Your work</label>
    <textarea id="work" bind:value={work} disabled={locked} rows="6"
      placeholder="Paste the piece of your own work you want feedback on…"
      class="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-slate-500 disabled:opacity-60"></textarea>
  </div>

  {#if isAiTask}
    <div>
      <label class="block text-sm font-bold text-white mb-2" for="prompt">Your prompt to the AI</label>
      <textarea id="prompt" bind:value={prompt} disabled={locked} rows="3"
        placeholder="e.g. Act as a GCSE English teacher and give me 3 specific improvements for this paragraph."
        class="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-slate-500 disabled:opacity-60"></textarea>
    </div>
  {/if}

  {#if !locked}
    <button on:click={submit} disabled={saving}
      class="rounded-lg px-5 py-2.5 font-bold bg-cyan-500 text-black hover:bg-cyan-400 transition-colors disabled:opacity-60">
      {saving ? 'Submitting…' : 'Submit to teacher'}
    </button>
  {/if}

  {#if message}
    <p class="text-sm text-slate-300">{message}</p>
  {/if}

  <!-- AI response -->
  {#if status === 'pending' || status === 'processing'}
    <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
      ⏳ Submitted — waiting for your teacher to run the AI. Reload this page to check for your response.
    </div>
  {:else if status === 'done' && response}
    <div class="rounded-xl border border-green-500/30 bg-green-500/10 p-5">
      <h3 class="font-bold text-green-300 mb-2">🤖 AI response (run by your teacher)</h3>
      <p class="text-slate-200 text-sm whitespace-pre-wrap">{response}</p>
      <p class="text-xs text-slate-400 mt-3">Now: read it critically. Is it useful? Is anything wrong? Improve your work yourself and write your AI use statement.</p>
    </div>
  {:else if status === 'error'}
    <div class="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
      The AI run failed. Ask your teacher to run it again.
    </div>
  {/if}
</div>
