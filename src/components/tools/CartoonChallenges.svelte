<script lang="ts">
  import { onMount } from 'svelte';

  // ───────────────────────────────────────────────────────────────────
  // Cartoon CS Challenges — four tap-based mini-games with themed SVG
  // character art. No typing, no drag: every interaction is a tap, so it
  // works on touch devices too.
  // ───────────────────────────────────────────────────────────────────

  const STORAGE_KEY = 'cartoon-challenges';
  type GameId = 'sort' | 'maze' | 'logic' | 'steps';

  const GAMES: { id: GameId; name: string; emoji: string; colour: string; tagline: string; concept: string; levels: number }[] = [
    { id: 'sort',  name: 'Sort Squad',   emoji: '🐲', colour: '#ec4899', tagline: 'Sorting algorithms', concept: 'Be the sorting algorithm! Tap two monsters to swap them until they line up shortest → tallest. Can you beat the par?', levels: 4 },
    { id: 'maze',  name: 'Maze Bot',     emoji: '🤖', colour: '#06b6d4', tagline: 'Graphs & pathfinding', concept: 'Collect every gem 💎 then guide the robot to the flag. Tap a neighbouring square or use the arrows.', levels: 3 },
    { id: 'logic', name: 'Light It Up',  emoji: '💡', colour: '#f59e0b', tagline: 'Logic gates', concept: 'Flip the switches to send the right signal through the gates and light the bulb. The circuits get trickier!', levels: 6 },
    { id: 'steps', name: 'Step Stacker', emoji: '📚', colour: '#8b5cf6', tagline: 'Algorithmic thinking', concept: 'The algorithm got scrambled! Tap two steps to swap them into the correct order.', levels: 5 },
  ];

  let view: 'hub' | GameId = 'hub';
  let progress: Record<string, number[]> = {};
  let celebrate = false;
  let celebrateMsg = 'Nice one! ⭐';
  let won = false;
  let level = 0;

  $: totalLevels = GAMES.reduce((s, g) => s + g.levels, 0);
  $: totalStars = Object.values(progress).reduce((s, arr) => s + (arr?.length || 0), 0);

  onMount(() => { try { progress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch {} });
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch {} }

  function party(msg = 'Nice one! ⭐') { celebrateMsg = msg; celebrate = true; setTimeout(() => { celebrate = false; }, 2200); }

  function completeLevel(id: GameId, msg = 'Nice one! ⭐') {
    const done = new Set(progress[id] || []);
    const first = !done.has(level);
    done.add(level);
    progress = { ...progress, [id]: [...done].sort((a, b) => a - b) };
    save();
    won = true;
    if (first) party(msg);
  }

  function openGame(id: GameId) { view = id; loadLevel(id, 0); }
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

  // ═══════════ CHARACTER ART (inline SVG) ═══════════
  const MONSTER_COLOURS = ['#f472b6', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#fb7185', '#22d3ee', '#f97316', '#4ade80', '#e879f9'];
  function monster(v: number, max: number): string {
    const col = MONSTER_COLOURS[v % MONSTER_COLOURS.length];
    const h = 50 + Math.round((v / max) * 120);
    const w = 58, cx = w / 2;
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <line x1="${cx}" y1="12" x2="${cx}" y2="3" stroke="${col}" stroke-width="3"/><circle cx="${cx}" cy="3" r="3.5" fill="${col}"/>
      <rect x="5" y="11" width="${w - 10}" height="${h - 15}" rx="17" fill="${col}"/>
      <circle cx="${cx - 10}" cy="28" r="8" fill="#fff"/><circle cx="${cx + 10}" cy="28" r="8" fill="#fff"/>
      <circle cx="${cx - 9}" cy="29" r="3.4" fill="#1e293b"/><circle cx="${cx + 11}" cy="29" r="3.4" fill="#1e293b"/>
      <path d="M ${cx - 8} 42 Q ${cx} 50 ${cx + 8} 42" stroke="#1e293b" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <text x="${cx}" y="${h - 12}" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">${v}</text>
    </svg>`;
  }
  const ROBOT = `<svg viewBox="0 0 40 40" width="86%" height="86%" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="6" x2="20" y2="2" stroke="#67e8f9" stroke-width="2"/><circle cx="20" cy="2" r="2" fill="#67e8f9"/>
    <rect x="8" y="6" width="24" height="19" rx="6" fill="#22d3ee"/>
    <circle cx="15" cy="15" r="4" fill="#fff"/><circle cx="25" cy="15" r="4" fill="#fff"/>
    <circle cx="15" cy="15" r="1.8" fill="#0e7490"/><circle cx="25" cy="15" r="1.8" fill="#0e7490"/>
    <rect x="13" y="20" width="14" height="2.4" rx="1.2" fill="#0e7490"/>
    <rect x="11" y="26" width="18" height="9" rx="3" fill="#0891b2"/></svg>`;
  const FLAG = `<svg viewBox="0 0 40 40" width="80%" height="80%" xmlns="http://www.w3.org/2000/svg">
    <line x1="13" y1="6" x2="13" y2="35" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
    <path d="M13 8 L32 13 L13 19 Z" fill="#34d399"/></svg>`;
  const GEM = `<svg viewBox="0 0 40 40" width="62%" height="62%" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 5 L31 16 L20 34 L9 16 Z" fill="#fbbf24" stroke="#b45309" stroke-width="1.6"/>
    <path d="M20 5 L31 16 L20 16 Z" fill="#fde047"/></svg>`;
  function bulb(on: boolean): string {
    const glass = on ? '#fde047' : '#475569';
    return `<svg viewBox="0 0 60 72" width="66" height="80" xmlns="http://www.w3.org/2000/svg">
      ${on ? `<g stroke="#fbbf24" stroke-width="3" stroke-linecap="round"><line x1="30" y1="1" x2="30" y2="9"/><line x1="5" y1="13" x2="11" y2="17"/><line x1="55" y1="13" x2="49" y2="17"/></g>` : ''}
      <circle cx="30" cy="28" r="21" fill="${glass}"/>
      <circle cx="22" cy="26" r="3.2" fill="#1e293b"/><circle cx="38" cy="26" r="3.2" fill="#1e293b"/>
      <path d="M21 35 Q30 ${on ? 43 : 37} 39 35" stroke="#1e293b" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <rect x="22" y="48" width="16" height="6" rx="2" fill="#94a3b8"/>
      <rect x="24" y="54" width="12" height="5" rx="2" fill="#64748b"/>
      <rect x="25" y="59" width="10" height="5" rx="2" fill="#64748b"/></svg>`;
  }
  const MASCOT = `<svg viewBox="0 0 44 44" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="22" r="18" fill="#8b5cf6"/>
    <circle cx="15" cy="19" r="6" fill="#fff"/><circle cx="29" cy="19" r="6" fill="#fff"/>
    <circle cx="15" cy="20" r="2.6" fill="#1e293b"/><circle cx="29" cy="20" r="2.6" fill="#1e293b"/>
    <path d="M16 30 Q22 35 28 30" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M22 8 L18 2 M22 8 L26 2" stroke="#8b5cf6" stroke-width="2.5" stroke-linecap="round"/></svg>`;

  // ═══════════ GAME 1: SORT SQUAD ═══════════
  const SORT_LEVELS = [[3, 1, 2], [5, 2, 8, 1], [6, 2, 9, 4, 1], [8, 3, 6, 1, 9, 4]];
  let sortArr: number[] = [];
  let sortSel: number | null = null;
  let sortSwaps = 0;
  let sortPar = 0;
  function minSwaps(arr: number[]): number {
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = new Map(sorted.map((v, i) => [v, i]));
    const seen = new Array(arr.length).fill(false);
    let swaps = 0;
    for (let i = 0; i < arr.length; i++) {
      if (seen[i]) continue;
      let len = 0, j = i;
      while (!seen[j]) { seen[j] = true; j = idx.get(arr[j])!; len++; }
      swaps += len - 1;
    }
    return swaps;
  }
  function initSort(l: number) { sortArr = [...SORT_LEVELS[l]]; sortSel = null; sortSwaps = 0; sortPar = minSwaps(sortArr); }
  function sortTap(i: number) {
    if (won) return;
    if (sortSel === null) { sortSel = i; return; }
    if (sortSel === i) { sortSel = null; return; }
    [sortArr[sortSel], sortArr[i]] = [sortArr[i], sortArr[sortSel]];
    sortArr = [...sortArr]; sortSwaps++; sortSel = null;
    if (sortArr.every((v, k) => k === 0 || sortArr[k - 1] <= v))
      completeLevel('sort', sortSwaps <= sortPar ? `Perfect — par beaten! ⭐` : 'Sorted! ⭐');
  }
  $: sortMax = Math.max(...(sortArr.length ? sortArr : [1]));

  // ═══════════ GAME 2: MAZE BOT ═══════════
  // S start · G goal · # wall · C gem
  const MAZE_LEVELS = [
    ['S...C', '####.', '.C...', '.####', '....G'],
    ['S....C', '#####.', 'C.....', '.#####', '.....C', '#####G'],
    ['S....#', '.###.#', '.#...#', '.#.###', 'C#...G', '.####.'],
  ];
  let maze: string[] = [];
  let robot = { r: 0, c: 0 };
  let visited: Record<string, boolean> = {};
  let collected: Record<string, boolean> = {};
  let gemsTotal = 0;
  let mazeSteps = 0;
  let mazeMsg = '';
  $: gemsLeft = gemsTotal - Object.keys(collected).length;
  function initMaze(l: number) {
    maze = [...MAZE_LEVELS[l]];
    gemsTotal = 0; collected = {}; mazeMsg = '';
    for (let r = 0; r < maze.length; r++)
      for (let c = 0; c < maze[r].length; c++) {
        if (maze[r][c] === 'S') robot = { r, c };
        if (maze[r][c] === 'C') gemsTotal++;
      }
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
    mazeMsg = '';
    if (cell === 'C') collected = { ...collected, [`${nr},${nc}`]: true };
    if (cell === 'G') {
      if (Object.keys(collected).length === gemsTotal) completeLevel('maze', 'Flag reached! ⭐');
      else mazeMsg = `Collect all the gems first! ${gemsLeft} to go 💎`;
    }
  }
  function mazeCellTap(r: number, c: number) {
    const dr = r - robot.r, dc = c - robot.c;
    if (Math.abs(dr) + Math.abs(dc) === 1) move(dr, dc);
  }

  // ═══════════ GAME 3: LIGHT IT UP ═══════════
  const LOGIC_LEVELS: { labels: string[]; formula: string; init: boolean[]; compute: (i: boolean[]) => boolean; tip: string }[] = [
    { labels: ['A', 'B'], formula: 'A AND B', init: [false, false], compute: i => i[0] && i[1], tip: 'AND needs BOTH inputs to be 1.' },
    { labels: ['A', 'B'], formula: 'A OR B', init: [false, false], compute: i => i[0] || i[1], tip: 'OR needs AT LEAST ONE input to be 1.' },
    { labels: ['A'], formula: 'NOT A', init: [true], compute: i => !i[0], tip: 'NOT flips the signal.' },
    { labels: ['A', 'B'], formula: 'A XOR B', init: [false, false], compute: i => i[0] !== i[1], tip: 'XOR needs the inputs to be DIFFERENT.' },
    { labels: ['A', 'B', 'C'], formula: '(A AND B) OR C', init: [false, false, false], compute: i => (i[0] && i[1]) || i[2], tip: 'Work out the AND first, then the OR.' },
    { labels: ['A', 'B', 'C'], formula: '(A OR B) AND (NOT C)', init: [false, false, false], compute: i => (i[0] || i[1]) && !i[2], tip: 'Both sides of the AND must be 1 — watch the NOT!' },
  ];
  let logicInputs: boolean[] = [];
  function initLogic(l: number) { logicInputs = [...LOGIC_LEVELS[l].init]; }
  function toggleInput(i: number) {
    if (won) return;
    logicInputs[i] = !logicInputs[i];
    logicInputs = [...logicInputs];
    if (LOGIC_LEVELS[level].compute(logicInputs)) completeLevel('logic', 'Lights on! ⭐');
  }
  $: logicOn = LOGIC_LEVELS[level] ? LOGIC_LEVELS[level].compute(logicInputs) : false;

  // ═══════════ GAME 4: STEP STACKER ═══════════
  const STEP_LEVELS = [
    { name: 'Make Toast 🍞', steps: ['Get a slice of bread', 'Put the bread in the toaster', 'Push the lever down', 'Wait until it pops up', 'Spread on the butter'] },
    { name: 'Bubble Sort 🫧', steps: ['Start at the first pair', 'Compare the two numbers', 'Swap them if out of order', 'Move on to the next pair', 'Repeat until no swaps happen'] },
    { name: 'Linear Search 🔦', steps: ['Start at the first item', 'Compare it with the target', 'If it matches, return its position', 'If not, move to the next item', 'Repeat until found or list ends'] },
    { name: 'Binary Search 🔍', steps: ['Make sure the list is sorted', 'Look at the middle item', 'If it matches, you are done', 'If target is smaller, take the left half', 'If target is bigger, take the right half'] },
    { name: 'Insertion Sort 📥', steps: ['Start with the second item', 'Compare it to the ones before it', 'Shift larger items one place right', 'Drop the item into the gap', 'Move on to the next item', 'Repeat until the list is sorted'] },
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
    do { stepsOrder = shuffle(stepsCorrect); } while (stepsOrder.every((s, k) => s === stepsCorrect[k]));
    stepsSel = null;
  }
  function stepTap(i: number) {
    if (won) return;
    if (stepsSel === null) { stepsSel = i; return; }
    if (stepsSel === i) { stepsSel = null; return; }
    [stepsOrder[stepsSel], stepsOrder[i]] = [stepsOrder[i], stepsOrder[stepsSel]];
    stepsOrder = [...stepsOrder]; stepsSel = null;
    if (stepsOrder.every((s, k) => s === stepsCorrect[k])) completeLevel('steps', 'In order! ⭐');
  }

  $: activeGame = GAMES.find(g => g.id === view);
</script>

{#if celebrate}
  <div class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
    <div class="text-center cc-pop">
      <div class="text-7xl mb-2">🎉</div>
      <div class="text-2xl font-black" style="color:#fff; text-shadow:0 2px 8px rgba(0,0,0,0.55)">{celebrateMsg}</div>
    </div>
    {#each Array(16) as _, i}
      <span class="cc-confetti" style="left:{4 + i * 6}%; animation-delay:{i * 0.07}s; background:{['#ec4899','#06b6d4','#f59e0b','#8b5cf6','#34d399','#f43f5e'][i % 6]}"></span>
    {/each}
  </div>
{/if}

<div class="mx-auto max-w-4xl">

  {#if view === 'hub'}
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
        <button on:click={() => openGame(g.id)} class="group text-left rounded-2xl border-2 p-5 transition-all hover:scale-[1.02]"
          style="border-color:{g.colour}55; background:{g.colour}12">
          <div class="flex items-center gap-3 mb-2">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shrink-0" style="background:{g.colour}25; border:2px solid {g.colour}55">{g.emoji}</div>
            <div>
              <h3 class="text-lg font-black text-white">{g.name}</h3>
              <p class="text-xs font-semibold" style="color:{g.colour}">{g.tagline}</p>
            </div>
          </div>
          <p class="text-sm text-slate-300 leading-relaxed">{g.concept}</p>
          <div class="mt-3 flex items-center gap-1">
            {#each Array(g.levels) as _, k}
              <span class="text-base">{(progress[g.id] || []).includes(k) ? '⭐' : '☆'}</span>
            {/each}
            <span class="ml-auto text-sm font-bold" style="color:{g.colour}">Play →</span>
          </div>
        </button>
      {/each}
    </div>

  {:else}
    <div class="mb-5 flex items-center justify-between">
      <button on:click={backToHub} class="text-sm text-slate-400 hover:text-white transition-colors">← All challenges</button>
      <div class="flex items-center gap-1">
        {#each Array(activeGame?.levels || 0) as _, k}
          <button on:click={() => loadLevel(view, k)} class="h-8 w-8 rounded-lg text-sm font-bold transition-all"
            style="background:{k === level ? activeGame?.colour : (activeGame?.colour + '20')}; color:{k === level ? '#fff' : activeGame?.colour}">
            {(progress[view] || []).includes(k) ? '⭐' : k + 1}
          </button>
        {/each}
      </div>
    </div>

    <div class="rounded-2xl border-2 p-5 sm:p-6" style="border-color:{activeGame?.colour}55; background:{activeGame?.colour}0d">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-2xl">{activeGame?.emoji}</span>
        <div><h2 class="text-xl font-black text-white">{activeGame?.name}</h2><p class="text-xs text-slate-400">Level {level + 1}</p></div>
      </div>

      <!-- ─────── SORT SQUAD ─────── -->
      {#if view === 'sort'}
        <p class="text-sm text-slate-300 mb-5">Tap two monsters to swap them. Line them up <strong>shortest → tallest</strong>!</p>
        <div class="flex items-end justify-center gap-3 sm:gap-4 min-h-[200px] py-2">
          {#each sortArr as v, i}
            <button on:click={() => sortTap(i)} class="transition-all" style="transform:{sortSel === i ? 'translateY(-14px)' : 'none'}; filter:{sortSel === i ? 'drop-shadow(0 0 6px #fde047)' : 'none'}">
              {@html monster(v, sortMax)}
            </button>
          {/each}
        </div>
        <p class="text-center text-xs text-slate-500 mt-3">Swaps: <span class="font-bold text-white">{sortSwaps}</span> · Par: <span class="font-bold" style="color:#ec4899">{sortPar}</span></p>

      <!-- ─────── MAZE BOT ─────── -->
      {:else if view === 'maze'}
        <p class="text-sm text-slate-300 mb-1">Collect every gem 💎, then reach the flag 🏁.</p>
        <p class="text-xs mb-4" style="color:{gemsLeft === 0 ? '#34d399' : '#06b6d4'}">Gems left: {gemsLeft} / {gemsTotal}{mazeMsg ? ' — ' + mazeMsg : ''}</p>
        <div class="flex flex-col items-center gap-4">
          <div class="inline-grid gap-1" style="grid-template-columns:repeat({maze[0]?.length || 1}, 1fr)">
            {#each maze as row, r}
              {#each row.split('') as cell, c}
                {@const key = `${r},${c}`}
                <button on:click={() => mazeCellTap(r, c)} class="h-11 w-11 sm:h-12 sm:w-12 rounded-lg flex items-center justify-center transition-all"
                  style="background:{cell === '#' ? '#1e293b' : visited[key] ? '#06b6d422' : '#06b6d40d'}; border:2px solid {cell === '#' ? '#0f172a' : '#06b6d433'}; cursor:{cell === '#' ? 'default' : 'pointer'}">
                  {#if robot.r === r && robot.c === c}{@html ROBOT}
                  {:else if cell === 'G'}{@html FLAG}
                  {:else if cell === 'C' && !collected[key]}{@html GEM}
                  {:else if cell === '#'}<span class="text-lg opacity-60">🧱</span>
                  {:else if visited[key]}<span style="color:#06b6d4">·</span>{/if}
                </button>
              {/each}
            {/each}
          </div>
          <div class="grid grid-cols-3 gap-1.5 w-36">
            <span></span><button on:click={() => move(-1, 0)} class="cc-arrow">⬆️</button><span></span>
            <button on:click={() => move(0, -1)} class="cc-arrow">⬅️</button>
            <button on:click={() => move(1, 0)} class="cc-arrow">⬇️</button>
            <button on:click={() => move(0, 1)} class="cc-arrow">➡️</button>
          </div>
          <p class="text-xs text-slate-500">Steps: {mazeSteps}</p>
        </div>

      <!-- ─────── LIGHT IT UP ─────── -->
      {:else if view === 'logic'}
        <p class="text-sm text-slate-300 mb-1">Light the bulb by satisfying: <span class="font-black" style="color:#f59e0b">{LOGIC_LEVELS[level].formula}</span></p>
        <p class="text-xs text-slate-500 mb-5">💡 {LOGIC_LEVELS[level].tip}</p>
        <div class="flex items-center justify-center gap-4 sm:gap-8 py-4 flex-wrap">
          <div class="flex flex-col gap-2.5">
            {#each LOGIC_LEVELS[level].labels as lab, i}
              <button on:click={() => toggleInput(i)} class="cc-switch" class:on={logicInputs[i]}>
                <span class="cc-switch-lab">{lab}</span>
                <span class="cc-track"><span class="cc-knob"></span></span>
                <span class="cc-bit">{logicInputs[i] ? '1' : '0'}</span>
              </button>
            {/each}
          </div>
          <div class="flex h-16 min-w-[5.5rem] items-center justify-center rounded-xl border-2 px-3 text-center font-black text-sm leading-tight"
               style="border-color:#f59e0b; background:#f59e0b1a; color:#f59e0b">{LOGIC_LEVELS[level].formula}</div>
          <div class="transition-transform" style="transform:{logicOn ? 'scale(1.12)' : 'none'}">{@html bulb(logicOn)}</div>
        </div>

      <!-- ─────── STEP STACKER ─────── -->
      {:else if view === 'steps'}
        <div class="flex items-center gap-3 mb-3">
          {@html MASCOT}
          <div>
            <p class="text-sm text-slate-300">Put the steps for <strong>{STEP_LEVELS[level].name}</strong> in order.</p>
            <p class="text-xs text-slate-500">Tap two cards to swap them.</p>
          </div>
        </div>
        <div class="space-y-2">
          {#each stepsOrder as step, i}
            <button on:click={() => stepTap(i)} class="w-full text-left rounded-xl border-2 px-4 py-3 flex items-center gap-3 transition-all"
              style="border-color:{stepsSel === i ? '#fde047' : '#8b5cf655'}; background:{stepsSel === i ? '#8b5cf625' : '#8b5cf60d'}; transform:{stepsSel === i ? 'scale(1.01)' : 'none'}">
              <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black" style="background:#8b5cf6; color:#fff">{i + 1}</span>
              <span class="text-sm text-white">{step}</span>
            </button>
          {/each}
        </div>
      {/if}

      {#if won}
        <div class="mt-5 rounded-xl border-2 p-4 text-center" style="border-color:#34d39955; background:#34d39912">
          <p class="text-lg font-black" style="color:#34d399">⭐ Solved it!</p>
          <button on:click={nextLevel} class="mt-2 rounded-xl px-5 py-2.5 font-bold text-white transition-all hover:opacity-90" style="background:{activeGame?.colour}">
            {level + 1 < (activeGame?.levels || 0) ? 'Next level →' : 'Back to challenges 🏆'}
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .cc-arrow { height: 2.75rem; border-radius: 0.75rem; background: rgba(6,182,212,0.12); border: 2px solid rgba(6,182,212,0.35); font-size: 1.1rem; transition: transform 0.1s; }
  .cc-arrow:active { transform: scale(0.9); }

  .cc-switch { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 0.85rem; background: #334155; transition: background 0.15s; }
  .cc-switch.on { background: #f59e0b; }
  .cc-switch-lab { font-weight: 800; font-size: 1rem; color: #94a3b8; width: 1ch; }
  .cc-switch.on .cc-switch-lab { color: #422006; }
  .cc-track { position: relative; width: 38px; height: 20px; border-radius: 999px; background: rgba(0,0,0,0.3); }
  .cc-knob { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #94a3b8; transition: transform 0.15s, background 0.15s; }
  .cc-switch.on .cc-knob { transform: translateX(18px); background: #fffbeb; }
  .cc-bit { font-family: monospace; font-weight: 700; font-size: 0.9rem; color: #94a3b8; width: 1ch; }
  .cc-switch.on .cc-bit { color: #422006; }

  @keyframes ccpop { 0% { transform: scale(0.4); opacity: 0; } 55% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
  .cc-pop { animation: ccpop 0.5s ease-out; }
  .cc-confetti { position: absolute; top: -12px; width: 11px; height: 16px; border-radius: 2px; animation: ccfall 2.2s linear forwards; }
  @keyframes ccfall { to { transform: translateY(105vh) rotate(600deg); opacity: 0.15; } }
</style>
