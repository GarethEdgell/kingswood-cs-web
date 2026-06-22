<script lang="ts">
  // ── Basic gate definitions ───────────────────────────────────────
  type Gate = 'AND'|'OR'|'NOT'|'NAND'|'NOR'|'XOR'|'XNOR';
  const gates: Record<Gate,{inputs:1|2;fn:(a:number,b?:number)=>number;desc:string}> = {
    AND:  {inputs:2,fn:(a,b=0)=>a&b,         desc:'Output is 1 only when ALL inputs are 1'},
    OR:   {inputs:2,fn:(a,b=0)=>a|b,         desc:'Output is 1 when AT LEAST ONE input is 1'},
    NOT:  {inputs:1,fn:(a)=>a?0:1,            desc:'Inverts the input — 0 becomes 1, 1 becomes 0'},
    NAND: {inputs:2,fn:(a,b=0)=>(a&b)?0:1,   desc:'NOT AND — output is 0 only when both inputs are 1'},
    NOR:  {inputs:2,fn:(a,b=0)=>(a|b)?0:1,   desc:'NOT OR — output is 0 if any input is 1'},
    XOR:  {inputs:2,fn:(a,b=0)=>a^b,         desc:'Output is 1 when inputs are DIFFERENT'},
    XNOR: {inputs:2,fn:(a,b=0)=>(a^b)?0:1,   desc:'Output is 1 when inputs are THE SAME'},
  };

  // ── Mode ─────────────────────────────────────────────────────────
  let mode: 'gate'|'halfadder'|'fulladder'|'dff' = 'gate';

  // ── Single gate state ─────────────────────────────────────────────
  let selectedGate: Gate = 'AND';
  let inputA = 0, inputB = 0;
  $: gate   = gates[selectedGate];
  $: output = gate.inputs === 1 ? gate.fn(inputA) : gate.fn(inputA, inputB);
  $: truthTable = (() => {
    if (gate.inputs===1) return [{a:0,out:gate.fn(0)},{a:1,out:gate.fn(1)}];
    return [0,1].flatMap(a=>[0,1].map(b=>({a,b,out:gate.fn(a,b)})));
  })();

  // ── Half adder state ──────────────────────────────────────────────
  let haA=0,haB=0;
  $: haSum   = haA ^ haB;
  $: haCarry = haA & haB;

  // ── Full adder state ──────────────────────────────────────────────
  let faA=0,faB=0,faCin=0;
  $: faSum  = faA^faB^faCin;
  $: faCout = (faA&faB)|((faA^faB)&faCin);

  // ── D-type flip-flop state ────────────────────────────────────────
  let dffD=0, dffClk=0, dffQ=0;
  let dffPrevClk=0;
  function dffTrigger() {
    // Rising edge capture
    if (dffClk===0) { dffClk=1; dffQ=dffD; }
    else             { dffClk=0; }
    dffPrevClk=dffClk;
  }

  // ── Helpers ───────────────────────────────────────────────────────
  const W = (v:number) => v ? '#34d399' : '#475569';   // wire colour
  const L = (v:number) => v ? '#34d399' : '#64748b';   // label colour

  // SVG gate path helpers (gate starts at x=gx, centred at y=gy)
  function andPath(gx:number,gy:number,h:number=22): string {
    return `M${gx},${gy-h} L${gx+28},${gy-h} Q${gx+52},${gy-h} ${gx+52},${gy} Q${gx+52},${gy+h} ${gx+28},${gy+h} L${gx},${gy+h} Z`;
  }
  function orPath(gx:number,gy:number,h:number=22): string {
    return `M${gx},${gy-h} Q${gx+14},${gy-h} ${gx+52},${gy} Q${gx+14},${gy+h} ${gx},${gy+h} Q${gx+10},${gy} ${gx},${gy-h} Z`;
  }
  function xorExtra(gx:number,gy:number,h:number=22): string {
    return `M${gx-6},${gy-h} Q${gx+4},${gy} ${gx-6},${gy+h}`;
  }
  function notPath(gx:number,gy:number): string {
    return `M${gx},${gy-20} L${gx+44},${gy} L${gx},${gy+20} Z`;
  }
</script>

<!-- ── Mode tabs ──────────────────────────────────────────────────── -->
<div class="mb-5 flex flex-wrap gap-2">
  {#each [
    {id:'gate',      label:'Single Gate'},
    {id:'halfadder', label:'Half Adder'},
    {id:'fulladder', label:'Full Adder'},
    {id:'dff',       label:'D-Type Flip-Flop'},
  ] as m}
    <button
      on:click={()=>mode=m.id as typeof mode}
      class="rounded-lg px-4 py-1.5 text-sm font-semibold transition-all border {mode===m.id
        ? 'bg-[#6c8cff]/20 border-[#6c8cff]/50 text-[#6c8cff]'
        : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'}"
    >{m.label}</button>
  {/each}
</div>

<!-- ══════════════════════════════════════════════════════════════════
     SINGLE GATE MODE
     ══════════════════════════════════════════════════════════════════ -->
{#if mode === 'gate'}
<div class="space-y-6">

  <!-- Gate selector -->
  <div>
    <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Select gate</p>
    <div class="flex flex-wrap gap-2">
      {#each Object.keys(gates) as g}
        <button on:click={()=>selectedGate=g as Gate}
          class="rounded-lg border px-4 py-2 text-sm font-semibold transition-colors {selectedGate===g
            ? 'border-[#6c8cff] bg-[#6c8cff]/15 text-[#6c8cff]'
            : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'}">
          {g}
        </button>
      {/each}
    </div>
    <p class="mt-2 text-sm text-slate-400">{gate.desc}</p>
  </div>

  <div class="grid gap-6 sm:grid-cols-2">
    <!-- Inputs -->
    <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-5">
      <p class="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Inputs</p>
      <div class="space-y-4">
        {#each (gate.inputs===2 ? [{lbl:'A',val:inputA,set:(v:number)=>inputA=v},{lbl:'B',val:inputB,set:(v:number)=>inputB=v}] : [{lbl:'A',val:inputA,set:(v:number)=>inputA=v}]) as inp}
          <label class="flex cursor-pointer items-center justify-between gap-4">
            <div>
              <span class="text-sm font-semibold text-white">Input {inp.lbl}</span>
              <span class="ml-2 rounded-full px-2 py-0.5 text-xs font-bold {inp.val?'bg-[#34d399]/20 text-[#34d399]':'bg-white/5 text-slate-500'}">{inp.val}</span>
            </div>
            <button on:click={()=>inp.set(inp.val?0:1)}
              class="relative h-7 w-14 rounded-full border transition-all {inp.val?'border-[#34d399]/40 bg-[#34d399]/20':'border-white/15 bg-white/5'}"
              role="switch" aria-checked={inp.val===1}>
              <span class="absolute top-1 h-5 w-5 rounded-full transition-all {inp.val?'left-8 bg-[#34d399]':'left-1 bg-slate-500'}"></span>
            </button>
          </label>
        {/each}
      </div>
    </div>

    <!-- Diagram + output -->
    <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-5">
      <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Gate diagram</p>

      <!-- SVG — fixed: labels at left, wires start AFTER labels -->
      <svg viewBox="0 0 220 90" class="w-full max-w-xs mx-auto mb-4">
        <!-- Input labels (left side, clear of wires) -->
        {#if gate.inputs===2}
          <text x="2" y="34"  fill={L(inputA)} font-size="11" font-family="monospace" font-weight="600">A={inputA}</text>
          <text x="2" y="62"  fill={L(inputB)} font-size="11" font-family="monospace" font-weight="600">B={inputB}</text>
          <!-- Wires start at x=36 (after label) -->
          <line x1="36" y1="30" x2="78" y2="30" stroke={W(inputA)} stroke-width="2.5"/>
          <line x1="36" y1="56" x2="78" y2="56" stroke={W(inputB)} stroke-width="2.5"/>
        {:else}
          <text x="2" y="49" fill={L(inputA)} font-size="11" font-family="monospace" font-weight="600">A={inputA}</text>
          <line x1="36" y1="45" x2="78" y2="45" stroke={W(inputA)} stroke-width="2.5"/>
        {/if}

        <!-- Gate body (starts at x=78, centred at y=43) -->
        {#if selectedGate==='AND'||selectedGate==='NAND'}
          <path d={andPath(78,43)} fill="none" stroke="#6c8cff" stroke-width="2.5"/>
        {:else if selectedGate==='OR'||selectedGate==='NOR'||selectedGate==='XOR'||selectedGate==='XNOR'}
          <path d={orPath(78,43)} fill="none" stroke="#6c8cff" stroke-width="2.5"/>
          {#if selectedGate==='XOR'||selectedGate==='XNOR'}
            <path d={xorExtra(78,43)} fill="none" stroke="#6c8cff" stroke-width="2.5"/>
          {/if}
        {:else}
          <!-- NOT triangle, single input centred -->
          <path d={notPath(78,43)} fill="none" stroke="#6c8cff" stroke-width="2.5"/>
        {/if}

        <!-- Bubble + output wire -->
        {#if selectedGate==='NAND'||selectedGate==='NOR'||selectedGate==='XNOR'||selectedGate==='NOT'}
          <circle cx="136" cy="43" r="5.5" fill="none" stroke="#6c8cff" stroke-width="2.5"/>
          <line x1="142" y1="43" x2="196" y2="43" stroke={W(output)} stroke-width="2.5"/>
        {:else}
          <line x1="130" y1="43" x2="196" y2="43" stroke={W(output)} stroke-width="2.5"/>
        {/if}

        <!-- Output label (right side, clear of wire) -->
        <text x="198" y="47" fill={L(output)} font-size="11" font-family="monospace" font-weight="700">{output}</text>
      </svg>

      <div class="flex items-center justify-center gap-3 mt-2">
        <div class="flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl font-extrabold transition-all {output?'border-[#34d399]/50 bg-[#34d399]/10 text-[#34d399]':'border-white/15 bg-white/5 text-slate-500'}">
          {output}
        </div>
        <div class="text-sm text-slate-400">
          Output<br><span class="font-semibold {output?'text-[#34d399]':'text-slate-500'}">{output?'HIGH (1)':'LOW (0)'}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Truth table -->
  <div>
    <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Truth table — {selectedGate}</p>
    <div class="overflow-hidden rounded-xl border border-white/8">
      <table class="w-full text-sm">
        <thead><tr class="bg-white/3 text-left">
          <th class="px-4 py-2.5 font-semibold text-slate-400">A</th>
          {#if gate.inputs===2}<th class="px-4 py-2.5 font-semibold text-slate-400">B</th>{/if}
          <th class="px-4 py-2.5 font-semibold text-[#6c8cff]">Output</th>
          <th class="hidden px-4 py-2.5 text-slate-500 sm:table-cell text-xs">Active</th>
        </tr></thead>
        <tbody class="divide-y divide-white/5">
          {#each truthTable as row}
            {@const active=gate.inputs===1?row.a===inputA:row.a===inputA&&(row as any).b===inputB}
            <tr class="{active?'bg-[#6c8cff]/8':'hover:bg-white/2'}">
              <td class="px-4 py-2.5 font-mono font-bold {row.a?'text-[#34d399]':'text-slate-500'}">{row.a}</td>
              {#if gate.inputs===2}<td class="px-4 py-2.5 font-mono font-bold {(row as any).b?'text-[#34d399]':'text-slate-500'}">{(row as any).b}</td>{/if}
              <td class="px-4 py-2.5 font-mono font-bold text-lg {row.out?'text-[#34d399]':'text-slate-500'}">{row.out}</td>
              <td class="hidden px-4 py-2.5 sm:table-cell">{#if active}<span class="text-xs text-[#6c8cff]">← now</span>{/if}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>


<!-- ══════════════════════════════════════════════════════════════════
     HALF ADDER
     ══════════════════════════════════════════════════════════════════ -->
{:else if mode==='halfadder'}
<div class="space-y-5">
  <div class="rounded-xl border border-[#6c8cff]/20 bg-[#6c8cff]/8 p-4 text-sm text-slate-300">
    <strong class="text-white">Half Adder</strong> — adds two single bits (A and B).
    Produces a <strong class="text-[#34d399]">Sum</strong> (A XOR B) and a
    <strong class="text-[#fbbf24]">Carry</strong> (A AND B).
    Cannot handle a carry-in — use a Full Adder for that.
  </div>

  <!-- Inputs -->
  <div class="flex flex-wrap gap-4">
    {#each [{lbl:'A',val:haA,set:(v:number)=>{haA=v}},{lbl:'B',val:haB,set:(v:number)=>{haB=v}}] as inp}
      <label class="flex items-center gap-3 cursor-pointer rounded-xl border border-white/8 bg-[var(--bg-card)] px-5 py-3">
        <span class="font-bold text-white">Input {inp.lbl}</span>
        <span class="font-mono font-bold text-lg {inp.val?'text-[#34d399]':'text-slate-500'}">{inp.val}</span>
        <button on:click={()=>inp.set(inp.val?0:1)}
          class="relative h-7 w-14 rounded-full border transition-all {inp.val?'border-[#34d399]/40 bg-[#34d399]/20':'border-white/15 bg-white/5'}"
          role="switch" aria-checked={inp.val===1}>
          <span class="absolute top-1 h-5 w-5 rounded-full transition-all {inp.val?'left-8 bg-[#34d399]':'left-1 bg-slate-500'}"></span>
        </button>
      </label>
    {/each}
  </div>

  <!-- Circuit diagram -->
  <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4">
    <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Circuit diagram</p>
    <svg viewBox="0 0 360 130" class="w-full max-w-md mx-auto">
      <!-- Input labels -->
      <text x="2" y="44"  fill={L(haA)} font-size="11" font-family="monospace" font-weight="700">A={haA}</text>
      <text x="2" y="94"  fill={L(haB)} font-size="11" font-family="monospace" font-weight="700">B={haB}</text>

      <!-- A wire splits to XOR and AND -->
      <line x1="36" y1="40" x2="80" y2="40" stroke={W(haA)} stroke-width="2"/>
      <line x1="70" y1="40" x2="70" y2="75" stroke={W(haA)} stroke-width="2"/>
      <line x1="70" y1="75" x2="80" y2="75" stroke={W(haA)} stroke-width="2"/>
      <circle cx="70" cy="40" r="3.5" fill={W(haA)}/>

      <!-- B wire splits -->
      <line x1="36" y1="90" x2="80" y2="90" stroke={W(haB)} stroke-width="2"/>
      <line x1="60" y1="90" x2="60" y2="85" stroke={W(haB)} stroke-width="2"/>
      <line x1="60" y1="55" x2="60" y2="85" stroke={W(haB)} stroke-width="2"/>
      <line x1="60" y1="55" x2="80" y2="55" stroke={W(haB)} stroke-width="2"/>
      <circle cx="60" cy="90" r="3.5" fill={W(haB)}/>

      <!-- XOR gate (top, centred at y=47) -->
      <path d={orPath(80,47,12)} fill="none" stroke="#6c8cff" stroke-width="2"/>
      <path d={xorExtra(80,47,12)} fill="none" stroke="#6c8cff" stroke-width="2"/>
      <text x="82" y="30" font-size="9" fill="#6c8cff" font-family="sans-serif">XOR</text>

      <!-- AND gate (bottom, centred at y=82) -->
      <path d={andPath(80,82,12)} fill="none" stroke="#6c8cff" stroke-width="2"/>
      <text x="82" y="67" font-size="9" fill="#6c8cff" font-family="sans-serif">AND</text>

      <!-- Output wires -->
      <line x1="132" y1="47" x2="240" y2="47" stroke={W(haSum)} stroke-width="2"/>
      <line x1="132" y1="82" x2="240" y2="82" stroke={W(haCarry)} stroke-width="2"/>

      <!-- Output labels -->
      <text x="243" y="51" font-size="11" fill={L(haSum)}   font-family="monospace" font-weight="700">Sum={haSum}</text>
      <text x="243" y="86" font-size="11" fill={L(haCarry)} font-family="monospace" font-weight="700">Carry={haCarry}</text>
    </svg>
  </div>

  <!-- Results + truth table -->
  <div class="grid gap-4 sm:grid-cols-2">
    <div class="flex gap-4">
      <div class="flex-1 rounded-xl border border-[#34d399]/25 bg-[#34d399]/8 p-4 text-center">
        <div class="text-xs text-slate-500 mb-1">Sum (XOR)</div>
        <div class="text-4xl font-black {haSum?'text-[#34d399]':'text-slate-500'}">{haSum}</div>
      </div>
      <div class="flex-1 rounded-xl border border-[#fbbf24]/25 bg-[#fbbf24]/8 p-4 text-center">
        <div class="text-xs text-slate-500 mb-1">Carry (AND)</div>
        <div class="text-4xl font-black {haCarry?'text-[#fbbf24]':'text-slate-500'}">{haCarry}</div>
      </div>
    </div>
    <div class="overflow-hidden rounded-xl border border-white/8">
      <table class="w-full text-sm">
        <thead><tr class="bg-white/3"><th class="px-3 py-2 text-slate-400">A</th><th class="px-3 py-2 text-slate-400">B</th><th class="px-3 py-2 text-[#34d399]">Sum</th><th class="px-3 py-2 text-[#fbbf24]">Carry</th></tr></thead>
        <tbody class="divide-y divide-white/5">
          {#each [[0,0],[0,1],[1,0],[1,1]] as [a,b]}
            {@const active=a===haA&&b===haB}
            <tr class="{active?'bg-[#6c8cff]/8':''}">
              <td class="px-3 py-2 text-center font-mono {a?'text-[#34d399]':'text-slate-500'}">{a}</td>
              <td class="px-3 py-2 text-center font-mono {b?'text-[#34d399]':'text-slate-500'}">{b}</td>
              <td class="px-3 py-2 text-center font-mono font-bold {(a^b)?'text-[#34d399]':'text-slate-500'}">{a^b}</td>
              <td class="px-3 py-2 text-center font-mono font-bold {(a&b)?'text-[#fbbf24]':'text-slate-500'}">{a&b}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
  <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4 text-sm text-slate-400">
    <strong class="text-white">Exam note:</strong> A half adder can only add two bits with no carry-in.
    <strong class="text-[#34d399]">Sum = A XOR B</strong> · <strong class="text-[#fbbf24]">Carry = A AND B</strong>.
    Two half adders + one OR gate = a Full Adder.
  </div>
</div>


<!-- ══════════════════════════════════════════════════════════════════
     FULL ADDER
     ══════════════════════════════════════════════════════════════════ -->
{:else if mode==='fulladder'}
<div class="space-y-5">
  <div class="rounded-xl border border-[#6c8cff]/20 bg-[#6c8cff]/8 p-4 text-sm text-slate-300">
    <strong class="text-white">Full Adder</strong> — adds three bits: A, B, and a Carry-in (Cin).
    Produces a <strong class="text-[#34d399]">Sum</strong> and a <strong class="text-[#fbbf24]">Carry-out (Cout)</strong>.
    Full adders are chained together to build multi-bit adders (e.g. 8-bit addition uses 8 full adders).
  </div>

  <div class="flex flex-wrap gap-3">
    {#each [{lbl:'A',val:faA,set:(v:number)=>{faA=v}},{lbl:'B',val:faB,set:(v:number)=>{faB=v}},{lbl:'Cin',val:faCin,set:(v:number)=>{faCin=v}}] as inp}
      <label class="flex items-center gap-3 cursor-pointer rounded-xl border border-white/8 bg-[var(--bg-card)] px-4 py-3">
        <span class="font-bold text-white text-sm">{inp.lbl}</span>
        <span class="font-mono font-bold text-lg {inp.val?'text-[#34d399]':'text-slate-500'}">{inp.val}</span>
        <button on:click={()=>inp.set(inp.val?0:1)}
          class="relative h-7 w-12 rounded-full border transition-all {inp.val?'border-[#34d399]/40 bg-[#34d399]/20':'border-white/15 bg-white/5'}"
          role="switch" aria-checked={inp.val===1}>
          <span class="absolute top-1 h-5 w-5 rounded-full transition-all {inp.val?'left-6 bg-[#34d399]':'left-1 bg-slate-500'}"></span>
        </button>
      </label>
    {/each}
  </div>

  <!-- Gate-level diagram -->
  <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4">
    <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Gate-level circuit diagram</p>
    <!--
      Layout (all y values are wire centre-lines):
        A   → y=38   XOR1 top (gy=55,h=17) → also fork down to AND1 top (gy=110,h=20, top input y=90)
        B   → y=72   XOR1 bot              → also fork down to AND1 bot (y=130)
        XOR1 out y=55 → XOR2 top (gy=75,h=20, top y=55); fork down to AND2 top (gy=135,h=15, top y=120)
        Cin → y=150  → fork up to XOR2 bot (y=95); straight right to AND2 bot (y=150)
        AND1 out y=110 → OR top  (gy=120,h=15, top y=105) via dog-leg
        AND2 out y=135 → OR bot  (y=135) direct
        XOR2 out y=75  → Sum
        OR   out y=120 → Cout
    -->
    <svg viewBox="0 0 475 170" class="w-full max-w-lg mx-auto">

      <!-- ── Input labels ── -->
      <text x="2"  y="42"  fill={L(faA)}   font-size="10" font-family="monospace" font-weight="700">A={faA}</text>
      <text x="2"  y="76"  fill={L(faB)}   font-size="10" font-family="monospace" font-weight="700">B={faB}</text>
      <text x="2"  y="154" fill={L(faCin)} font-size="10" font-family="monospace" font-weight="700">Cin={faCin}</text>

      <!-- ── A main wire + fork to AND1 top (y=90) ── -->
      <line x1="30" y1="38" x2="80" y2="38" stroke={W(faA)} stroke-width="2"/>
      <circle cx="50" cy="38" r="3" fill={W(faA)}/>
      <line x1="50" y1="38" x2="50"  y2="90" stroke={W(faA)} stroke-width="2"/>
      <line x1="50" y1="90" x2="80"  y2="90" stroke={W(faA)} stroke-width="2"/>

      <!-- ── B main wire + fork to AND1 bottom (y=130) ── -->
      <line x1="30" y1="72" x2="80" y2="72" stroke={W(faB)} stroke-width="2"/>
      <circle cx="60" cy="72" r="3" fill={W(faB)}/>
      <line x1="60" y1="72" x2="60"  y2="130" stroke={W(faB)} stroke-width="2"/>
      <line x1="60" y1="130" x2="80" y2="130" stroke={W(faB)} stroke-width="2"/>

      <!-- ── XOR1 gate: gx=80 gy=55 h=22 — wires enter at y=38,72 (6px inside gate edge) ── -->
      <path d={orPath(80,55,22)}    fill="none" stroke="#6c8cff" stroke-width="2"/>
      <path d={xorExtra(80,55,22)}  fill="none" stroke="#6c8cff" stroke-width="2"/>
      <text x="106" y="58" text-anchor="middle" font-size="8" font-weight="700" fill="#6c8cff" font-family="sans-serif">XOR</text>

      <!-- ── AND1 gate: gx=80 gy=110 h=25 — wires enter at y=90,130 (5px inside gate edge) ── -->
      <path d={andPath(80,110,25)} fill="none" stroke="#6c8cff" stroke-width="2"/>
      <text x="106" y="113" text-anchor="middle" font-size="8" font-weight="700" fill="#6c8cff" font-family="sans-serif">AND</text>

      <!-- ── Sum1 wire from XOR1 (y=55), fork to XOR2 top (y=55) and AND2 top (y=120) ── -->
      <line x1="132" y1="55"  x2="165"  y2="55"  stroke={W(faA^faB)} stroke-width="2"/>
      <circle cx="165" cy="55" r="3" fill={W(faA^faB)}/>
      <line x1="165" y1="55"  x2="200"  y2="55"  stroke={W(faA^faB)} stroke-width="2"/>
      <line x1="165" y1="55"  x2="165"  y2="120" stroke={W(faA^faB)} stroke-width="2"/>
      <line x1="165" y1="120" x2="200"  y2="120" stroke={W(faA^faB)} stroke-width="2"/>
      <text x="134" y="52" font-size="8" fill="#475569" font-family="monospace">S₁</text>

      <!-- ── C1 wire from AND1 (y=110), dog-leg up to OR top input (y=105) ── -->
      <line x1="132" y1="110" x2="285"  y2="110" stroke={W(faA&faB)} stroke-width="2"/>
      <line x1="285" y1="110" x2="285"  y2="105" stroke={W(faA&faB)} stroke-width="2"/>
      <line x1="285" y1="105" x2="295"  y2="105" stroke={W(faA&faB)} stroke-width="2"/>
      <text x="134" y="108" font-size="8" fill="#475569" font-family="monospace">C₁</text>

      <!-- ── XOR2 gate: gx=200 gy=75 h=25 — wires enter at y=55,95 (5px inside gate edge) ── -->
      <path d={orPath(200,75,25)}   fill="none" stroke="#6c8cff" stroke-width="2"/>
      <path d={xorExtra(200,75,25)} fill="none" stroke="#6c8cff" stroke-width="2"/>
      <text x="226" y="78" text-anchor="middle" font-size="8" font-weight="700" fill="#6c8cff" font-family="sans-serif">XOR</text>

      <!-- ── AND2 gate: gx=200 gy=135 h=22 — wires enter at y=120,150 (7px inside gate edge) ── -->
      <path d={andPath(200,135,22)} fill="none" stroke="#6c8cff" stroke-width="2"/>
      <text x="226" y="138" text-anchor="middle" font-size="8" font-weight="700" fill="#6c8cff" font-family="sans-serif">AND</text>

      <!-- ── Cin wire (y=150): fork up to XOR2 bottom (y=95), straight right to AND2 bottom (y=150) ── -->
      <line x1="40"  y1="150" x2="175"  y2="150" stroke={W(faCin)} stroke-width="2"/>
      <circle cx="175" cy="150" r="3" fill={W(faCin)}/>
      <line x1="175" y1="150" x2="175"  y2="95"  stroke={W(faCin)} stroke-width="2"/>
      <line x1="175" y1="95"  x2="200"  y2="95"  stroke={W(faCin)} stroke-width="2"/>
      <line x1="175" y1="150" x2="200"  y2="150" stroke={W(faCin)} stroke-width="2"/>

      <!-- ── C2 wire from AND2 (y=135) straight to OR bottom input (y=135) ── -->
      <line x1="252" y1="135" x2="295"  y2="135" stroke={W((faA^faB)&faCin)} stroke-width="2"/>
      <text x="254" y="133" font-size="8" fill="#475569" font-family="monospace">C₂</text>

      <!-- ── OR gate: gx=295 gy=120 h=22 — wires enter at y=105,135 (7px inside gate edge) ── -->
      <path d={orPath(295,120,22)} fill="none" stroke="#6c8cff" stroke-width="2"/>
      <text x="321" y="123" text-anchor="middle" font-size="8" font-weight="700" fill="#6c8cff" font-family="sans-serif">OR</text>

      <!-- ── Sum output from XOR2 (y=75) ── -->
      <line x1="252" y1="75"  x2="422"  y2="75"  stroke={W(faSum)}  stroke-width="2.5"/>
      <text x="424" y="79"  font-size="10" fill={L(faSum)}  font-family="monospace" font-weight="700">Sum={faSum}</text>

      <!-- ── Cout output from OR (y=120) ── -->
      <line x1="347" y1="120" x2="422"  y2="120" stroke={W(faCout)} stroke-width="2.5"/>
      <text x="424" y="124" font-size="10" fill={L(faCout)} font-family="monospace" font-weight="700">Cout={faCout}</text>

    </svg>
    <div class="mt-2 text-xs text-slate-500 text-center">Sum = A ⊕ B ⊕ Cin &nbsp;·&nbsp; Cout = (A·B) + (Cin·(A⊕B))</div>
  </div>

  <div class="grid gap-4 sm:grid-cols-2">
    <div class="flex gap-4">
      <div class="flex-1 rounded-xl border border-[#34d399]/25 bg-[#34d399]/8 p-4 text-center">
        <div class="text-xs text-slate-500 mb-1">Sum</div>
        <div class="text-4xl font-black {faSum?'text-[#34d399]':'text-slate-500'}">{faSum}</div>
      </div>
      <div class="flex-1 rounded-xl border border-[#fbbf24]/25 bg-[#fbbf24]/8 p-4 text-center">
        <div class="text-xs text-slate-500 mb-1">Carry out</div>
        <div class="text-4xl font-black {faCout?'text-[#fbbf24]':'text-slate-500'}">{faCout}</div>
      </div>
    </div>
    <div class="overflow-hidden rounded-xl border border-white/8">
      <table class="w-full text-sm">
        <thead><tr class="bg-white/3">
          <th class="px-2 py-2 text-slate-400">A</th><th class="px-2 py-2 text-slate-400">B</th>
          <th class="px-2 py-2 text-slate-400">Cin</th>
          <th class="px-2 py-2 text-[#34d399]">Sum</th><th class="px-2 py-2 text-[#fbbf24]">Cout</th>
        </tr></thead>
        <tbody class="divide-y divide-white/5">
          {#each [[0,0,0],[0,0,1],[0,1,0],[0,1,1],[1,0,0],[1,0,1],[1,1,0],[1,1,1]] as [a,b,c]}
            {@const s=a^b^c}
            {@const co=(a&b)|((a^b)&c)}
            {@const active=a===faA&&b===faB&&c===faCin}
            <tr class="{active?'bg-[#6c8cff]/8':''}">
              <td class="px-2 py-1.5 text-center font-mono {a?'text-[#34d399]':'text-slate-500'}">{a}</td>
              <td class="px-2 py-1.5 text-center font-mono {b?'text-[#34d399]':'text-slate-500'}">{b}</td>
              <td class="px-2 py-1.5 text-center font-mono {c?'text-[#34d399]':'text-slate-500'}">{c}</td>
              <td class="px-2 py-1.5 text-center font-mono font-bold {s?'text-[#34d399]':'text-slate-500'}">{s}</td>
              <td class="px-2 py-1.5 text-center font-mono font-bold {co?'text-[#fbbf24]':'text-slate-500'}">{co}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>


<!-- ══════════════════════════════════════════════════════════════════
     D-TYPE FLIP-FLOP
     ══════════════════════════════════════════════════════════════════ -->
{:else if mode==='dff'}
<div class="space-y-5">
  <div class="rounded-xl border border-[#6c8cff]/20 bg-[#6c8cff]/8 p-4 text-sm text-slate-300">
    <strong class="text-white">D-Type Flip-Flop</strong> — a bistable memory element.
    Captures the value of <strong class="text-white">D</strong> on the <strong class="text-[#34d399]">rising edge</strong> of the clock (CLK 0→1).
    Output <strong class="text-[#34d399]">Q</strong> holds the stored bit until the next rising clock edge.
    Used in registers, memory and sequential logic circuits.
  </div>

  <!-- Controls -->
  <div class="grid gap-4 sm:grid-cols-3">
    <!-- D input toggle -->
    <label class="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-[var(--bg-card)] p-4 cursor-pointer">
      <div>
        <div class="font-bold text-white">D (Data)</div>
        <div class="text-xs text-slate-500 mt-0.5">Value to store</div>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-mono font-bold text-xl {dffD?'text-[#6c8cff]':'text-slate-500'}">{dffD}</span>
        <button on:click={()=>dffD=dffD?0:1}
          class="relative h-7 w-14 rounded-full border transition-all {dffD?'border-[#6c8cff]/40 bg-[#6c8cff]/20':'border-white/15 bg-white/5'}"
          role="switch" aria-checked={dffD===1}>
          <span class="absolute top-1 h-5 w-5 rounded-full transition-all {dffD?'left-8 bg-[#6c8cff]':'left-1 bg-slate-500'}"></span>
        </button>
      </div>
    </label>

    <!-- CLK trigger -->
    <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4 text-center">
      <div class="font-bold text-white mb-1">CLK (Clock)</div>
      <div class="text-xs text-slate-500 mb-3">Click to toggle. Rising edge (0→1) captures D.</div>
      <button on:click={dffTrigger}
        class="rounded-xl px-6 py-2 font-semibold text-sm transition-all {dffClk
          ? 'bg-[#34d399]/20 border border-[#34d399]/40 text-[#34d399]'
          : 'bg-white/5 border border-white/15 text-slate-400'}"
      >
        CLK = {dffClk} {dffClk?'▲ HIGH':'▼ LOW'}
      </button>
    </div>

    <!-- Q output -->
    <div class="rounded-xl border border-[#34d399]/25 bg-[#34d399]/8 p-4 text-center">
      <div class="text-xs text-slate-500 mb-1">Outputs</div>
      <div class="flex items-center justify-center gap-6 mt-2">
        <div>
          <div class="text-xs text-slate-500">Q</div>
          <div class="text-4xl font-black {dffQ?'text-[#34d399]':'text-slate-500'}">{dffQ}</div>
        </div>
        <div>
          <div class="text-xs text-slate-500">Q̄ (not Q)</div>
          <div class="text-4xl font-black {dffQ?'text-slate-500':'text-[#fb7185]'}">{dffQ?0:1}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Block diagram -->
  <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4">
    <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Block diagram (rising-edge triggered)</p>
    <svg viewBox="0 0 340 130" class="w-full max-w-sm mx-auto">
      <!-- D input -->
      <text x="2" y="48" font-size="11" fill={L(dffD)} font-family="monospace" font-weight="700">D={dffD}</text>
      <line x1="28" y1="44" x2="105" y2="44" stroke={W(dffD)} stroke-width="2.5"/>

      <!-- CLK input -->
      <text x="2" y="88" font-size="11" fill={L(dffClk)} font-family="monospace" font-weight="700">CLK={dffClk}</text>
      <line x1="40" y1="84" x2="105" y2="84" stroke={W(dffClk)} stroke-width="2.5"/>

      <!-- Rising edge indicator on CLK line -->
      <polyline points="55,90 55,78 65,78 65,90" fill="none" stroke={dffClk?'#34d399':'#475569'} stroke-width="2"/>
      {#if dffClk}
        <polygon points="62,78 66,82 62,86" fill="#34d399"/>
      {/if}

      <!-- D-FF box -->
      <rect x="105" y="20" width="90" height="90" rx="8" fill="none" stroke="#6c8cff" stroke-width="2.5"/>
      <text x="150" y="58" text-anchor="middle" font-size="13" fill="#6c8cff" font-weight="700">D-FF</text>
      <text x="150" y="74" text-anchor="middle" font-size="9" fill="#475569">edge-triggered</text>
      <!-- Labels inside box -->
      <text x="112" y="48" font-size="9" fill="#94a3b8">D</text>
      <text x="112" y="88" font-size="9" fill="#94a3b8">▷CLK</text>
      <text x="184" y="48" font-size="9" fill="#94a3b8" text-anchor="end">Q</text>
      <text x="184" y="88" font-size="9" fill="#94a3b8" text-anchor="end">Q̄</text>

      <!-- Q output -->
      <line x1="195" y1="44" x2="290" y2="44" stroke={W(dffQ)} stroke-width="2.5"/>
      <text x="292" y="48" font-size="11" fill={L(dffQ)} font-family="monospace" font-weight="700">Q={dffQ}</text>

      <!-- Q-bar output -->
      <line x1="195" y1="84" x2="260" y2="84" stroke={W(dffQ?0:1)} stroke-width="2.5"/>
      <text x="262" y="88" font-size="11" fill={L(dffQ?0:1)} font-family="monospace" font-weight="700">Q̄={dffQ?0:1}</text>
    </svg>
  </div>

  <!-- Explanation -->
  <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4 text-sm text-slate-400 space-y-2">
    <div><strong class="text-white">How to use:</strong> Set D to 0 or 1, then click CLK. When CLK goes from 0→1 (rising edge), Q captures the value of D.</div>
    <div><strong class="text-white">Key property:</strong> Q only changes on the rising clock edge — it holds its value at all other times, even if D changes. This makes it a 1-bit memory cell.</div>
    <div><strong class="text-white">Applications:</strong> CPU registers (store intermediate results), shift registers, counters, serial-to-parallel conversion, synchronising asynchronous signals.</div>
    <div class="font-mono text-xs text-slate-500 mt-2">Q(t+1) = D(t) &nbsp;[at rising CLK edge]</div>
  </div>
</div>
{/if}
