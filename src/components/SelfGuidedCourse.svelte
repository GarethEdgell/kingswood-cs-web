<script lang="ts">
  import { onMount } from 'svelte';
  import { AI_TRACKS, getAllAIModules, type AIModule, type AITrack } from '../data/digitalFuturesAI';

  // ───────────────────────────────────────────────────────────────────
  // Self-guided Digital Futures & AI course. No gating — students pick any
  // module in any order. Progress (completed + reflections) saved locally,
  // gamified with badges, XP and a per-track certificate.
  // ───────────────────────────────────────────────────────────────────
  const STORAGE_KEY = 'df-ai-course';

  let completed: Record<string, boolean> = {};
  let reflections: Record<string, string> = {};
  let studentName = '';
  let active: AIModule | null = null;
  let activeTrack: AITrack | null = null;
  let celebrate = false;
  let celebrateMsg = '';

  const allModules = getAllAIModules();
  $: totalXP = allModules.reduce((s, m) => s + (completed[m.id] ? m.xp : 0), 0);
  $: doneCount = allModules.filter(m => completed[m.id]).length;

  onMount(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      completed = saved.completed || {};
      reflections = saved.reflections || {};
      studentName = saved.name || '';
    } catch {}
  });
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ completed, reflections, name: studentName })); } catch {} }
  function onName(e: Event) { studentName = (e.target as HTMLInputElement).value; save(); }

  function open(track: AITrack, m: AIModule) {
    activeTrack = track; active = m;
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function close() { active = null; activeTrack = null; }

  function toggleComplete(m: AIModule, track: AITrack) {
    const wasDone = completed[m.id];
    completed = { ...completed, [m.id]: !wasDone };
    save();
    if (!wasDone) {
      const full = track.modules.every(x => completed[x.id]);
      celebrateMsg = full ? `Track complete! You earned the ${track.name} certificate 🏆` : `Badge unlocked: ${m.badge} +${m.xp} XP`;
      celebrate = true;
      setTimeout(() => { celebrate = false; }, 2400);
    }
  }
  function onReflect(id: string, e: Event) {
    reflections = { ...reflections, [id]: (e.target as HTMLTextAreaElement).value };
    save();
  }

  // ── Certificate (drawn on a canvas, downloaded as PNG) ────────────────
  function downloadCertificate(track: AITrack) {
    const name = (studentName || '').trim();
    if (!name) { alert('Pop your name in the box at the top first — it goes on your certificate.'); return; }
    const W = 1200, H = 850, S = 2;
    const cv = document.createElement('canvas');
    cv.width = W * S; cv.height = H * S;
    const ctx = cv.getContext('2d')!;
    ctx.scale(S, S);
    const centre = (t: string, y: number, font: string, fill: string) => {
      ctx.font = font; ctx.fillStyle = fill; ctx.textAlign = 'center'; ctx.fillText(t, W / 2, y);
    };
    // background
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
    // gradient border
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#00d4ff'); g.addColorStop(1, track.colour);
    ctx.strokeStyle = g; ctx.lineWidth = 14; ctx.strokeRect(28, 28, W - 56, H - 56);
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2; ctx.strokeRect(48, 48, W - 96, H - 96);
    // text
    centre('KINGSWOOD COMPUTER SCIENCE', 130, '600 22px Arial', '#64748b');
    centre('Certificate of Completion', 210, '800 56px Georgia, serif', '#0f172a');
    ctx.fillStyle = track.colour; ctx.fillRect(W / 2 - 70, 240, 140, 5);
    centre('This certificate is proudly awarded to', 320, '400 24px Arial', '#475569');
    centre(name, 400, '700 64px Georgia, serif', '#0f172a');
    centre('for completing the', 470, '400 24px Arial', '#475569');
    centre(`Digital Futures & AI — Year ${track.track}: ${track.name}`, 520, '700 32px Arial', track.colour);
    const xp = track.modules.reduce((s, m) => s + m.xp, 0);
    centre(`${track.modules.length} modules completed · ${xp} XP earned`, 565, '400 22px Arial', '#64748b');
    // badges row
    ctx.font = '46px Arial'; ctx.textAlign = 'center';
    const badges = track.modules.map(m => m.badge);
    const gap = 70, startX = W / 2 - ((badges.length - 1) * gap) / 2;
    badges.forEach((b, i) => ctx.fillText(b, startX + i * gap, 670));
    // footer
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    ctx.font = '400 20px Arial'; ctx.fillStyle = '#64748b';
    ctx.textAlign = 'left'; ctx.fillText(date, 90, 770);
    ctx.textAlign = 'right'; ctx.fillText('kingswoodcomputerscience.com', W - 90, 770);
    // seal
    ctx.beginPath(); ctx.arc(W - 150, 250, 52, 0, Math.PI * 2); ctx.fillStyle = track.colour + '22'; ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = track.colour; ctx.stroke();
    ctx.font = '44px Arial'; ctx.textAlign = 'center'; ctx.fillText('🏆', W - 150, 266);

    cv.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Kingswood-${track.name.replace(/\s+/g, '-')}-Certificate.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }
</script>

{#if celebrate}
  <div class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4">
    <div class="text-center cc-pop">
      <div class="text-7xl mb-2">🎉</div>
      <div class="text-2xl font-black" style="color:#fff; text-shadow:0 2px 8px rgba(0,0,0,0.55)">{celebrateMsg}</div>
    </div>
    {#each Array(16) as _, i}
      <span class="cc-confetti" style="left:{4 + i * 6}%; animation-delay:{i * 0.07}s; background:{['#00d4ff','#7c3aed','#00ff94','#f59e0b','#ec4899','#38bdf8'][i % 6]}"></span>
    {/each}
  </div>
{/if}

<div class="mx-auto max-w-4xl">

  {#if !active}
    <!-- ══════════ OVERVIEW ══════════ -->
    <div class="mb-6 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-black text-white">Your progress</h2>
          <p class="text-sm text-slate-400">Work through it at your own pace — any module, any order.</p>
        </div>
        <div class="flex items-center gap-5 text-center">
          <div><div class="text-2xl font-black" style="color:#00ff94">{doneCount}/{allModules.length}</div><div class="text-xs text-slate-500">modules</div></div>
          <div><div class="text-2xl font-black" style="color:#f59e0b">{totalXP}</div><div class="text-xs text-slate-500">XP</div></div>
        </div>
      </div>
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <label for="cert-name" class="text-xs font-semibold text-slate-400">Your name (for your certificate):</label>
        <input id="cert-name" value={studentName} on:input={onName} placeholder="e.g. Alex Taylor" maxlength="40"
          class="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white/30" style="background:var(--input-bg)" />
      </div>
    </div>

    {#each AI_TRACKS as track}
      {@const done = track.modules.filter(m => completed[m.id]).length}
      {@const pct = Math.round((done / track.modules.length) * 100)}
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shrink-0" style="background:{track.colour}22; border:2px solid {track.colour}55">{track.emoji}</div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="text-xl font-black text-white">Year {track.track} · {track.name}</h3>
              {#if pct === 100}<span class="text-xs font-bold px-2 py-0.5 rounded-full" style="background:{track.colour}25; color:{track.colour}">🏆 Certified</span>{/if}
            </div>
            <p class="text-sm text-slate-400">{track.tagline}</p>
          </div>
        </div>
        <div class="h-2 rounded-full bg-white/5 overflow-hidden mb-4">
          <div class="h-2 rounded-full transition-all duration-500" style="width:{pct}%; background:{track.colour}"></div>
        </div>

        {#if pct === 100}
          <div class="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 p-4" style="border-color:{track.colour}55; background:{track.colour}12">
            <p class="text-sm font-bold text-white">🏆 Track complete — you've earned your certificate!</p>
            <button on:click={() => downloadCertificate(track)} class="rounded-lg px-4 py-2 text-sm font-bold text-white transition-all hover:opacity-90" style="background:{track.colour}">🎓 Download certificate</button>
          </div>
        {/if}

        <div class="grid gap-3 sm:grid-cols-2">
          {#each track.modules as m}
            {@const done = completed[m.id]}
            <button on:click={() => open(track, m)} class="text-left rounded-xl border-2 p-4 transition-all hover:scale-[1.02]"
              style="border-color:{done ? '#00ff9455' : m.colour + '44'}; background:{done ? '#00ff9410' : m.colour + '0a'}">
              <div class="flex items-center justify-between mb-1">
                <span class="text-2xl">{m.emoji}</span>
                <span class="text-xs font-bold px-2 py-0.5 rounded" style="background:{m.colour}20; color:{m.colour}">{done ? '✓ Done' : m.time}</span>
              </div>
              <div class="font-black text-white text-sm">{m.num}. {m.title}</div>
              <div class="text-xs text-slate-400 mt-1 leading-relaxed">{m.why}</div>
            </button>
          {/each}
        </div>
      </div>
    {/each}

  {:else}
    <!-- ══════════ MODULE VIEW ══════════ -->
    <button on:click={close} class="text-sm text-slate-400 hover:text-white transition-colors mb-4">← Back to all modules</button>

    <div class="rounded-2xl border-2 p-5 sm:p-7" style="border-color:{active.colour}55; background:{active.colour}0d">
      <div class="flex items-center gap-3 mb-1">
        <span class="text-3xl">{active.emoji}</span>
        <div>
          <span class="text-xs font-bold px-2 py-0.5 rounded-full" style="background:{active.colour}20; color:{active.colour}">Year {active.track} · {activeTrack?.name} · {active.time}</span>
          <h2 class="text-2xl font-black text-white mt-1">{active.title}</h2>
        </div>
      </div>

      <p class="text-slate-200 mt-3 mb-5 leading-relaxed">{active.why}</p>

      <h3 class="text-sm font-black uppercase tracking-wide mb-2" style="color:{active.colour}">📖 The key ideas</h3>
      <ul class="space-y-2 mb-6">
        {#each active.learn as point}
          <li class="flex gap-2.5 text-sm text-slate-300 leading-relaxed"><span style="color:{active.colour}">●</span><span>{@html point}</span></li>
        {/each}
      </ul>

      <div class="rounded-xl border p-4 mb-4" style="border-color:{active.colour}44; background:{active.colour}10">
        <h3 class="font-black text-white mb-1">🎯 Your mission</h3>
        <p class="text-sm text-slate-200 leading-relaxed">{@html active.mission}</p>
      </div>

      <div class="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 mb-4">
        <h3 class="font-black text-amber-300 mb-1">⚡ Level up (optional)</h3>
        <p class="text-sm text-slate-300 leading-relaxed">{active.challenge}</p>
      </div>

      <div class="rounded-xl border border-white/10 bg-white/5 p-4 mb-5">
        <h3 class="font-black text-white mb-1">🤔 Reflect</h3>
        <p class="text-sm text-slate-300 mb-2">{active.reflect}</p>
        <textarea
          value={reflections[active.id] || ''}
          on:input={(e) => onReflect(active.id, e)}
          placeholder="Jot your thoughts here — saved automatically on this device."
          class="w-full h-24 rounded-lg border border-white/10 p-3 text-sm text-white resize-none focus:outline-none focus:border-white/30"
          style="background:var(--input-bg)"></textarea>
      </div>

      {#if active.links && active.links.length}
        <div class="flex flex-wrap gap-2 mb-6">
          {#each active.links as l}
            <a href={l.href} target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener noreferrer' : undefined}
              class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold transition-all hover:bg-white/5"
              style="border-color:{active.colour}55; color:{active.colour}">
              🔗 {l.label}{l.external ? ' ↗' : ' →'}
            </a>
          {/each}
        </div>
      {/if}

      <div class="flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
        <button on:click={() => toggleComplete(active, activeTrack)}
          class="rounded-xl px-5 py-2.5 font-bold transition-all hover:opacity-90"
          style="background:{completed[active.id] ? '#1e293b' : active.colour}; color:{completed[active.id] ? '#94a3b8' : '#fff'}">
          {completed[active.id] ? '✓ Completed — tap to undo' : `Mark complete ${active.badge} +${active.xp} XP`}
        </button>
        <button on:click={close} class="text-sm text-slate-400 hover:text-white">Back to modules</button>
      </div>
    </div>
  {/if}
</div>

<style>
  @keyframes ccpop { 0% { transform: scale(0.4); opacity: 0; } 55% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
  .cc-pop { animation: ccpop 0.5s ease-out; }
  .cc-confetti { position: absolute; top: -12px; width: 11px; height: 16px; border-radius: 2px; animation: ccfall 2.4s linear forwards; }
  @keyframes ccfall { to { transform: translateY(105vh) rotate(600deg); opacity: 0.15; } }
</style>
