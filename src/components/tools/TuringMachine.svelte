<script lang="ts">
  // AQA A Level Section 3.2 — Turing Machine Simulator
  // Transition function: (currentState, readSymbol) → (newState, writeSymbol, direction)

  type Direction = 'L' | 'R' | 'S';

  interface Transition {
    id: string;
    state: string;
    read: string;
    newState: string;
    write: string;
    direction: Direction;
  }

  // ── Machine state ─────────────────────────────────────────
  let tape: string[]   = [];
  let head             = 0;       // tape position
  let currentState     = '';
  let halted           = false;
  let accepted: boolean | null = null;
  let stepCount        = 0;
  let stepLog: string[] = [];

  // ── Definition ────────────────────────────────────────────
  let transitions: Transition[] = [];
  let startState   = 'q0';
  let acceptStates = 'qaccept';
  let rejectState  = 'qreject';
  let blankSymbol  = 'B';

  // tape editor
  let tapeInput = '1011';

  // new transition form
  let newState = '', newRead = '', newNewState = '', newWrite = '', newDir: Direction = 'R';

  // ── Examples ─────────────────────────────────────────────
  const examples = [
    {
      label: 'Recognise 0ⁿ1ⁿ (equal 0s and 1s)',
      desc: 'Accepts strings like 01, 0011, 000111. AQA classic.',
      startState: 'q0',
      acceptStates: 'qaccept',
      rejectState:  'qreject',
      blank: 'B',
      tape: '0011',
      transitions: [
        { id:'t0',  state:'q0', read:'0', newState:'q1', write:'X', direction:'R' as Direction },
        { id:'t1',  state:'q0', read:'Y', newState:'q3', write:'Y', direction:'R' as Direction },
        { id:'t2',  state:'q0', read:'B', newState:'qaccept', write:'B', direction:'R' as Direction },
        { id:'t3',  state:'q1', read:'0', newState:'q1', write:'0', direction:'R' as Direction },
        { id:'t4',  state:'q1', read:'Y', newState:'q1', write:'Y', direction:'R' as Direction },
        { id:'t5',  state:'q1', read:'1', newState:'q2', write:'Y', direction:'L' as Direction },
        { id:'t6',  state:'q2', read:'Y', newState:'q2', write:'Y', direction:'L' as Direction },
        { id:'t7',  state:'q2', read:'0', newState:'q2', write:'0', direction:'L' as Direction },
        { id:'t8',  state:'q2', read:'X', newState:'q0', write:'X', direction:'R' as Direction },
        { id:'t9',  state:'q3', read:'Y', newState:'q3', write:'Y', direction:'R' as Direction },
        { id:'t10', state:'q3', read:'B', newState:'qaccept', write:'B', direction:'R' as Direction },
      ],
    },
    {
      label: 'Copy: duplicate a string of 0s',
      desc: 'Given n zeros, produces 2n zeros. E.g. 000 → 000000.',
      startState: 'q0',
      acceptStates: 'qaccept',
      rejectState:  'qreject',
      blank: 'B',
      tape: '000',
      transitions: [
        { id:'t0', state:'q0', read:'0', newState:'q1', write:'B', direction:'R' as Direction },
        { id:'t1', state:'q0', read:'B', newState:'qaccept', write:'B', direction:'R' as Direction },
        { id:'t2', state:'q1', read:'0', newState:'q1', write:'0', direction:'R' as Direction },
        { id:'t3', state:'q1', read:'X', newState:'q1', write:'X', direction:'R' as Direction },
        { id:'t4', state:'q1', read:'B', newState:'q2', write:'X', direction:'L' as Direction },
        { id:'t5', state:'q2', read:'0', newState:'q2', write:'0', direction:'L' as Direction },
        { id:'t6', state:'q2', read:'X', newState:'q2', write:'X', direction:'L' as Direction },
        { id:'t7', state:'q2', read:'B', newState:'q0', write:'0', direction:'R' as Direction },
      ],
    },
    {
      label: 'Simple: accept all strings of 1s',
      desc: 'Accepts any string of only 1s (including empty). Good starting example.',
      startState: 'q0',
      acceptStates: 'qaccept',
      rejectState:  'qreject',
      blank: 'B',
      tape: '111',
      transitions: [
        { id:'t0', state:'q0', read:'1', newState:'q0', write:'1', direction:'R' as Direction },
        { id:'t1', state:'q0', read:'B', newState:'qaccept', write:'B', direction:'R' as Direction },
        { id:'t2', state:'q0', read:'0', newState:'qreject', write:'0', direction:'R' as Direction },
      ],
    },
  ];

  function loadExample(ex: typeof examples[0]) {
    startState   = ex.startState;
    acceptStates = ex.acceptStates;
    rejectState  = ex.rejectState;
    blankSymbol  = ex.blank;
    tapeInput    = ex.tape;
    transitions  = ex.transitions.map(t => ({ ...t }));
    resetMachine();
  }

  // ── Machine operations ────────────────────────────────────
  function resetMachine() {
    const rawTape = (tapeInput || '').split('').map(c => c === '_' ? blankSymbol : c);
    tape = [...rawTape, blankSymbol, blankSymbol, blankSymbol, blankSymbol];
    head = 0;
    currentState = startState;
    halted = false;
    accepted = null;
    stepCount = 0;
    stepLog = [`Start: state=${startState}, tape="${tapeInput || '(empty)'}"`];
  }

  function getTapeDisplay(): string[] {
    // Show a window of 20 cells centred around head
    const pad = 6;
    const start = Math.max(0, head - pad);
    const end   = Math.min(tape.length, head + pad + 1);
    while (tape.length < end + 2) tape = [...tape, blankSymbol];
    return tape.slice(start, end);
  }
  $: displayOffset = Math.max(0, head - 6);

  function step(): boolean {
    if (halted) return false;

    // Check if in accept/reject state
    const accepts = acceptStates.split(',').map(s => s.trim()).filter(Boolean);
    const rejects = rejectState.split(',').map(s => s.trim()).filter(Boolean);

    if (accepts.includes(currentState)) {
      halted = true;
      accepted = true;
      stepLog = [...stepLog, `✓ ACCEPTED — entered accept state ${currentState}`];
      return false;
    }
    if (rejects.includes(currentState)) {
      halted = true;
      accepted = false;
      stepLog = [...stepLog, `✗ REJECTED — entered reject state ${currentState}`];
      return false;
    }

    // Ensure tape is long enough
    while (tape.length <= head + 2) tape = [...tape, blankSymbol];

    const readSym = tape[head] ?? blankSymbol;
    const trans = transitions.find(t => t.state === currentState && t.read === readSym);

    if (!trans) {
      halted = true;
      accepted = false;
      stepLog = [...stepLog, `✗ REJECTED — no transition for (${currentState}, '${readSym}')`];
      return false;
    }

    // Apply transition
    const oldState = currentState;
    const newTape = [...tape];
    newTape[head] = trans.write;
    tape = newTape;
    currentState = trans.newState;
    const oldHead = head;
    if (trans.direction === 'R') head++;
    else if (trans.direction === 'L') head = Math.max(0, head - 1);

    stepCount++;
    stepLog = [...stepLog, `Step ${stepCount}: (${oldState}, '${readSym}') → write '${trans.write}', go ${trans.direction}, state=${currentState}`];

    // Check new state immediately
    if (accepts.includes(currentState)) {
      halted = true;
      accepted = true;
      stepLog = [...stepLog, `✓ ACCEPTED`];
      return false;
    }
    if (rejects.includes(currentState)) {
      halted = true;
      accepted = false;
      stepLog = [...stepLog, `✗ REJECTED`];
      return false;
    }

    return true;
  }

  function runAll(maxSteps = 500) {
    resetMachine();
    let i = 0;
    while (step() && i < maxSteps) i++;
    if (i >= maxSteps) {
      halted = true;
      stepLog = [...stepLog, '⚠ Halted after 500 steps — possible infinite loop'];
    }
    tape = [...tape]; // trigger reactivity
  }

  // ── Transition management ─────────────────────────────────
  let tCounter = 0;
  function addTransition() {
    if (!newState || !newNewState) return;
    transitions = [...transitions, {
      id: `t${tCounter++}`,
      state: newState,
      read: newRead || blankSymbol,
      newState: newNewState,
      write: newWrite || blankSymbol,
      direction: newDir,
    }];
    newState = ''; newRead = ''; newNewState = ''; newWrite = ''; newDir = 'R';
  }

  function deleteTransition(id: string) {
    transitions = transitions.filter(t => t.id !== id);
  }
</script>

<!-- ── Example selector ─────────────────────────────── -->
<div class="mb-5 flex flex-wrap gap-2 items-center">
  <span class="text-xs text-slate-500 font-semibold">Examples:</span>
  {#each examples as ex}
    <button on:click={() => loadExample(ex)}
      class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 transition-colors"
      title={ex.desc}>
      {ex.label}
    </button>
  {/each}
</div>

<div class="grid gap-6 lg:grid-cols-5">

  <!-- Left: Definition + controls (2 cols) -->
  <div class="lg:col-span-2 space-y-4">

    <!-- Machine definition -->
    <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4 space-y-3">
      <div class="text-xs font-semibold uppercase tracking-wider text-slate-500">Machine Definition</div>

      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-xs text-slate-500 mb-1">Start state</label>
          <input bind:value={startState} class="w-full rounded-lg border border-white/10 bg-[var(--bg-base)] px-2.5 py-1.5 text-sm font-mono text-white outline-none focus:border-[#6c8cff]/60"/>
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">Blank symbol</label>
          <input bind:value={blankSymbol} class="w-full rounded-lg border border-white/10 bg-[var(--bg-base)] px-2.5 py-1.5 text-sm font-mono text-white outline-none focus:border-[#6c8cff]/60"/>
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">Accept state(s)</label>
          <input bind:value={acceptStates} placeholder="qaccept" class="w-full rounded-lg border border-white/10 bg-[var(--bg-base)] px-2.5 py-1.5 text-sm font-mono text-white outline-none focus:border-[#34d399]/60"/>
        </div>
        <div>
          <label class="block text-xs text-slate-500 mb-1">Reject state</label>
          <input bind:value={rejectState} placeholder="qreject" class="w-full rounded-lg border border-white/10 bg-[var(--bg-base)] px-2.5 py-1.5 text-sm font-mono text-white outline-none focus:border-red-500/60"/>
        </div>
      </div>

      <div>
        <label class="block text-xs text-slate-500 mb-1">Initial tape (use _ for blank)</label>
        <input bind:value={tapeInput} class="w-full rounded-lg border border-white/10 bg-[var(--bg-base)] px-2.5 py-1.5 text-sm font-mono text-white outline-none focus:border-[#6c8cff]/60"/>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-wrap gap-2">
      <button on:click={resetMachine}
        class="rounded-lg bg-[#6c8cff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a6cf7] transition-colors">
        Load tape
      </button>
      <button on:click={step} disabled={halted}
        class="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors disabled:opacity-40">
        Step →
      </button>
      <button on:click={() => runAll()} disabled={halted}
        class="rounded-lg bg-[#34d399] px-4 py-2 text-sm font-semibold text-[#0f172a] hover:bg-[#10b981] transition-colors disabled:opacity-40">
        Run all
      </button>
    </div>

    <!-- Status -->
    {#if halted}
      <div class="rounded-xl border {accepted ? 'border-[#34d399]/30 bg-[#34d399]/10' : 'border-red-500/30 bg-red-500/10'} p-4 text-center">
        <div class="text-xl font-extrabold {accepted ? 'text-[#34d399]' : 'text-red-400'}">
          {accepted ? '✓ ACCEPTED' : '✗ REJECTED'}
        </div>
        <div class="text-xs text-slate-400 mt-1">{stepCount} step{stepCount !== 1 ? 's' : ''}</div>
      </div>
    {:else if currentState}
      <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-3 text-center">
        <div class="text-xs text-slate-500 mb-1">Current state</div>
        <div class="text-lg font-bold font-mono text-[#6c8cff]">{currentState}</div>
        <div class="text-xs text-slate-500 mt-1">Step {stepCount}</div>
      </div>
    {/if}

    <!-- Transition table: add new -->
    <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4">
      <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Add Transition</div>
      <div class="grid grid-cols-5 gap-1 text-xs mb-2">
        <div>
          <div class="text-slate-600 mb-0.5">State</div>
          <input bind:value={newState} placeholder="q0"
            class="w-full rounded border border-white/10 bg-[var(--bg-base)] px-1.5 py-1 font-mono text-white outline-none text-xs"/>
        </div>
        <div>
          <div class="text-slate-600 mb-0.5">Read</div>
          <input bind:value={newRead} placeholder="0"
            class="w-full rounded border border-white/10 bg-[var(--bg-base)] px-1.5 py-1 font-mono text-white outline-none text-xs"/>
        </div>
        <div>
          <div class="text-slate-600 mb-0.5">New state</div>
          <input bind:value={newNewState} placeholder="q1"
            class="w-full rounded border border-white/10 bg-[var(--bg-base)] px-1.5 py-1 font-mono text-white outline-none text-xs"/>
        </div>
        <div>
          <div class="text-slate-600 mb-0.5">Write</div>
          <input bind:value={newWrite} placeholder="1"
            class="w-full rounded border border-white/10 bg-[var(--bg-base)] px-1.5 py-1 font-mono text-white outline-none text-xs"/>
        </div>
        <div>
          <div class="text-slate-600 mb-0.5">Dir</div>
          <select bind:value={newDir} class="w-full rounded border border-white/10 bg-[var(--bg-base)] px-1 py-1 text-white text-xs outline-none">
            <option value="R">R</option>
            <option value="L">L</option>
            <option value="S">S</option>
          </select>
        </div>
      </div>
      <button on:click={addTransition}
        class="w-full rounded-lg border border-white/10 bg-white/5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-colors">
        + Add transition
      </button>
    </div>
  </div>

  <!-- Right: Tape + transitions + log (3 cols) -->
  <div class="lg:col-span-3 space-y-4">

    <!-- Tape visualisation -->
    <div>
      <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Tape</div>
      <div class="rounded-xl border border-white/10 bg-[var(--code-bg)] p-4 overflow-x-auto">
        <div class="flex gap-1 min-w-max">
          {#each getTapeDisplay() as cell, i}
            {@const absPos = displayOffset + i}
            {@const isHead = absPos === head}
            <div class="flex flex-col items-center gap-0.5">
              <div class="text-[9px] text-slate-600 font-mono">{absPos}</div>
              <div
                class="h-10 w-9 rounded border text-center font-mono text-sm font-bold flex items-center justify-center transition-colors"
                style="
                  background: {isHead ? 'var(--accent)' : 'var(--bg-card)'};
                  border-color: {isHead ? 'var(--accent)' : 'rgba(255,255,255,0.1)'};
                  color: {isHead ? 'white' : 'var(--text-2)'};
                "
              >{cell === blankSymbol ? '□' : cell}</div>
              {#if isHead}
                <div class="text-[9px] text-[#6c8cff] font-bold">▲</div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Transition function table -->
    <div>
      <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
        Transition function ({transitions.length} rules)
      </div>
      <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] overflow-hidden max-h-64 overflow-y-auto">
        <table class="w-full text-xs font-mono">
          <thead>
            <tr class="border-b border-white/8">
              {#each ['State', 'Read', '→ New state', 'Write', 'Dir', ''] as h}
                <th class="px-3 py-2 text-left text-slate-500 font-semibold">{h}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each transitions as t}
              {@const isActive = !halted && t.state === currentState && t.read === (tape[head] ?? blankSymbol)}
              <tr class="border-b border-white/5 {isActive ? 'bg-[#6c8cff]/15' : ''}">
                <td class="px-3 py-1.5 text-[#6c8cff]">{t.state}</td>
                <td class="px-3 py-1.5 text-white">{t.read}</td>
                <td class="px-3 py-1.5 text-[#34d399]">{t.newState}</td>
                <td class="px-3 py-1.5 text-white">{t.write}</td>
                <td class="px-3 py-1.5 text-[#fbbf24]">{t.direction}</td>
                <td class="px-3 py-1.5">
                  <button on:click={() => deleteTransition(t.id)} class="text-slate-600 hover:text-red-400 transition-colors">✕</button>
                </td>
              </tr>
            {/each}
            {#if transitions.length === 0}
              <tr><td colspan="6" class="px-3 py-4 text-center text-slate-600">No transitions — load an example or add one</td></tr>
            {/if}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Step log -->
    {#if stepLog.length > 0}
      <div>
        <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Execution trace</div>
        <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-3 max-h-44 overflow-y-auto space-y-0.5">
          {#each stepLog as log, i}
            <div class="text-xs font-mono {i === stepLog.length-1 && halted ? (accepted ? 'text-[#34d399] font-bold' : 'text-red-400 font-bold') : 'text-slate-400'}">{log}</div>
          {/each}
        </div>
      </div>
    {/if}

  </div>
</div>
