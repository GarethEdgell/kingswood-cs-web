<script lang="ts">
  import { onMount } from 'svelte';

  // ───────────────────────────────────────────────────────────────────
  // Cartoon CS Challenges — four tap-based mini-games. No typing, no drag:
  // every interaction is a tap, so it works on touch devices too.
  // ───────────────────────────────────────────────────────────────────

  const STORAGE_KEY = 'cartoon-challenges';

  type GameId = 'sort' | 'maze' | 'logic' | 'steps';

  const GAMES: { id: GameId; name: string; emoji: string; colour: string; tagline: string; concept: string; levels: number }[] = [
    { id: 'sort',  name: 'Sort Squad',   emoji: '🐲', colour: '#ec4899', tagline: 'Sorting algorithms', concept: 'Be the sorting algorithm! Tap two monsters to swap them until they line up shortest → tallest.', levels: 3 },
    { id: 'maze',  name: 'Maze Bot',     emoji: '🤖', colour: '#06b6d4', tagline: 'Graphs & pathfinding', concept: 'Guide the robot through the maze to the flag. Tap a neighbouring square (or use the arrows) to move.', levels: 3 },
    { id: 'logic', name: 'Light It Up',  emoji: '💡', colour: '#f59e0b', tagline: 'Logic gates', concept: 'Flip the switches to send the right signal through the gate and light the bulb!', levels: 4 },
    { id: 'steps', name: 'Step Stacker', emoji: '📚', colour: '#8b5cf6', tagline: 'Algorithmic thinking', concept: 'The algorithm got scrambled! Tap two steps to swap them into the correct order.', levels: 3 },
  ];

  let view: 'hub' | GameId = 'hub';
  let progress: Record<string, number[]> = {};   // completed level indices per game
  let celebrate = false;
  let won = false;
  let level = 0;

  $: totalLevels = GAMES.reduce((s, g) => s + g.levels, 0);
  $: totalStars = Object.values(progress).reduce((s, arr) => s + (arr?.length || 0), 0);

  onMount(() => {
    try { progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch {}
  });
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch {} }
  function starsFor(id: GameId) { return progress[id]?.length || 0; }

  function party() {
    celebrate = true;
    setTimeout(() => { celebrate = false; }, 2200);
  }

  function completeLevel(id: GameId) {
    const done = new Set(progress[id] || []);
    const first = !done.has(level);
    done.add(level);
    progress = { ...progress, [id]: [...done].sort((a, b) => a - b) };
    save();
    won = true;
    if (first) party();
  }

  // ── Open / navigate ──────────────────────────────────────────────────
  function openGame(id: GameId) { view = id; level = 0; won = false; loadLevel(id, 0); }
  function backToHub() { view = 'hub'; won = false; }
  function loadLevel(id: GameId, l: number) {
    level = l; won = false;
    if (id === 'sort') initSort(l);
    if (id === 'maze') initMaze(l);
    if (id === 'logic') initLogic(l);
    if (id === 'steps') initSteps(l);
  }
  function nextLevel() {
    const g = GAMES.find(x => x.id === view)!;
    if (level + 1 < g.levels) loadLevel(view as GameId, level + 1);
    else backToHub();
  }

  // ═══════════ GAME 1: SORT SQUAD ═══════════
  const SORT_LEVELS = [[3, 1, 2], [5, 2, 8, 1], [6, 2, 9, 4, 1]];
  const MONSTER_FACES = ['😀', '😎', '🤪', '😺', '🐲', '👾', '🐙', '🦖', '🐸'];
  let sortArr: number[] = [];
  let sortSel: number | null = null;
  let sortSwaps = 0;
  function initSort(l: number) { sortArr = [...SORT_LEVELS[l]]; sortSel = null; sortSwaps = 0; }
  function sortTap(i: number) {
    if (won) return;
    if (sortSel === null) { sortSel = i; return; }
    if (sortSel === i) { sortSel = null; return; }
    [sortArr[sortSel], sortArr[i]] = [sortArr[i], sortArr[sortSel]];
    sortArr = [...sortArr];
    sortSwaps++;
    sortSel = null;
    if (sortArr.every((v, k) => k === 0 || sortArr[k - 1] <= v)) completeLevel('sort');
  }
  $: sortMax = Math.max(...(sortArr.length ? sortArr : [1]));

  // ═══════════ GAME 2: MAZE BOT ═══════════
  const MAZE_LEVELS = [
    ['S....', '####.', '.....', '.####', '....G'],
    ['S.....', '#####.', '......', '.#####', '......', '#####G'],
    ['S....#', '.###.#', '.#...#', '.#.###', '.#...G', '.####.'],
  ];
  let maze: string[] = [];
  let robot = { r: 0, c: 0 };
  let visited: Record<string, boolean> = {};
  let mazeSteps = 0;
  function initMaze(l: number) {
    maze = [...MAZE_LEVELS[l]];
    for (let r = 0; r < maze.length; r++)
      for (let c = 0; c < maze[r].length; c++)
        if (maze[r][c] === 'S') robot = { r, c };
    visited = { [`${robot.r},${robot.c}`]: true };
    mazeSteps = 0;
  }
  function cellAt(r: number, c: number) { return maze[r]?.[c]; }
  function move(dr: number, dc: number) {
    if (won) return;
    const nr = robot.r + dr, nc = robot.c + dc;
    const cell = cellAt(nr, nc);
    if (cell === undefined || cell === '#') return;
    robot = { r: nr, c: nc };
    visited = { ...visited, [`${nr},${nc}`]: true };
    mazeSteps++;
    if (cell === 'G') completeLevel('maze');
  }
  function mazeCellTap(r: number, c: number) {
    const dr = r - robot.r, dc = c - robot.c;
    if (Math.abs(dr) + Math.abs(dc) === 1) move(dr, dc);
  }

  // ═══════════ GAME 3: LIGHT IT UP ═══════════
  const LOGIC_LEVELS: { gate: string; labels: string[]; init: boolean[]; compute: (i: boolean[]) => boolean; tip: string }[] = [
    { gate: 'AND', labels: ['A', 'B'], init: [false, false], compute: i => i[0] && i[1], tip: 'AND only outputs 1 when BOTH inputs are 1.' },
    { gate: 'OR',  labels: ['A', 'B'], init: [false, false], compute: i => i[0] || i[1], tip: 'OR outputs 1 when AT LEAST ONE input is 1.' },
    { gate: 'NOT', labels: ['A'],      init: [true],         compute: i => !i[0],        tip: 'NOT flips the signal: 1 becomes 0, 0 becomes 1.' },
    { gate: 'XOR', labels: ['A', 'B'], init: [false, false], compute: i => i[0] !== i[1], tip: 'XOR outputs 1 when the inputs are DIFFERENT.' },
  ];
  let logicInputs: boolean[] = [];
  function initLogic(l: number) { logicInputs = [...LOGIC_LEVELS[l].init]; }
  function toggleInput(i: number) {
    if (won) return;
    logicInputs[i] = !logicInputs[i];
    logicInputs = [...logicInputs];
    if (LOGIC_LEVELS[level].compute(logicInputs)) completeLevel('logic');
  }
  $: logicOn = LOGIC_LEVELS[level] ? LOGIC_LEVELS[level].compute(logicInputs) : false;

  // ═══════════ GAME 4: STEP STACKER ═══════════
  const STEP_LEVELS = [
    { name: 'Make Toast 🍞', steps: ['Get a slice of bread', 'Put the bread in the toaster', 'Push the lever down', 'Wait until it pops up', 'Spread on the butter'] },
    { name: 'Bubble Sort 🫧', steps: ['Start at the first pair', 'Compare the two numbers', 'Swap them if out of order', 'Move on to the next pair', 'Repeat until no swaps happen'] },
    { name: 'Binary Search 🔍', steps: ['Make sure the list is sorted', 'Look at the middle item', 'If it matches, you are done', 'If target is smaller, take the left half', 'If target is bigger, take the right half'] },
  ];
  let stepsOrder: string[] = [];
  let stepsCorrect: string[] = [];
  let stepsSel: number | null = null;
  function shuffle<T>(a: T[]): T[] {
    const r = [...a];
    for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
    return r;
  }
  function initSteps(l: number) {
    stepsCorrect = STEP_LEVELS[l].steps;
    do { stepsOrder = shuffle(stepsCorrect); }
    while (stepsOrder.every((s, k) => s === stepsCorrect[k])); // never start solved
    stepsSel = null;
  }
  function stepTap(i: number) {
    if (won) return;
    if (stepsSel === null) { stepsSel = i; return; }
    if (stepsSel === i) { stepsSel = null; return; }
    [stepsOrder[stepsSel], stepsOrder[i]] = [stepsOrder[i], stepsOrder[stepsSel]];
    stepsOrder = [...stepsOrder];
    stepsSel = null;
    if (stepsOrder.every((s, k) => s === stepsCorrect[k])) completeLevel('steps');
  }

  $: activeGame = GAMES.find(g => g.id === view);
</script>

<!-- ══════════ CELEBRATION ══════════ -->
{#if celebrate}
  <div class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
    <div class="text-center cc-pop">
      <div class="text-7xl mb-2">🎉</div>
      <div class="text-3xl font-black" style="color:#fff; text-shadow:0 2px 8px rgba(0,0,0,0.5)">Nice one! ⭐</div>
    </div>
    {#each Array(16) as _, i}
      <span class="cc-confetti" style="left:{4 + i * 6}%; animation-delay:{i * 0.07}s; background:{['#ec4899','#06b6d4','#f59e0b','#8b5cf6','#34d399','#f43f5e'][i % 6]}"></span>
    {/each}
  </div>
{/if}

<div class="mx-auto max-w-4xl">

  {#if view === 'hub'}
    <!-- ══════════ HUB ══════════ -->
    <div class="mb-6 flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-pink-500/10 via-amber-500/10 to-violet-500/10 p-5">
      <div>
        <h2 class="text-lg font-black text-white">Pick a challenge!</h2>
        <p class="text-sm text-slate-400">Tap to play — no typing needed.</p>
      </div>
      <div class="text-right">
        <div class="text-2xl font-black" style="color:#f59e0b">⭐ {totalStars}/{totalLevels}</div>
        <div class="text-xs text-slate-500">stars earned</div>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      {#each GAMES as g}
        <button on:click={() => openGame(g.id)}
          class="group text-left rounded-2xl border-2 p-5 transition-all hover:scale-[1.02]"
          style="border-color:{g.colour}55; background:{g.colour}12">
          <div class="flex items-center gap-3 mb-2">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shrink-0"
                 style="background:{g.colour}25; border:2px solid {g.colour}55">{g.emoji}</div>
            <div>
              <h3 class="text-lg font-black text-white">{g.name}</h3>
              <p class="text-xs font-semibold" style="color:{g.colour}">{g.tagline}</p>
            </div>
          </div>
          <p class="text-sm text-slate-300 leading-relaxed">{g.concept}</p>
          <div class="mt-3 flex items-center gap-1">
            {#each Array(g.levels) as _, k}
              <span class="text-lg">{(progress[g.id] || []).includes(k) ? '⭐' : '☆'}</span>
            {/each}
            <span class="ml-auto text-sm font-bold" style="color:{g.colour}">Play →</span>
          </div>
        </button>
      {/each}
    </div>

  {:else}
    <!-- ══════════ GAME HEADER ══════════ -->
    <div class="mb-5 flex items-center justify-between">
      <button on:click={backToHub} class="text-sm text-slate-400 hover:text-white transition-colors">← All challenges</button>
      <div class="flex items-center gap-1">
        {#each Array(activeGame?.levels || 0) as _, k}
          <button on:click={() => loadLevel(view, k)}
            class="h-8 w-8 rounded-lg text-sm font-bold transition-all"
            style="background:{k === level ? activeGame?.colour : (activeGame?.colour + '20')}; color:{k === level ? '#fff' : activeGame?.colour}">
            {(progress[view] || []).includes(k) ? '⭐' : k + 1}
          </button>
        {/each}
      </div>
    </div>

    <div class="rounded-2xl border-2 p-5 sm:p-6" style="border-color:{activeGame?.colour}55; background:{activeGame?.colour}0d">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-2xl">{activeGame?.emoji}</span>
        <div>
          <h2 class="text-xl font-black text-white">{activeGame?.name}</h2>
          <p class="text-xs text-slate-400">Level {level + 1}</p>
        </div>
      </div>

      <!-- ─────── SORT SQUAD ─────── -->
      {#if view === 'sort'}
        <p class="text-sm text-slate-300 mb-5">Tap two monsters to swap them. Line them up <strong>shortest → tallest</strong>!</p>
        <div class="flex items-end justify-center gap-3 sm:gap-4 min-h-[180px] py-2">
          {#each sortArr as v, i}
            <button on:click={() => sortTap(i)} class="flex flex-col items-center transition-all"
              style="transform:{sortSel === i ? 'translateY(-12px) scale(1.05)' : 'none'}">
              <span class="text-3xl mb-1">{MONSTER_FACES[v % MONSTER_FACES.length]}</span>
              <div class="w-10 sm:w-12 rounded-t-xl flex items-end justify-center pb-1 font-black text-white"
                   style="height:{30 + (v / sortMax) * 120}px; background:linear-gradient(180deg,#ec4899,#be185d); box-shadow:{sortSel === i ? '0 0 0 3px #fde047' : 'none'}">
                {v}
              </div>
            </button>
          {/each}
        </div>
        <p class="text-center text-xs text-slate-500 mt-3">Swaps: {sortSwaps}</p>

      <!-- ─────── MAZE BOT ─────── -->
      {:else if view === 'maze'}
        <p class="text-sm text-slate-300 mb-4">Tap a square next to the robot to move. Reach the flag 🏁!</p>
        <div class="flex flex-col items-center gap-4">
          <div class="inline-grid gap-1" style="grid-template-columns:repeat({maze[0]?.length || 1}, 1fr)">
            {#each maze as row, r}
              {#each row.split('') as cell, c}
                <button on:click={() => mazeCellTap(r, c)}
                  class="h-10 w-10 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center text-xl transition-all"
                  style="background:{cell === '#' ? '#1e293b' : visited[`${r},${c}`] ? '#06b6d433' : '#06b6d40d'};
                         border:2px solid {cell === '#' ? '#0f172a' : '#06b6d433'}; cursor:{cell === '#' ? 'default' : 'pointer'}">
                  {#if robot.r === r && robot.c === c}🤖
                  {:else if cell === 'G'}🏁
                  {:else if cell === 'S'}🚩
                  {:else if cell === '#'}🧱
                  {:else if visited[`${r},${c}`]}<span class="text-xs" style="color:#06b6d4">•</span>{/if}
                </button>
              {/each}
            {/each}
          </div>
          <div class="grid grid-cols-3 gap-1.5 w-36">
            <span></span>
            <button on:click={() => move(-1, 0)} class="cc-arrow">⬆️</button>
            <span></span>
            <button on:click={() => move(0, -1)} class="cc-arrow">⬅️</button>
            <button on:click={() => move(1, 0)} class="cc-arrow">⬇️</button>
            <button on:click={() => move(0, 1)} class="cc-arrow">➡️</button>
          </div>
          <p class="text-xs text-slate-500">Steps: {mazeSteps}</p>
        </div>

      <!-- ─────── LIGHT IT UP ─────── -->
      {:else if view === 'logic'}
        <p class="text-sm text-slate-300 mb-2">Flip the switches to light the bulb through the <strong>{LOGIC_LEVELS[level].gate}</strong> gate.</p>
        <p class="text-xs text-slate-500 mb-5">💡 {LOGIC_LEVELS[level].tip}</p>
        <div class="flex items-center justify-center gap-3 sm:gap-6 py-4 flex-wrap">
          <!-- switches -->
          <div class="flex flex-col gap-3">
            {#each LOGIC_LEVELS[level].labels as lab, i}
              <button on:click={() => toggleInput(i)}
                class="flex items-center gap-2 rounded-xl px-3 py-2 font-bold transition-all"
                style="background:{logicInputs[i] ? '#f59e0b' : '#334155'}; color:{logicInputs[i] ? '#422006' : '#94a3b8'}">
                <span class="text-lg">{lab}</span>
                <span class="rounded-md px-2 py-0.5 text-sm" style="background:rgba(0,0,0,0.2)">{logicInputs[i] ? 'ON' : 'OFF'}</span>
              </button>
            {/each}
          </div>
          <!-- gate -->
          <div class="flex h-16 w-20 items-center justify-center rounded-xl border-2 font-black text-sm"
               style="border-color:#f59e0b; background:#f59e0b1a; color:#f59e0b">{LOGIC_LEVELS[level].gate}</div>
          <!-- bulb -->
          <div class="text-5xl transition-all" style="filter:{logicOn ? 'none' : 'grayscale(1) opacity(0.4)'}; transform:{logicOn ? 'scale(1.15)' : 'none'}">
            {logicOn ? '💡' : '🔌'}
          </div>
        </div>

      <!-- ─────── STEP STACKER ─────── -->
      {:else if view === 'steps'}
        <p class="text-sm text-slate-300 mb-1">Put the steps for <strong>{STEP_LEVELS[level].name}</strong> in order.</p>
        <p class="text-xs text-slate-500 mb-4">Tap two cards to swap them.</p>
        <div class="space-y-2">
          {#each stepsOrder as step, i}
            <button on:click={() => stepTap(i)}
              class="w-full text-left rounded-xl border-2 px-4 py-3 flex items-center gap-3 transition-all"
              style="border-color:{stepsSel === i ? '#fde047' : '#8b5cf655'}; background:{stepsSel === i ? '#8b5cf625' : '#8b5cf60d'}; transform:{stepsSel === i ? 'scale(1.01)' : 'none'}">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black" style="background:#8b5cf6; color:#fff">{i + 1}</span>
              <span class="text-sm text-white">{step}</span>
            </button>
          {/each}
        </div>
      {/if}

      <!-- ─────── WIN PANEL ─────── -->
      {#if won}
        <div class="mt-5 rounded-xl border-2 p-4 text-center" style="border-color:#34d39955; background:#34d39912">
          <p class="text-lg font-black" style="color:#34d399">⭐ Solved it!</p>
          <button on:click={nextLevel}
            class="mt-2 rounded-xl px-5 py-2.5 font-bold text-white transition-all hover:opacity-90"
            style="background:{activeGame?.colour}">
            {level + 1 < (activeGame?.levels || 0) ? 'Next level →' : 'Back to challenges 🏆'}
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .cc-arrow {
    height: 2.75rem;
    border-radius: 0.75rem;
    background: rgba(6, 182, 212, 0.12);
    border: 2px solid rgba(6, 182, 212, 0.35);
    font-size: 1.1rem;
    transition: transform 0.1s;
  }
  .cc-arrow:active { transform: scale(0.9); }

  @keyframes ccpop {
    0% { transform: scale(0.4); opacity: 0; }
    55% { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
  }
  .cc-pop { animation: ccpop 0.5s ease-out; }

  .cc-confetti {
    position: absolute;
    top: -12px;
    width: 11px;
    height: 16px;
    border-radius: 2px;
    animation: ccfall 2.2s linear forwards;
  }
  @keyframes ccfall {
    to { transform: translateY(105vh) rotate(600deg); opacity: 0.15; }
  }
</style>
