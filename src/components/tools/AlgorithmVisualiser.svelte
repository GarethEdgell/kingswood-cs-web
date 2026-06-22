<script lang="ts">
  import { onDestroy } from 'svelte';

  // ── Types ──────────────────────────────────────────────────────────────────
  type AlgoId = 'bubble' | 'insertion' | 'linear' | 'binary' | 'dijkstra' | 'astar';

  interface Step {
    arr:       number[];
    comparing: number[];
    swapping:  number[];
    sorted:    number[];
    found:     number[];
    active:    number[];
    low?:      number;
    mid?:      number;
    high?:     number;
    msg:       string;
    trace:     (string | number)[];
  }

  interface GraphStep {
    g:         Record<string, number>;
    h?:        Record<string, number>;
    f?:        Record<string, number>;
    prev:      Record<string, string | null>;
    visited:   string[];
    frontier:  string[];
    current:   string | null;
    examining: string | null;
    path:      string[];
    msg:       string;
    trace:     (string | number)[];
  }

  // ── Algo selector ─────────────────────────────────────────────────────────
  let selectedAlgo: AlgoId = 'bubble';
  const algos: { id: AlgoId; label: string; emoji: string; cat: string }[] = [
    { id: 'bubble',    label: 'Bubble Sort',    emoji: '🫧', cat: 'Sort'   },
    { id: 'insertion', label: 'Insertion Sort', emoji: '📌', cat: 'Sort'   },
    { id: 'linear',    label: 'Linear Search',  emoji: '🔍', cat: 'Search' },
    { id: 'binary',    label: 'Binary Search',  emoji: '⚡', cat: 'Search' },
    { id: 'dijkstra',  label: "Dijkstra's",     emoji: '🗺️', cat: 'Graph'  },
    { id: 'astar',     label: 'A* Search',      emoji: '⭐', cat: 'Graph'  },
  ];

  $: isGraphAlgo = selectedAlgo === 'dijkstra' || selectedAlgo === 'astar';

  // ── Default arrays ─────────────────────────────────────────────────────────
  const DEFAULT_SORT   = [5, 2, 8, 1, 9, 3, 7, 4];
  const DEFAULT_SEARCH = [1, 3, 4, 5, 7, 8, 9, 12];
  let targetValue = 7;

  // ── Graph data ─────────────────────────────────────────────────────────────
  // 8-node weighted graph: S→G with several paths
  const NODES: Record<string, { x: number; y: number }> = {
    S: { x: 65,  y: 155 },
    A: { x: 185, y: 62  },
    B: { x: 185, y: 248 },
    C: { x: 305, y: 62  },
    D: { x: 305, y: 248 },
    E: { x: 405, y: 62  },
    F: { x: 405, y: 248 },
    G: { x: 458, y: 155 },
  };
  const EDGES: { a: string; b: string; w: number }[] = [
    { a: 'S', b: 'A', w: 4 },
    { a: 'S', b: 'B', w: 3 },
    { a: 'A', b: 'B', w: 2 },
    { a: 'A', b: 'C', w: 5 },
    { a: 'B', b: 'D', w: 4 },
    { a: 'C', b: 'D', w: 1 },
    { a: 'C', b: 'E', w: 6 },
    { a: 'D', b: 'F', w: 5 },
    { a: 'E', b: 'F', w: 2 },
    { a: 'E', b: 'G', w: 3 },
    { a: 'F', b: 'G', w: 4 },
  ];
  // Shortest path S→B→D→F→G = 3+4+5+4 = 16

  function heuristic(nodeId: string): number {
    const n = NODES[nodeId], goal = NODES['G'];
    const dx = n.x - goal.x, dy = n.y - goal.y;
    return Math.round(Math.sqrt(dx * dx + dy * dy) / 50);
  }

  function reconstructPath(prev: Record<string, string | null>, goal: string): string[] {
    const path: string[] = [];
    let cur: string | null = goal;
    while (cur) { path.unshift(cur); cur = prev[cur]; }
    return path[0] === 'S' ? path : [];
  }

  function isOnPath(path: string[] | undefined, a: string, b: string): boolean {
    if (!path || path.length < 2) return false;
    for (let i = 0; i < path.length - 1; i++) {
      if ((path[i] === a && path[i + 1] === b) || (path[i] === b && path[i + 1] === a)) return true;
    }
    return false;
  }

  // ── Playback state ─────────────────────────────────────────────────────────
  // Pre-initialise both arrays with real data so neither is ever [] when the
  // reactive declarations (totalSteps, step/graphStep) first evaluate.
  // Without this, Svelte runs those declarations before the reactive statement
  // init() fires, giving totalSteps=0 and a frozen visualiser on first click.
  let steps: Step[] = bubbleSortSteps([...DEFAULT_SORT]);
  let graphSteps: GraphStep[] = dijkstraSteps();
  let stepIdx = 0;
  let playing = false;
  let speedMs = 700;
  let timer: ReturnType<typeof setInterval> | null = null;

  $: totalSteps = isGraphAlgo ? graphSteps.length : steps.length;
  $: step       = !isGraphAlgo ? (steps[stepIdx] ?? null)      : null;
  $: graphStep  =  isGraphAlgo ? (graphSteps[stepIdx] ?? null) : null;
  $: anyStep    = isGraphAlgo  ? graphStep : step;
  $: progress   = totalSteps > 1 ? (stepIdx / (totalSteps - 1)) * 100 : 0;

  // ── ARRAY STEP GENERATORS ─────────────────────────────────────────────────
  function bubbleSortSteps(init: number[]): Step[] {
    const out: Step[] = [];
    const a = [...init];
    const n = a.length;
    const sorted: number[] = [];

    out.push({ arr: [...a], comparing: [], swapping: [], sorted: [], found: [], active: [],
      msg: `Bubble sort: scan left→right, swap adjacent pairs if out of order. Largest "bubbles" to the end each pass.`,
      trace: ['—', '—', '—', '—', '—'] });

    for (let pass = 0; pass < n - 1; pass++) {
      let swapped = false;
      out.push({ arr: [...a], comparing: [], swapping: [], sorted: [...sorted], found: [], active: [],
        msg: `▶ Pass ${pass + 1} begins (compare positions 0 to ${n - 2 - pass})`,
        trace: [pass + 1, '—', '—', '—', '—'] });

      for (let j = 0; j < n - 1 - pass; j++) {
        out.push({ arr: [...a], comparing: [j, j + 1], swapping: [], sorted: [...sorted], found: [], active: [],
          msg: `Compare a[${j}]=${a[j]} and a[${j + 1}]=${a[j + 1]} — is ${a[j]} > ${a[j + 1]}?`,
          trace: [pass + 1, j, a[j], a[j + 1], '?'] });

        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          swapped = true;
          out.push({ arr: [...a], comparing: [], swapping: [j, j + 1], sorted: [...sorted], found: [], active: [],
            msg: `Yes — swap! → [${a.join(', ')}]`,
            trace: [pass + 1, j, a[j + 1], a[j], '✓ swap'] });
        } else {
          out.push({ arr: [...a], comparing: [], swapping: [], sorted: [...sorted], found: [], active: [],
            msg: `No — ${a[j]} ≤ ${a[j + 1]}, no swap needed`,
            trace: [pass + 1, j, a[j], a[j + 1], '✗ no swap'] });
        }
      }

      sorted.unshift(n - 1 - pass);
      out.push({ arr: [...a], comparing: [], swapping: [], sorted: [...sorted], found: [], active: [],
        msg: `End of pass ${pass + 1}: position ${n - 1 - pass} is now in its final place ✓`,
        trace: [pass + 1, '—', '—', '—', '—'] });

      if (!swapped) {
        const all = Array.from({ length: n }, (_, i) => i);
        out.push({ arr: [...a], comparing: [], swapping: [], sorted: all, found: [], active: [],
          msg: `No swaps in pass ${pass + 1} — array is already sorted. Algorithm terminates early ✓`,
          trace: ['done', '—', '—', '—', '—'] });
        return out;
      }
    }

    const all = Array.from({ length: n }, (_, i) => i);
    out.push({ arr: [...a], comparing: [], swapping: [], sorted: all, found: [], active: [],
      msg: `All passes complete. Sorted: [${a.join(', ')}] ✓`,
      trace: ['done', '—', '—', '—', '—'] });
    return out;
  }

  function insertionSortSteps(init: number[]): Step[] {
    const out: Step[] = [];
    const a = [...init];
    const n = a.length;

    out.push({ arr: [...a], comparing: [], swapping: [], sorted: [0], found: [], active: [],
      msg: `Insertion sort: build a sorted section on the left. a[0]=${a[0]} is trivially sorted.`,
      trace: ['—', '—', '—', '—', '—'] });

    for (let i = 1; i < n; i++) {
      const key = a[i];
      const sortedSoFar = Array.from({ length: i }, (_, k) => k);

      out.push({ arr: [...a], comparing: [], swapping: [], sorted: sortedSoFar, found: [], active: [i],
        msg: `i=${i}: pick up key = ${key} from position ${i}`,
        trace: [i, key, '—', '—', '—'] });

      let j = i - 1;
      while (j >= 0 && a[j] > key) {
        out.push({ arr: [...a], comparing: [j, j + 1], swapping: [], sorted: sortedSoFar, found: [], active: [i],
          msg: `a[${j}]=${a[j]} > key(${key}), shift ${a[j]} right to position ${j + 1}`,
          trace: [i, key, j, a[j], '→ shift'] });
        a[j + 1] = a[j];
        out.push({ arr: [...a], comparing: [], swapping: [j, j + 1], sorted: sortedSoFar, found: [], active: [j + 1],
          msg: `Shifted ${a[j + 1]} → position ${j + 1}`,
          trace: [i, key, j, a[j + 1], 'shifted'] });
        j--;
      }

      a[j + 1] = key;
      out.push({ arr: [...a], comparing: [], swapping: [], sorted: Array.from({ length: i + 1 }, (_, k) => k), found: [], active: [j + 1],
        msg: `Insert key ${key} at position ${j + 1}. Sorted section grows to length ${i + 1} ✓`,
        trace: [i, key, j + 1, key, '✓ insert'] });
    }

    out.push({ arr: [...a], comparing: [], swapping: [], sorted: Array.from({ length: n }, (_, i) => i), found: [], active: [],
      msg: `Insertion sort complete: [${a.join(', ')}] ✓`,
      trace: ['done', '—', '—', '—', '—'] });
    return out;
  }

  function linearSearchSteps(arr: number[], target: number): Step[] {
    const out: Step[] = [];
    const a = [...arr];

    out.push({ arr: [...a], comparing: [], swapping: [], sorted: [], found: [], active: [],
      msg: `Linear search for target = ${target}. Check each element in order until found or end reached.`,
      trace: ['—', '—', target, '—'] });

    for (let i = 0; i < a.length; i++) {
      out.push({ arr: [...a], comparing: [i], swapping: [], sorted: [], found: [], active: [],
        msg: `Check index ${i}: a[${i}] = ${a[i]}. Is ${a[i]} = ${target}?`,
        trace: [i, a[i], target, '?'] });

      if (a[i] === target) {
        out.push({ arr: [...a], comparing: [], swapping: [], sorted: [], found: [i], active: [],
          msg: `✓ Found! ${target} is at index ${i}. Comparisons made: ${i + 1}`,
          trace: [i, a[i], target, 'FOUND ✓'] });
        return out;
      } else {
        out.push({ arr: [...a], comparing: [], swapping: [], sorted: [], found: [], active: Array.from({ length: i + 1 }, (_, k) => k),
          msg: `${a[i]} ≠ ${target}. Move to next element.`,
          trace: [i, a[i], target, '✗'] });
      }
    }

    out.push({ arr: [...a], comparing: [], swapping: [], sorted: [], found: [], active: Array.from({ length: a.length }, (_, i) => i),
      msg: `Reached end of array — ${target} not found ✗. ${a.length} comparisons made.`,
      trace: ['—', '—', target, 'NOT FOUND ✗'] });
    return out;
  }

  function binarySearchSteps(arr: number[], target: number): Step[] {
    const out: Step[] = [];
    const a = [...arr];
    let low = 0;
    let high = a.length - 1;
    let pass = 0;

    out.push({ arr: [...a], comparing: [], swapping: [], sorted: [], found: [], active: [], low, high,
      msg: `Binary search for ${target} in sorted array. Set low=${low}, high=${high}.`,
      trace: [low, '—', high, '—', '—'] });

    while (low <= high) {
      pass++;
      const mid = Math.floor((low + high) / 2);

      out.push({ arr: [...a], comparing: [mid], swapping: [], sorted: [], found: [], active: [], low, mid, high,
        msg: `Pass ${pass}: low=${low}, high=${high} → mid = ⌊(${low}+${high})/2⌋ = ${mid}. Check a[${mid}]=${a[mid]}.`,
        trace: [low, mid, high, a[mid], '?'] });

      if (a[mid] === target) {
        out.push({ arr: [...a], comparing: [], swapping: [], sorted: [], found: [mid], active: [], low, mid, high,
          msg: `a[${mid}] = ${a[mid]} = ${target}. Found at index ${mid} in ${pass} comparison${pass > 1 ? 's' : ''} ✓`,
          trace: [low, mid, high, a[mid], 'FOUND ✓'] });
        return out;
      } else if (a[mid] < target) {
        const eliminated = Array.from({ length: mid + 1 }, (_, i) => i);
        out.push({ arr: [...a], comparing: [], swapping: [], sorted: [], found: [], active: eliminated, low, mid, high,
          msg: `a[${mid}]=${a[mid]} < ${target}. Target must be in right half. New low = ${mid + 1}.`,
          trace: [low, mid, high, a[mid], `low → ${mid + 1}`] });
        low = mid + 1;
      } else {
        const eliminated = Array.from({ length: a.length - mid }, (_, i) => mid + i);
        out.push({ arr: [...a], comparing: [], swapping: [], sorted: [], found: [], active: eliminated, low, mid, high,
          msg: `a[${mid}]=${a[mid]} > ${target}. Target must be in left half. New high = ${mid - 1}.`,
          trace: [low, mid, high, a[mid], `high → ${mid - 1}`] });
        high = mid - 1;
      }
    }

    out.push({ arr: [...a], comparing: [], swapping: [], sorted: [], found: [], active: [], low, high,
      msg: `low (${low}) > high (${high}). Search space exhausted — ${target} not found ✗.`,
      trace: [low, '—', high, '—', 'NOT FOUND ✗'] });
    return out;
  }

  // ── GRAPH STEP GENERATORS ─────────────────────────────────────────────────
  function dijkstraSteps(): GraphStep[] {
    const out: GraphStep[] = [];
    const INF = Infinity;
    const nodeIds = Object.keys(NODES);
    const START = 'S', GOAL = 'G';

    const g: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    nodeIds.forEach(n => { g[n] = INF; prev[n] = null; });
    g[START] = 0;

    let visited: string[] = [];
    let frontier: string[] = [START];

    const snap = (extra: Partial<GraphStep>): GraphStep => ({
      g: { ...g }, prev: { ...prev },
      visited: [...visited], frontier: [...frontier],
      current: null, examining: null, path: [],
      msg: '', trace: ['—', '—', '—', '—', '—'],
      ...extra,
    });

    out.push(snap({
      msg: `Dijkstra: set dist[S]=0, all others ∞. Add S to the priority queue (min-heap ordered by distance).`,
      trace: ['S', 0, '—', '—', 'init'],
    }));

    while (frontier.length > 0) {
      frontier = [...frontier].sort((a, b) => g[a] - g[b]);
      const u = frontier[0];
      frontier = frontier.slice(1);

      if (visited.includes(u)) continue;
      visited = [...visited, u];

      const queueStr = frontier.length
        ? frontier.map(n => `${n}(${g[n] === INF ? '∞' : g[n]})`).join(', ')
        : 'empty';

      out.push(snap({
        current: u,
        msg: `Dequeue node ${u} — dist=${g[u]}. Mark visited. Remaining queue: [${queueStr}]`,
        trace: [u, g[u], '—', '—', 'dequeue'],
      }));

      if (u === GOAL) {
        const path = reconstructPath(prev, GOAL);
        out.push(snap({
          path, frontier: [],
          msg: `🎯 Goal reached! Shortest path: ${path.join(' → ')} | Total cost: ${g[GOAL]}`,
          trace: [GOAL, g[GOAL], '—', '—', 'FOUND ✓'],
        }));
        return out;
      }

      const neighbours = EDGES
        .filter(e => e.a === u || e.b === u)
        .map(e => ({ node: e.a === u ? e.b : e.a, w: e.w }))
        .filter(({ node }) => !visited.includes(node));

      for (const { node: v, w } of neighbours) {
        const alt = g[u] + w;
        const better = alt < g[v];
        out.push(snap({
          current: u, examining: v,
          msg: `  Edge ${u}→${v} (weight ${w}): alt = ${g[u]}+${w} = ${alt}  vs  dist[${v}] = ${g[v] === INF ? '∞' : g[v]}${better ? '  → shorter! UPDATE' : '  → no improvement'}`,
          trace: [v, g[v] === INF ? '∞' : g[v], alt, w, better ? `update → ${alt}` : 'skip'],
        }));
        if (better) {
          g[v] = alt;
          prev[v] = u;
          if (!frontier.includes(v)) frontier = [...frontier, v];
          out.push(snap({
            current: u, examining: v,
            msg: `  ✓ dist[${v}] updated to ${alt}  (via ${u}). ${frontier.includes(v) ? `${v} added to queue.` : ''}`,
            trace: [v, alt, u, w, 'updated'],
          }));
        }
      }
    }

    out.push(snap({
      frontier: [],
      msg: 'Priority queue empty. Algorithm complete.',
      trace: ['—', '—', '—', '—', 'done'],
    }));
    return out;
  }

  function astarSteps(): GraphStep[] {
    const out: GraphStep[] = [];
    const INF = Infinity;
    const nodeIds = Object.keys(NODES);
    const START = 'S', GOAL = 'G';

    const hMap: Record<string, number> = {};
    nodeIds.forEach(n => { hMap[n] = heuristic(n); });

    const g: Record<string, number> = {};
    const f: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    nodeIds.forEach(n => { g[n] = INF; f[n] = INF; prev[n] = null; });
    g[START] = 0;
    f[START] = hMap[START];

    let visited: string[] = [];
    let frontier: string[] = [START];

    const snap = (extra: Partial<GraphStep>): GraphStep => ({
      g: { ...g }, h: { ...hMap }, f: { ...f }, prev: { ...prev },
      visited: [...visited], frontier: [...frontier],
      current: null, examining: null, path: [],
      msg: '', trace: ['—', '—', '—', '—', '—'],
      ...extra,
    });

    out.push(snap({
      msg: `A*: heuristic h(n) = straight-line distance to G ÷ 50 (rounded). h(S)=${hMap[START]}. Set g[S]=0, f[S]=g+h=${hMap[START]}. Add S to open set.`,
      trace: ['S', 0, hMap[START], hMap[START], 'init'],
    }));

    while (frontier.length > 0) {
      frontier = [...frontier].sort((a, b) => f[a] - f[b]);
      const u = frontier[0];
      frontier = frontier.slice(1);

      if (visited.includes(u)) continue;
      visited = [...visited, u];

      const openStr = frontier.length
        ? frontier.map(n => `${n}(f=${f[n] === INF ? '∞' : f[n]})`).join(', ')
        : 'empty';

      out.push(snap({
        current: u,
        msg: `Dequeue ${u}: f=${f[u]} (g=${g[u]} + h=${hMap[u]}). Move to closed set. Open: [${openStr}]`,
        trace: [u, g[u], hMap[u], f[u], 'expand'],
      }));

      if (u === GOAL) {
        const path = reconstructPath(prev, GOAL);
        out.push(snap({
          path, frontier: [],
          msg: `🎯 Optimal path found! ${path.join(' → ')} | Total cost g=${g[GOAL]}`,
          trace: [GOAL, g[GOAL], 0, g[GOAL], 'FOUND ✓'],
        }));
        return out;
      }

      const neighbours = EDGES
        .filter(e => e.a === u || e.b === u)
        .map(e => ({ node: e.a === u ? e.b : e.a, w: e.w }))
        .filter(({ node }) => !visited.includes(node));

      for (const { node: v, w } of neighbours) {
        const tentG = g[u] + w;
        const tentF = tentG + hMap[v];
        const better = tentG < g[v];
        out.push(snap({
          current: u, examining: v,
          msg: `  Edge ${u}→${v} (w=${w}): g=${g[u]}+${w}=${tentG}, h[${v}]=${hMap[v]}, f=${tentF}  vs  current f[${v}]=${f[v] === INF ? '∞' : f[v]}${better ? '  → BETTER!' : '  → skip'}`,
          trace: [v, tentG, hMap[v], tentF, better ? `f=${tentF} ✓` : 'skip'],
        }));
        if (better) {
          g[v] = tentG; f[v] = tentF; prev[v] = u;
          if (!frontier.includes(v)) frontier = [...frontier, v];
          out.push(snap({
            current: u, examining: v,
            msg: `  ✓ Updated ${v}: g=${tentG}, h=${hMap[v]}, f=${tentF}. ${!frontier.slice(0).includes(v) ? 'Added to' : 'Updated in'} open set.`,
            trace: [v, tentG, hMap[v], tentF, 'updated'],
          }));
        }
      }
    }

    out.push(snap({
      frontier: [],
      msg: 'Open set empty. No path found.',
      trace: ['—', '—', '—', '—', 'done'],
    }));
    return out;
  }

  // ── Trace table headers ────────────────────────────────────────────────────
  const traceHeaders: Record<AlgoId, string[]> = {
    bubble:    ['Pass', 'j', 'a[j]', 'a[j+1]', 'Action'],
    insertion: ['i', 'Key', 'j', 'a[j]', 'Action'],
    linear:    ['Index', 'a[i]', 'Target', 'Result'],
    binary:    ['Low', 'Mid', 'High', 'a[mid]', 'Action'],
    dijkstra:  ['Neighbor', 'Old dist', 'New alt', 'Edge w', 'Action'],
    astar:     ['Node', 'g', 'h(n)', 'f=g+h', 'Action'],
  };

  // ── Initialise ─────────────────────────────────────────────────────────────
  function init() {
    stopPlaying();
    stepIdx = 0;
    traceHistory = [];
    switch (selectedAlgo) {
      case 'bubble':    steps = bubbleSortSteps([...DEFAULT_SORT]);                  break;
      case 'insertion': steps = insertionSortSteps([...DEFAULT_SORT]);               break;
      case 'linear':    steps = linearSearchSteps([...DEFAULT_SEARCH], targetValue); break;
      case 'binary':    steps = binarySearchSteps([...DEFAULT_SEARCH], targetValue); break;
      case 'dijkstra':  graphSteps = dijkstraSteps();                                break;
      case 'astar':     graphSteps = astarSteps();                                   break;
    }
  }

  $: selectedAlgo, init();
  $: if (selectedAlgo === 'linear' || selectedAlgo === 'binary') targetValue, init();

  // ── Playback ───────────────────────────────────────────────────────────────
  function stopPlaying() {
    playing = false;
    if (timer) { clearInterval(timer); timer = null; }
  }

  function startPlaying() {
    if (stepIdx >= totalSteps - 1) stepIdx = 0;
    playing = true;
    timer = setInterval(() => {
      if (stepIdx < totalSteps - 1) {
        stepIdx++;
      } else {
        stopPlaying();
      }
    }, speedMs);
  }

  function togglePlay() { playing ? stopPlaying() : startPlaying(); }
  function prev()  { stopPlaying(); if (stepIdx > 0) stepIdx--; }
  function next()  { stopPlaying(); if (stepIdx < totalSteps - 1) stepIdx++; }
  function reset() { stopPlaying(); stepIdx = 0; traceHistory = []; }

  onDestroy(stopPlaying);

  // ── Derived current step ───────────────────────────────────────────────────
  $: maxVal = Math.max(...(step?.arr ?? [1]), 1);

  // ── Trace history (rolling last 6 rows) ────────────────────────────────────
  let traceHistory: (string | number)[][] = [];

  $: if (anyStep && anyStep.trace[0] !== '—') {
    const last = traceHistory[traceHistory.length - 1];
    if (!last || last.join() !== anyStep.trace.join()) {
      traceHistory = [...traceHistory.slice(-7), anyStep.trace];
    }
  }

  // ── Bar colouring ─────────────────────────────────────────────────────────
  function valueHue(val: number): number {
    return Math.round(10 + (val / Math.max(maxVal, 1)) * 260);
  }

  // NOTE: step is passed explicitly as a parameter so Svelte's template
  // compiler sees it as a reactive dependency of the call expression.
  // Without this, Svelte only tracks (i, val) — if val doesn't change for
  // a bar after a swap, barStyle is never re-called and the colour sticks.
  function barStyle(i: number, val: number, s: Step | null): string {
    const hue = valueHue(val);
    if (!s) return `background:hsl(${hue},70%,52%)`;
    if (s.found.includes(i))
      return 'background:#10b981;box-shadow:0 0 18px rgba(16,185,129,.75)';
    if (s.swapping.includes(i))
      return 'background:#f43f5e;box-shadow:0 0 18px rgba(244,63,94,.75)';
    if (s.comparing.includes(i))
      return 'background:#f59e0b;box-shadow:0 0 18px rgba(245,158,11,.75)';
    if (s.sorted.includes(i))
      return 'background:#10b981;box-shadow:0 0 12px rgba(16,185,129,.65)';
    if (s.active.includes(i))
      return `background:hsl(${hue},30%,38%);opacity:0.55`;
    return `background:hsl(${hue},70%,52%)`;
  }

  function labelColor(i: number, s: Step | null): string {
    if (!s) return 'text-slate-400';
    if (s.found.includes(i))     return 'text-emerald-400 font-bold';
    if (s.swapping.includes(i))  return 'text-rose-400 font-bold';
    if (s.comparing.includes(i)) return 'text-amber-400 font-bold';
    if (s.sorted.includes(i))    return 'text-sky-300';
    return 'text-slate-400';
  }

  function posLabel(i: number, s: Step | null): string {
    if (!s || (selectedAlgo !== 'binary' && selectedAlgo !== 'linear')) return '';
    const parts: string[] = [];
    if (s.low === i)  parts.push('low');
    if (s.mid === i)  parts.push('mid');
    if (s.high === i) parts.push('high');
    return parts.join('/');
  }

  // ── Graph node helpers ────────────────────────────────────────────────────
  function nodeFill(id: string, gs: GraphStep | null): string {
    if (!gs) return '#1a2d44';
    if (gs.path.includes(id))     return '#064e3b';
    if (gs.current === id)        return '#2e2a6b';
    if (gs.examining === id)      return '#5c2008';
    if (gs.visited.includes(id))  return '#1e3a8a';
    if (gs.frontier.includes(id)) return '#5c3a00';
    return '#1a2d44';
  }
  function nodeStroke(id: string, gs: GraphStep | null): string {
    if (!gs) return '#2d4a6e';
    if (gs.path.includes(id))     return '#10b981';
    if (gs.current === id)        return '#818cf8';
    if (gs.examining === id)      return '#fb923c';
    if (gs.visited.includes(id))  return '#3b82f6';
    if (gs.frontier.includes(id)) return '#f59e0b';
    return '#2d4a6e';
  }
  function nodeTextFill(id: string, gs: GraphStep | null): string {
    if (!gs) return '#7ca3c8';
    if (gs.path.includes(id))     return '#34d399';
    if (gs.current === id)        return '#c7d2fe';
    if (gs.examining === id)      return '#fdba74';
    if (gs.visited.includes(id))  return '#93c5fd';
    if (gs.frontier.includes(id)) return '#fde68a';
    return '#7ca3c8';
  }
  function nodeStrokeW(id: string, gs: GraphStep | null): number {
    if (!gs) return 1.5;
    if (gs.path.includes(id) || gs.current === id) return 2.5;
    if (gs.examining === id) return 2;
    return 1.5;
  }

  const speedLabels = [
    { label: 'Slow',   ms: 1200 },
    { label: 'Normal', ms: 700 },
    { label: 'Fast',   ms: 300 },
  ];
</script>

<!-- ── Shell ─────────────────────────────────────────────────────────────── -->
<div class="text-slate-200">

  <!-- Algorithm selector -->
  <div class="border-b border-white/8 px-4 py-3 flex flex-wrap gap-2 items-center">
    <span class="text-xs text-slate-500 mr-1 shrink-0">Algorithm:</span>
    {#each algos as algo}
      <button
        on:click={() => selectedAlgo = algo.id}
        class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {
          selectedAlgo === algo.id
            ? 'bg-[#6c8cff] text-white'
            : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
        }"
      >
        <span class="mr-1">{algo.emoji}</span>{algo.label}
        <span class="ml-1.5 text-xs opacity-60">{algo.cat}</span>
      </button>
    {/each}

    {#if selectedAlgo === 'linear' || selectedAlgo === 'binary'}
      <div class="flex items-center gap-2 ml-auto">
        <label class="text-xs text-slate-500">Target:</label>
        <select
          bind:value={targetValue}
          class="rounded-lg border border-white/10 bg-[var(--bg-base)] px-2 py-1.5 text-sm text-white outline-none"
        >
          {#each DEFAULT_SEARCH as v}
            <option value={v}>{v}</option>
          {/each}
          <option value={6}>6 (not in array)</option>
          <option value={10}>10 (not in array)</option>
        </select>
      </div>
    {/if}
  </div>

  <!-- Progress bar -->
  <div class="h-1 bg-white/5">
    <div class="h-full bg-[#6c8cff] transition-all duration-200" style="width: {progress}%"></div>
  </div>

  <!-- ── ARRAY VISUALISATION (sort / search algos) ──────────────────────── -->
  {#if !isGraphAlgo}
    <div class="px-4 sm:px-6 pt-6 pb-4">
      <div class="flex items-end justify-center gap-2 h-52" aria-label="Array visualisation">
        {#if step}
          {#each step.arr as val, i}
            {@const heightPct = (val / maxVal) * 100}
            {@const label = posLabel(i, step)}

            <!-- Insertion sort: vertical divider between sorted and unsorted regions -->
            {#if selectedAlgo === 'insertion' && step.sorted.length > 0 && step.sorted.length < step.arr.length && i === step.sorted.length}
              <div class="self-stretch w-px shrink-0 mx-0.5 relative" style="background:rgba(52,211,153,0.55)">
                <div class="absolute top-0 left-1/2 flex flex-col items-center" style="transform:translateX(-50%);gap:0;pointer-events:none">
                  <span class="text-[8px] font-black text-[#34d399] whitespace-nowrap leading-tight">sorted</span>
                  <span class="text-[8px] text-slate-600 whitespace-nowrap leading-tight">↕</span>
                  <span class="text-[8px] font-bold text-slate-500 whitespace-nowrap leading-tight">unsorted</span>
                </div>
              </div>
            {/if}

            <div class="flex flex-col items-center gap-1 flex-1 min-w-0">
              <div class="h-4 text-center">
                {#if label}
                  <span class="text-xs font-bold text-sky-400 leading-none">{label}</span>
                {/if}
              </div>
              <span class="text-xs font-mono font-bold {labelColor(i, step)} leading-none">{val}</span>
              <div
                class="w-full rounded-t"
                style="{barStyle(i, val, step)};height:{Math.max(heightPct * 1.7, 8)}px;transition:height 0.3s ease"
              ></div>
              <span class="text-xs text-slate-600 font-mono leading-none">{i}</span>
            </div>
          {/each}
        {/if}
      </div>

      <!-- Array legend -->
      <div class="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-xs justify-center text-slate-400">
        <span class="flex items-center gap-1.5">
          <span class="h-3 w-8 rounded-sm" style="background:linear-gradient(to right,hsl(10,70%,52%),hsl(90,70%,52%),hsl(180,70%,52%),hsl(270,70%,52%)"></span>
          Value colour
        </span>
        {#if selectedAlgo === 'bubble' || selectedAlgo === 'insertion'}
          <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded-sm bg-amber-500"></span> Comparing</span>
          <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded-sm bg-rose-500"></span> Swapping</span>
          <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded-sm" style="background:#10b981"></span> Sorted ✓</span>
        {:else}
          <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded-sm bg-amber-500"></span> Checking</span>
          <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded-sm bg-emerald-500"></span> Found ✓</span>
          <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded-sm bg-slate-600 opacity-55"></span> Eliminated</span>
        {/if}
      </div>
    </div>

  <!-- ── GRAPH VISUALISATION (Dijkstra / A*) ───────────────────────────── -->
  {:else}
    <div class="px-4 sm:px-6 pt-4 pb-2">

      <!-- SVG graph canvas -->
      <div class="rounded-2xl border border-white/8 overflow-hidden" style="background:#0f1e30">
        <svg viewBox="0 0 524 315" class="w-full" style="height:auto;max-height:310px" aria-label="Graph visualisation">

          <!-- ── Pass 1: non-path edges (drawn first, behind everything) ── -->
          {#each EDGES as edge}
            {@const n1 = NODES[edge.a]}
            {@const n2 = NODES[edge.b]}
            {@const onPath = isOnPath(graphStep?.path, edge.a, edge.b)}
            {@const active = (graphStep?.current === edge.a && graphStep?.examining === edge.b)
                           || (graphStep?.current === edge.b && graphStep?.examining === edge.a)}
            {#if !onPath}
              <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                stroke={active ? '#f59e0b' : 'rgba(148,163,184,0.28)'}
                stroke-width={active ? 2.5 : 1.5}
                stroke-linecap="round"
              />
            {/if}
          {/each}

          <!-- ── Pass 2: path edges — glow layer then sharp line ── -->
          {#each EDGES as edge}
            {@const n1 = NODES[edge.a]}
            {@const n2 = NODES[edge.b]}
            {@const onPath = isOnPath(graphStep?.path, edge.a, edge.b)}
            {#if onPath}
              <!-- soft glow halo -->
              <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                stroke="rgba(16,185,129,0.22)" stroke-width="12" stroke-linecap="round" />
              <!-- mid glow -->
              <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                stroke="rgba(16,185,129,0.45)" stroke-width="6" stroke-linecap="round" />
              <!-- crisp green line on top -->
              <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                stroke="#10b981" stroke-width="3" stroke-linecap="round" />
            {/if}
          {/each}

          <!-- ── Pass 3: weight badges (on top of edges, under nodes) ── -->
          {#each EDGES as edge}
            {@const n1 = NODES[edge.a]}
            {@const n2 = NODES[edge.b]}
            {@const onPath = isOnPath(graphStep?.path, edge.a, edge.b)}
            {@const active = (graphStep?.current === edge.a && graphStep?.examining === edge.b)
                           || (graphStep?.current === edge.b && graphStep?.examining === edge.a)}
            {@const mx = (n1.x + n2.x) / 2}
            {@const my = (n1.y + n2.y) / 2}
            <rect x={mx - 9} y={my - 8} width="18" height="14" rx="3"
              fill={onPath ? '#0a2218' : active ? '#1a1400' : '#0c1826'}
              stroke={onPath ? 'rgba(16,185,129,0.5)' : active ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.06)'}
              stroke-width="1"
            />
            <text x={mx} y={my + 1.5} text-anchor="middle" dominant-baseline="middle"
              font-size="9" font-family="monospace" font-weight="bold"
              fill={onPath ? '#34d399' : active ? '#fcd34d' : '#64748b'}>{edge.w}</text>
          {/each}

          <!-- ── Pass 4: nodes (always on top) ── -->
          {#each Object.entries(NODES) as [id, pos]}
            {@const gs = graphStep}
            {@const isStart = id === 'S'}
            {@const isGoal = id === 'G'}
            {@const isCurrent = gs?.current === id}
            {@const onNodePath = gs?.path.includes(id) ?? false}
            {@const gScore = gs?.g[id]}
            {@const fScore = gs?.f?.[id]}
            {@const hasScore = gScore !== undefined && gScore !== Infinity && gScore !== null}
            {@const showF = selectedAlgo === 'astar' && fScore !== undefined && fScore !== Infinity}

            <!-- Path node pulse ring -->
            {#if onNodePath}
              <circle cx={pos.x} cy={pos.y} r="27"
                fill="none" stroke="rgba(16,185,129,0.2)" stroke-width="4" />
            {/if}

            <!-- Current node pulse ring -->
            {#if isCurrent}
              <circle cx={pos.x} cy={pos.y} r="27"
                fill="none" stroke="rgba(129,140,248,0.3)" stroke-width="4" />
            {/if}

            <!-- Node circle -->
            <circle cx={pos.x} cy={pos.y} r="22"
              fill={nodeFill(id, gs)}
              stroke={nodeStroke(id, gs)}
              stroke-width={nodeStrokeW(id, gs)}
            />

            <!-- Node ID -->
            <text x={pos.x} y={pos.y + (hasScore ? -4 : 1)}
              text-anchor="middle" dominant-baseline="middle"
              font-size="13" font-weight="bold" font-family="system-ui, sans-serif"
              fill={nodeTextFill(id, gs)}>{id}</text>

            <!-- Score inside node -->
            {#if hasScore}
              <text x={pos.x} y={pos.y + 10}
                text-anchor="middle" dominant-baseline="middle"
                font-size="8" font-family="monospace"
                fill={onNodePath ? '#34d399' : '#6b7280'}>
                {showF ? `f=${fScore}` : `d=${gScore}`}
              </text>
            {/if}

            <!-- START / GOAL chip -->
            {#if isStart || isGoal}
              <rect x={pos.x - 18} y={pos.y - 41} width="36" height="13" rx="4"
                fill={isStart ? 'rgba(99,102,241,0.25)' : 'rgba(16,185,129,0.25)'}
                stroke={isStart ? 'rgba(129,140,248,0.5)' : 'rgba(16,185,129,0.5)'}
                stroke-width="1"
              />
              <text x={pos.x} y={pos.y - 35} text-anchor="middle" dominant-baseline="middle"
                font-size="7.5" font-family="system-ui" font-weight="bold"
                fill={isStart ? '#a5b4fc' : '#34d399'}>{isStart ? 'START' : 'GOAL'}</text>
            {/if}

            <!-- A* h-value chip (top-right) -->
            {#if selectedAlgo === 'astar'}
              {@const hv = gs?.h?.[id] ?? heuristic(id)}
              <rect x={pos.x + 13} y={pos.y - 32} width="22" height="12" rx="3"
                fill="rgba(251,146,60,0.18)" stroke="rgba(251,146,60,0.45)" stroke-width="1" />
              <text x={pos.x + 24} y={pos.y - 26} text-anchor="middle" dominant-baseline="middle"
                font-size="7.5" font-family="monospace" font-weight="bold" fill="#fb923c">h={hv}</text>
            {/if}
          {/each}
        </svg>
      </div>

      <!-- Graph legend -->
      <div class="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs justify-center text-slate-400">
        <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded-full" style="background:#818cf8;border:1.5px solid #818cf8"></span> Current</span>
        <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded-full" style="background:#422006;border:1.5px solid #f59e0b"></span> In queue</span>
        <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded-full" style="background:#431407;border:1.5px solid #fb923c"></span> Examining</span>
        <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded-full" style="background:#1e3a8a;border:1.5px solid #3b82f6"></span> Visited</span>
        <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded-full" style="background:#064e3b;border:1.5px solid #10b981"></span> Shortest path</span>
        {#if selectedAlgo === 'astar'}
          <span class="flex items-center gap-1.5"><span style="color:#fb923c">h=</span> heuristic (estimate to G)</span>
        {/if}
      </div>

      {#if selectedAlgo === 'astar'}
        <p class="mt-2 text-xs text-slate-600 text-center">
          Numbers inside nodes: <span class="text-[#6c8cff]">f = g + h</span> (total estimated cost).
          Orange <span class="text-[#fb923c]">h=</span> chips show the straight-line heuristic.
          A* always expands the node with the lowest f first.
        </p>
      {:else}
        <p class="mt-2 text-xs text-slate-600 text-center">
          Numbers inside nodes: <span class="text-[#6c8cff]">d</span> = shortest distance found from S so far.
          Dijkstra always expands the unvisited node with the lowest known distance first.
        </p>
      {/if}
    </div>
  {/if}

  <!-- Status message -->
  <div class="mx-4 sm:mx-6 mb-4 rounded-xl border border-white/8 bg-[var(--bg-card)] px-4 py-3 min-h-[3rem] flex items-center">
    <p class="text-sm text-slate-300 leading-relaxed">
      {#if anyStep}
        <span class="text-xs text-slate-600 font-mono mr-2">Step {stepIdx + 1}/{totalSteps}</span>
        {anyStep.msg}
      {:else}
        Loading…
      {/if}
    </p>
  </div>

  <!-- Controls -->
  <div class="px-4 sm:px-6 pb-4 flex flex-wrap items-center gap-3">
    <div class="flex items-center gap-1">
      <button
        on:click={reset}
        class="h-9 w-9 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center"
        title="Reset"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v5h5"/>
        </svg>
      </button>

      <button
        on:click={prev}
        disabled={stepIdx === 0}
        class="h-9 w-9 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center disabled:opacity-30"
        title="Previous step"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <button
        on:click={togglePlay}
        class="h-9 w-16 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 {
          playing ? 'bg-[#f87171]/20 border border-[#f87171]/30 text-[#f87171]' : 'bg-[#6c8cff] text-white hover:bg-[#4a6cf7]'
        }"
      >
        {#if playing}
          <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
          Pause
        {:else}
          <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21"/></svg>
          Play
        {/if}
      </button>

      <button
        on:click={next}
        disabled={stepIdx === totalSteps - 1}
        class="h-9 w-9 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center disabled:opacity-30"
        title="Next step"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

    <div class="flex items-center gap-1.5 ml-auto">
      <span class="text-xs text-slate-500">Speed:</span>
      {#each speedLabels as { label, ms }}
        <button
          on:click={() => { speedMs = ms; if (playing) { stopPlaying(); startPlaying(); } }}
          class="rounded px-2 py-1 text-xs transition-colors {
            speedMs === ms ? 'bg-[#6c8cff]/20 text-[#6c8cff]' : 'text-slate-500 hover:text-white'
          }"
        >{label}</button>
      {/each}
    </div>
  </div>

  <!-- Trace table -->
  <div class="border-t border-white/8 mx-4 sm:mx-6 mb-6">
    <div class="pt-4">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
        Trace table <span class="font-normal text-slate-600 normal-case">(last {traceHistory.length} steps)</span>
      </h3>
      <div class="overflow-x-auto rounded-xl border border-white/8 bg-[var(--bg-card)]">
        <table class="w-full text-xs font-mono">
          <thead>
            <tr class="border-b border-white/8">
              {#each traceHeaders[selectedAlgo] as h}
                <th class="px-3 py-2 text-left text-slate-500 font-semibold whitespace-nowrap">{h}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#if traceHistory.length === 0}
              <tr>
                <td colspan={traceHeaders[selectedAlgo].length} class="px-3 py-4 text-center text-slate-600">
                  Press Play or Step → to see trace
                </td>
              </tr>
            {:else}
              {#each traceHistory as row, ri}
                <tr class="border-b border-white/4 {ri === traceHistory.length - 1 ? 'bg-[#6c8cff]/8' : ''}">
                  {#each row as cell}
                    <td class="px-3 py-2 {
                      String(cell).includes('FOUND') ? 'text-[#34d399] font-bold' :
                      String(cell).includes('NOT FOUND') ? 'text-red-400 font-bold' :
                      String(cell).includes('done') ? 'text-[#34d399]' :
                      String(cell).includes('update') ? 'text-[#34d399]' :
                      String(cell).includes('swap') ? 'text-[#f87171]' :
                      String(cell).includes('shift') ? 'text-[#fbbf24]' :
                      String(cell).includes('insert') ? 'text-[#34d399]' :
                      String(cell).includes('skip') ? 'text-slate-600' :
                      'text-slate-300'
                    } whitespace-nowrap">{cell}</td>
                  {/each}
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Complexity reference — A Level only -->
  <div class="border-t border-white/8 px-4 sm:px-6 py-5">
    <div class="flex items-center gap-3 mb-3">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500">Big O complexity reference</h3>
      <span class="rounded-full border border-[#818cf8]/30 bg-[#818cf8]/10 px-2 py-0.5 text-xs font-semibold text-[#818cf8]">A Level only</span>
    </div>
    <p class="text-xs text-slate-600 mb-3">Big O notation is assessed at A Level (AQA 7517, OCR H446) — not required at GCSE. GCSE students should focus on tracing algorithms by hand and comparing the number of comparisons made.</p>
    <div class="overflow-x-auto">
      <table class="text-xs font-mono w-full">
        <thead>
          <tr class="border-b border-white/8">
            <th class="pb-2 pr-6 text-left text-slate-500">Algorithm</th>
            <th class="pb-2 pr-4 text-left text-slate-500">Level</th>
            <th class="pb-2 pr-6 text-left text-slate-500">Best case</th>
            <th class="pb-2 pr-6 text-left text-slate-500">Worst case</th>
            <th class="pb-2 text-left text-slate-500">Space</th>
          </tr>
        </thead>
        <tbody class="text-slate-300">
          {#each [
            { name: 'Bubble Sort',    level: 'GCSE',    best: 'O(n)',           worst: 'O(n²)',          space: 'O(1)',  id: 'bubble'    },
            { name: 'Insertion Sort', level: 'GCSE',    best: 'O(n)',           worst: 'O(n²)',          space: 'O(1)',  id: 'insertion' },
            { name: 'Linear Search',  level: 'GCSE',    best: 'O(1)',           worst: 'O(n)',           space: 'O(1)',  id: 'linear'    },
            { name: 'Binary Search',  level: 'GCSE',    best: 'O(1)',           worst: 'O(log n)',       space: 'O(1)',  id: 'binary'    },
            { name: "Dijkstra's",     level: 'A Level', best: 'O((V+E)log V)', worst: 'O((V+E)log V)', space: 'O(V)', id: 'dijkstra'  },
            { name: 'A* Search',      level: 'A Level', best: 'O(E)',           worst: 'O(b^d)',         space: 'O(V)', id: 'astar'     },
          ] as row}
            <tr class="border-b border-white/4 {selectedAlgo === row.id ? 'bg-[#6c8cff]/8' : ''}">
              <td class="py-2 pr-6 {selectedAlgo === row.id ? 'text-[#6c8cff] font-semibold' : ''}">{row.name}</td>
              <td class="py-2 pr-4 {row.level === 'GCSE' ? 'text-[#34d399]' : 'text-[#818cf8]'}">{row.level}</td>
              <td class="py-2 pr-6 text-[#34d399]">{row.best}</td>
              <td class="py-2 pr-6 text-[#f87171]">{row.worst}</td>
              <td class="py-2">{row.space}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <p class="mt-3 text-xs text-slate-600">
      <span class="text-[#fbbf24] font-semibold">A Level exam tip:</span>
      Dijkstra guarantees the shortest path in a non-negative weighted graph but explores in all directions.
      A* uses a heuristic h(n) to focus the search toward the goal — it finds the same optimal path
      but typically visits far fewer nodes. A* is only optimal when h(n) is <em>admissible</em>
      (never overestimates the true cost). V = vertices, E = edges, b = branching factor, d = depth.
    </p>
  </div>

</div>
