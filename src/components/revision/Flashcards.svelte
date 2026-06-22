<script lang="ts">
  import { FLASHCARD_DECKS } from '../../data/flashcardDecks.ts';
  import type { FlashcardDeck } from '../../data/flashcardDecks.ts';

  type Card = { term: string; def: string; topic: string };
  type Rating = 'know' | 'unsure' | 'unknown';

  let level: 'gcse' | 'alevel' = 'gcse';

  $: gcseDecks = FLASHCARD_DECKS.filter(d => d.level === 'gcse');
  $: alevelDecks = FLASHCARD_DECKS.filter(d => d.level === 'alevel');
  $: currentDecks = level === 'gcse' ? gcseDecks : alevelDecks;

  let selectedDeckId = FLASHCARD_DECKS.find(d => d.level === 'gcse')?.id ?? '';
  let cardIndex = 0;
  let isFlipped = false;
  let ratings: Record<string, Rating> = {};

  $: selectedDeck = FLASHCARD_DECKS.find(d => d.id === selectedDeckId) as FlashcardDeck | undefined;
  $: cards = selectedDeck?.cards ?? [] as Card[];
  $: currentCard = cards[cardIndex];
  $: total = cards.length;
  $: known = Object.values(ratings).filter(r => r === 'know').length;
  $: unsure = Object.values(ratings).filter(r => r === 'unsure').length;
  $: unknown = Object.values(ratings).filter(r => r === 'unknown').length;
  $: progress = total > 0 ? Math.round(((known + unsure + unknown) / total) * 100) : 0;
  $: allRated = total > 0 && Object.keys(ratings).filter(k => k.startsWith(selectedDeckId)).length >= total;
  $: currentRating = ratings[`${selectedDeckId}-${cardIndex}`];

  function switchLevel(l: 'gcse' | 'alevel') {
    level = l;
    const first = FLASHCARD_DECKS.find(d => d.level === l);
    if (first) selectDeck(first.id);
  }

  function selectDeck(id: string) {
    selectedDeckId = id;
    cardIndex = 0;
    isFlipped = false;
    ratings = {};
  }

  function rate(r: Rating) {
    ratings[`${selectedDeckId}-${cardIndex}`] = r;
    ratings = { ...ratings };
    next();
  }

  function next() {
    if (cardIndex < total - 1) { cardIndex++; isFlipped = false; }
  }

  function prev() {
    if (cardIndex > 0) { cardIndex--; isFlipped = false; }
  }

  function flip() { isFlipped = !isFlipped; }

  function restart() { cardIndex = 0; isFlipped = false; ratings = {}; }
</script>

<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">

  <!-- Level tabs -->
  <div class="flex items-center gap-2 mb-6">
    <div class="flex rounded-xl border border-white/10 bg-black/20 p-1 gap-1">
      <button
        on:click={() => switchLevel('gcse')}
        class="rounded-lg px-5 py-2 text-sm font-semibold transition-colors {level === 'gcse' ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'}"
      >
        GCSE
      </button>
      <button
        on:click={() => switchLevel('alevel')}
        class="rounded-lg px-5 py-2 text-sm font-semibold transition-colors {level === 'alevel' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}"
      >
        A Level
      </button>
    </div>
    <span class="text-slate-500 text-sm">OCR {level === 'gcse' ? 'J277' : 'H446'}</span>
  </div>

  <!-- Deck selector -->
  <div class="mb-8">
    <h2 class="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
      {level === 'gcse' ? 'Component 01' : 'Component 01'}
    </h2>
    <div class="flex flex-wrap gap-2 mb-4">
      {#each currentDecks.filter(d => d.topic.startsWith('1')) as deck}
        <button
          on:click={() => selectDeck(deck.id)}
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors border {selectedDeckId === deck.id
            ? 'text-white border-transparent'
            : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border-white/10'}"
          style={selectedDeckId === deck.id ? `background:${deck.colour}30; border-color:${deck.colour}50; color:${deck.colour}` : ''}
        >
          <span class="text-xs opacity-60 mr-1">{deck.topic}</span>{deck.name}
          <span class="ml-1.5 text-xs opacity-50">({deck.cards.length})</span>
        </button>
      {/each}
    </div>

    <h2 class="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Component 02</h2>
    <div class="flex flex-wrap gap-2">
      {#each currentDecks.filter(d => d.topic.startsWith('2')) as deck}
        <button
          on:click={() => selectDeck(deck.id)}
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors border {selectedDeckId === deck.id
            ? 'text-white border-transparent'
            : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border-white/10'}"
          style={selectedDeckId === deck.id ? `background:${deck.colour}30; border-color:${deck.colour}50; color:${deck.colour}` : ''}
        >
          <span class="text-xs opacity-60 mr-1">{deck.topic}</span>{deck.name}
          <span class="ml-1.5 text-xs opacity-50">({deck.cards.length})</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Progress bar -->
  {#if selectedDeck}
    <div class="mb-6">
      <div class="mb-2 flex items-center justify-between text-sm">
        <span class="text-slate-400">Card {cardIndex + 1} of {total} — <span class="font-semibold text-white">{selectedDeck.name}</span></span>
        <div class="flex items-center gap-3 text-xs">
          <span class="text-green-400">✓ {known} know</span>
          <span class="text-amber-400">~ {unsure} unsure</span>
          <span class="text-red-400">✗ {unknown} again</span>
        </div>
      </div>
      <div class="h-1.5 w-full rounded-full bg-white/5">
        <div class="h-1.5 rounded-full transition-all" style="width:{progress}%; background:{selectedDeck.colour}"></div>
      </div>
    </div>

    <!-- Complete screen -->
    {#if allRated}
      <div class="rounded-2xl border border-green-400/30 bg-green-400/10 p-12 text-center">
        <div class="text-5xl mb-4">🎉</div>
        <h2 class="text-2xl font-bold text-white">Deck complete!</h2>
        <div class="mt-4 flex justify-center gap-8 text-sm">
          <div class="text-center"><div class="text-2xl font-bold text-green-400">{known}</div><div class="text-slate-400">Know it</div></div>
          <div class="text-center"><div class="text-2xl font-bold text-amber-400">{unsure}</div><div class="text-slate-400">Unsure</div></div>
          <div class="text-center"><div class="text-2xl font-bold text-red-400">{unknown}</div><div class="text-slate-400">Need review</div></div>
        </div>
        <button on:click={restart} class="mt-6 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90" style="background:{selectedDeck.colour}">
          Restart deck
        </button>
      </div>

    {:else if currentCard}
      <!-- Flashcard -->
      <div
        class="relative cursor-pointer select-none"
        on:click={flip}
        on:keydown={(e) => e.key === ' ' && flip()}
        role="button"
        tabindex="0"
        aria-label="Click to flip card"
      >
        <div class="min-h-[260px] rounded-2xl border p-8 transition-all {isFlipped ? 'border-white/20 bg-white/8' : 'border-white/10 bg-white/5'}">
          <div class="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
            {#if !isFlipped}
              <div class="text-xs font-bold uppercase tracking-wider mb-4" style="color:{selectedDeck.colour}">{currentCard.topic}</div>
              <div class="text-2xl font-bold text-white">{currentCard.term}</div>
              <div class="mt-6 text-sm text-slate-500">Click to reveal definition</div>
            {:else}
              <div class="text-xs font-bold uppercase tracking-wider text-green-400 mb-4">Definition</div>
              <div class="text-lg text-slate-200 leading-relaxed max-w-xl">{currentCard.def}</div>
            {/if}
          </div>
        </div>
      </div>

      <!-- Buttons -->
      {#if isFlipped}
        <div class="mt-4 flex gap-3">
          <button on:click={() => rate('unknown')} class="flex-1 rounded-xl border border-red-400/30 bg-red-400/10 py-3 text-sm font-semibold text-red-400 hover:bg-red-400/20 transition-colors">
            ✗ Don't know
          </button>
          <button on:click={() => rate('unsure')} class="flex-1 rounded-xl border border-amber-400/30 bg-amber-400/10 py-3 text-sm font-semibold text-amber-400 hover:bg-amber-400/20 transition-colors">
            ~ Mostly got it
          </button>
          <button on:click={() => rate('know')} class="flex-1 rounded-xl border border-green-400/30 bg-green-400/10 py-3 text-sm font-semibold text-green-400 hover:bg-green-400/20 transition-colors">
            ✓ Know it!
          </button>
        </div>
      {:else}
        <div class="mt-4 flex gap-3">
          <button on:click={prev} disabled={cardIndex === 0} class="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            ← Previous
          </button>
          <button on:click={flip} class="flex-[2] rounded-xl py-3 text-sm font-semibold text-white hover:opacity-90 transition-colors" style="background:{selectedDeck.colour}">
            Flip card (Space)
          </button>
          <button on:click={next} disabled={cardIndex === total - 1} class="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            Next →
          </button>
        </div>
      {/if}

      <p class="mt-3 text-center text-xs text-slate-600">Press Space to flip · ← → to navigate</p>
    {/if}
  {/if}
</div>

<svelte:window on:keydown={(e) => {
  if (e.key === 'ArrowRight') next();
  else if (e.key === 'ArrowLeft') prev();
  else if (e.key === ' ') { e.preventDefault(); flip(); }
}} />
