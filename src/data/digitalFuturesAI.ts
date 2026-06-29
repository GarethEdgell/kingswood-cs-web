// ═══════════════════════════════════════════════════════════════════════
// Digital Futures & AI — Year 10 & 11 self-guided course
// No lesson time is allocated, so this is designed to be completed
// independently: bite-sized modules in any order, each with a fun hands-on
// "mission", a level-up challenge and a reflection. Progress is gamified
// (badges + XP) to keep self-motivated students going.
// Year 10/11 students are 13+, so they may use AI tools directly — every
// module reinforces responsible, honest use.
// ═══════════════════════════════════════════════════════════════════════

export interface AILink { href: string; label: string; external?: boolean }

export interface AIModule {
  id: string;
  track: 10 | 11;
  num: number;
  title: string;
  emoji: string;
  colour: string;
  time: string;       // estimated self-study time
  badge: string;      // emoji badge earned on completion
  xp: number;
  why: string;        // why it matters (hook)
  learn: string[];    // key points — HTML allowed
  mission: string;    // the fun hands-on task — HTML allowed
  challenge: string;  // optional level-up
  reflect: string;    // reflection prompt
  links?: AILink[];
}

export interface AITrack {
  track: 10 | 11;
  name: string;
  tagline: string;
  colour: string;
  emoji: string;
  modules: AIModule[];
}

export const AI_TRACKS: AITrack[] = [

  // ═══════════════════════════════ YEAR 10 ═══════════════════════════════
  {
    track: 10, name: 'AI Foundations', tagline: 'Understand AI — and use it brilliantly', colour: '#00d4ff', emoji: '🧠',
    modules: [
      {
        id: 'ai10-1', track: 10, num: 1, title: 'What AI Actually Is', emoji: '🧠', colour: '#00d4ff', time: '20 min', badge: '🧠', xp: 20,
        why: 'AI is everywhere — but most people have no idea how it works. Understand it and you can use it well and never be fooled by it.',
        learn: [
          'Tools like Copilot and ChatGPT are <strong>prediction machines</strong>: they guess the next word from patterns in huge amounts of text.',
          'They were <strong>trained</strong> on billions of examples — there is no real understanding or feelings behind the answer.',
          'They can be confidently <strong>wrong</strong> (a "hallucination") because they predict plausible text, not truth.',
          '<strong>Machine learning</strong> = finding patterns in data. <strong>Generative AI</strong> = creating new text or images from those patterns.',
        ],
        mission: 'Open Microsoft Copilot and ask: <em>"Explain how you work in 3 sentences a 14-year-old would understand."</em> Then ask it something you already know well — and something tricky. Did it get anything wrong?',
        challenge: 'Ask the exact same question in two brand-new chats. Do you get different answers? Why might that happen?',
        reflect: 'In your own words, what is an AI actually doing when it answers you?',
        links: [{ href: 'https://copilot.microsoft.com', label: 'Microsoft Copilot', external: true }],
      },
      {
        id: 'ai10-2', track: 10, num: 2, title: 'Prompt Like a Pro', emoji: '💬', colour: '#7c3aed', time: '25 min', badge: '💬', xp: 25,
        why: 'The gap between a useless AI answer and a brilliant one is almost always the prompt. This is a real skill employers now look for.',
        learn: [
          'Give it a <strong>role</strong>: "Act as a GCSE history examiner…"',
          'Give <strong>context</strong>: what you need, who it\'s for, how long, what style.',
          'Show an <strong>example</strong> of what "good" looks like.',
          '<strong>Iterate</strong> — never accept the first answer. Refine it.',
        ],
        mission: 'Take a weak prompt like <em>"tell me about WW2"</em> and rewrite it using role + context + format. Run both and compare the answers side by side.',
        challenge: 'Write a single prompt that makes the AI quiz YOU on a topic — one question at a time — and mark each answer before moving on.',
        reflect: 'What exactly made your improved prompt work better?',
        links: [{ href: 'https://copilot.microsoft.com', label: 'Microsoft Copilot', external: true }],
      },
      {
        id: 'ai10-3', track: 10, num: 3, title: 'Your AI Study Buddy', emoji: '📚', colour: '#00ff94', time: '25 min', badge: '📚', xp: 25,
        why: 'Used well, AI is a patient tutor available 24/7. Used badly, it quietly stops you learning. Here is the difference.',
        learn: [
          'Good moves: "Explain this like I\'m 12", "Quiz me", "Give feedback on my answer", "What did I miss?"',
          'Bad move: "Write my essay" — you learn nothing and it counts as cheating.',
          'AI feedback is a starting point, not the final word — always check it.',
          'You can turn your own notes into flashcards or practice questions in seconds.',
        ],
        mission: 'Paste a topic from your notes and ask Copilot to write 5 exam-style questions. Answer them, then ask it to mark your answers and explain any mistakes.',
        challenge: 'Ask AI to explain a topic you find hard in three different ways — a story, an everyday analogy, and a step-by-step list. Which helped most?',
        reflect: 'Where is the line between using AI to learn and using it to cheat?',
        links: [
          { href: '/revision/flashcards', label: 'Try the Flashcards tool' },
          { href: '/revision/notes', label: 'Revision Notes' },
        ],
      },
      {
        id: 'ai10-4', track: 10, num: 4, title: 'Spot the Fake', emoji: '🕵️', colour: '#f59e0b', time: '25 min', badge: '🕵️', xp: 25,
        why: 'AI can now generate fake images, voices and videos that look real. Spotting them protects you from being fooled or manipulated.',
        learn: [
          'AI images: check hands, teeth, text in the background, jewellery and weird blending.',
          'Use <strong>reverse image search</strong> to find where a picture really came from.',
          'Deepfake videos: look for odd lighting, dodgy lip-sync and unnatural blinking.',
          'If a post makes you instantly furious, that\'s a red flag — verify before you share.',
        ],
        mission: 'Find a "real or AI?" quiz online and test yourself. Write down 3 giveaways that helped you spot the fakes.',
        challenge: 'Take a surprising claim from social media and fact-check it using two independent, reliable sources.',
        reflect: 'Why is "I saw it online" no longer good enough as proof?',
      },
      {
        id: 'ai10-5', track: 10, num: 5, title: 'Your Digital Footprint', emoji: '👣', colour: '#ec4899', time: '20 min', badge: '👣', xp: 20,
        why: 'Everything you post leaves a trail that colleges and employers can find. Your footprint is your reputation.',
        learn: [
          'A footprint = posts, comments, photos, likes and tags — even deleted content can linger.',
          'Colleges, apprenticeships and employers really do look people up.',
          'Privacy settings reduce your trail but never fully erase it.',
          'A good test: "Would I be happy for my future boss — or my nan — to see this?"',
        ],
        mission: 'Search your own name and usernames on a search engine. What comes up? Then open the privacy settings on one account and review them.',
        challenge: 'Audit one social account: remove or hide three things that don\'t represent the person you want to be.',
        reflect: 'What does your current footprint say about you right now?',
      },
      {
        id: 'ai10-6', track: 10, num: 6, title: 'Stay Safe Online', emoji: '🔒', colour: '#38bdf8', time: '25 min', badge: '🔒', xp: 25,
        why: 'Scams are getting smarter — AI now writes convincing phishing messages. A few habits keep you and your family safe.',
        learn: [
          'Use strong, <strong>unique</strong> passwords — a password manager makes this easy.',
          'Turn on <strong>two-factor authentication (2FA)</strong> on important accounts.',
          'Phishing clues: odd sender address, urgency/threats, and links that don\'t match when you hover.',
          'AI scams now fake voices and "friend" messages — verify through a different channel before acting.',
        ],
        mission: 'Turn on 2FA for one important account. Then check whether your email has appeared in a known data breach at <strong>haveibeenpwned.com</strong>.',
        challenge: 'Write a "spot the phishing" checklist: 5 things that reveal a scam message.',
        reflect: 'What is one online-safety habit you will actually change after this?',
        links: [{ href: 'https://haveibeenpwned.com', label: 'Have I Been Pwned (breach check)', external: true }],
      },
      {
        id: 'ai10-7', track: 10, num: 7, title: 'Is AI Fair?', emoji: '⚖️', colour: '#a78bfa', time: '20 min', badge: '⚖️', xp: 20,
        why: 'AI learns from human data — including our biases. It\'s already used in hiring, policing and loans, so fairness really matters.',
        learn: [
          'AI reflects the data it was trained on — biased data produces biased AI.',
          'Real examples: facial recognition working worse for some groups; biased CV-screening tools.',
          '"Garbage in, garbage out" — the output is only as fair as the input.',
          'Humans must stay responsible for decisions an AI is involved in.',
        ],
        mission: 'Ask an AI to "describe a doctor", then "a nurse", then "a criminal". Notice any assumptions it makes. What does that reveal about its training data?',
        challenge: 'Research one real news story about AI bias and summarise in 3 sentences what went wrong.',
        reflect: 'Who should be held responsible when an AI system gets something wrong?',
      },
    ],
  },

  // ═══════════════════════════════ YEAR 11 ═══════════════════════════════
  {
    track: 11, name: 'AI & Your Future', tagline: 'Apply AI, stay honest, get ahead', colour: '#7c3aed', emoji: '🚀',
    modules: [
      {
        id: 'ai11-1', track: 11, num: 1, title: 'AI Without Cheating', emoji: '🎓', colour: '#7c3aed', time: '25 min', badge: '🎓', xp: 25,
        why: 'AI can supercharge your coursework — or get you disqualified. Know the rules and use it like a pro, not a cheat.',
        learn: [
          'Exam boards treat AI-written work handed in as your own as <strong>malpractice</strong>.',
          'Usually fine: brainstorming, explaining ideas, checking understanding, getting feedback.',
          'Always check your own school\'s and exam board\'s current policy.',
          'If you use AI, be able to explain what you did — and acknowledge it where required.',
        ],
        mission: 'Take a piece of your own writing. Ask AI <em>"how could I improve this?"</em> — then YOU make the edits. Note what you changed and why.',
        challenge: 'Write your own 3-rule "AI honour code" that you\'ll stick to this year.',
        reflect: 'How do you get the benefit of AI while keeping the work genuinely yours?',
      },
      {
        id: 'ai11-2', track: 11, num: 2, title: 'Build Something With AI', emoji: '🏗️', colour: '#00d4ff', time: '30 min', badge: '🏗️', xp: 30,
        why: 'You don\'t need to code to create with AI — and building things is the best way to really understand it. It\'s also genuinely fun.',
        learn: [
          'Generative tools can make images, music, slide decks and even simple apps from a description.',
          '"No-code" tools let you automate boring, repetitive tasks.',
          'The real skill is breaking your idea into clear, specific instructions.',
          'Iterate — the first version is never the best one.',
        ],
        mission: 'Pick one: design a poster or logo with an AI image tool, OR get Copilot to draft a 5-slide presentation about a hobby. Save it to your portfolio folder.',
        challenge: 'Improve your creation through 3 rounds of feedback to the AI — and keep all 3 versions to show your progress.',
        reflect: 'What was surprisingly easy, and where did it still need a human (you)?',
        links: [
          { href: '/courses/python-alevel', label: 'Go further: Python Quest' },
          { href: '/tools/cartoon-challenges', label: 'Warm up: Cartoon Challenges' },
        ],
      },
      {
        id: 'ai11-3', track: 11, num: 3, title: "Don't Trust — Verify", emoji: '🔍', colour: '#f59e0b', time: '25 min', badge: '🔍', xp: 25,
        why: 'AI sounds confident even when it\'s completely wrong. The most valuable skill in the AI age is knowing how to check.',
        learn: [
          'A <strong>hallucination</strong> is a confident, made-up answer — fake facts, fake quotes, even fake sources.',
          'Always verify facts, statistics, quotations and references before you trust them.',
          'Cross-check with reliable, independent sources.',
          'Ask the AI for its sources — then actually go and check they exist and say what it claims.',
        ],
        mission: 'Ask AI for "3 famous quotes about science, with their sources". Try to verify each one. How many turned out to be real?',
        challenge: 'Pick a topic you know really well (a hobby) and catch the AI making a confident mistake about it.',
        reflect: 'Why does AI make things up — and why does it sound so sure when it does?',
      },
      {
        id: 'ai11-4', track: 11, num: 4, title: 'AI & Your Career', emoji: '💼', colour: '#00ff94', time: '25 min', badge: '💼', xp: 25,
        why: 'AI is reshaping almost every job. Understanding how means you can aim for the future, not the past.',
        learn: [
          'AI probably won\'t replace people who use AI — but it will out-compete those who don\'t.',
          'Every field — medicine, art, law, sport, trades — is being changed by AI.',
          'The durable skills: creativity, communication, judgement and adaptability.',
          'Whole new jobs are appearing that didn\'t exist five years ago.',
        ],
        mission: 'Pick a career you\'re interested in. Ask AI: <em>"How is AI changing the job of a ___, and what skills will matter most in 10 years?"</em> Then fact-check the key claims.',
        challenge: 'Find one real job advert in that field and list the digital or AI skills it asks for.',
        reflect: 'What is one skill you\'ll start building now to stay ahead?',
        links: [{ href: '/a-level-taster', label: 'Curious about Computer Science? Try the taster' }],
      },
      {
        id: 'ai11-5', track: 11, num: 5, title: 'Data & You', emoji: '📊', colour: '#38bdf8', time: '20 min', badge: '📊', xp: 20,
        why: 'You pay for "free" apps with your data — and that data trains the AI you use. Time to see the deal clearly.',
        learn: [
          'Apps collect huge amounts of data about you: location, habits, contacts and more.',
          'That data is valuable and trains recommendation and AI systems.',
          'You have rights (under GDPR): to access, delete and consent to data use.',
          'At least skim what you\'re agreeing to before you tap "Accept".',
        ],
        mission: 'Open the privacy settings of an app you use every day. What does it collect? Turn off one thing you\'re not comfortable sharing.',
        challenge: 'Skim one app\'s privacy policy and write the 3 most surprising things in plain English.',
        reflect: 'Is the trade — your data in exchange for free apps — actually a fair one?',
      },
      {
        id: 'ai11-6', track: 11, num: 6, title: 'Your Professional Brand', emoji: '🌐', colour: '#ec4899', time: '25 min', badge: '🌐', xp: 25,
        why: 'Soon you\'ll apply for jobs, apprenticeships or university. A clean, professional online presence gives you a real edge.',
        learn: [
          'A professional email address and tidy public profiles genuinely matter.',
          'A simple portfolio shows what you can <em>do</em>, not just what you say.',
          'A profile on a network like LinkedIn isn\'t only for adults — an early one stands out.',
          'Consistency — same name, handle and photo — looks professional.',
        ],
        mission: 'Draft a 3-sentence professional bio: who you are, what you\'re into, and what you\'re aiming for. Save it to your portfolio.',
        challenge: 'Sketch (or build) a one-page portfolio listing 3 things you\'ve made — include something from this course.',
        reflect: 'What impression do you want your online presence to give in three years\' time?',
      },
      {
        id: 'ai11-7', track: 11, num: 7, title: 'Capstone: Make Your Mark', emoji: '🚀', colour: '#7c3aed', time: '40 min', badge: '🏆', xp: 40,
        why: 'Time to put it all together. A finished project you\'re genuinely proud of is worth more than any certificate.',
        learn: [
          'The best projects solve a real problem or share something you actually care about.',
          'Use AI as a tool all the way through — but stay the author of your own work.',
          'Document your process: idea → rough drafts → final version.',
          'Done is better than perfect — finish it.',
        ],
        mission: 'Create ONE finished thing using what you\'ve learned — a guide, a design, a short presentation, a mini-site, or a plan for a club. Use AI responsibly and save it to your portfolio.',
        challenge: 'Share it with someone, get one piece of honest feedback, and improve it once.',
        reflect: 'What are you most proud of — and what would you do next if you had more time?',
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────
export function getAITrack(track: 10 | 11): AITrack {
  return AI_TRACKS.find(t => t.track === track)!;
}
export function getAllAIModules(): AIModule[] {
  return AI_TRACKS.flatMap(t => t.modules);
}
