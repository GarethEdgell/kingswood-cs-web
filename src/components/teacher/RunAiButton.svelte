<script lang="ts">
  // Teacher-only: batch-run all pending submissions through the AI.
  export let assignmentId: string;
  export let pendingCount: number = 0;

  let running = false;
  let message = '';

  async function run() {
    running = true;
    message = '';
    try {
      const res = await fetch(`/api/assignments/${assignmentId}/run-ai`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        message = `✅ Ran ${data.done}/${data.processed} submissions${data.failed ? `, ${data.failed} failed` : ''}. Refreshing…`;
        setTimeout(() => window.location.reload(), 900);
      } else {
        message = `⚠️ ${data.error ?? 'Run failed.'}`;
      }
    } catch {
      message = '⚠️ Could not reach the server.';
    } finally {
      running = false;
    }
  }
</script>

<div class="flex items-center gap-3">
  <button on:click={run} disabled={running || pendingCount === 0}
    class="rounded-lg px-5 py-2.5 font-bold transition-colors {pendingCount > 0 ? 'bg-purple-500 text-white hover:bg-purple-400' : 'bg-white/10 text-slate-500 cursor-not-allowed'} disabled:opacity-60">
    {running ? '🤖 Running…' : `▶ Run all pending through AI (${pendingCount})`}
  </button>
  {#if message}<span class="text-sm text-slate-300">{message}</span>{/if}
</div>
