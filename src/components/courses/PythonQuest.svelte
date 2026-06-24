<script lang="ts">
  import { onMount } from 'svelte';
  import { PYTHON_WORLDS, levelFromXP, rankFromLevel, type Challenge, type World } from '../../data/pythonCourse';

  // Course data is injected so this component powers both the GCSE and A Level
  // quests. Defaults keep the original GCSE page working unchanged.
  export let worlds: World[] = PYTHON_WORLDS;
  export let storageKey = 'pyquest-progress';
  export let masteryNoun = 'every OCR GCSE Python skill';

  let completed: Record<string, boolean> = {};
  let xp = 0;
  let activeChallenge: Challenge | null = null;
  let activeWorld: World | null = null;

  // Editor / run state
  let code = '';
  let output = '';
  let isError = false;
  let running = false;
  let statusMsg = '';
  let result: 'none' | 'pass' | 'fail' = 'none';
  let hintsShown = 0;
  let celebrate = false;
  let levelUp = false;

  $: allChallenges = worlds.flatMap(w => w.challenges);

  $: lvl = levelFromXP(xp);
  $: rank = rankFromLevel(lvl.level);
  $: completedCount = Object.values(completed).filter(Boolean).length;
  $: progressPct = Math.round((completedCount / allChallenges.length) * 100);

  onMount(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      completed = saved.completed || {};
      xp = saved.xp || 0;
    } catch {}
  });

  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify({ completed, xp })); } catch {}
  }

  function worldUnlocked(index: number): boolean {
    if (index === 0) return true;
    // Unlocked when the previous world is fully complete
    const prev = worlds[index - 1];
    return prev.challenges.every(c => completed[c.id]);
  }

  function openChallenge(world: World, ch: Challenge) {
    activeWorld = world;
    activeChallenge = ch;
    code = ch.starter;
    output = '';
    isError = false;
    result = 'none';
    hintsShown = 0;
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeChallenge() {
    activeChallenge = null;
    activeWorld = null;
    result = 'none';
  }

  // ── Pyodide ──────────────────────────────────────────────────────────
  async function ensurePyodide(): Promise<any> {
    const w = window as any;
    if (w._pq_pyodide) return w._pq_pyodide;
    if (w._pq_loading) {
      while (!w._pq_pyodide) await new Promise(r => setTimeout(r, 100));
      return w._pq_pyodide;
    }
    w._pq_loading = true;
    statusMsg = 'Loading Python engine… (~10 MB, cached after first use)';
    if (!w.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.0/full/pyodide.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load Python engine. Check your connection.'));
        document.head.appendChild(s);
      });
    }
    w._pq_pyodide = await w.loadPyodide();
    w._pq_loading = false;
    statusMsg = '';
    return w._pq_pyodide;
  }

  async function run() {
    if (!activeChallenge) return;
    running = true;
    output = '';
    isError = false;
    result = 'none';

    try {
      const py = await ensurePyodide();
      statusMsg = 'Running…';
      const stdinLines = activeChallenge.stdin ?? [];

      await py.runPythonAsync(`
import sys, io, builtins as _bi
_pq_out = io.StringIO()
_pq_saved = sys.stdout
sys.stdout = _pq_out
_pq_lines = ${JSON.stringify(stdinLines)}
_pq_idx = [0]
def _pq_input(prompt=''):
    if prompt: _pq_out.write(str(prompt))
    i = _pq_idx[0]; _pq_idx[0] += 1
    if i < len(_pq_lines):
        v = _pq_lines[i]; _pq_out.write(v + '\\n'); return v
    return ''
_pq_orig = _bi.input
_bi.input = _pq_input
`);

      try {
        await py.runPythonAsync(code);
        output = py.runPython('_pq_out.getvalue()').replace(/\s+$/, '');
      } catch (e: any) {
        try { output = py.runPython('_pq_out.getvalue()').replace(/\s+$/, ''); } catch {}
        isError = true;
        output = (output ? output + '\n' : '') + (e.message || String(e)).replace(/^PythonError:\s+/i, '').trim();
      } finally {
        py.runPython('import sys, builtins as _bi\nsys.stdout = _pq_saved\n_bi.input = _pq_orig');
      }

      if (!isError) checkAnswer();
    } catch (e: any) {
      isError = true;
      output = e.message || 'Failed to start Python engine.';
    } finally {
      statusMsg = '';
      running = false;
    }
  }

  function checkAnswer() {
    if (!activeChallenge) return;
    const expected = activeChallenge.expectedOutput.trim();
    const got = output.trim();
    const ok = activeChallenge.match === 'contains'
      ? got.includes(expected)
      : got === expected;

    if (ok) {
      result = 'pass';
      if (!completed[activeChallenge.id]) {
        const before = levelFromXP(xp).level;
        completed[activeChallenge.id] = true;
        completed = { ...completed };
        xp += activeChallenge.xp;
        save();
        const after = levelFromXP(xp).level;
        celebrate = true;
        levelUp = after > before;
        setTimeout(() => { celebrate = false; levelUp = false; }, 2600);
      }
    } else {
      result = 'fail';
    }
  }

  function showHint() {
    if (activeChallenge && hintsShown < activeChallenge.hints.length) hintsShown++;
  }

  function nextChallenge() {
    if (!activeChallenge) return;
    const idx = allChallenges.findIndex(c => c.id === activeChallenge!.id);
    const next = allChallenges[idx + 1];
    if (next) {
      const w = worlds.find(world => world.challenges.some(c => c.id === next.id))!;
      openChallenge(w, next);
    } else {
      closeChallenge();
    }
  }

  function resetProgress() {
    if (confirm('Reset all progress and XP? This cannot be undone.')) {
      completed = {}; xp = 0; save();
    }
  }
</script>

<!-- ══════════ CELEBRATION OVERLAY ══════════ -->
{#if celebrate}
  <div class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
    <div class="text-center animate-pop">
      <div class="text-7xl mb-3">{levelUp ? '🎉' : '⭐'}</div>
      <div class="text-3xl font-black text-white drop-shadow-lg">
        {levelUp ? `LEVEL UP! Lvl ${lvl.level}` : `+${activeChallenge?.xp} XP`}
      </div>
      {#if levelUp}<div class="text-lg font-bold text-cyan-300 mt-1">You're now a {rank}!</div>{/if}
    </div>
    {#each Array(14) as _, i}
      <span class="confetti" style="left:{5 + i * 6.5}%; animation-delay:{i * 0.08}s; background:{['#00d4ff','#7c3aed','#00ff94','#fbbf24','#fb7185'][i % 5]}"></span>
    {/each}
  </div>
{/if}

<div class="mx-auto max-w-6xl px-4 py-8 sm:px-6">

  <!-- ══════════ HUD: level + XP bar ══════════ -->
  <div class="rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-5 mb-8">
    <div class="flex items-center gap-4 flex-wrap">
      <div class="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 text-2xl font-black text-white shrink-0">
        {lvl.level}
      </div>
      <div class="flex-1 min-w-[200px]">
        <div class="flex items-center justify-between mb-1">
          <span class="font-black text-white text-lg">{rank}</span>
          <span class="text-sm text-slate-400">{xp} XP · {completedCount}/{allChallenges.length} challenges</span>
        </div>
        <div class="h-3 rounded-full bg-black/30 overflow-hidden">
          <div class="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500" style="width:{(lvl.into / lvl.needed) * 100}%"></div>
        </div>
        <div class="text-xs text-slate-500 mt-1">{lvl.needed - lvl.into} XP to level {lvl.level + 1}</div>
      </div>
      <button on:click={resetProgress} class="text-xs text-slate-500 hover:text-slate-300 underline shrink-0">Reset</button>
    </div>
  </div>

  {#if !activeChallenge}
    <!-- ══════════ WORLD MAP ══════════ -->
    <div class="space-y-6">
      {#each worlds as world, wi}
        {@const unlocked = worldUnlocked(wi)}
        {@const done = world.challenges.filter(c => completed[c.id]).length}
        {@const worldComplete = done === world.challenges.length}
        <div class="rounded-2xl border p-5 transition-all {unlocked ? 'border-white/10 bg-white/5' : 'border-white/5 bg-white/2 opacity-50'}"
             style={unlocked ? `border-color:${world.colour}30` : ''}>
          <div class="flex items-center gap-4 mb-4">
            <div class="flex items-center justify-center h-14 w-14 rounded-2xl text-3xl shrink-0"
                 style="background:{world.colour}20; border:1px solid {world.colour}40">
              {unlocked ? world.emoji : '🔒'}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-black text-white">{world.name}</h3>
                {#if worldComplete}<span class="text-xs font-bold px-2 py-0.5 rounded-full" style="background:{world.colour}25; color:{world.colour}">✓ Complete</span>{/if}
              </div>
              <p class="text-sm text-slate-400">{world.tagline}</p>
            </div>
            <div class="text-sm font-bold shrink-0" style="color:{world.colour}">{done}/{world.challenges.length}</div>
          </div>

          {#if unlocked}
            <div class="grid gap-2 sm:grid-cols-3">
              {#each world.challenges as ch}
                {@const isDone = completed[ch.id]}
                <button on:click={() => openChallenge(world, ch)}
                  class="text-left rounded-xl border p-3 transition-all hover:scale-[1.02] {isDone ? 'border-green-500/40 bg-green-500/10' : 'border-white/10 bg-white/5 hover:border-white/25'}">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-lg">{isDone ? '✅' : '🎯'}</span>
                    <span class="text-xs font-bold px-1.5 py-0.5 rounded" style="background:{world.colour}20; color:{world.colour}">+{ch.xp}</span>
                  </div>
                  <div class="font-bold text-white text-sm">{ch.title}</div>
                  <div class="text-xs text-slate-500 mt-0.5">{ch.skill}</div>
                </button>
              {/each}
            </div>
          {:else}
            <p class="text-sm text-slate-500 text-center py-2">Complete {worlds[wi - 1].name} to unlock</p>
          {/if}
        </div>
      {/each}
    </div>

    {#if progressPct === 100}
      <div class="mt-8 rounded-2xl border border-yellow-500/40 bg-yellow-500/10 p-8 text-center">
        <div class="text-6xl mb-3">🏆</div>
        <h2 class="text-2xl font-black text-white">Quest Complete!</h2>
        <p class="text-slate-300 mt-1">You've mastered {masteryNoun}. {rank}, Level {lvl.level}.</p>
      </div>
    {/if}

  {:else}
    <!-- ══════════ CHALLENGE VIEW ══════════ -->
    <button on:click={closeChallenge} class="text-slate-400 hover:text-white transition-colors mb-4 text-sm">← Back to map</button>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Left: brief + concept -->
      <div class="space-y-4">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-6" style="border-color:{activeWorld?.colour}30">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">{activeWorld?.emoji}</span>
            <span class="text-xs font-bold px-2 py-0.5 rounded-full" style="background:{activeWorld?.colour}20; color:{activeWorld?.colour}">
              {activeWorld?.name} · OCR {activeChallenge.specRef}
            </span>
          </div>
          <h2 class="text-2xl font-black text-white mb-3">{activeChallenge.title}</h2>
          <p class="text-slate-200 mb-4">{activeChallenge.brief}</p>
          <div class="rounded-xl bg-black/20 border border-white/10 p-4 text-sm text-slate-300 leading-relaxed">
            {@html activeChallenge.concept}
          </div>
        </div>

        <!-- Hints -->
        <div class="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-bold text-white">💡 Hints</h3>
            {#if hintsShown < activeChallenge.hints.length}
              <button on:click={showHint} class="text-xs font-semibold text-amber-400 hover:text-amber-300">Reveal hint ({hintsShown}/{activeChallenge.hints.length})</button>
            {/if}
          </div>
          {#if hintsShown === 0}
            <p class="text-sm text-slate-500">Stuck? Reveal a hint — no penalty.</p>
          {:else}
            <div class="space-y-2">
              {#each activeChallenge.hints.slice(0, hintsShown) as hint}
                <div class="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-sm text-amber-200 whitespace-pre-wrap font-mono">{hint}</div>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- Right: editor + output -->
      <div class="space-y-4">
        <div class="rounded-2xl border border-white/10 overflow-hidden bg-[#0a0e1a]">
          <div class="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
            <span class="text-xs font-bold text-slate-400">🐍 main.py</span>
            <button on:click={() => { code = activeChallenge!.starter; output=''; result='none'; }} class="text-xs text-slate-500 hover:text-slate-300">Reset code</button>
          </div>
          <textarea
            bind:value={code}
            spellcheck="false"
            class="w-full h-72 bg-transparent text-slate-100 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
            style="tab-size: 4;"
            on:keydown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const t = e.target as HTMLTextAreaElement;
                const s = t.selectionStart;
                code = code.slice(0, s) + '    ' + code.slice(t.selectionEnd);
                setTimeout(() => { t.selectionStart = t.selectionEnd = s + 4; });
              }
            }}
          ></textarea>
        </div>

        <button on:click={run} disabled={running}
          class="w-full rounded-xl py-3 font-bold text-black transition-all disabled:opacity-60 hover:opacity-90"
          style="background:linear-gradient(135deg,{activeWorld?.colour},{activeWorld?.colour}cc)">
          {running ? '⏳ ' + (statusMsg || 'Running…') : '▶ Run & Check'}
        </button>

        <!-- Output -->
        {#if output || result !== 'none'}
          <div class="rounded-2xl border overflow-hidden {result === 'pass' ? 'border-green-500/40' : result === 'fail' ? 'border-red-500/40' : 'border-white/10'}">
            <div class="px-4 py-2 border-b text-xs font-bold {result === 'pass' ? 'bg-green-500/15 text-green-400 border-green-500/20' : result === 'fail' ? 'bg-red-500/15 text-red-400 border-red-500/20' : 'bg-white/5 text-slate-400 border-white/10'}">
              {result === 'pass' ? '✅ Correct!' : result === 'fail' ? '❌ Not quite — check the expected output' : 'Output'}
            </div>
            <pre class="p-4 text-sm font-mono whitespace-pre-wrap {isError ? 'text-red-300' : 'text-slate-200'} bg-[#0a0e1a]">{output || '(no output)'}</pre>
            {#if result === 'fail'}
              <div class="px-4 py-3 bg-white/5 border-t border-white/10 text-xs text-slate-400">
                <span class="font-bold text-slate-300">Expected:</span>
                <pre class="mt-1 text-slate-300 font-mono whitespace-pre-wrap">{activeChallenge.expectedOutput}</pre>
              </div>
            {/if}
          </div>
        {/if}

        {#if result === 'pass'}
          <button on:click={nextChallenge}
            class="w-full rounded-xl py-3 font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 transition-all">
            Next Challenge →
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  @keyframes pop {
    0% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  .animate-pop { animation: pop 0.5s ease-out; }

  .confetti {
    position: absolute;
    top: -10px;
    width: 10px;
    height: 16px;
    border-radius: 2px;
    animation: fall 2.4s linear forwards;
  }
  @keyframes fall {
    to { transform: translateY(105vh) rotate(540deg); opacity: 0.2; }
  }
</style>
