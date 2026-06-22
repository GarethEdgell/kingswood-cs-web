<script lang="ts">
  // ── Types ────────────────────────────────────────────────────────────
  interface State {
    id: string;
    label: string;
    x: number;
    y: number;
    isStart: boolean;
    isAccept: boolean;
  }

  interface Transition {
    id: string;
    from: string;
    to: string;
    symbol: string;
  }

  // ── State ────────────────────────────────────────────────────────────
  let states: State[]      = [];
  let transitions: Transition[] = [];
  let inputString          = '';
  let currentStateId: string | null = null;
  let stepIndex            = 0;
  let running              = false;
  let result: 'accepted' | 'rejected' | null = null;
  let stepLog: string[]    = [];
  let mode: 'build' | 'test' = 'build';

  // editing state
  let selectedStateId: string | null = null;
  let drawingFrom: string | null = null;
  let editingTransitionId: string | null = null;
  let newSymbol = '';
  let stateCounter = 0;
  let transitionCounter = 0;

  // drag
  let dragging: string | null = null;
  let dragOffX = 0;
  let dragOffY = 0;

  // ── Built-in examples ─────────────────────────────────────────────────
  const examples = [
    {
      label: 'Even number of 1s',
      desc: 'Accepts binary strings with an even number of 1s (including zero). AQA-style.',
      states: [
        { id:'q0', label:'q0', x:120, y:200, isStart:true,  isAccept:true  },
        { id:'q1', label:'q1', x:340, y:200, isStart:false, isAccept:false },
      ],
      transitions: [
        { id:'t0', from:'q0', to:'q0', symbol:'0' },
        { id:'t1', from:'q0', to:'q1', symbol:'1' },
        { id:'t2', from:'q1', to:'q1', symbol:'0' },
        { id:'t3', from:'q1', to:'q0', symbol:'1' },
      ],
    },
    {
      label: 'Ends in "ab"',
      desc: 'Accepts strings over {a,b} that end with "ab".',
      states: [
        { id:'q0', label:'q0', x:100, y:200, isStart:true,  isAccept:false },
        { id:'q1', label:'q1', x:280, y:200, isStart:false, isAccept:false },
        { id:'q2', label:'q2', x:460, y:200, isStart:false, isAccept:true  },
      ],
      transitions: [
        { id:'t0', from:'q0', to:'q0', symbol:'b' },
        { id:'t1', from:'q0', to:'q1', symbol:'a' },
        { id:'t2', from:'q1', to:'q1', symbol:'a' },
        { id:'t3', from:'q1', to:'q2', symbol:'b' },
        { id:'t4', from:'q2', to:'q1', symbol:'a' },
        { id:'t5', from:'q2', to:'q0', symbol:'b' },
      ],
    },
    {
      label: 'Traffic light sequence',
      desc: 'Models a 4-state traffic light: Red → Red+Amber → Green → Amber → Red.',
      states: [
        { id:'red',      label:'Red',       x:100, y:200, isStart:true,  isAccept:false },
        { id:'redamber', label:'R+A',        x:270, y:200, isStart:false, isAccept:false },
        { id:'green',    label:'Green',     x:440, y:200, isStart:false, isAccept:false },
        { id:'amber',    label:'Amber',     x:610, y:200, isStart:false, isAccept:false },
      ],
      transitions: [
        { id:'t0', from:'red',      to:'redamber', symbol:'tick' },
        { id:'t1', from:'redamber', to:'green',    symbol:'tick' },
        { id:'t2', from:'green',    to:'amber',    symbol:'tick' },
        { id:'t3', from:'amber',    to:'red',      symbol:'tick' },
      ],
    },
  ];

  function loadExample(ex: typeof examples[0]) {
    states      = ex.states.map(s => ({ ...s }));
    transitions = ex.transitions.map(t => ({ ...t }));
    stateCounter      = states.length;
    transitionCounter = transitions.length;
    resetTest();
  }

  // ── Build mode helpers ────────────────────────────────────────────────
  function addState(x: number, y: number) {
    const id    = `q${stateCounter++}`;
    const isStart = states.length === 0;
    states = [...states, { id, label: id, x, y, isStart, isAccept: false }];
  }

  function deleteState(id: string) {
    states      = states.filter(s => s.id !== id);
    transitions = transitions.filter(t => t.from !== id && t.to !== id);
    if (selectedStateId === id) selectedStateId = null;
  }

  function toggleAccept(id: string) {
    states = states.map(s => s.id === id ? { ...s, isAccept: !s.isAccept } : s);
  }

  function toggleStart(id: string) {
    states = states.map(s => ({ ...s, isStart: s.id === id }));
  }

  function addTransition(from: string, to: string) {
    editingTransitionId = `t${transitionCounter++}`;
    newSymbol = '';
    // temp transition so user can set symbol
    transitions = [...transitions, { id: editingTransitionId, from, to, symbol: '' }];
  }

  function confirmTransitionSymbol() {
    if (!newSymbol.trim()) {
      transitions = transitions.filter(t => t.id !== editingTransitionId);
    } else {
      transitions = transitions.map(t =>
        t.id === editingTransitionId ? { ...t, symbol: newSymbol.trim() } : t
      );
    }
    editingTransitionId = null;
    newSymbol = '';
    drawingFrom = null;
  }

  function deleteTransition(id: string) {
    transitions = transitions.filter(t => t.id !== id);
  }

  // ── Drag ─────────────────────────────────────────────────────────────
  function onMouseDown(e: MouseEvent, stateId: string) {
    if (mode !== 'build') return;
    if (e.shiftKey) {
      // shift+drag = draw transition
      drawingFrom = stateId;
      return;
    }
    dragging  = stateId;
    const svg = (e.currentTarget as SVGElement).ownerSVGElement!;
    const pt  = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    const st = states.find(s => s.id === stateId)!;
    dragOffX = svgPt.x - st.x;
    dragOffY = svgPt.y - st.y;
  }

  function onMouseMove(e: MouseEvent) {
    if (!dragging) return;
    const svg = (e.currentTarget as SVGElement);
    const pt  = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    states = states.map(s =>
      s.id === dragging
        ? { ...s, x: Math.max(36, Math.min(svgPt.x - dragOffX, 730)), y: Math.max(36, Math.min(svgPt.y - dragOffY, 350)) }
        : s
    );
  }

  function onMouseUp(e: MouseEvent, targetId: string | undefined = undefined) {
    if (drawingFrom && targetId && targetId !== drawingFrom) {
      addTransition(drawingFrom, targetId);
    }
    dragging     = null;
    if (!editingTransitionId) drawingFrom = null;
  }

  function svgClick(e: MouseEvent) {
    if (mode !== 'build') return;
    if (drawingFrom) { drawingFrom = null; return; }
    if (dragging) return;
    const svg = e.currentTarget as SVGElement;
    const pt  = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const svgPt = pt.matrixTransform(svg.getScreenCTM()!.inverse());
    // Only add state if clicked on empty canvas (not on a state/transition)
    const target = e.target as SVGElement;
    if (target.tagName === 'svg' || target.tagName === 'rect') {
      addState(svgPt.x, svgPt.y);
    }
  }

  // ── Test mode ─────────────────────────────────────────────────────────
  function resetTest() {
    const start = states.find(s => s.isStart);
    currentStateId = start?.id ?? null;
    stepIndex = 0;
    result    = null;
    stepLog   = start ? [`Start: entered state ${start.label}`] : [];
    running   = false;
  }

  function step() {
    if (result !== null || currentStateId === null) return;
    const symbols = inputString.split(',').map(s => s.trim()).filter(Boolean);
    // Allow comma-separated or char-by-char
    const inputArr = inputString.includes(',')
      ? inputString.split(',').map(s => s.trim()).filter(Boolean)
      : inputString.split('').filter(s => s !== ' ');

    if (stepIndex >= inputArr.length) {
      // Out of input — check if current state is accept
      const cur = states.find(s => s.id === currentStateId);
      result = cur?.isAccept ? 'accepted' : 'rejected';
      stepLog = [...stepLog, result === 'accepted'
        ? `✓ Input exhausted in accept state ${cur?.label} — ACCEPTED`
        : `✗ Input exhausted in non-accept state ${cur?.label} — REJECTED`];
      return;
    }

    const sym = inputArr[stepIndex];
    const match = transitions.find(t => t.from === currentStateId && t.symbol === sym);

    if (!match) {
      result = 'rejected';
      stepLog = [...stepLog, `✗ No transition from ${states.find(s=>s.id===currentStateId)?.label} on '${sym}' — REJECTED`];
      return;
    }

    const next = states.find(s => s.id === match.to)!;
    stepLog = [...stepLog, `Read '${sym}': ${states.find(s=>s.id===currentStateId)?.label} → ${next.label}`];
    currentStateId = match.to;
    stepIndex++;

    // Auto-finish if at end
    if (stepIndex >= inputArr.length) {
      result = next.isAccept ? 'accepted' : 'rejected';
      stepLog = [...stepLog, result === 'accepted'
        ? `✓ Accept state ${next.label} — ACCEPTED`
        : `✗ Non-accept state ${next.label} — REJECTED`];
    }
  }

  function runAll() {
    resetTest();
    const inputArr = inputString.includes(',')
      ? inputString.split(',').map(s => s.trim()).filter(Boolean)
      : inputString.split('').filter(s => s !== ' ');
    for (let i = 0; i < inputArr.length + 1; i++) {
      if (result !== null) break;
      step();
    }
  }

  // ── Transition arc helpers ────────────────────────────────────────────
  function getArcPath(t: Transition): string {
    const from = states.find(s => s.id === t.from);
    const to   = states.find(s => s.id === t.to);
    if (!from || !to) return '';

    if (from.id === to.id) {
      // Self-loop
      return `M ${from.x} ${from.y - 28} C ${from.x - 50} ${from.y - 90} ${from.x + 50} ${from.y - 90} ${from.x} ${from.y - 28}`;
    }

    const dx = to.x - from.x, dy = to.y - from.y;
    const len = Math.sqrt(dx*dx + dy*dy);
    const ux = dx/len, uy = dy/len;
    const R = 28; // state circle radius
    // Check for reverse transition (bend the arc)
    const hasReverse = transitions.some(r => r.from === t.to && r.to === t.from && r.id !== t.id);
    if (hasReverse) {
      const perp = 40;
      const mx = (from.x + to.x)/2 + (-uy * perp);
      const my = (from.y + to.y)/2 + (ux * perp);
      return `M ${from.x + ux*R} ${from.y + uy*R} Q ${mx} ${my} ${to.x - ux*R} ${to.y - uy*R}`;
    }
    return `M ${from.x + ux*R} ${from.y + uy*R} L ${to.x - ux*R} ${to.y - uy*R}`;
  }

  function arcLabelPos(t: Transition) {
    const from = states.find(s => s.id === t.from);
    const to   = states.find(s => s.id === t.to);
    if (!from || !to) return { x: 0, y: 0 };
    if (from.id === to.id) return { x: from.x, y: from.y - 78 };
    const hasReverse = transitions.some(r => r.from === t.to && r.to === t.from && r.id !== t.id);
    if (hasReverse) {
      const dx = to.x - from.x, dy = to.y - from.y;
      const len = Math.sqrt(dx*dx + dy*dy);
      return { x: (from.x+to.x)/2 + (-(dy/len)*52), y: (from.y+to.y)/2 + ((dx/len)*52) };
    }
    return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 - 10 };
  }

  function clearAll() {
    states = []; transitions = []; stateCounter = 0; transitionCounter = 0;
    resetTest(); selectedStateId = null;
  }

  $: startState = states.find(s => s.isStart);
  $: if (mode === 'test') resetTest();
</script>

<!-- ── Mode tabs ──────────────────────────────────────────────── -->
<div class="mb-5 flex gap-3 flex-wrap items-center justify-between">
  <div class="flex gap-2">
    <button on:click={() => mode = 'build'}
      class="rounded-lg px-4 py-2 text-sm font-semibold transition-colors {mode==='build' ? 'bg-[#6c8cff] text-white' : 'border border-white/10 bg-white/5 text-slate-300 hover:text-white'}">
      ✏️ Build
    </button>
    <button on:click={() => mode = 'test'}
      disabled={states.length === 0}
      class="rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40 {mode==='test' ? 'bg-[#34d399] text-[#0f172a]' : 'border border-white/10 bg-white/5 text-slate-300 hover:text-white'}">
      ▶ Test
    </button>
  </div>

  <div class="flex gap-2 flex-wrap">
    <span class="text-xs text-slate-500 self-center">Examples:</span>
    {#each examples as ex}
      <button on:click={() => loadExample(ex)}
        class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors"
        title={ex.desc}>
        {ex.label}
      </button>
    {/each}
    <button on:click={clearAll}
      class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-500 hover:text-white transition-colors">
      Clear
    </button>
  </div>
</div>

<!-- ── Canvas ─────────────────────────────────────────────────── -->
<div class="rounded-xl border border-white/10 bg-[var(--code-bg)] overflow-hidden mb-5">
  {#if mode === 'build'}
    <div class="px-4 py-2 border-b border-white/8 text-xs text-slate-500 flex gap-4">
      <span>Click canvas to add state</span>
      <span>Shift+drag between states to add transition</span>
      <span>Click state to select · double-click to toggle accept</span>
    </div>
  {/if}

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <svg
    width="100%" viewBox="0 0 760 380"
    class="cursor-crosshair"
    role="img"
    aria-label="Finite state machine diagram"
    on:click={svgClick}
    on:mousemove={onMouseMove}
    on:mouseup={e => onMouseUp(e)}
  >
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="var(--accent)" opacity="0.8"/>
      </marker>
      <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#34d399"/>
      </marker>
      <marker id="arrow-dead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L0,6 L8,3 z" fill="#ef4444" opacity="0.7"/>
      </marker>
    </defs>

    <!-- Background -->
    <rect width="760" height="380" fill="transparent"/>

    <!-- Transitions -->
    {#each transitions as t}
      {@const isActive = mode==='test' && currentStateId && t.from === (stepIndex > 0 ? null : null)}
      {@const lp = arcLabelPos(t)}
      {@const ap = getArcPath(t)}
      {#if ap}
        <path d={ap}
          fill="none"
          stroke="var(--accent)"
          stroke-width="2"
          stroke-opacity="0.7"
          marker-end="url(#arrow)"
          class="cursor-pointer"
          on:click|stopPropagation={() => { if(mode==='build') deleteTransition(t.id); }}
        />
        <!-- Symbol label -->
        <circle cx={lp.x} cy={lp.y} r="11" fill="var(--code-bg)" stroke="var(--accent)" stroke-width="1.5" stroke-opacity="0.6"/>
        <text x={lp.x} y={lp.y + 4.5} text-anchor="middle" font-size="12" font-family="'Fira Code',monospace"
              fill="var(--accent)" font-weight="600">{t.symbol}</text>
      {/if}
    {/each}

    <!-- States -->
    {#each states as s}
      {@const isActive = mode === 'test' && s.id === currentStateId}
      {@const isDead   = mode === 'test' && result === 'rejected' && s.id === currentStateId}
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <g
        transform="translate({s.x},{s.y})"
        class="cursor-grab"
        on:mousedown={e => { e.stopPropagation(); onMouseDown(e, s.id); }}
        on:mouseup|stopPropagation={e => onMouseUp(e, s.id)}
        on:click|stopPropagation={() => { if(mode==='build') selectedStateId = selectedStateId === s.id ? null : s.id; }}
        on:dblclick|stopPropagation={() => { if(mode==='build') toggleAccept(s.id); }}
        role="img"
        aria-label={`State ${s.label}`}
      >
        <!-- Start arrow -->
        {#if s.isStart}
          <line x1="-60" y1="0" x2="-30" y2="0" stroke="var(--accent)" stroke-width="2"/>
          <polygon points="-30,0 -38,-5 -38,5" fill="var(--accent)"/>
        {/if}

        <!-- State circle -->
        <circle r="28"
          fill={isActive ? (isDead ? '#1a0505' : '#0a1f0a') : 'var(--bg-card)'}
          stroke={isDead ? '#ef4444' : isActive ? '#34d399' : (selectedStateId === s.id ? 'var(--accent)' : 'rgba(255,255,255,0.35)')}
          stroke-width={isActive || selectedStateId === s.id ? "3" : "2"}
        />

        <!-- Accept state double ring -->
        {#if s.isAccept}
          <circle r="22" fill="none"
            stroke={isDead ? '#ef4444' : isActive ? '#34d399' : 'rgba(255,255,255,0.35)'}
            stroke-width="1.5"/>
        {/if}

        <!-- State label -->
        <text y="5" text-anchor="middle" font-size="13" font-family="Arial,sans-serif" font-weight="600"
              fill={isActive ? (isDead ? '#ef4444' : '#34d399') : 'var(--text-1)'}>
          {s.label}
        </text>
      </g>
    {/each}

    <!-- Transition being edited -->
    {#if editingTransitionId}
      <text x="380" y="360" text-anchor="middle" font-size="12" fill="var(--accent)">
        Enter transition symbol below ↓
      </text>
    {/if}

    <!-- Empty state hint -->
    {#if states.length === 0}
      <text x="380" y="190" text-anchor="middle" font-size="14" fill="rgba(255,255,255,0.2)">
        Click here to add states — or load an example above
      </text>
    {/if}
  </svg>
</div>

<!-- ── Transition symbol input ────────────────────────────────── -->
{#if editingTransitionId}
  <div class="mb-4 flex gap-3 items-center rounded-xl border border-[#6c8cff]/30 bg-[#6c8cff]/10 px-4 py-3">
    <span class="text-sm text-slate-300">Transition symbol:</span>
    <input
      type="text"
      bind:value={newSymbol}
      placeholder="e.g. 0, 1, a, b, tick"
      class="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white outline-none focus:border-[#6c8cff]/60"
      on:keydown={e => { if (e.key === 'Enter') confirmTransitionSymbol(); if (e.key === 'Escape') { transitions = transitions.filter(t => t.id !== editingTransitionId); editingTransitionId = null; drawingFrom = null; } }}
    />
    <button on:click={confirmTransitionSymbol}
      class="rounded-lg bg-[#6c8cff] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#4a6cf7]">
      Add
    </button>
  </div>
{/if}

<!-- ── Build mode: selected state controls ───────────────────── -->
{#if mode === 'build' && selectedStateId}
  {@const sel = states.find(s => s.id === selectedStateId)}
  {#if sel}
    <div class="mb-4 flex flex-wrap gap-2 items-center rounded-xl border border-white/8 bg-[var(--bg-card)] px-4 py-3">
      <span class="text-sm font-semibold text-white">State {sel.label}:</span>
      <button on:click={() => toggleAccept(selectedStateId!)}
        class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors {sel.isAccept ? 'bg-[#34d399]/20 text-[#34d399]' : 'border border-white/10 bg-white/5 text-slate-400'}">
        {sel.isAccept ? '✓ Accept state' : 'Set as accept'}
      </button>
      <button on:click={() => toggleStart(selectedStateId!)}
        class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors {sel.isStart ? 'bg-[#6c8cff]/20 text-[#6c8cff]' : 'border border-white/10 bg-white/5 text-slate-400'}">
        {sel.isStart ? '→ Start state' : 'Set as start'}
      </button>
      <button on:click={() => { deleteState(selectedStateId!); selectedStateId = null; }}
        class="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-colors">
        Delete state
      </button>
      <span class="text-xs text-slate-600 ml-2">Shift+drag to another state to add transition · Double-click to toggle accept</span>
    </div>
  {/if}
{/if}

<!-- ── Test mode controls ─────────────────────────────────────── -->
{#if mode === 'test'}
  <div class="space-y-4">

    <div class="flex gap-3 items-start flex-wrap">
      <div class="flex-1 min-w-48">
        <label class="block text-xs text-slate-500 mb-1">Input string (characters or comma-separated symbols)</label>
        <input
          type="text"
          bind:value={inputString}
          on:input={resetTest}
          placeholder="e.g. 011001  or  tick,tick,tick"
          class="w-full rounded-xl border border-white/10 bg-[var(--bg-card)] px-4 py-2.5 text-sm font-mono text-white outline-none focus:border-[#6c8cff]/60"
        />
      </div>
      <div class="flex gap-2 mt-5">
        <button on:click={step} disabled={result !== null || !inputString}
          class="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors disabled:opacity-40">
          Step →
        </button>
        <button on:click={runAll} disabled={!inputString}
          class="rounded-xl bg-[#34d399] px-4 py-2.5 text-sm font-semibold text-[#0f172a] hover:bg-[#10b981] transition-colors disabled:opacity-40">
          Run all
        </button>
        <button on:click={resetTest}
          class="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors">
          Reset
        </button>
      </div>
    </div>

    <!-- Step log -->
    {#if stepLog.length > 0}
      <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4">
        <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Execution trace</div>
        <div class="space-y-1 font-mono text-sm">
          {#each stepLog as log, i}
            <div class="{i === stepLog.length-1 && result ? (result==='accepted' ? 'text-[#34d399] font-semibold' : 'text-red-400 font-semibold') : 'text-slate-300'}">
              {log}
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Result banner -->
    {#if result}
      <div class="rounded-xl border {result==='accepted' ? 'border-[#34d399]/30 bg-[#34d399]/10' : 'border-red-500/30 bg-red-500/10'} p-4 text-center">
        <div class="text-2xl font-extrabold {result==='accepted' ? 'text-[#34d399]' : 'text-red-400'}">
          {result === 'accepted' ? '✓ ACCEPTED' : '✗ REJECTED'}
        </div>
        <div class="mt-1 text-sm text-slate-400">
          Input "{inputString}" was {result} by this FSM
        </div>
      </div>
    {/if}
  </div>
{/if}

<!-- ── Transition list ─────────────────────────────────────────── -->
{#if mode === 'build' && transitions.length > 0}
  <div class="mt-5">
    <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Transitions (click to delete)</div>
    <div class="flex flex-wrap gap-2">
      {#each transitions as t}
        <button on:click={() => deleteTransition(t.id)}
          class="rounded-lg border border-white/8 bg-[var(--bg-card)] px-3 py-1.5 text-xs font-mono text-slate-300 hover:border-red-500/40 hover:text-red-400 transition-colors">
          {states.find(s=>s.id===t.from)?.label} –{t.symbol || '?'}→ {states.find(s=>s.id===t.to)?.label}
        </button>
      {/each}
    </div>
  </div>
{/if}
