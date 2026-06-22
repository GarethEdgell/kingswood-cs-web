<script lang="ts">
  // ── Tab state ──────────────────────────────────────────────────────────────
  type Tab = 'bases' | 'twos' | 'shifts' | 'filesizes' | 'ascii';
  let activeTab: Tab = 'bases';

  // ── BASE CONVERTER ─────────────────────────────────────────────────────────
  let decInput = '';
  let binInput = '';
  let hexInput = '';

  function clampDec(n: number) {
    return Math.max(0, Math.min(255, Math.floor(n)));
  }

  function fromDec(val: string) {
    decInput = val;
    const n = parseInt(val, 10);
    if (isNaN(n) || val.trim() === '') {
      binInput = '';
      hexInput = '';
      return;
    }
    const c = clampDec(n);
    decInput   = String(c);
    binInput   = c.toString(2).padStart(8, '0');
    hexInput   = c.toString(16).toUpperCase();
  }

  function fromBin(val: string) {
    binInput = val.replace(/[^01]/g, '');
    if (!binInput) { decInput = ''; hexInput = ''; return; }
    const n = parseInt(binInput, 2);
    decInput = String(n);
    hexInput = n.toString(16).toUpperCase();
  }

  function fromHex(val: string) {
    hexInput = val.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
    if (!hexInput) { decInput = ''; binInput = ''; return; }
    const n = parseInt(hexInput, 16);
    decInput = String(n);
    binInput = n.toString(2).padStart(8, '0');
  }

  // nibble display — split 8-bit binary into two groups of 4
  $: binNibbles = binInput.length === 8
    ? binInput.slice(0, 4) + ' ' + binInput.slice(4)
    : binInput;

  // bit weight breakdown
  $: bitWeights = (() => {
    const b = binInput.padStart(8, '0').slice(-8);
    return b.split('').map((bit, i) => ({
      bit,
      weight: Math.pow(2, 7 - i),
      contrib: bit === '1' ? Math.pow(2, 7 - i) : 0,
    }));
  })();

  $: decValue = decInput ? parseInt(decInput, 10) : 0;

  // ── TWO'S COMPLEMENT ───────────────────────────────────────────────────────
  let tcBits = 8;
  let tcInput = '';

  $: tcResult = (() => {
    const n = parseInt(tcInput, 10);
    if (isNaN(n) || tcInput.trim() === '') return null;
    const bits = tcBits;
    const min  = -(Math.pow(2, bits - 1));
    const max  =   Math.pow(2, bits - 1) - 1;
    if (n < min || n > max) return { error: `Out of range for ${bits}-bit two's complement (${min} to ${max})` };

    let raw: number;
    if (n >= 0) {
      raw = n;
    } else {
      raw = Math.pow(2, bits) + n;
    }

    const b = raw.toString(2).padStart(bits, '0');
    return {
      error: null,
      value: n,
      unsigned: raw,
      binary: b,
      signBit: b[0],
      magnitude: b.slice(1),
    };
  })();

  // ── BINARY SHIFTS ──────────────────────────────────────────────────────────
  let shiftInput = '01001010'; // 74
  let shiftAmount = 1;
  let shiftDir: 'left' | 'right' = 'left';

  $: shiftResult = (() => {
    const clean = shiftInput.replace(/[^01]/g, '').slice(0, 8).padStart(8, '0');
    const n = parseInt(clean, 2);
    let shifted: number;
    let lostBits: string;
    let newBits: string;

    if (shiftDir === 'left') {
      shifted = (n << shiftAmount) & 0xFF;
      lostBits = clean.slice(0, shiftAmount);
      newBits  = '0'.repeat(shiftAmount);
    } else {
      shifted = (n >>> shiftAmount) & 0xFF;
      lostBits = clean.slice(8 - shiftAmount);
      newBits  = '0'.repeat(shiftAmount);
    }

    const originalDec   = n;
    const shiftedDec    = shifted;
    const expectedDec   = shiftDir === 'left'
      ? originalDec * Math.pow(2, shiftAmount)
      : Math.floor(originalDec / Math.pow(2, shiftAmount));
    const overflow      = shiftedDec !== expectedDec;

    return {
      original: clean,
      originalDec,
      shifted:  shifted.toString(2).padStart(8, '0'),
      shiftedDec,
      lostBits,
      newBits,
      overflow,
      expectedDec,
    };
  })();

  // ── FILE SIZES ─────────────────────────────────────────────────────────────
  let fsInput = '1';
  let fsUnit: 'B' | 'KB' | 'MB' | 'GB' | 'TB' = 'MB';

  $: fsResult = (() => {
    const n = parseFloat(fsInput);
    if (isNaN(n) || n < 0) return null;
    const units: { label: string; factor: number }[] = [
      { label: 'Bits (b)',      factor: 1/8 },
      { label: 'Bytes (B)',     factor: 1 },
      { label: 'Kilobytes (KB)', factor: 1024 },
      { label: 'Megabytes (MB)', factor: 1024 ** 2 },
      { label: 'Gigabytes (GB)', factor: 1024 ** 3 },
      { label: 'Terabytes (TB)', factor: 1024 ** 4 },
    ];
    const fromFactor = units.find(u => u.label.includes(`(${fsUnit})`))?.factor ?? 1;
    const bytes = n * fromFactor;
    return units.map(u => ({
      label: u.label,
      value: bytes / u.factor,
    }));
  })();

  // ── ASCII ─────────────────────────────────────────────────────────────────
  let asciiChar = 'A';
  let asciiCode = '65';
  let asciiBin  = '01000001';
  let asciiString = '';

  function fromChar(val: string) {
    asciiChar = val.slice(-1) || 'A';
    const code = asciiChar.charCodeAt(0);
    asciiCode = String(code);
    asciiBin  = code.toString(2).padStart(8, '0');
  }

  function fromCode(val: string) {
    asciiCode = val.replace(/\D/g, '');
    const n = parseInt(asciiCode, 10);
    if (!isNaN(n) && n >= 32 && n <= 126) {
      asciiChar = String.fromCharCode(n);
      asciiBin  = n.toString(2).padStart(8, '0');
    } else if (!isNaN(n)) {
      asciiChar = '?';
      asciiBin  = n.toString(2).padStart(8, '0');
    }
  }

  function fromAsciiBin(val: string) {
    asciiBin = val.replace(/[^01]/g, '').slice(0, 8);
    if (asciiBin.length === 8) {
      const n = parseInt(asciiBin, 2);
      asciiCode = String(n);
      asciiChar = n >= 32 && n <= 126 ? String.fromCharCode(n) : '?';
    }
  }

  // Printable ASCII range for table
  const asciiRows = Array.from({ length: 95 }, (_, i) => ({
    dec: i + 32,
    char: String.fromCharCode(i + 32),
    hex: (i + 32).toString(16).toUpperCase().padStart(2, '0'),
    bin: (i + 32).toString(2).padStart(8, '0'),
  }));

  function selectAscii(row: typeof asciiRows[0]) {
    asciiChar = row.char;
    asciiCode = String(row.dec);
    asciiBin  = row.bin;
  }

  $: stringCodes = asciiString.split('').map(c => ({
    char: c,
    dec:  c.charCodeAt(0),
    hex:  c.charCodeAt(0).toString(16).toUpperCase().padStart(2,'0'),
  }));

  // ── helpers ───────────────────────────────────────────────────────────────
  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'bases',     label: 'Base Converter',    emoji: '🔢' },
    { id: 'twos',      label: "Two's Complement",  emoji: '±'  },
    { id: 'shifts',    label: 'Bit Shifts',         emoji: '⇄'  },
    { id: 'filesizes', label: 'File Sizes',          emoji: '💾' },
    { id: 'ascii',     label: 'ASCII',               emoji: '🔤' },
  ];

  function fmtNum(n: number): string {
    if (n < 0.001 && n > 0) return n.toExponential(3);
    if (n >= 1e12) return n.toExponential(3);
    // up to 6 sig figs
    return parseFloat(n.toPrecision(6)).toString();
  }
</script>

<!-- ── Shell ─────────────────────────────────────────────────────────────── -->
<div class="min-h-screen text-slate-200">

  <!-- Tab bar -->
  <div class="border-b border-white/8 overflow-x-auto">
    <div class="flex min-w-max">
      {#each tabs as t}
        <button
          on:click={() => activeTab = t.id}
          class="px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 {
            activeTab === t.id
              ? 'border-[#6c8cff] text-white'
              : 'border-transparent text-slate-400 hover:text-white hover:border-white/20'
          }"
        >
          <span class="mr-1.5">{t.emoji}</span>{t.label}
        </button>
      {/each}
    </div>
  </div>

  <!-- ── BASE CONVERTER ───────────────────────────────────────────────────── -->
  {#if activeTab === 'bases'}
  <div class="p-4 sm:p-6 max-w-2xl mx-auto">
    <h2 class="text-lg font-bold text-white mb-1">Number Base Converter</h2>
    <p class="text-sm text-slate-500 mb-6">Type in any field — the others update instantly.</p>

    <div class="space-y-4">
      <!-- Decimal -->
      <div class="rounded-xl border border-white/10 bg-[var(--bg-card)] p-4">
        <label class="block text-xs font-semibold uppercase tracking-wider text-[#6c8cff] mb-2">
          Denary (Base 10)
        </label>
        <input
          type="number"
          min="0" max="255"
          bind:value={decInput}
          on:input={e => fromDec((e.target as HTMLInputElement).value)}
          placeholder="0 – 255"
          class="w-full bg-transparent text-2xl font-mono font-bold text-white outline-none placeholder-slate-700"
        />
        <p class="mt-1 text-xs text-slate-600">Enter a whole number between 0 and 255</p>
      </div>

      <!-- Binary -->
      <div class="rounded-xl border border-white/10 bg-[var(--bg-card)] p-4">
        <label class="block text-xs font-semibold uppercase tracking-wider text-[#34d399] mb-2">
          Binary (Base 2)
        </label>
        <input
          type="text"
          maxlength="8"
          bind:value={binInput}
          on:input={e => fromBin((e.target as HTMLInputElement).value)}
          placeholder="00000000"
          class="w-full bg-transparent text-2xl font-mono font-bold text-white outline-none placeholder-slate-700 tracking-widest"
        />
        {#if binInput}
          <p class="mt-2 text-xs text-slate-500 font-mono">{binNibbles}</p>
        {/if}
      </div>

      <!-- Hex -->
      <div class="rounded-xl border border-white/10 bg-[var(--bg-card)] p-4">
        <label class="block text-xs font-semibold uppercase tracking-wider text-[#fbbf24] mb-2">
          Hexadecimal (Base 16)
        </label>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-mono text-slate-500">0x</span>
          <input
            type="text"
            maxlength="2"
            bind:value={hexInput}
            on:input={e => fromHex((e.target as HTMLInputElement).value)}
            placeholder="00"
            class="flex-1 bg-transparent text-2xl font-mono font-bold text-white outline-none placeholder-slate-700 uppercase tracking-widest"
          />
        </div>
      </div>
    </div>

    <!-- Bit weight breakdown -->
    {#if binInput}
    <div class="mt-6 rounded-xl border border-white/8 bg-[var(--bg-card)] p-4">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Bit Weight Breakdown</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-center font-mono text-sm">
          <thead>
            <tr>
              {#each bitWeights as { weight }}
                <th class="pb-2 text-xs text-slate-500 font-medium px-1">{weight}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            <tr>
              {#each bitWeights as { bit, contrib }}
                <td class="py-2 px-1">
                  <span class="inline-flex h-8 w-8 items-center justify-center rounded-md text-base font-bold {
                    bit === '1' ? 'bg-[#6c8cff]/20 text-[#6c8cff]' : 'bg-white/5 text-slate-600'
                  }">{bit}</span>
                </td>
              {/each}
            </tr>
            <tr>
              {#each bitWeights as { contrib }}
                <td class="pt-1 text-xs {contrib > 0 ? 'text-[#34d399]' : 'text-slate-700'} px-1">
                  {contrib > 0 ? '+' + contrib : '0'}
                </td>
              {/each}
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-sm text-center">
        <span class="text-slate-500">Sum = </span>
        <span class="font-bold text-white text-base">{decValue}</span>
        <span class="text-slate-500"> (0x{hexInput || '00'})</span>
      </p>
    </div>
    {/if}

    <!-- Quick reference -->
    <div class="mt-6 rounded-xl border border-white/8 bg-[var(--bg-card)] p-4">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Common values</h3>
      <div class="grid grid-cols-3 gap-1 text-xs font-mono">
        {#each [0,1,2,4,8,10,15,16,32,64,100,127,128,200,255] as n}
          <button
            on:click={() => fromDec(String(n))}
            class="rounded px-2 py-1.5 text-left hover:bg-white/5 transition-colors {
              parseInt(decInput) === n ? 'bg-[#6c8cff]/20 text-[#6c8cff]' : 'text-slate-400'
            }"
          >
            {n} = {n.toString(2).padStart(8,'0')}
          </button>
        {/each}
      </div>
    </div>
  </div>
  {/if}

  <!-- ── TWO'S COMPLEMENT ──────────────────────────────────────────────────── -->
  {#if activeTab === 'twos'}
  <div class="p-4 sm:p-6 max-w-2xl mx-auto">
    <h2 class="text-lg font-bold text-white mb-1">Two's Complement</h2>
    <p class="text-sm text-slate-500 mb-6">Represent negative integers in binary using two's complement.</p>

    <div class="flex items-center gap-4 mb-5">
      <span class="text-sm text-slate-400">Bit width:</span>
      {#each [4, 8, 16] as b}
        <button
          on:click={() => { tcBits = b; tcInput = tcInput; }}
          class="rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors {
            tcBits === b
              ? 'bg-[#6c8cff] text-white'
              : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
          }"
        >{b}-bit</button>
      {/each}
    </div>

    <div class="rounded-xl border border-white/10 bg-[var(--bg-card)] p-4 mb-5">
      <label class="block text-xs font-semibold uppercase tracking-wider text-[#6c8cff] mb-2">
        Enter a decimal integer
      </label>
      <input
        type="number"
        bind:value={tcInput}
        on:input={e => tcInput = (e.target as HTMLInputElement).value}
        placeholder={`e.g. -42 or +100`}
        class="w-full bg-transparent text-2xl font-mono font-bold text-white outline-none placeholder-slate-700"
      />
      <p class="mt-1 text-xs text-slate-600">
        Range: {-(Math.pow(2, tcBits-1))} to {Math.pow(2, tcBits-1) - 1}
      </p>
    </div>

    {#if tcResult}
      {#if tcResult.error}
        <div class="rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-400">
          {tcResult.error}
        </div>
      {:else}
        <div class="space-y-3">
          <!-- Binary result -->
          <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4">
            <div class="text-xs text-slate-500 mb-2">{tcBits}-bit two's complement representation</div>
            <div class="font-mono text-2xl font-bold tracking-widest">
              <span class="text-red-400">{tcResult.binary[0]}</span><span class="text-white">{tcResult.binary.slice(1)}</span>
            </div>
            <div class="mt-2 flex gap-4 text-xs text-slate-500">
              <span><span class="text-red-400">■</span> sign bit</span>
              <span class="text-white">{tcResult.value}</span> = <span class="text-[#fbbf24]">0x{(tcResult.unsigned).toString(16).toUpperCase().padStart(tcBits/4,'0')}</span>
            </div>
          </div>

          <!-- How it's calculated -->
          <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4">
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">How it's calculated</div>
            {#if tcResult.value >= 0}
              <p class="text-sm text-slate-300">
                <strong class="text-white">{tcResult.value}</strong> is positive, so the two's complement representation is just the standard binary:
              </p>
              <div class="mt-2 font-mono text-lg text-[#34d399]">{tcResult.binary}</div>
            {:else}
              <ol class="space-y-3 text-sm text-slate-300">
                <li>
                  <span class="font-semibold text-white">1.</span> Start with the positive value:
                  <span class="font-mono text-[#6c8cff]">{Math.abs(tcResult.value).toString(2).padStart(tcBits, '0')}</span>
                </li>
                <li>
                  <span class="font-semibold text-white">2.</span> Flip all bits (one's complement):
                  <span class="font-mono text-[#fbbf24]">
                    {Math.abs(tcResult.value).toString(2).padStart(tcBits,'0').split('').map(b => b === '0' ? '1' : '0').join('')}
                  </span>
                </li>
                <li>
                  <span class="font-semibold text-white">3.</span> Add 1:
                  <span class="font-mono text-[#34d399]">{tcResult.binary}</span>
                  <span class="text-slate-500"> = {tcResult.value}</span>
                </li>
              </ol>
            {/if}
          </div>

          <!-- Exam tip -->
          <div class="rounded-xl border border-[#fbbf24]/20 bg-[#fbbf24]/5 p-4 text-sm">
            <span class="font-semibold text-[#fbbf24]">Exam tip:</span>
            <span class="text-slate-300"> The sign bit has a <em>negative</em> weight. For {tcBits}-bit:
              the sign bit = –{Math.pow(2, tcBits-1)}, then remaining bits add positive values normally.
            </span>
          </div>
        </div>
      {/if}
    {/if}
  </div>
  {/if}

  <!-- ── BIT SHIFTS ────────────────────────────────────────────────────────── -->
  {#if activeTab === 'shifts'}
  <div class="p-4 sm:p-6 max-w-2xl mx-auto">
    <h2 class="text-lg font-bold text-white mb-1">Bit Shifts</h2>
    <p class="text-sm text-slate-500 mb-6">Logical left and right shifts — equivalent to multiplying or dividing by powers of 2.</p>

    <div class="rounded-xl border border-white/10 bg-[var(--bg-card)] p-4 mb-5">
      <label class="block text-xs font-semibold uppercase tracking-wider text-[#6c8cff] mb-2">
        8-bit binary input
      </label>
      <input
        type="text"
        maxlength="8"
        bind:value={shiftInput}
        on:input={e => shiftInput = (e.target as HTMLInputElement).value.replace(/[^01]/g, '')}
        placeholder="01001010"
        class="w-full bg-transparent text-2xl font-mono font-bold text-white outline-none placeholder-slate-700 tracking-widest"
      />
      <p class="mt-1 text-xs text-slate-500">= {parseInt(shiftInput || '0', 2)} in decimal</p>
    </div>

    <div class="flex flex-wrap gap-4 mb-5">
      <!-- Direction -->
      <div>
        <div class="text-xs text-slate-500 mb-2">Direction</div>
        <div class="flex gap-2">
          <button
            on:click={() => shiftDir = 'left'}
            class="rounded-lg px-4 py-2 text-sm font-semibold transition-colors {
              shiftDir === 'left' ? 'bg-[#6c8cff] text-white' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }">← Left shift</button>
          <button
            on:click={() => shiftDir = 'right'}
            class="rounded-lg px-4 py-2 text-sm font-semibold transition-colors {
              shiftDir === 'right' ? 'bg-[#6c8cff] text-white' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }">Right shift →</button>
        </div>
      </div>

      <!-- Amount -->
      <div>
        <div class="text-xs text-slate-500 mb-2">Positions</div>
        <div class="flex gap-2">
          {#each [1, 2, 3, 4] as n}
            <button
              on:click={() => shiftAmount = n}
              class="h-9 w-9 rounded-lg text-sm font-bold transition-colors {
                shiftAmount === n ? 'bg-[#6c8cff] text-white' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              }">{n}</button>
          {/each}
        </div>
      </div>
    </div>

    <!-- Visual shift -->
    <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-5 mb-4">
      <div class="text-xs text-slate-500 mb-4 text-center">
        {shiftDir === 'left' ? '← Shifting left' : 'Shifting right →'} by {shiftAmount} {shiftAmount === 1 ? 'position' : 'positions'}
      </div>

      <!-- Before -->
      <div class="mb-2">
        <span class="text-xs text-slate-600 mr-2">Before:</span>
        <span class="font-mono font-bold text-lg">
          {#if shiftDir === 'left'}
            <span class="text-red-400">{shiftResult.original.slice(0, shiftAmount)}</span><span class="text-white">{shiftResult.original.slice(shiftAmount)}</span>
          {:else}
            <span class="text-white">{shiftResult.original.slice(0, 8 - shiftAmount)}</span><span class="text-red-400">{shiftResult.original.slice(8 - shiftAmount)}</span>
          {/if}
        </span>
        <span class="ml-3 text-sm text-slate-500">= {shiftResult.originalDec}</span>
      </div>

      <!-- Arrow -->
      <div class="text-center text-slate-600 my-2">
        {shiftDir === 'left' ? '↓ shift left ' + shiftAmount : '↓ shift right ' + shiftAmount}
      </div>

      <!-- After -->
      <div>
        <span class="text-xs text-slate-600 mr-2">After: </span>
        <span class="font-mono font-bold text-lg">
          {#if shiftDir === 'left'}
            <span class="text-white">{shiftResult.shifted.slice(0, 8 - shiftAmount)}</span><span class="text-[#34d399]">{shiftResult.shifted.slice(8 - shiftAmount)}</span>
          {:else}
            <span class="text-[#34d399]">{shiftResult.shifted.slice(0, shiftAmount)}</span><span class="text-white">{shiftResult.shifted.slice(shiftAmount)}</span>
          {/if}
        </span>
        <span class="ml-3 text-sm {shiftResult.overflow ? 'text-red-400' : 'text-[#34d399]'} font-semibold">= {shiftResult.shiftedDec}</span>
      </div>

      <div class="mt-4 flex flex-wrap gap-3 text-xs">
        <span class="text-red-400">■ bits lost (overflow)</span>
        <span class="text-[#34d399]">■ new zero bits</span>
      </div>
    </div>

    <!-- Explanation -->
    <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4 text-sm">
      {#if shiftResult.overflow}
        <p class="text-red-400 font-semibold mb-1">⚠ Overflow! Lost significant bits.</p>
        <p class="text-slate-400">
          Shifting left by {shiftAmount} <em>should</em> multiply {shiftResult.originalDec} × {Math.pow(2, shiftAmount)} = {shiftResult.expectedDec},
          but the result ({shiftResult.shiftedDec}) doesn't fit in 8 bits — bits were lost from the left.
        </p>
      {:else}
        <p class="text-slate-300">
          {shiftDir === 'left' ? 'Left' : 'Right'} shift by {shiftAmount} {shiftDir === 'left' ? 'multiplied' : 'divided'}
          <strong class="text-white">{shiftResult.originalDec}</strong> by {Math.pow(2, shiftAmount)} =
          <strong class="text-[#34d399]">{shiftResult.shiftedDec}</strong>.
        </p>
        <p class="mt-1 text-slate-500 text-xs">
          {shiftDir === 'left' ? '×' : '÷'} 2<sup>{shiftAmount}</sup> = {shiftDir === 'left' ? '×' : '÷'} {Math.pow(2, shiftAmount)}
        </p>
      {/if}
    </div>
  </div>
  {/if}

  <!-- ── FILE SIZES ────────────────────────────────────────────────────────── -->
  {#if activeTab === 'filesizes'}
  <div class="p-4 sm:p-6 max-w-2xl mx-auto">
    <h2 class="text-lg font-bold text-white mb-1">File Size Calculator</h2>
    <p class="text-sm text-slate-500 mb-6">Convert between bits, bytes, kilobytes, megabytes, gigabytes and terabytes.</p>

    <div class="rounded-xl border border-white/10 bg-[var(--bg-card)] p-4 mb-5 flex gap-3 items-end">
      <div class="flex-1">
        <label class="block text-xs font-semibold uppercase tracking-wider text-[#6c8cff] mb-2">Value</label>
        <input
          type="number"
          min="0"
          bind:value={fsInput}
          class="w-full bg-transparent text-2xl font-mono font-bold text-white outline-none"
          placeholder="1"
        />
      </div>
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Unit</label>
        <select bind:value={fsUnit} class="rounded-lg border border-white/10 bg-[var(--bg-base)] px-3 py-2 text-sm text-white outline-none">
          <option value="B">Bytes (B)</option>
          <option value="KB">Kilobytes (KB)</option>
          <option value="MB">Megabytes (MB)</option>
          <option value="GB">Gigabytes (GB)</option>
          <option value="TB">Terabytes (TB)</option>
        </select>
      </div>
    </div>

    {#if fsResult}
    <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] overflow-hidden">
      {#each fsResult as row, i}
        <div class="flex items-center justify-between px-5 py-3 {i !== fsResult.length - 1 ? 'border-b border-white/5' : ''}
          {row.label.includes(`(${fsUnit})`) ? 'bg-[#6c8cff]/10' : ''}">
          <span class="text-sm text-slate-400">{row.label}</span>
          <span class="font-mono font-semibold {row.label.includes(`(${fsUnit})`) ? 'text-[#6c8cff]' : 'text-white'}">
            {fmtNum(row.value)}
          </span>
        </div>
      {/each}
    </div>
    {/if}

    <!-- Exam reference -->
    <div class="mt-6 rounded-xl border border-white/8 bg-[var(--bg-card)] p-4">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Exam reference</h3>
      <div class="space-y-2 text-sm font-mono">
        {#each [
          ['1 KB', '= 1,024 B', '= 2¹⁰ bytes'],
          ['1 MB', '= 1,024 KB', '= 2²⁰ bytes'],
          ['1 GB', '= 1,024 MB', '= 2³⁰ bytes'],
          ['1 TB', '= 1,024 GB', '= 2⁴⁰ bytes'],
        ] as [unit, bytes, power]}
          <div class="flex gap-3">
            <span class="text-[#6c8cff] w-12">{unit}</span>
            <span class="text-slate-300">{bytes}</span>
            <span class="text-slate-500">{power}</span>
          </div>
        {/each}
      </div>
      <div class="mt-4 rounded-lg border border-[#fbbf24]/20 bg-[#fbbf24]/5 p-3 text-xs text-slate-400">
        <span class="text-[#fbbf24] font-semibold">Exam tip:</span> Computer storage uses powers of 2 (1 KB = 1,024 bytes),
        not powers of 10 (1 KB ≠ 1,000 bytes). Some questions use 1,000 — read carefully!
      </div>
    </div>

    <!-- Common file sizes -->
    <div class="mt-4 rounded-xl border border-white/8 bg-[var(--bg-card)] p-4">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Common file sizes</h3>
      <div class="grid grid-cols-2 gap-2 text-xs">
        {#each [
          ['Plain text (1 page)', '~2 KB'],
          ['MP3 song (4 min)', '~4 MB'],
          ['JPEG photo', '~3 MB'],
          ['PNG screenshot', '~500 KB'],
          ['HD video (1 hr)', '~4 GB'],
          ['Blu-ray film', '~25 GB'],
          ['GCSE past paper PDF', '~1 MB'],
          ['Word document', '~50 KB'],
        ] as [desc, size]}
          <div class="rounded-lg bg-white/3 px-3 py-2 flex justify-between items-center">
            <span class="text-slate-400">{desc}</span>
            <span class="text-[#6c8cff] font-semibold ml-2">{size}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
  {/if}

  <!-- ── ASCII ─────────────────────────────────────────────────────────────── -->
  {#if activeTab === 'ascii'}
  <div class="p-4 sm:p-6 max-w-2xl mx-auto">
    <h2 class="text-lg font-bold text-white mb-1">ASCII Converter</h2>
    <p class="text-sm text-slate-500 mb-6">Look up any printable ASCII character — decimal code, hex, and binary.</p>

    <div class="grid grid-cols-3 gap-3 mb-6">
      <!-- Character -->
      <div class="rounded-xl border border-white/10 bg-[var(--bg-card)] p-4">
        <label class="block text-xs font-semibold uppercase tracking-wider text-[#6c8cff] mb-2">Character</label>
        <input
          type="text"
          maxlength="1"
          bind:value={asciiChar}
          on:input={e => fromChar((e.target as HTMLInputElement).value)}
          class="w-full bg-transparent text-3xl font-mono font-bold text-white outline-none text-center"
        />
      </div>

      <!-- Decimal -->
      <div class="rounded-xl border border-white/10 bg-[var(--bg-card)] p-4">
        <label class="block text-xs font-semibold uppercase tracking-wider text-[#34d399] mb-2">Decimal</label>
        <input
          type="number"
          min="32" max="126"
          bind:value={asciiCode}
          on:input={e => fromCode((e.target as HTMLInputElement).value)}
          class="w-full bg-transparent text-2xl font-mono font-bold text-white outline-none"
        />
      </div>

      <!-- Binary -->
      <div class="rounded-xl border border-white/10 bg-[var(--bg-card)] p-4">
        <label class="block text-xs font-semibold uppercase tracking-wider text-[#fbbf24] mb-2">Binary</label>
        <input
          type="text"
          maxlength="8"
          bind:value={asciiBin}
          on:input={e => fromAsciiBin((e.target as HTMLInputElement).value)}
          class="w-full bg-transparent text-sm font-mono font-bold text-white outline-none tracking-wider"
        />
      </div>
    </div>

    <!-- Character string helper -->
    <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4 mb-5">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">String to ASCII codes</h3>
      <input
        type="text"
        placeholder="Type a word or sentence..."
        bind:value={asciiString}
        class="w-full rounded-lg border border-white/10 bg-[var(--bg-base)] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none"
      />
      {#if stringCodes.length > 0}
        <div class="mt-3 flex flex-wrap gap-1.5 font-mono text-xs">
          {#each stringCodes as { char, dec, hex }}
            <span class="rounded px-1.5 py-1 bg-white/5 text-slate-300">
              {char === ' ' ? '␣' : char}<span class="text-slate-500 ml-1">{dec}</span>
            </span>
          {/each}
        </div>
        <p class="mt-2 text-xs text-slate-600">Decimal codes shown. Total characters: {stringCodes.length}</p>
      {/if}
    </div>

    <!-- ASCII table -->
    <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] overflow-hidden">
      <div class="px-4 py-3 border-b border-white/8 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Printable ASCII (32–126)
      </div>
      <div class="overflow-x-auto max-h-64 overflow-y-auto">
        <table class="w-full text-xs font-mono">
          <thead class="sticky top-0 bg-[var(--bg-card)] border-b border-white/8">
            <tr>
              <th class="px-3 py-2 text-left text-slate-500">Char</th>
              <th class="px-3 py-2 text-left text-slate-500">Dec</th>
              <th class="px-3 py-2 text-left text-slate-500">Hex</th>
              <th class="px-3 py-2 text-left text-slate-500">Binary</th>
            </tr>
          </thead>
          <tbody>
            {#each asciiRows as row}
              <tr
                on:click={() => selectAscii(row)}
                class="cursor-pointer border-b border-white/4 transition-colors hover:bg-white/5 {
                  parseInt(asciiCode) === row.dec ? 'bg-[#6c8cff]/15' : ''
                }"
              >
                <td class="px-3 py-1.5 font-bold text-white">{row.char === ' ' ? '␣' : row.char}</td>
                <td class="px-3 py-1.5 text-slate-300">{row.dec}</td>
                <td class="px-3 py-1.5 text-[#fbbf24]">{row.hex}</td>
                <td class="px-3 py-1.5 text-slate-400">{row.bin}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  {/if}

</div>
