<script lang="ts">
  import { onDestroy } from 'svelte';

  // ── Memory & registers ────────────────────────────────────────
  let memory: number[] = Array(100).fill(0);
  let acc   = 0;
  let pc    = 0;
  let running  = false;
  let halted   = false;
  let output: string[] = [];
  let inputQueue: number[] = [];
  let inputVal = '';
  let statusMsg = '';
  let highlighted = -1; // currently executing mailbox

  // ── Assembler ─────────────────────────────────────────────────
  const OPCODES: Record<string, number> = {
    HLT: 0, ADD: 1, SUB: 2, STA: 3, LDA: 5,
    BRA: 6, BRZ: 7, BRP: 8, INP: 901, OUT: 902,
  };

  function assemble(src: string): string | null {
    const lines = src.split('\n').map(l => l.replace(/\/\/.*/, '').trim()).filter(Boolean);
    const labels: Record<string, number> = {};
    const parsed: { op: string; arg?: string }[] = [];

    // First pass: collect labels and instructions
    let addr = 0;
    for (const line of lines) {
      const parts = line.split(/\s+/);
      if (parts[0].endsWith(':') || (!OPCODES.hasOwnProperty(parts[0].toUpperCase()) && parts[0].toUpperCase() !== 'DAT')) {
        // might be a label
        if (!OPCODES.hasOwnProperty(parts[0].toUpperCase()) && parts[0].toUpperCase() !== 'DAT') {
          // label definition
          labels[parts[0].replace(':', '')] = addr;
          parts.shift();
          if (!parts.length) continue;
        }
      }
      parsed.push({ op: parts[0].toUpperCase(), arg: parts[1] });
      addr++;
    }

    // Second pass: encode
    const newMem = Array(100).fill(0);
    for (let i = 0; i < parsed.length; i++) {
      const { op, arg } = parsed[i];
      if (op === 'DAT') {
        newMem[i] = arg ? parseInt(arg) : 0;
      } else if (op === 'INP') {
        newMem[i] = 901;
      } else if (op === 'OUT') {
        newMem[i] = 902;
      } else if (op === 'HLT') {
        newMem[i] = 0;
      } else {
        const opcode = OPCODES[op];
        if (opcode === undefined) return `Unknown instruction: ${op} on line ${i + 1}`;
        const operand = arg !== undefined
          ? (labels.hasOwnProperty(arg) ? labels[arg] : parseInt(arg))
          : 0;
        if (isNaN(operand)) return `Unknown label: ${arg} on line ${i + 1}`;
        newMem[i] = opcode * 100 + operand;
      }
    }
    memory = [...newMem];
    return null;
  }

  // ── Execution ─────────────────────────────────────────────────
  function decode(val: number): { op: number; addr: number } {
    if (val === 901) return { op: 901, addr: 0 };
    if (val === 902) return { op: 902, addr: 0 };
    return { op: Math.floor(val / 100), addr: val % 100 };
  }

  function step(): boolean {
    if (halted || pc >= 100) { halted = true; return false; }
    const { op, addr } = decode(memory[pc]);
    highlighted = pc;
    pc++;

    switch (op) {
      case 0: halted = true; statusMsg = 'Program halted.'; return false;
      case 1: acc = (acc + memory[addr]) % 1000; break;          // ADD
      case 2: acc = (acc - memory[addr] + 1000) % 1000; break;   // SUB
      case 3: memory[addr] = acc; memory = [...memory]; break;    // STA
      case 5: acc = memory[addr]; break;                          // LDA
      case 6: pc = addr; break;                                   // BRA
      case 7: if (acc === 0) pc = addr; break;                   // BRZ
      case 8: if (acc >= 0 && acc < 500) pc = addr; break;       // BRP
      case 901: // INP
        if (inputQueue.length) {
          acc = inputQueue.shift()!;
        } else {
          const v = parseInt(prompt('LMC input (0–999):') ?? '0');
          acc = isNaN(v) ? 0 : Math.max(0, Math.min(999, v));
        }
        break;
      case 902: // OUT
        output = [...output, String(acc)];
        break;
      default:
        statusMsg = `Unknown opcode ${op} at PC ${pc - 1}`;
        halted = true;
        return false;
    }
    return true;
  }

  // ── Run loop ──────────────────────────────────────────────────
  let runTimer: ReturnType<typeof setInterval> | null = null;

  function run() {
    if (halted) return;
    running = true;
    runTimer = setInterval(() => {
      if (!step()) {
        stopRun();
      }
      acc = acc; // trigger reactivity
    }, 50);
  }

  function stopRun() {
    if (runTimer) { clearInterval(runTimer); runTimer = null; }
    running = false;
  }

  function stepOnce() {
    step();
    acc = acc; // trigger reactivity
  }

  function reset() {
    stopRun();
    acc = 0; pc = 0; halted = false; output = []; statusMsg = ''; highlighted = -1;
    inputQueue = [];
  }

  function resetAll() {
    reset();
    memory = Array(100).fill(0);
    code = examples[0].code;
  }

  onDestroy(stopRun);

  // ── Examples ──────────────────────────────────────────────────
  const examples = [
    {
      label: 'Add two numbers',
      code: `// Add two user inputs and output the result
INP
STA num1
INP
ADD num1
OUT
HLT
num1 DAT 0`,
    },
    {
      label: 'Count down to zero',
      code: `// Count down from user input to 0
INP
loop OUT
      SUB one
      BRZ done
      BRP loop
done HLT
one  DAT 1`,
    },
    {
      label: 'Multiply two numbers',
      code: `// Multiply two numbers using repeated addition
      INP
      STA num1
      INP
      STA num2
      LDA zero
loop  LDA result
      ADD num1
      STA result
      LDA num2
      SUB one
      STA num2
      BRZ done
      BRA loop
done  LDA result
      OUT
      HLT
num1   DAT 0
num2   DAT 0
result DAT 0
one    DAT 1
zero   DAT 0`,
    },
  ];

  let code = examples[0].code;
  let asmError = '';

  function loadAndAssemble() {
    reset();
    const err = assemble(code);
    if (err) {
      asmError = err;
    } else {
      asmError = '';
      statusMsg = 'Assembled OK. Ready to run.';
    }
  }

  // ── Colour for memory cell display ───────────────────────────
  function cellColor(i: number): string {
    if (i === highlighted) return '#6c8cff';
    if (memory[i] !== 0) return '#34d399';
    return '';
  }
</script>

<div class="grid gap-6 lg:grid-cols-2">

  <!-- Left: editor + controls -->
  <div class="space-y-4">

    <!-- Example selector -->
    <div class="flex flex-wrap gap-2">
      {#each examples as ex, i}
        <button
          on:click={() => { code = ex.code; asmError = ''; statusMsg = ''; }}
          class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 transition-colors"
        >
          {ex.label}
        </button>
      {/each}
    </div>

    <!-- Code editor -->
    <div class="rounded-xl border border-white/10 overflow-hidden bg-[var(--code-bg)]">
      <div class="flex items-center justify-between border-b border-white/8 px-3 py-2 bg-white/3">
        <span class="text-xs font-semibold text-[#6c8cff]">LMC Assembly</span>
        <span class="text-xs text-slate-500">// for comments &nbsp;·&nbsp; LABEL before instruction</span>
      </div>
      <textarea
        bind:value={code}
        rows="14"
        spellcheck="false"
        class="w-full bg-transparent px-4 py-3 font-mono text-sm text-slate-200 outline-none resize-none leading-6"
        placeholder="Write LMC assembly here..."
      ></textarea>
    </div>

    {#if asmError}
      <p class="text-sm text-red-400">❌ {asmError}</p>
    {/if}

    <!-- Controls -->
    <div class="flex flex-wrap gap-2">
      <button
        on:click={loadAndAssemble}
        class="rounded-lg bg-[#6c8cff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a6cf7] transition-colors"
      >Assemble</button>

      {#if !running}
        <button
          on:click={run}
          disabled={halted || memory.every(v => v === 0)}
          class="rounded-lg bg-[#34d399] px-4 py-2 text-sm font-semibold text-[#0f172a] hover:bg-[#10b981] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >▶ Run</button>
      {:else}
        <button
          on:click={stopRun}
          class="rounded-lg bg-[#f59e0b] px-4 py-2 text-sm font-semibold text-[#0f172a] hover:bg-[#d97706] transition-colors"
        >⏸ Pause</button>
      {/if}

      <button
        on:click={stepOnce}
        disabled={halted || running}
        class="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors disabled:opacity-40"
      >Step</button>

      <button
        on:click={reset}
        class="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
      >Reset</button>

      <button
        on:click={resetAll}
        class="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
      >Clear all</button>
    </div>

    <!-- Registers -->
    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4 text-center">
        <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Accumulator</div>
        <div class="text-3xl font-bold text-[#6c8cff] font-mono">{String(acc).padStart(3,'0')}</div>
      </div>
      <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4 text-center">
        <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Program Counter</div>
        <div class="text-3xl font-bold text-[#34d399] font-mono">{String(pc).padStart(2,'0')}</div>
      </div>
    </div>

    <!-- Status -->
    {#if statusMsg}
      <p class="text-sm {halted ? 'text-[#fbbf24]' : 'text-[#34d399]'}">{statusMsg}</p>
    {/if}

    <!-- Output -->
    <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4">
      <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Output</div>
      {#if output.length}
        <div class="font-mono text-sm text-[#34d399] leading-relaxed">{output.join('\n')}</div>
      {:else}
        <p class="text-xs text-slate-600">Output will appear here when OUT is executed</p>
      {/if}
    </div>

  </div>

  <!-- Right: memory grid -->
  <div>
    <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Memory (100 mailboxes)</div>
    <div class="grid grid-cols-10 gap-1">
      {#each memory as val, i}
        <div
          class="rounded border text-center font-mono text-xs py-1.5 transition-colors"
          style="
            border-color: {cellColor(i) ? cellColor(i) + '40' : 'rgba(255,255,255,0.06)'};
            background: {cellColor(i) ? cellColor(i) + '18' : 'var(--bg-base)'};
            color: {cellColor(i) || 'var(--text-4)'};
          "
          title="Mailbox {i}: {val}"
        >
          <div class="text-[9px] opacity-50 leading-none">{i}</div>
          <div class="font-bold leading-tight">{String(val).padStart(3,'0')}</div>
        </div>
      {/each}
    </div>

    <!-- Instruction set reference -->
    <div class="mt-5 rounded-xl border border-white/8 bg-[var(--bg-card)] p-4">
      <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Instruction set</div>
      <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
        {#each [
          ['INP','Input → ACC'],['OUT','ACC → Output'],
          ['HLT','Stop'],['ADD xx','ACC + mem[xx]'],
          ['SUB xx','ACC − mem[xx]'],['STA xx','ACC → mem[xx]'],
          ['LDA xx','mem[xx] → ACC'],['BRA xx','Jump to xx'],
          ['BRZ xx','Jump if ACC=0'],['BRP xx','Jump if ACC≥0'],
          ['DAT n','Define data n'],
        ] as [ins, desc]}
          <div><span class="text-[#6c8cff]">{ins}</span> <span class="text-slate-500">{desc}</span></div>
        {/each}
      </div>
    </div>
  </div>

</div>
