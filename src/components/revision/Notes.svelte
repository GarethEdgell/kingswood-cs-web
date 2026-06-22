<script lang="ts">
  import { SPECS } from '../../data/specs.ts';
  import { NOTES } from '../../data/notes.ts';

  type NoteSection = {
    type: 'text' | 'keyterm' | 'worked' | 'tip' | 'mistake' | 'table';
    heading?: string; body?: string;
    term?: string; def?: string;
    label?: string; code?: string;
    text?: string;
    headers?: string[]; rows?: string[][];
  };

  type Note = {
    title: string; spec: string; level: string;
    sections: NoteSection[];
  };

  let selectedSpec = 'AQA GCSE';
  let selectedNoteId: string | null = null;

  $: specData = (SPECS as any)[selectedSpec];
  $: topics = specData?.topics ?? [];
  $: availableNotes = topics.filter((t: any) => (NOTES as any)[t.id]);
  $: currentNote = (selectedNoteId ? (NOTES as any)[selectedNoteId] ?? null : null) as Note | null;

  $: specGroups = {
    gcse: Object.keys(SPECS).filter(k => (SPECS as any)[k].level === 'gcse'),
    alevel: Object.keys(SPECS).filter(k => !(SPECS as any)[k].level),
  };

  function selectNote(id: string) {
    selectedNoteId = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<div class="flex min-h-screen flex-col">

  <!-- Spec selector -->
  <div class="border-b border-white/8 bg-[var(--bg-card)] px-4 py-3 sm:px-6">
    <div class="mx-auto max-w-7xl">
      <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">GCSE</div>
      <div class="flex flex-wrap gap-2 mb-3">
        {#each specGroups.gcse as spec}
          <button
            on:click={() => { selectedSpec = spec; selectedNoteId = null; }}
            class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {selectedSpec === spec ? 'bg-[#6c8cff] text-white' : 'bg-white/5 text-slate-400 hover:text-white'}"
          >{spec}</button>
        {/each}
      </div>
      <div class="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">A Level</div>
      <div class="flex flex-wrap gap-2">
        {#each specGroups.alevel as spec}
          <button
            on:click={() => { selectedSpec = spec; selectedNoteId = null; }}
            class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {selectedSpec === spec ? 'bg-[#6c8cff] text-white' : 'bg-white/5 text-slate-400 hover:text-white'}"
          >{spec}</button>
        {/each}
      </div>
    </div>
  </div>

  <div class="flex flex-1">

    <!-- Sidebar -->
    <aside class="hidden w-72 shrink-0 border-r border-white/8 bg-[var(--bg-card)] md:block">
      <div class="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto p-4">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">{selectedSpec} Notes</h2>
        {#if availableNotes.length > 0}
          <nav class="space-y-1">
            {#each availableNotes as topic}
              <button
                on:click={() => selectNote(topic.id)}
                class="w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors {selectedNoteId === topic.id ? 'bg-[#6c8cff]/20 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}"
              >
                <span class="mr-1.5 text-xs text-[#6c8cff]">{topic.num}</span>{topic.name}
              </button>
            {/each}
          </nav>
        {:else}
          <p class="text-sm text-slate-500">No notes available for this spec yet.</p>
        {/if}

        {#if topics.length > availableNotes.length}
          <div class="mt-4 rounded-lg border border-white/8 bg-[var(--bg-base)] p-3">
            <p class="text-xs text-slate-500">More topics coming soon.</p>
          </div>
        {/if}
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 px-4 py-6 sm:px-6">
      <div class="mx-auto max-w-3xl">

        {#if !selectedNoteId || !currentNote}
          <!-- Landing -->
          <h1 class="mb-2 text-2xl font-bold text-white">Revision Notes</h1>
          <p class="mb-6 text-slate-400">Select a topic from the sidebar to read structured revision notes.</p>

          <div class="grid gap-3 sm:grid-cols-2 md:hidden">
            {#each availableNotes as topic}
              <button on:click={() => selectNote(topic.id)} class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-4 text-left hover:border-white/20 transition-all">
                <div class="text-xs text-[#6c8cff] mb-1">{topic.num}</div>
                <div class="font-medium text-white">{topic.name}</div>
              </button>
            {/each}
          </div>

          {#if availableNotes.length === 0}
            <div class="rounded-xl border border-white/8 bg-[var(--bg-card)] p-8 text-center">
              <p class="text-slate-400">No notes available for {selectedSpec} yet.</p>
              <p class="mt-2 text-sm text-slate-500">Try AQA A Level or OCR A Level for available notes.</p>
            </div>
          {/if}

        {:else}
          <!-- Note content -->
          <button on:click={() => selectedNoteId = null} class="mb-4 flex items-center gap-1 text-sm text-slate-500 hover:text-white transition-colors">
            ← Back to notes
          </button>

          <h1 class="mb-1 text-2xl font-bold text-white">{currentNote.title}</h1>
          <p class="mb-8 text-sm text-slate-500">{currentNote.spec} · {currentNote.level === 'alevel' ? 'A Level' : 'GCSE'}</p>

          <div class="space-y-5">
            {#each currentNote.sections as section}

              {#if section.type === 'text'}
                <div>
                  {#if section.heading}<h2 class="mb-2 text-lg font-bold text-white">{section.heading}</h2>{/if}
                  <p class="text-slate-300 leading-relaxed">{@html section.body ?? ''}</p>
                </div>

              {:else if section.type === 'keyterm'}
                <div class="rounded-xl border border-[#6c8cff]/20 bg-[#6c8cff]/5 p-4">
                  <div class="mb-1 text-xs font-semibold uppercase tracking-wider text-[#6c8cff]">Key Term</div>
                  <div class="font-semibold text-white">{section.term}</div>
                  <div class="mt-1 text-sm text-slate-300">{section.def}</div>
                </div>

              {:else if section.type === 'worked'}
                <div class="rounded-xl border border-[#34d399]/20 bg-[#34d399]/5 p-4">
                  <div class="mb-2 text-sm font-semibold text-[#34d399]">{section.label}</div>
                  <pre class="whitespace-pre-wrap text-sm text-slate-300 font-mono leading-relaxed">{section.code}</pre>
                </div>

              {:else if section.type === 'tip'}
                <div class="rounded-xl border border-[#f59e0b]/20 bg-[#f59e0b]/5 p-4">
                  <div class="mb-1 text-xs font-semibold uppercase tracking-wider text-[#f59e0b]">💡 Examiner Tip</div>
                  <p class="text-sm text-slate-300">{section.text}</p>
                </div>

              {:else if section.type === 'mistake'}
                <div class="rounded-xl border border-[#fb7185]/20 bg-[#fb7185]/5 p-4">
                  <div class="mb-1 text-xs font-semibold uppercase tracking-wider text-[#fb7185]">⚠️ Common Mistake</div>
                  <p class="text-sm text-slate-300">{section.text}</p>
                </div>

              {:else if section.type === 'table'}
                <div class="overflow-x-auto rounded-xl border border-white/8">
                  <table class="w-full text-sm">
                    <thead class="bg-white/5">
                      <tr>
                        {#each section.headers ?? [] as h}
                          <th class="px-4 py-2.5 text-left font-semibold text-white">{h}</th>
                        {/each}
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                      {#each section.rows ?? [] as row}
                        <tr>
                          {#each row as cell, ci}
                            <td class="px-4 py-2.5 {ci === 0 ? 'font-medium text-white' : 'text-slate-300'}">{@html cell}</td>
                          {/each}
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>

              {/if}
            {/each}
          </div>
        {/if}

      </div>
    </main>
  </div>
</div>
