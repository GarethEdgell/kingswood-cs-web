<script lang="ts">
  import { FLASHCARD_DECKS } from '../../data/flashcardDecks.ts';

  type Card = { term: string; def: string; topic: string };

  const deckNames = Object.keys(FLASHCARD_DECKS) as string[];

  let selectedDeck = deckNames[0];
  let cardIndex = 0;
  let isFlipped = false;
  let ratings: Record<string, 'know' | 'unsure' | 'unknown'> = {};

  $: cards = (FLASHCARD_DECKS as any)[selectedDeck] as Card[];
  $: currentCard = cards[cardIndex];
  $: total = cards.length;
  $: known = Object.values(ratings).filter(r => r === 'know').length;
  $: unsure = Object.values(ratings).filter(r => r === 'unsure').length;
  $: unknown = Object.values(ratings).filter(r => r === 'unknown').length;
  $: progress = total > 0 ? Math.round(((known + unsure + unknown) / total) * 100) : 0;

  function selectDeck(name: string) {
    selectedDeck = name;
    cardIndex = 0;
    isFlipped = false;
    ratings = {};
  }

  function rate(r: 'know' | 'unsure' | 'unknown') {
    ratings[`${selectedDeck}-${cardIndex}`] = r;
    ratings = { ...ratings };
    next();
  }

  function next() {
    if (cardIndex < total - 1) {
      cardIndex++;
      isFlipped = false;
    }
  }

  function prev() {
    if (cardIndex > 0) {
      cardIndex--;
      isFlipped = false;
    }
  }

  function flip() {
    isFlipped = !isFlipped;
  }

  function restart() {
    cardIndex = 0;
    isFlipped = false;
    ratings = {};
  }

  $: currentRating = ratings[`${selectedDeck}-${cardIndex}`];
  $: allRated = Object.keys(ratings).length >= total;
</script>

<div class="mx-auto max-w-4xl px-4 py-8 sm:px-6">

  <!-- Deck selector -->
  <div class="mb-8">
    <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Choose a deck</h2>
    <div class="flex flex-wrap gap-2">
      {#each deckNames as name}
        <button
          on:click={() => selectDeck(name)}
          class="rounded-lg px-4 py-2 text-sm font-medium transition-colors {selectedDeck === name ? 'bg-[#6c8cff] text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}"
        >
          {name}
          <span class="ml-1.5 text-xs opacity-60">({(FLASHCARD_DECKS as any)[name].length})</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Progress bar -->
  <div class="mb-6">
    <div class="mb-2 flex items-center justify-between text-sm">
      <span class="text-slate-400">Card {cardIndex + 1} of {total}</span>
      <div class="flex items-center gap-3 text-xs">
        <span class="text-[#34d399]">✓ {known} know</span>
        <span class="text-[#f59e0b]">~ {unsure} unsure</span>
        <span class="text-[#fb7185]">✗ {unknown} again</span>
      </div>
    </div>
    <div class="h-1.5 w-full rounded-full bg-white/5">
      <div class="h-1.5 rounded-full bg-[#6c8cff] transition-all" style="width: {progress}%"></div>
    </div>
  </div>

  <!-- Flashcard -->
  {#if allRated}
    <div class="rounded-2xl border border-[#34d399]/30 bg-[#34d399]/10 p-12 text-center">
      <div class="text-5xl mb-4">🎉</div>
      <h2 class="text-2xl font-bold text-white">Deck complete!</h2>
      <div class="mt-4 flex justify-center gap-6 text-sm">
        <div class="text-center"><div class="text-2xl font-bold text-[#34d399]">{known}</div><div class="text-slate-400">Know it</div></div>
        <div class="text-center"><div class="text-2xl font-bold text-[#f59e0b]">{unsure}</div><div class="text-slate-400">Unsure</div></div>
        <div class="text-center"><div class="text-2xl font-bold text-[#fb7185]">{unknown}</div><div class="text-slate-400">Need review</div></div>
      </div>
      <button on:click={restart} class="mt-6 rounded-xl bg-[#6c8cff] px-6 py-3 text-sm font-semibold text-white hover:bg-[#4a6cf7] transition-colors">
        Restart deck
      </button>
    </div>
  {:else if currentCard}

    <!-- Card wrapper — click to flip -->
    <div
      class="relative cursor-pointer select-none"
      on:click={flip}
      on:keydown={(e) => e.key === ' ' && flip()}
      role="button"
      tabindex="0"
      aria-label="Click to flip card"
    >
      <div class="min-h-[260px] rounded-2xl border {isFlipped ? 'border-[#6c8cff]/40 bg-gradient-to-b from-[var(--bg-hover)] to-[var(--bg-card)]' : 'border-white/10 bg-[var(--bg-card)]'} p-8 transition-all">
        <div class="flex h-full min-h-[200px] flex-col items-center justify-center text-center">
          {#if !isFlipped}
            <div class="text-xs font-semibold uppercase tracking-wider text-[#6c8cff] mb-4">{currentCard.topic}</div>
            <div class="text-2xl font-bold text-white">{currentCard.term}</div>
            <div class="mt-6 text-sm text-slate-500">Click to reveal definition</div>
          {:else}
            <div class="text-xs font-semibold uppercase tracking-wider text-[#34d399] mb-4">Definition</div>
            <div class="text-lg text-slate-200 leading-relaxed max-w-xl">{currentCard.def}</div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Rating buttons (shown after flip) -->
    {#if isFlipped}
      <div class="mt-4 flex gap-3">
        <button on:click={() => rate('unknown')} class="flex-1 rounded-xl border border-[#fb7185]/30 bg-[#fb7185]/10 py-3 text-sm font-semibold text-[#fb7185] hover:bg-[#fb7185]/20 transition-colors">
          ✗ Don't know
        </button>
        <button on:click={() => rate('unsure')} class="flex-1 rounded-xl border border-[#f59e0b]/30 bg-[#f59e0b]/10 py-3 text-sm font-semibold text-[#f59e0b] hover:bg-[#f59e0b]/20 transition-colors">
          ~ Got it mostly
        </button>
        <button on:click={() => rate('know')} class="flex-1 rounded-xl border border-[#34d399]/30 bg-[#34d399]/10 py-3 text-sm font-semibold text-[#34d399] hover:bg-[#34d399]/20 transition-colors">
          ✓ Know it!
        </button>
      </div>
    {:else}
      <!-- Navigation when not flipped -->
      <div class="mt-4 flex gap-3">
        <button on:click={prev} disabled={cardIndex === 0} class="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          ← Previous
        </button>
        <button on:click={flip} class="flex-[2] rounded-xl bg-[#6c8cff] py-3 text-sm font-semibold text-white hover:bg-[#4a6cf7] transition-colors">
          Flip card (Space)
        </button>
        <button on:click={next} disabled={cardIndex === total - 1} class="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          Next →
        </button>
      </div>
    {/if}

    <!-- Keyboard hint -->
    <p class="mt-3 text-center text-xs text-slate-600">Press Space to flip · ← → to navigate</p>

  {/if}
</div>

<svelte:window on:keydown={(e) => {
  if (e.key === 'ArrowRight') next();
  else if (e.key === 'ArrowLeft') prev();
  else if (e.key === ' ') { e.preventDefault(); flip(); }
}} />
