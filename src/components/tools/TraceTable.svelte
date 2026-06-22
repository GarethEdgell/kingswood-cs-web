<script lang="ts">
  // ── Example programs to trace ─────────────────────────────────────────────
  type Example = {
    id: string;
    title: string;
    language: 'Python' | 'Pseudocode';
    code: string;
    variables: string[];
    expectedRows: Record<string, string>[];
  };

  const EXAMPLES: Example[] = [
    {
      id: 'count-loop',
      title: 'Counting loop',
      language: 'Pseudocode',
      code: `count ← 0
total ← 0
WHILE count < 4
   total ← total + (count * 2)
   count ← count + 1
ENDWHILE
OUTPUT total`,
      variables: ['count', 'total'],
      expectedRows: [
        { count: '0', total: '0' },
        { count: '0', total: '0' },
        { count: '1', total: '2' },
        { count: '2', total: '6' },
        { count: '3', total: '12' },
        { count: '4', total: '20' },
      ],
    },
    {
      id: 'fizzbuzz',
      title: 'FizzBuzz (3 iterations)',
      language: 'Python',
      code: `for i in range(1, 4):
    if i % 3 == 0 and i % 5 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)`,
      variables: ['i', 'i%3', 'i%5', 'output'],
      expectedRows: [
        { i: '1', 'i%3': '1', 'i%5': '1', output: '1' },
        { i: '2', 'i%3': '2', 'i%5': '2', output: '2' },
        { i: '3', 'i%3': '0', 'i%5': '3', output: 'Fizz' },
      ],
    },
    {
      id: 'bubble-sort',
      title: 'Bubble sort (1 pass)',
      language: 'Pseudocode',
      code: `array ← [5, 3, 8, 1]
FOR i ← 0 TO 2
   IF array[i] > array[i+1] THEN
      temp ← array[i]
      array[i] ← array[i+1]
      array[i+1] ← temp
   ENDIF
ENDFOR`,
      variables: ['i', 'array[0]', 'array[1]', 'array[2]', 'array[3]', 'temp'],
      expectedRows: [
        { i: '-', 'array[0]': '5', 'array[1]': '3', 'array[2]': '8', 'array[3]': '1', temp: '-' },
        { i: '0', 'array[0]': '3', 'array[1]': '5', 'array[2]': '8', 'array[3]': '1', temp: '5' },
        { i: '1', 'array[0]': '3', 'array[1]': '5', 'array[2]': '8', 'array[3]': '1', temp: '-' },
        { i: '2', 'array[0]': '3', 'array[1]': '5', 'array[2]': '1', 'array[3]': '8', temp: '8' },
      ],
    },
    {
      id: 'custom',
      title: 'Custom (blank)',
      language: 'Pseudocode',
      code: '',
      variables: ['var1', 'var2', 'var3'],
      expectedRows: [],
    },
  ];

  // ── State ──────────────────────────────────────────────────────────────────
  let selectedExampleId = EXAMPLES[0].id;
  let customVars = '';
  let mode: 'practice' | 'check' = 'practice';

  $: example = EXAMPLES.find(e => e.id === selectedExampleId) ?? EXAMPLES[0];
  $: variables = selectedExampleId === 'custom'
    ? customVars.split(',').map(v => v.trim()).filter(Boolean)
    : example.variables;

  // Student table (rows the student fills in)
  let studentRows: Record<string, string>[] = [];

  function resetTable() {
    mode = 'practice';
    studentRows = example.variables.length > 0 ? [makeEmptyRow()] : [makeEmptyRow()];
  }

  $: { selectedExampleId; resetTable(); }

  function makeEmptyRow(): Record<string, string> {
    return Object.fromEntries(variables.map(v => [v, '']));
  }

  function addRow() {
    studentRows = [...studentRows, makeEmptyRow()];
  }

  function removeRow(idx: number) {
    studentRows = studentRows.filter((_, i) => i !== idx);
  }

  function checkAnswers() {
    mode = 'check';
  }

  function cellStatus(rowIdx: number, v: string): 'correct' | 'wrong' | 'empty' | 'unchecked' {
    if (mode !== 'check') return 'unchecked';
    if (example.expectedRows.length === 0) return 'unchecked';
    const expected = example.expectedRows[rowIdx]?.[v];
    if (expected === undefined) return 'unchecked';
    const student = (studentRows[rowIdx]?.[v] ?? '').trim();
    if (!student) return 'empty';
    return student === expected ? 'correct' : 'wrong';
  }

  function cellClass(status: ReturnType<typeof cellStatus>) {
    switch (status) {
      case 'correct': return 'bg-[#34d399]/10 border-[#34d399]/30 text-[#34d399]';
      case 'wrong':   return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'empty':   return 'bg-[#f59e0b]/5 border-[#f59e0b]/20 text-slate-400';
      default:        return 'bg-white/3 border-white/8 text-slate-200';
    }
  }

  $: score = mode === 'check' && example.expectedRows.length > 0
    ? (() => {
        let correct = 0, total = 0;
        example.expectedRows.forEach((row, ri) => {
          variables.forEach(v => {
            if (row[v] !== undefined) {
              total++;
              if ((studentRows[ri]?.[v] ?? '').trim() === row[v]) correct++;
            }
          });
        });
        return { correct, total };
      })()
    : null;
</script>

<div class="space-y-6">

  <!-- Example selector -->
  <div>
    <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Choose program</p>
    <div class="flex flex-wrap gap-2">
      {#each EXAMPLES as ex}
        <button
          on:click={() => selectedExampleId = ex.id}
          class="rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors {
            selectedExampleId === ex.id
              ? 'border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]'
              : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
          }"
        >
          {ex.title}
        </button>
      {/each}
    </div>
  </div>

  <!-- Code + trace table side by side -->
  <div class="grid gap-5 lg:grid-cols-2">

    <!-- Code listing -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {selectedExampleId === 'custom' ? 'Your program' : `Program — ${example.language}`}
        </p>
        <span class="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs text-slate-500">{example.language}</span>
      </div>
      {#if selectedExampleId === 'custom'}
        <textarea
          rows="12"
          placeholder="Paste or type your pseudocode or Python here…"
          class="w-full resize-none rounded-xl border border-white/10 bg-[var(--code-bg)] p-4 font-mono text-sm text-slate-300 outline-none placeholder-slate-700"
        ></textarea>
        <div class="mt-3">
          <label class="mb-1 block text-xs text-slate-500">Variable names (comma separated)</label>
          <input
            bind:value={customVars}
            type="text"
            placeholder="x, y, total, output"
            class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 outline-none placeholder-slate-700"
          />
        </div>
      {:else}
        <pre class="rounded-xl border border-white/10 bg-[var(--code-bg)] p-4 font-mono text-sm text-slate-300 leading-relaxed overflow-x-auto">{example.code}</pre>
      {/if}
    </div>

    <!-- Trace table -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Trace table</p>
        {#if mode === 'check' && score}
          <span class="rounded-full px-2.5 py-0.5 text-xs font-bold {score.correct === score.total ? 'bg-[#34d399]/20 text-[#34d399]' : 'bg-[#f59e0b]/20 text-[#f59e0b]'}">
            {score.correct}/{score.total} correct
          </span>
        {/if}
      </div>

      <div class="overflow-x-auto rounded-xl border border-white/8">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-white/3">
              <th class="px-3 py-2 text-left text-xs font-semibold text-slate-500 w-8">#</th>
              {#each variables as v}
                <th class="px-3 py-2 text-left text-xs font-semibold text-[var(--accent)] whitespace-nowrap">{v}</th>
              {/each}
              <th class="px-2 py-2 w-8"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            {#each studentRows as row, ri}
              <tr>
                <td class="px-3 py-1.5 text-xs text-slate-600">{ri + 1}</td>
                {#each variables as v}
                  {@const status = cellStatus(ri, v)}
                  <td class="px-1 py-1">
                    <input
                      type="text"
                      bind:value={row[v]}
                      disabled={mode === 'check'}
                      placeholder="—"
                      class="w-full min-w-[3rem] rounded border px-2 py-1 font-mono text-xs outline-none transition-colors {cellClass(status)} disabled:cursor-default"
                    />
                  </td>
                {/each}
                <td class="px-1 py-1">
                  {#if mode === 'practice'}
                    <button
                      on:click={() => removeRow(ri)}
                      class="text-slate-700 hover:text-red-400 transition-colors text-xs"
                      title="Remove row"
                    >✕</button>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Table actions -->
      <div class="mt-3 flex flex-wrap gap-2">
        {#if mode === 'practice'}
          <button
            on:click={addRow}
            class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            + Add row
          </button>
          {#if example.expectedRows.length > 0}
            <button
              on:click={checkAnswers}
              class="rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Check answers
            </button>
          {/if}
        {:else}
          <button
            on:click={resetTable}
            class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Try again
          </button>
          {#if example.expectedRows.length > 0}
            <button
              on:click={() => {
                studentRows = example.expectedRows.map(r => ({ ...r }));
                mode = 'check';
              }}
              class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Show answer
            </button>
          {/if}
        {/if}
      </div>

      <!-- Legend -->
      {#if mode === 'check'}
        <div class="mt-3 flex flex-wrap gap-3 text-xs">
          <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded bg-[#34d399]/20 border border-[#34d399]/30"></span><span class="text-slate-400">Correct</span></span>
          <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded bg-red-500/20 border border-red-500/30"></span><span class="text-slate-400">Incorrect</span></span>
          <span class="flex items-center gap-1.5"><span class="h-3 w-3 rounded bg-[#f59e0b]/10 border border-[#f59e0b]/20"></span><span class="text-slate-400">Blank</span></span>
        </div>
      {/if}
    </div>

  </div>

  <!-- Exam tips -->
  <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-5">
    <h3 class="mb-3 text-sm font-semibold text-white">Trace table exam technique</h3>
    <ul class="space-y-1.5 text-sm text-slate-400">
      <li class="flex gap-2"><span class="text-[var(--accent)] shrink-0">•</span>Each row = one iteration or significant change to a variable</li>
      <li class="flex gap-2"><span class="text-[var(--accent)] shrink-0">•</span>Only write a value when it changes — leave cells blank when unchanged</li>
      <li class="flex gap-2"><span class="text-[var(--accent)] shrink-0">•</span>Always include an initial row before any loop runs</li>
      <li class="flex gap-2"><span class="text-[var(--accent)] shrink-0">•</span>Show the OUTPUT column where required — examiners look for this</li>
      <li class="flex gap-2"><span class="text-[var(--accent)] shrink-0">•</span>For boolean conditions, write True/False (or 1/0) as appropriate</li>
    </ul>
  </div>

</div>
