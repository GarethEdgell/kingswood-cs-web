// Digital Futures — AI & Digital Skills Curriculum
// Year 8 (17 lessons) + Year 9 (17 lessons)

export interface DFTool { name: string; url: string; free: boolean }
export interface DFVocab { term: string; def: string }

export interface DFLesson {
  id: string;
  year: 8 | 9;
  lessonNum: number;
  unitNum: number;
  title: string;
  subtitle: string;
  emoji: string;
  colour: string;
  bigIdea: string;
  objectives: string[];
  vocab: DFVocab[];
  timing: {
    hook: { mins: number; activity: string };
    teach: { mins: number; points: string[] };
    create: { mins: number; task: string; tools: string[] };
    share: { mins: number; activity: string };
  };
  aiAngle: string;
  tools: DFTool[];
  evidence: string;
  homework: { task: string; mins: number };
  differentiation: { support: string; extension: string };
  teacherNote?: string;
}

export interface DFUnit {
  id: number;
  year: 8 | 9;
  title: string;
  subtitle: string;
  colour: string;
  emoji: string;
  lessons: DFLesson[];
}

export const DF_UNITS: DFUnit[] = [

  // ═══════════════════════════════════════════════
  // YEAR 8
  // ═══════════════════════════════════════════════

  {
    id: 1, year: 8,
    title: 'Digital Foundation',
    subtitle: 'Build your digital workspace and professional habits',
    colour: '#00d4ff', emoji: '🏗️',
    lessons: [
      {
        id: 'df-8-1', year: 8, lessonNum: 1, unitNum: 1,
        title: 'Digital Me', subtitle: 'Set up your digital identity and portfolio',
        emoji: '🪪', colour: '#00d4ff',
        bigIdea: 'Everything you create this year lives in one organised place — let\'s build it.',
        objectives: [
          'Create a structured digital portfolio folder with correct naming conventions',
          'Complete a baseline digital skills audit to identify strengths and gaps',
          'Explain why digital organisation matters in school and work',
        ],
        vocab: [
          { term: 'Portfolio', def: 'A curated collection of your best digital work' },
          { term: 'Naming convention', def: 'A consistent system for naming files so they\'re easy to find' },
          { term: 'Cloud storage', def: 'Saving files on internet servers so you can access them anywhere' },
          { term: 'File format', def: 'The type of file, e.g. .docx, .pdf, .png — affects what can open it' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Show two screenshots: one chaotic desktop vs one organised folder. Ask: which person do you want to be? Students vote and explain.' },
          teach: { mins: 10, points: [
            'Why organisation saves hours: searching costs time',
            'Naming convention: Year_LessonNum_Task_FirstName (e.g. Y8_L01_DigitalMe_Aisha)',
            'Folder structure: Digital Futures > Y8 > Unit A, Unit B etc.',
            'Cloud vs local: never lose work again',
            'Export to PDF: the professional standard',
          ]},
          create: { mins: 40, task: 'Students: (1) Create their Digital Futures folder structure in Drive/OneDrive. (2) Complete the baseline skills audit Google Form (linked). (3) Create a "Digital Me" card in PowerPoint Online or Canva — name, three digital skills they already have, three they want to learn. Export to PDF and save in correct folder.', tools: ['OneDrive', 'PowerPoint Online', 'Canva', 'Microsoft Forms'] },
          share: { mins: 5, activity: 'Cold call 3 students: show me your folder on screen. Teacher ticks off checklist.' },
        },
        aiAngle: 'Not introduced yet — this lesson establishes the habits that make AI use safe and traceable.',
        tools: [
          { name: 'OneDrive', url: 'https://onedrive.live.com', free: true },
          { name: 'Canva', url: 'https://canva.com/education', free: true },
        ],
        evidence: 'Folder screenshot + Digital Me card (PDF)',
        homework: { task: 'Find one example of a job advertised near you that mentions "digital skills". Screenshot it and save to your portfolio folder. Write one sentence: which skill on the advert do you want to learn this year?', mins: 15 },
        differentiation: {
          support: 'Pre-made folder template shared via class link — students copy it rather than build from scratch',
          extension: 'Research what a "digital portfolio" looks like for a career they\'re interested in. Note 3 things they\'d want to include by Year 11',
        },
        teacherNote: 'This lesson sets up habits for the whole year. Be strict on naming conventions now — it saves enormous time later. Check every student has cloud storage before lesson ends.',
      },
      {
        id: 'df-8-2', year: 8, lessonNum: 2, unitNum: 1,
        title: 'File Boss', subtitle: 'Master file management and cloud tools',
        emoji: '📁', colour: '#00d4ff',
        bigIdea: 'Professionals don\'t lose files. You won\'t either.',
        objectives: [
          'Organise, rename and export files using correct conventions',
          'Use version history to recover from mistakes',
          'Choose the right file format for different purposes',
        ],
        vocab: [
          { term: 'Version history', def: 'A record of every change made to a file — you can roll back to any point' },
          { term: 'Export', def: 'Saving a file in a different format (e.g. .docx → .pdf)' },
          { term: 'Backup', def: 'A copy of your file in a second location in case the first is lost' },
          { term: 'Compression', def: 'Making a file smaller so it\'s faster to share (e.g. zip files)' },
        ],
        timing: {
          hook: { mins: 5, activity: '"Has anyone ever lost a piece of homework?" Show a dramatic story of a student losing a whole essay. Then show version history saving the day — teacher demo on a Google Doc.' },
          teach: { mins: 10, points: [
            'File types: .docx (editable), .pdf (locked/professional), .jpg/.png (images), .csv (data)',
            'Version history in OneDrive: every autosave is tracked',
            'Renaming files in bulk using the right-click menu',
            'Sharing settings: view, comment, edit — why this matters',
            'Downloading vs. exporting: same outcome, different names in different apps',
          ]},
          create: { mins: 40, task: 'Students are given a "messy starter pack" folder (shared via class link) with 10 badly named files. Task 1: rename and sort them all using correct convention. Task 2: open the document, make a deliberate mistake, then use version history to undo it. Task 3: export one document as PDF and one spreadsheet as CSV. Save everything to their portfolio.', tools: ['OneDrive', 'Word Online', 'Excel Online'] },
          share: { mins: 5, activity: 'Exit ticket: name ONE thing you\'ll do differently with your files from now on. Say it to a partner, partner types it into the shared class Teams.' },
        },
        aiAngle: 'Files and version history are especially important when using AI — you need to track what YOU wrote vs. what AI helped with.',
        tools: [
          { name: 'OneDrive', url: 'https://onedrive.live.com', free: true },
          { name: 'Teams / PowerPoint Online Q&A', url: 'https://teams.microsoft.com', free: true },
        ],
        evidence: 'Reorganised folder with correctly named files + PDF and CSV exports',
        homework: { task: 'Sort the downloads/desktop folder on your home device. Take a before and after screenshot. Save to portfolio.', mins: 15 },
        differentiation: {
          support: 'Starter pack pre-sorted into wrong subfolders so students just need to rename, not sort',
          extension: 'Research what a "version control" system like GitHub does and why developers use it. Write 3 bullet points.',
        },
      },
      {
        id: 'df-8-3', year: 8, lessonNum: 3, unitNum: 1,
        title: 'Email Pro', subtitle: 'Professional digital communication',
        emoji: '📧', colour: '#00d4ff',
        bigIdea: 'How you write online creates an impression — make it a good one.',
        objectives: [
          'Write a formal email using correct structure, tone and etiquette',
          'Identify what makes digital communication professional or unprofessional',
          'Use collaboration tools (comments, shared docs) responsibly',
        ],
        vocab: [
          { term: 'CC / BCC', def: 'CC = others can see who got it; BCC = hidden recipients' },
          { term: 'Tone', def: 'The feeling conveyed by your word choices — formal vs informal' },
          { term: 'Digital etiquette', def: 'The unwritten rules of respectful online communication' },
          { term: 'Attachment', def: 'A file sent alongside an email' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Show two emails asking a teacher for an extension. One is "hey can I have more time plz" and one is professional. Class votes on which gets the extension and WHY.' },
          teach: { mins: 10, points: [
            'Email structure: subject line, greeting, body (context → request → thank you), sign-off',
            'Subject lines: specific and useful ("RE: History homework — extension request" not "hi")',
            'Tone: formal for adults/institutions, semi-formal for classmates',
            'CC vs BCC use cases',
            'Replying vs. Reply All: the #1 office mistake',
            'Word Online collaboration: comments, suggestions mode, @mentions',
          ]},
          create: { mins: 40, task: 'Part 1: Students receive a badly written email and must rewrite it professionally (template provided). Part 2: Compose an original email to a fictional employer requesting work experience, with a CV attached (use a template). Part 3: Open a shared Google Doc, leave two constructive comments and one suggestion using Suggesting mode.', tools: ['Outlook', 'Word Online'] },
          share: { mins: 5, activity: 'Peer review: swap emails with partner. Use the checklist (clear subject? right greeting? professional tone? correct sign-off?) and score 1-4 for each.' },
        },
        aiAngle: 'AI can draft emails — but you need to know what a good email looks like to judge whether the AI got it right.',
        tools: [
          { name: 'Outlook', url: 'https://outlook.live.com', free: true },
          { name: 'Word Online', url: 'https://office.com', free: true },
        ],
        evidence: 'Rewritten email + original professional email + annotated shared document',
        homework: { task: 'Find a real job or apprenticeship that interests you. Write the email you\'d send to request more information. Save to portfolio.', mins: 20 },
        differentiation: {
          support: 'Email frame with sentence starters provided',
          extension: 'Research "email marketing subject lines that work." Apply one technique to their work experience request email and explain why.',
        },
      },
    ],
  },

  {
    id: 2, year: 8,
    title: 'AI Skills',
    subtitle: 'Use AI safely, critically and effectively',
    colour: '#7c3aed', emoji: '🤖',
    lessons: [
      {
        id: 'df-8-4', year: 8, lessonNum: 4, unitNum: 2,
        title: 'Hello AI', subtitle: 'Meet your AI assistant — and its limits',
        emoji: '👋', colour: '#7c3aed',
        bigIdea: 'AI is the most powerful tool of your generation. Learning to use it wisely is a superpower.',
        objectives: [
          'Explain what generative AI is and how it produces responses',
          'Use an AI tool safely without entering personal information',
          'Identify at least two limitations of AI responses',
        ],
        vocab: [
          { term: 'Generative AI', def: 'AI that creates new text, images or code by predicting likely next words/pixels' },
          { term: 'Prompt', def: 'The instruction or question you give to an AI' },
          { term: 'Hallucination', def: 'When AI confidently states something false' },
          { term: 'Training data', def: 'The massive dataset of text the AI learned from' },
          { term: 'Privacy', def: 'Never enter personal details, passwords or sensitive info into AI tools' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Teacher asks an AI a question live — one where it gets something confidently wrong (e.g. a local fact). Class erupts. "This is your new tool. Let\'s learn to use it properly."' },
          teach: { mins: 12, points: [
            'What generative AI is: predicting likely next words from training data',
            'ChatGPT, Copilot, Copilot — same idea, different companies',
            'What AI is good at: brainstorming, drafting, explaining, checking work',
            'What AI is bad at: facts, maths, current events, personal advice',
            'Safety rules: NO real name, school name, passwords, personal problems',
            'Academic integrity: AI assistance must be declared',
          ]},
          create: { mins: 38, task: 'Structured exploration: Students use Copilot (school-safe) to complete 4 mini-challenges. (1) Ask it to explain a topic they find confusing in school. Rate the explanation 1-5. (2) Ask it to write a poem about their hobby — edit it to make it actually theirs. (3) Ask it a local fact they know the answer to — catch it if it\'s wrong. (4) Ask it to help plan a birthday party — note what\'s useful and what\'s wrong. Document everything in their "AI Log" (template provided).', tools: ['Microsoft Copilot', 'AI Log template (Google Doc)'] },
          share: { mins: 5, activity: 'Share the best "AI got it wrong" moment. Build a class list of things AI is bad at.' },
        },
        aiAngle: 'This IS the AI lesson — foundation for all future AI work.',
        tools: [
          { name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com', free: true },
          { name: 'AI Log Template', url: '', free: true },
        ],
        evidence: 'Completed AI Log with 4 mini-challenges and honest evaluations',
        homework: { task: 'Use Copilot to help you revise for one upcoming test. Write an "AI use statement": what did you ask, what was useful, what did you change?', mins: 20 },
        differentiation: {
          support: 'Pre-written prompts on a card — students just need to run them and evaluate',
          extension: 'Research how a large language model works. Draw a diagram explaining it to a Year 7 student.',
        },
        teacherNote: 'Use school-approved AI tools only. Check your school policy before this lesson. If ChatGPT isn\'t approved, Copilot (Google) is generally school-safe. Do not skip the safety rules — they matter.',
      },
      {
        id: 'df-8-5', year: 8, lessonNum: 5, unitNum: 2,
        title: 'Prompt Powerup', subtitle: 'Better prompts = better results',
        emoji: '⚡', colour: '#7c3aed',
        bigIdea: 'The quality of your question determines the quality of the answer.',
        objectives: [
          'Construct prompts using the RCTF framework (Role, Context, Task, Format)',
          'Iterate on prompts to improve AI outputs',
          'Compare weak and strong prompts for the same task',
        ],
        vocab: [
          { term: 'Prompt engineering', def: 'The skill of crafting instructions that get the best results from AI' },
          { term: 'Iteration', def: 'Improving through repeated attempts — each prompt builds on the last' },
          { term: 'Context', def: 'Background information that helps AI understand your situation' },
          { term: 'Output format', def: 'Telling AI how to structure its response (list, table, paragraph, etc.)' },
        ],
        timing: {
          hook: { mins: 5, activity: '"Prompt Battle": Teacher shows two prompts for the same task. Students predict which gets the better result. Teacher reveals both AI responses live.' },
          teach: { mins: 10, points: [
            'RCTF framework: Role ("You are a friendly tutor..."), Context ("I\'m a Year 8 student who..."), Task ("explain X"), Format ("in bullet points under 100 words")',
            'Be specific: vague in = vague out',
            'Iteration: "Make it shorter", "Give me 3 alternatives", "Explain it differently"',
            'System prompts: setting the scene for the whole conversation',
            'Few-shot prompting: give examples of what you want',
          ]},
          create: { mins: 40, task: 'Prompt challenge tournament: students have 5 tasks and must write the best possible prompt for each one, get the AI output, evaluate it (1-5 stars with reason), then iterate once. Tasks: (1) Help me understand photosynthesis, (2) Give me 10 ideas for a school campaign poster, (3) Check my argument in this paragraph [paste their own writing], (4) Create 5 quiz questions on the Roman Empire, (5) Help me plan my revision timetable. Record all prompts and outputs in their AI Log.', tools: ['Microsoft Copilot', 'AI Log'] },
          share: { mins: 5, activity: 'Share the best prompt they wrote today. Class decides what makes it great. Add "great prompt features" to a shared class document.' },
        },
        aiAngle: 'Core AI skill — this lesson alone changes how students use AI forever.',
        tools: [{ name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com', free: true }],
        evidence: 'AI Log with 5 prompt/output/evaluation/iteration cycles',
        homework: { task: 'Write 3 RCTF prompts for something useful in your life (homework help, meal ideas, career research). Rate the outputs and note what you improved.', mins: 20 },
        differentiation: {
          support: 'RCTF prompt frame with sentence starters for each element',
          extension: 'Research "chain-of-thought prompting" and test it on a maths problem. Write up findings.',
        },
      },
      {
        id: 'df-8-6', year: 8, lessonNum: 6, unitNum: 2,
        title: 'Fact-Check Challenge', subtitle: 'Don\'t believe everything AI tells you',
        emoji: '🔍', colour: '#7c3aed',
        bigIdea: 'AI sounds confident even when it\'s wrong. Your job is to check.',
        objectives: [
          'Identify hallucinations and inaccuracies in AI-generated content',
          'Use cross-referencing techniques to verify AI outputs',
          'Explain why AI sometimes produces plausible-sounding false information',
        ],
        vocab: [
          { term: 'Hallucination', def: 'AI confidently stating something false — not lying, just wrong prediction' },
          { term: 'Cross-reference', def: 'Checking a claim against a second reliable, independent source' },
          { term: 'Primary source', def: 'Original evidence (government stats, published research, official websites)' },
          { term: 'Bias', def: 'Systematic skew in AI outputs due to patterns in the training data' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Teacher has planted 5 "AI fact cards" around the room — some true, some hallucinated. Students read and vote true/false. Reveal.' },
          teach: { mins: 10, points: [
            'Why hallucination happens: AI predicts likely words, not verified facts',
            'Types of AI errors: fabricated facts, wrong dates, invented sources, biased summaries',
            'How to verify: BBC, gov.uk, NHS, academic sources, Wikipedia (for leads not facts)',
            'The "too smooth" warning: AI is never uncertain unless you ask it to be',
            'Bias: AI trained on human text inherits human biases',
          ]},
          create: { mins: 40, task: 'Students are given a topic related to another subject (e.g. the causes of WW1, climate change facts, a historical person). They must: (1) Get an AI summary on the topic. (2) Fact-check every single claim — mark correct (✓), wrong (✗), or can\'t verify (?). (3) Find reliable sources for at least 3 claims. (4) Write an improved, verified paragraph. Document in "Fact-Check Worksheet".', tools: ['Microsoft Copilot', 'Google', 'BBC / gov.uk', 'Fact-Check Worksheet'] },
          share: { mins: 5, activity: 'What was the most surprising wrong thing AI said? Build a hall-of-shame list.' },
        },
        aiAngle: 'Critical AI evaluation — the most important skill for AI use.',
        tools: [
          { name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com', free: true },
          { name: 'BBC News', url: 'https://bbc.co.uk/news', free: true },
        ],
        evidence: 'Annotated AI output with verified/corrected claims + improved paragraph',
        homework: { task: 'Ask AI a question about something you\'re studying in another subject. Fact-check 3 of its claims using a reliable source. Write a short verdict.', mins: 20 },
        differentiation: {
          support: 'Pre-highlighted AI text — students only need to check the underlined claims',
          extension: 'Research a high-profile case where AI-generated misinformation caused real harm. Write a 150-word report.',
        },
      },
      {
        id: 'df-8-7', year: 8, lessonNum: 7, unitNum: 2,
        title: 'AI + My Work', subtitle: 'Use AI to improve your work — not replace it',
        emoji: '✍️', colour: '#7c3aed',
        bigIdea: 'The best AI users are the ones who stay in charge of their own thinking.',
        objectives: [
          'Use AI as a feedback tool to improve original work',
          'Write an accurate AI use statement for a piece of work',
          'Explain the difference between AI assistance and academic dishonesty',
        ],
        vocab: [
          { term: 'Academic integrity', def: 'Honest representation of your own work and the help you received' },
          { term: 'AI use statement', def: 'A short declaration of what AI helped with and what you changed' },
          { term: 'Attribution', def: 'Crediting the sources and tools that helped you' },
          { term: 'Human oversight', def: 'The principle that humans must check and take responsibility for AI outputs' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Scenario: A student submits work AI wrote word-for-word. Another uses AI to get feedback, then rewrites it themselves. Who should get the credit? Class debate — 2 minutes.' },
          teach: { mins: 10, points: [
            'The spectrum: from "AI did it" (not OK) to "AI gave me an idea I developed" (fine)',
            'AI as a writing coach: ask for feedback, not for the answer',
            'Useful AI feedback prompts: "What\'s unclear?", "What\'s the weakest argument?", "Suggest a stronger opening"',
            'AI use statement: what you asked, what it said, what YOU changed',
            'Why this matters: skills you outsource, you lose',
          ]},
          create: { mins: 40, task: 'Students take a piece of writing they\'ve done recently (any subject — their own words). (1) Ask AI for feedback using a structured prompt ("Act as a GCSE English teacher — give me 3 specific improvements for this paragraph..."). (2) Read the feedback critically — is it useful? Is anything wrong? (3) Rewrite the paragraph using the useful feedback. (4) Write their AI use statement. Compare before/after.', tools: ['Microsoft Copilot', 'Word Online'] },
          share: { mins: 5, activity: 'Show before and after — who made the biggest genuine improvement? Celebrate the human work, not the AI output.' },
        },
        aiAngle: 'The culmination of Unit B — AI as a tool for human growth.',
        tools: [{ name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com', free: true }],
        evidence: 'Before/after writing comparison + AI use statement',
        homework: { task: 'Use AI to help plan an essay or project for another subject. Write the AI use statement. Bring evidence to next lesson.', mins: 20 },
        differentiation: {
          support: 'Pre-written prompts for the feedback conversation — students just paste their text',
          extension: 'Design a classroom "AI use policy" poster that explains when AI use is and isn\'t appropriate in school.',
        },
        teacherNote: 'This lesson works best if students bring actual homework from another subject. Coordinate with form tutors or other departments if possible.',
      },
    ],
  },

  {
    id: 3, year: 8,
    title: 'Create & Design',
    subtitle: 'Make things people actually want to look at',
    colour: '#ff6b6b', emoji: '🎨',
    lessons: [
      {
        id: 'df-8-8', year: 8, lessonNum: 8, unitNum: 3,
        title: 'Design Basics', subtitle: 'Canva, design principles and your first poster',
        emoji: '🖼️', colour: '#ff6b6b',
        bigIdea: 'Good design isn\'t about talent — it\'s about knowing the rules.',
        objectives: [
          'Apply the four design principles: contrast, repetition, alignment, proximity (CRAP)',
          'Create a professional poster using Canva for a real audience',
          'Evaluate design choices using design vocabulary',
        ],
        vocab: [
          { term: 'Contrast', def: 'Making elements look different to create visual interest and hierarchy' },
          { term: 'Alignment', def: 'Lining up elements so the design looks intentional, not random' },
          { term: 'Proximity', def: 'Grouping related things together so the layout makes sense' },
          { term: 'Repetition', def: 'Using the same colours, fonts and styles throughout for consistency' },
          { term: 'Hierarchy', def: 'Making the most important thing the most visually prominent' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Show 3 pairs of posters — one designed well, one badly. Students vote and explain why in one word. Reveal the design principles that explain each choice.' },
          teach: { mins: 10, points: [
            'CRAP: Contrast, Repetition, Alignment, Proximity — the four laws of design',
            'Typography: max 2 fonts, one for headings one for body',
            'Colour: 60-30-10 rule (dominant, secondary, accent)',
            'Whitespace is your friend — don\'t fill every gap',
            'Canva tour: templates, elements, text, image upload, brand kit, export',
          ]},
          create: { mins: 40, task: 'Create a poster for a school digital wellbeing campaign ("Think Before You Post" or "Screen Smart" — student chooses). Must use CRAP principles, maximum 2 fonts, limited colour palette. Use Canva. Export as PDF and PNG. Write 3 sentences explaining their design choices.', tools: ['Canva'] },
          share: { mins: 5, activity: 'Gallery walk (digital): class views each other\'s posters in a shared PowerPoint Online. Leave one positive and one "even better if" comment on two others.' },
        },
        aiAngle: 'Canva has AI image generation and design suggestion tools — explore them but always make the final creative decisions yourself.',
        tools: [{ name: 'Canva for Education', url: 'https://www.canva.com/education/', free: true }],
        evidence: 'Exported poster (PDF + PNG) + design rationale (3 sentences)',
        homework: { task: 'Find a poster or advert you think is well-designed. Screenshot it. Annotate it (on Canva or PowerPoint Online) identifying CRAP principles in action.', mins: 20 },
        differentiation: {
          support: 'Pre-made Canva template with guidance boxes to fill in',
          extension: 'Redesign a real school notice that is currently badly designed. Get permission and actually put it up.',
        },
      },
      {
        id: 'df-8-9', year: 8, lessonNum: 9, unitNum: 3,
        title: 'Slide Mastery', subtitle: 'Presentations people actually watch',
        emoji: '📊', colour: '#ff6b6b',
        bigIdea: 'Death by PowerPoint is real. Be the person who fixes it.',
        objectives: [
          'Apply the "one idea per slide" and "less text = more impact" principles',
          'Create a 5-slide presentation that communicates clearly for a specific audience',
          'Give and receive structured peer feedback on presentation design',
        ],
        vocab: [
          { term: 'Visual hierarchy', def: 'Ordering elements so the eye knows where to look first' },
          { term: 'Speaker notes', def: 'Prompts for the presenter — never read these aloud' },
          { term: 'Slide economy', def: 'Using only as many slides and words as necessary' },
          { term: 'Audience', def: 'Who you\'re communicating to — it changes every design decision' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Show a deliberately terrible presentation (wall of text, WordArt, clip art, 14 bullet points per slide). Class picks out everything wrong. Then show the same information beautifully designed. Reaction.' },
          teach: { mins: 10, points: [
            'One idea, one slide — ruthless editing',
            'Images do what words can\'t: use them instead of text where possible',
            'Fonts: 28pt minimum body, 40pt+ heading',
            'The "squint test": can you tell what\'s most important when you squint?',
            'Speaker notes: everything you say that isn\'t on screen',
            'Presenting: eye contact, pause, don\'t read the slide',
          ]},
          create: { mins: 40, task: 'Students are given a text-heavy "wall of information" document about a topic they choose (sports, music, a country, a career). They must transform it into a 5-slide visual presentation for a Year 7 audience. Maximum 10 words per slide. Must include images, one data visualisation and speaker notes for each slide. Use PowerPoint Online or Canva Presentations.', tools: ['PowerPoint Online', 'Canva', 'Unsplash (free images)'] },
          share: { mins: 5, activity: 'Quick fire — each student has 30 seconds to present their opening slide only. Peer votes: clear? Visual? Would you want to see the rest?' },
        },
        aiAngle: 'Use AI to generate speaker notes and suggest one key statistic or image idea per slide — but design the slides yourself.',
        tools: [
          { name: 'PowerPoint Online', url: 'https://office.com', free: true },
          { name: 'Unsplash', url: 'https://unsplash.com', free: true },
        ],
        evidence: '5-slide presentation + speaker notes (exported PDF)',
        homework: { task: 'Watch one TED Talk (under 10 minutes). Note 3 things the speaker does that makes it engaging. Bring notes to next lesson.', mins: 20 },
        differentiation: {
          support: 'Slide skeleton with layout guides pre-set — students fill in the visual content',
          extension: 'Record a 2-minute video of themselves presenting their slides. Review it and identify one improvement.',
        },
      },
      {
        id: 'df-8-10', year: 8, lessonNum: 10, unitNum: 3,
        title: 'Spreadsheet Start', subtitle: 'Make data work for you',
        emoji: '📈', colour: '#ff6b6b',
        bigIdea: 'Spreadsheets run the world. Learn them and you\'re ahead of most adults.',
        objectives: [
          'Enter data and use SUM, AVERAGE, MIN, MAX formulas accurately',
          'Create a chart that correctly represents data',
          'Explain why chart type choice matters',
        ],
        vocab: [
          { term: 'Formula', def: 'A calculation in a spreadsheet, always starting with =' },
          { term: 'Cell reference', def: 'The address of a cell, e.g. B3 — used in formulas' },
          { term: 'Function', def: 'A pre-built formula like SUM() or AVERAGE()' },
          { term: 'Chart', def: 'A visual representation of data — type matters' },
        ],
        timing: {
          hook: { mins: 5, activity: '"Would you rather earn £50,000 as a flat salary, or start at £30,000 with a 5% raise each year?" Students guess — then teacher shows a spreadsheet model that answers it definitively.' },
          teach: { mins: 10, points: [
            'Spreadsheet grid: rows, columns, cells — the foundation',
            'Data types: text vs numbers — formulas only work on numbers',
            'Key formulas: =SUM(), =AVERAGE(), =MIN(), =MAX(), =COUNT()',
            'Cell references: why B3+C3 is better than 5+7',
            'Charts: bar chart (comparing categories), line chart (change over time), pie chart (proportions — use sparingly)',
          ]},
          create: { mins: 40, task: 'Students receive a "Fictional Class Survey" dataset (pre-made). Task: (1) Calculate total, average, min and max for several columns. (2) Create a bar chart comparing results across groups. (3) Create a line chart showing a trend. (4) Spot the "misleading chart" in the example pack and explain what\'s wrong. (5) Bonus: build a simple personal budget (income vs. expenses, using their own made-up figures).', tools: ['Excel Online'] },
          share: { mins: 5, activity: 'Which chart type is most often misused? Class votes and explains.' },
        },
        aiAngle: 'Ask AI to explain what a formula does, suggest a formula for a task, or explain why a chart might be misleading — then verify it actually works.',
        tools: [{ name: 'Excel Online', url: 'https://office.com', free: true }],
        evidence: 'Completed survey analysis spreadsheet with formulas and 2 charts',
        homework: { task: 'Find a real chart in a newspaper or on a website. Screenshot it. Is it honest? Does it mislead? Write 3 sentences evaluating it.', mins: 15 },
        differentiation: {
          support: 'Formula reference card with syntax and examples',
          extension: 'Build a spreadsheet that could actually be useful (e.g. a monthly budget, a sports league table, a homework tracker).',
        },
      },
      {
        id: 'df-8-11', year: 8, lessonNum: 11, unitNum: 3,
        title: 'Search Smart & Copyright', subtitle: 'Research skills and legal image use',
        emoji: '🔎', colour: '#ff6b6b',
        bigIdea: 'Not everything online is true, free or yours to use.',
        objectives: [
          'Use advanced search techniques to find reliable, specific information',
          'Identify Creative Commons licences and use images legally',
          'Evaluate the credibility of a source using SIFT',
        ],
        vocab: [
          { term: 'SIFT', def: 'Stop, Investigate the source, Find better coverage, Trace claims' },
          { term: 'Creative Commons', def: 'A licence system allowing creators to share work with defined conditions' },
          { term: 'Copyright', def: 'Legal protection for creators — using without permission can be illegal' },
          { term: 'Attribution', def: 'Crediting where an image or text came from' },
          { term: 'Public domain', def: 'Work with no copyright restrictions — free to use' },
        ],
        timing: {
          hook: { mins: 5, activity: '"Find me a photo of the Prime Minister in 30 seconds — but only one you can legally use in a school poster." Students scramble. Most get it wrong. Reveal the correct approach.' },
          teach: { mins: 10, points: [
            'Advanced search: "exact phrase", site:bbc.co.uk, filetype:pdf, date filters',
            'SIFT method: 4 steps to evaluate any source',
            'Creative Commons: CC0 (free), CC BY (credit required), CC BY-SA (share alike), CC BY-NC (non-commercial)',
            'Where to find free images: Unsplash, Pexels, Pixabay, Bing (filter: Creative Commons)',
            'Attribution format: Image by [name] via [site] (CC BY)',
          ]},
          create: { mins: 40, task: 'Students receive a research brief about a current technology issue (e.g. AI in healthcare, electric vehicles, social media and mental health). They must: (1) Find 3 sources using SIFT and rate each for credibility. (2) Find 2 legally usable images with correct attribution. (3) Summarise their findings in a structured Google Doc with sources cited. (4) Add their CC-attributed images with captions.', tools: ['Google', 'Unsplash', 'Pexels', 'Word Online'] },
          share: { mins: 5, activity: 'Quick share: what was the most suspicious source you found? What gave it away?' },
        },
        aiAngle: 'AI can\'t tell you if images are copyright-free. Always check manually. AI outputs also don\'t have reliable sources — they need to be verified using SIFT.',
        tools: [
          { name: 'Unsplash', url: 'https://unsplash.com', free: true },
          { name: 'Pexels', url: 'https://pexels.com', free: true },
        ],
        evidence: 'Research document with 3 evaluated sources and 2 attributed images',
        homework: { task: 'Find one example of copyright infringement in the news (a company using someone\'s image/music without permission). Write a short summary of what happened and what the consequence was.', mins: 15 },
        differentiation: {
          support: 'Pre-selected sources — students evaluate rather than find',
          extension: 'Research the difference between CC licences and create a one-page visual guide for the class.',
        },
      },
    ],
  },

  {
    id: 4, year: 8,
    title: 'Safe & Smart Online',
    subtitle: 'Protect yourself and think critically',
    colour: '#f59e0b', emoji: '🛡️',
    lessons: [
      {
        id: 'df-8-12', year: 8, lessonNum: 12, unitNum: 4,
        title: 'Stay Safe', subtitle: 'Passwords, phishing and your privacy settings',
        emoji: '🔐', colour: '#f59e0b',
        bigIdea: 'One weak password or one clicked phishing link can cause real damage.',
        objectives: [
          'Create and evaluate strong passwords using passphrase technique',
          'Identify phishing attempts using at least 5 warning signs',
          'Explain how multi-factor authentication (MFA) works and why it matters',
        ],
        vocab: [
          { term: 'Passphrase', def: 'A long password made of random words (e.g. "purple-elephant-taxi-moon")' },
          { term: 'MFA / 2FA', def: 'Multi-factor authentication — a second check beyond the password' },
          { term: 'Phishing', def: 'Fake messages designed to trick you into revealing credentials' },
          { term: 'Social engineering', def: 'Manipulating people (not systems) to gain access' },
          { term: 'Data breach', def: 'When hackers access and steal stored personal data' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Live demo: teacher goes to haveibeenpwned.com and enters a generic example email. Show students that millions of passwords are already known. "This is what you\'re up against."' },
          teach: { mins: 10, points: [
            'Password strength: length beats complexity — 4 random words = very strong',
            'Password manager: one strong master password manages everything else',
            'MFA: something you know + something you have/are',
            'Phishing tells: urgency, generic greeting, wrong URL, spelling errors, unexpected attachment',
            'Privacy settings: location, who sees your posts, app permissions',
          ]},
          create: { mins: 40, task: 'Students work through a phishing detection challenge: given 6 emails/messages, annotate each one identifying legitimate vs phishing, with evidence. Then they create a "Phishing Warning Card" for a younger sibling (visual, clear, useful). Finally, they audit their own social media privacy settings (or a fictional account) using a checklist.', tools: ['Word Online', 'Canva'] },
          share: { mins: 5, activity: 'Display the best phishing warning cards. What made them effective for the audience?' },
        },
        aiAngle: 'AI is increasingly used to make phishing emails more convincing — grammatically perfect, personalised. The red flags are getting harder to spot.',
        tools: [
          { name: 'Have I Been Pwned', url: 'https://haveibeenpwned.com', free: true },
          { name: 'Microsoft Password Manager', url: 'https://passwordmanager.microsoft.com', free: true },
        ],
        evidence: 'Annotated phishing examples + phishing warning card (exported)',
        homework: { task: 'Audit one account you use. Change the password to a passphrase. Enable MFA if possible. Write a short note: what did you change and why?', mins: 15 },
        differentiation: {
          support: 'Phishing checklist with explicit clues to look for',
          extension: 'Research the most expensive cyberattack in UK history. What was the human error that allowed it? What could have prevented it?',
        },
      },
      {
        id: 'df-8-13', year: 8, lessonNum: 13, unitNum: 4,
        title: 'Your Digital Footprint', subtitle: 'Your online identity — who sees it, forever',
        emoji: '👣', colour: '#f59e0b',
        bigIdea: 'Everything you post online can outlive you. Your digital footprint is part of your reputation.',
        objectives: [
          'Describe what a digital footprint includes and who can access it',
          'Evaluate scenarios using responsible sharing criteria',
          'Create a "digital identity guide" for a younger student',
        ],
        vocab: [
          { term: 'Digital footprint', def: 'The trail of data left by everything you do online' },
          { term: 'Permanence', def: 'The idea that deleted posts may still exist in screenshots, caches and backups' },
          { term: 'Reputation', def: 'How others perceive you — increasingly shaped by your online presence' },
          { term: 'Active vs passive data', def: 'Data you choose to share (posts) vs data collected without you realising (location, clicks)' },
        ],
        timing: {
          hook: { mins: 5, activity: '"Imagine a future employer Googles your name. What would they find?" Students jot privately. Then discuss what controls that and what doesn\'t.' },
          teach: { mins: 10, points: [
            'Active footprint: posts, photos, comments, likes, follows',
            'Passive footprint: location data, cookies, search history, purchase patterns',
            'Who has access: platforms, employers, universities, parents, police',
            'Permanence: screenshots exist even after deletion',
            'The 5-year rule: would you be proud of this post in 5 years?',
          ]},
          create: { mins: 40, task: 'Part 1: Scenario cards — groups evaluate 10 online behaviours and rank them risk level 1-5 with justification. Part 2: Students design a "Digital Identity Guide" aimed at a Year 7 student starting secondary school — in PowerPoint Online, Canva or as a document. It must include: 3 do\'s, 3 don\'ts, what a digital footprint is, and one piece of advice they wish they\'d known.', tools: ['Canva', 'PowerPoint Online'] },
          share: { mins: 5, activity: 'Share one genuine piece of advice. Compile into a class "Digital Survival Guide" shared document.' },
        },
        aiAngle: 'AI tools also collect your data. Be aware of what you share in prompts — don\'t include personal details, medical info or anything private.',
        tools: [{ name: 'Canva', url: 'https://canva.com/education', free: true }],
        evidence: 'Completed scenario ranking + Digital Identity Guide (exported)',
        homework: { task: 'Google your own name. What appears? Write 3 sentences: what you found, whether it represents you well, and what you\'d want to change.', mins: 15 },
        differentiation: {
          support: 'Pre-written scenarios with hint cards',
          extension: 'Research the "right to be forgotten" ruling in the EU. Write a paragraph arguing for or against it.',
        },
      },
      {
        id: 'df-8-14', year: 8, lessonNum: 14, unitNum: 4,
        title: 'Misinformation Lab', subtitle: 'Spot fake news and algorithm bubbles',
        emoji: '📰', colour: '#f59e0b',
        bigIdea: 'The internet shows you what keeps you scrolling — not necessarily what\'s true.',
        objectives: [
          'Distinguish between misinformation, disinformation and satire',
          'Explain how social media algorithms create echo chambers',
          'Apply the SIFT method to evaluate a viral claim',
        ],
        vocab: [
          { term: 'Misinformation', def: 'False information shared without intent to deceive' },
          { term: 'Disinformation', def: 'False information shared deliberately to mislead' },
          { term: 'Algorithm', def: 'A set of rules a platform uses to decide what content to show you' },
          { term: 'Echo chamber', def: 'An environment where you only encounter opinions that match your own' },
          { term: 'Confirmation bias', def: 'The tendency to believe information that matches what you already think' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Show 3 viral social media posts — one true, one false, one satire. Students vote on each. Most get at least one wrong. Why?' },
          teach: { mins: 10, points: [
            'Misinformation vs disinformation vs satire: intent matters',
            'How platforms work: engagement = more reach (outrage travels fastest)',
            'Echo chambers: algorithms show you more of what you click on',
            'How to break the bubble: follow diverse sources, check before sharing',
            'SIFT: Stop → Investigate → Find better coverage → Trace claims',
          ]},
          create: { mins: 40, task: 'Fact-checking newsroom: students are editors at a fictional fact-checking agency. They receive 8 claims (supplied — mix of real viral posts and fabricated ones). For each: classify (true/false/misleading/satire), apply SIFT, write a one-sentence verdict with evidence. Then create a short "How to Spot Fake News" Instagram-style carousel (3 slides in Canva).', tools: ['Google', 'Full Fact (fullfact.org)', 'Canva'] },
          share: { mins: 5, activity: 'Which claim was hardest to verify? Why? What does that tell us about how misinformation works?' },
        },
        aiAngle: 'AI-generated text and deepfakes are making misinformation harder than ever to detect. Even fact-checkers struggle.',
        tools: [
          { name: 'Full Fact', url: 'https://fullfact.org', free: true },
          { name: 'Snopes', url: 'https://snopes.com', free: true },
        ],
        evidence: 'Completed fact-check log + Canva carousel (exported)',
        homework: { task: 'Find a claim that went viral on social media and turned out to be false. Research it using Full Fact or Snopes. Write a short report: what was claimed, what was actually true, and why people believed it.', mins: 20 },
        differentiation: {
          support: 'Claims are pre-highlighted with the key statement to check',
          extension: 'Research how governments and organisations use social media strategically to influence public opinion. Is this misinformation?',
        },
      },
    ],
  },

  {
    id: 5, year: 8,
    title: 'Final Project',
    subtitle: 'Apply everything — create something real',
    colour: '#10b981', emoji: '🚀',
    lessons: [
      {
        id: 'df-8-15', year: 8, lessonNum: 15, unitNum: 5,
        title: 'Project Launch', subtitle: 'Choose your challenge and make a plan',
        emoji: '🎯', colour: '#10b981',
        bigIdea: 'Real projects start with a clear brief and a realistic plan.',
        objectives: [
          'Choose a final project from the available briefs based on their strengths',
          'Analyse a project brief and produce a success criteria checklist',
          'Create a realistic timeline for completing the project in 2 lessons',
        ],
        vocab: [
          { term: 'Brief', def: 'A description of what a client or task requires' },
          { term: 'Success criteria', def: 'Specific, measurable standards the finished work must meet' },
          { term: 'Audience', def: 'Who the product is for — determines every design decision' },
          { term: 'Asset list', def: 'All the files, images and resources needed before building begins' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Reveal the 4 final project options with examples of finished work from previous students (or teacher-made examples). Build anticipation.' },
          teach: { mins: 10, points: [
            'Project options: (A) Digital Wellbeing Campaign Pack (poster + slides + tip card), (B) AI Guide for Parents (document + explainer slides), (C) School Tech Report (spreadsheet analysis + data dashboard), (D) Fact-Check Website/Doc (research + source evaluation guide)',
            'How to choose: play to your strengths, challenge yourself, think about audience',
            'Project planning: brief analysis → success criteria → asset list → timeline',
            'Time management: 2 build lessons = 80 minutes — plan carefully',
          ]},
          create: { mins: 40, task: 'Students choose their project and complete a project plan template: (1) Brief summary in their own words. (2) Target audience (specific — not just "everyone"). (3) Success criteria (5 specific, measurable statements). (4) Asset list — what do they need to make/find before starting? (5) Two-session timeline — what will they complete in each session? Teacher approves the plan before they proceed.', tools: ['Word Online'] },
          share: { mins: 5, activity: 'Each student pitches their project in 30 seconds: what, who for, and why they chose it.' },
        },
        aiAngle: 'Use AI to help refine your brief — ask it "What would make this project excellent? What am I missing from my success criteria?"',
        tools: [{ name: 'Word Online', url: 'https://office.com', free: true }],
        evidence: 'Approved project plan with brief, audience, success criteria, asset list, timeline',
        homework: { task: 'Gather any assets you need for your project. Find images (credited), data, or draft text. Save everything to your project folder before next lesson.', mins: 30 },
        differentiation: {
          support: 'Simplified project option with more structure and fewer decisions',
          extension: 'Add a 30-second "pitch video" to their deliverables — record a video explaining the project',
        },
        teacherNote: 'Don\'t let students start building in this lesson — the plan must be solid first. Approve every plan before Lesson 16.',
      },
      {
        id: 'df-8-16', year: 8, lessonNum: 16, unitNum: 5,
        title: 'Build Day', subtitle: 'Create your final project',
        emoji: '🔨', colour: '#10b981',
        bigIdea: 'Now it\'s real. Make something you\'re proud of.',
        objectives: [
          'Work independently to create a high-quality digital product against a brief',
          'Use AI appropriately as a planning and feedback tool (not a builder)',
          'Manage time to have a complete draft ready for submission',
        ],
        vocab: [
          { term: 'Draft', def: 'A working version that will be refined before the final version' },
          { term: 'Iteration', def: 'Improving through repeated rounds of feedback and changes' },
          { term: 'Export', def: 'Saving in the final format (usually PDF) for submission' },
        ],
        timing: {
          hook: { mins: 3, activity: 'Students review their project plan from Lesson 15. Teacher sets the timer: "80 minutes. Go."' },
          teach: { mins: 2, points: ['Quick quality check: does your work meet each success criteria? Review halfway through.'] },
          create: { mins: 50, task: 'Students build their final project. Teacher circulates and provides live feedback — focuses on: Does it meet the success criteria? Is it appropriate for the audience? Is it technically accurate? Students record any AI use in their AI use statement (ongoing). At the 40-minute mark, teacher prompts everyone to do a quality review against their success criteria.', tools: ['Canva', 'PowerPoint Online', 'Word Online', 'Excel Online'] },
          share: { mins: 5, activity: 'Paired preview: swap with a partner and give one piece of specific improvement feedback before next lesson.' },
        },
        aiAngle: 'AI may be used for feedback, improving drafts, and generating ideas — but every word in the final product should be written or edited by the student.',
        tools: [
          { name: 'Canva', url: 'https://canva.com/education', free: true },
          { name: 'Google Suite', url: 'https://microsoft365.com', free: true },
        ],
        evidence: 'Draft final project + AI use statement',
        homework: { task: 'Polish your project at home. Apply the feedback from your partner. Export the final version as PDF. Save to portfolio by the start of Lesson 17.', mins: 30 },
        differentiation: {
          support: 'Teacher check-in at 15, 30 and 45 minutes',
          extension: 'Add a reflective "Designer\'s Commentary" — a short paragraph explaining each major design/content decision',
        },
      },
      {
        id: 'df-8-17', year: 8, lessonNum: 17, unitNum: 5,
        title: 'Showcase & Celebrate', subtitle: 'Present your work, reflect on your journey',
        emoji: '🎉', colour: '#10b981',
        bigIdea: 'Sharing your work is the final step — and the most important.',
        objectives: [
          'Present a completed digital product to an audience',
          'Evaluate their own progress across the year using specific evidence',
          'Organise their complete digital portfolio for submission',
        ],
        vocab: [
          { term: 'Evaluation', def: 'A balanced, honest judgement of what went well and what could improve' },
          { term: 'Evidence', def: 'Specific examples from your work that support a claim' },
          { term: 'Transferable skills', def: 'Skills learned in one context that apply to many others' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Open with the baseline skills audit from Lesson 1. Students rate themselves again on each skill — they\'ll be amazed at the progress.' },
          teach: { mins: 5, points: [
            'How to present your work: explain the what, who for, and one decision you\'re proud of',
            'Evaluation: honest, specific, forward-looking',
            'Portfolio final check: is everything named correctly and in the right folder?',
          ]},
          create: { mins: 35, task: 'Showcase gallery: students display their final project on screen (or on printed/projected version). Class does a gallery walk — each student leaves a post-it (physical or digital) on two other projects with specific praise. Then students complete a structured self-evaluation form: 3 skills you\'ve gained, 1 project you\'re most proud of and why, 1 thing you\'d do differently, and 2 skills you want to develop in Year 9. Final portfolio organisation and submission.', tools: ['Microsoft Forms', 'Padlet or Teams'] },
          share: { mins: 15, activity: 'Teacher-led celebration: highlight the most creative project, most improved, most useful, and most visually impressive (not the same student for all). Every student should receive genuine recognition for something.' },
        },
        aiAngle: 'Reflection: how did you use AI this year? Was it useful? Did it ever let you down? What would you do differently?',
        tools: [
          { name: 'Padlet', url: 'https://padlet.com', free: true },
          { name: 'Microsoft Forms', url: 'https://forms.microsoft.com', free: true },
        ],
        evidence: 'Final project (submitted) + portfolio (organised) + self-evaluation (completed)',
        homework: { task: 'No homework — celebrate! Optional: share your favourite project with a family member and teach them one thing you learned this year.', mins: 0 },
        differentiation: {
          support: 'Simplified self-evaluation with sentence starters',
          extension: 'Write a "Letter to my Year 9 self" — what to focus on, what they\'ve learned, what excites them about Y9 Digital Futures',
        },
        teacherNote: 'Make this genuinely celebratory. Year 8 students don\'t often get to showcase their own work. If possible, invite another teacher or display work in a common area.',
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // YEAR 9
  // ═══════════════════════════════════════════════

  {
    id: 6, year: 9,
    title: 'AI Deep Dive',
    subtitle: 'Understand AI critically and use it like an expert',
    colour: '#7c3aed', emoji: '🧠',
    lessons: [
      {
        id: 'df-9-1', year: 9, lessonNum: 1, unitNum: 1,
        title: 'How AI Really Works', subtitle: 'Under the hood of large language models',
        emoji: '⚙️', colour: '#7c3aed',
        bigIdea: 'You can\'t use a tool critically until you understand what it actually does.',
        objectives: [
          'Explain how large language models (LLMs) generate text using pattern prediction',
          'Describe what training data is and why it creates bias',
          'Identify three structural limitations of current AI systems',
        ],
        vocab: [
          { term: 'Large Language Model (LLM)', def: 'An AI trained on massive text datasets to predict likely next words' },
          { term: 'Token', def: 'A chunk of text (roughly a word or part of a word) that AI processes' },
          { term: 'Temperature', def: 'How creative/random vs. focused an AI\'s output is — a setting you can control' },
          { term: 'Training data', def: 'The massive corpus of text used to train the model — full of human biases' },
          { term: 'Context window', def: 'How much text an AI can "see" at once — like working memory' },
        ],
        timing: {
          hook: { mins: 5, activity: '"Finish this sentence: The best thing about school is..." Students guess what AI will say. Teacher enters it live and shows result. Then repeat with an unusual context. How does AI decide? That\'s today\'s lesson.' },
          teach: { mins: 15, points: [
            'LLMs: trained on trillions of words from the internet, books, code',
            'How text generation works: probability prediction, one token at a time',
            'Temperature: low = focused/predictable, high = creative/random',
            'Training data problems: internet text is not balanced — skews toward English, Western, male',
            'Context window: AI has no true memory beyond the current conversation',
            'Key companies: OpenAI (ChatGPT), Google (Copilot), Anthropic (Claude), Meta (Llama)',
            'Multimodal AI: text, image, audio, video — all converging',
          ]},
          create: { mins: 35, task: 'Investigation task: students run a set of structured experiments to observe AI behaviour. (1) Test temperature by asking the same question multiple times — is it consistent? (2) Find an example of AI reproducing a cultural or gender bias. (3) Test the context window by giving a very long context and seeing if AI remembers detail from the start. (4) Find a task where AI fails completely — and write a hypothesis for WHY. Document with screenshots in a "How AI Works" investigation report.', tools: ['Microsoft Copilot', 'Word Online'] },
          share: { mins: 5, activity: 'What surprised you most? What would you want AI developers to fix?' },
        },
        aiAngle: 'This IS the AI lesson — building the critical literacy foundation for all Year 9 AI work.',
        tools: [{ name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com', free: true }],
        evidence: 'How AI Works investigation report with screenshots and observations',
        homework: { task: 'Watch a 10-minute explainer video on how LLMs work (e.g. 3Blue1Brown or Computerphile on YouTube). Write 5 things you learned that weren\'t in today\'s lesson.', mins: 20 },
        differentiation: {
          support: 'Structured experiment sheet with exact prompts to use',
          extension: 'Research how AI training has changed from GPT-2 to GPT-4. What were the key breakthroughs?',
        },
      },
      {
        id: 'df-9-2', year: 9, lessonNum: 2, unitNum: 1,
        title: 'Prompt Engineering Masterclass', subtitle: 'Advanced techniques for expert results',
        emoji: '🎛️', colour: '#7c3aed',
        bigIdea: 'Prompt engineering is already a paid career. You\'re learning it now.',
        objectives: [
          'Use role prompting, chain-of-thought and few-shot techniques',
          'Build a multi-turn conversation that produces a complex output',
          'Evaluate the quality of an AI output using a structured rubric',
        ],
        vocab: [
          { term: 'Role prompting', def: 'Asking AI to behave as a specific expert or character' },
          { term: 'Chain-of-thought', def: 'Asking AI to show its reasoning step-by-step ("think this through...")"' },
          { term: 'Few-shot prompting', def: 'Giving 2-3 examples of the output you want before asking for yours' },
          { term: 'System prompt', def: 'Instructions that set AI\'s behaviour for the whole conversation' },
          { term: 'Iteration', def: 'Improving through multiple refinement rounds' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Show the average job listing for "AI Prompt Engineer" — £60-120k salary. "This job didn\'t exist 3 years ago. Today you\'ll start learning it."' },
          teach: { mins: 12, points: [
            'Review RCTF (Year 8) — now going deeper',
            'Role prompting: "You are a data scientist reviewing this analysis..."',
            'Chain-of-thought: "Think through this step by step before answering"',
            'Few-shot: show 2 examples of the format you want, then ask for yours',
            'Negative prompting: "Don\'t use jargon. Don\'t make assumptions about..."',
            'Conversation design: each message builds on the last',
            'When to start fresh vs. continue a conversation',
          ]},
          create: { mins: 38, task: 'Masterclass challenge — 3 advanced tasks: (1) Use role prompting to get a genuinely expert-level explanation of a topic they\'re studying (cross-subject). (2) Use chain-of-thought to solve a logic puzzle step by step. (3) Use few-shot to get AI to write in their own writing style (give it 3 examples of their writing, then ask it to continue in the same style). Evaluate each output using the "output quality rubric" provided. Record all prompts and outputs.', tools: ['Microsoft Copilot', 'AI Log (continued)'] },
          share: { mins: 5, activity: 'Share the most impressive result. Class critiques: is it genuinely good, or does it just look impressive?' },
        },
        aiAngle: 'Core AI skills lesson — this will change how students use AI in every subject.',
        tools: [{ name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com', free: true }],
        evidence: 'Advanced prompt log with 3 techniques demonstrated and outputs evaluated',
        homework: { task: 'Use advanced prompting to help with something real in your life. Document the conversation. Write: what technique worked best and why.', mins: 20 },
        differentiation: {
          support: 'Prompt templates pre-written — students modify one element at a time',
          extension: 'Research "prompt injection attacks" — how can malicious prompts hijack AI systems? Write a short security brief.',
        },
      },
      {
        id: 'df-9-3', year: 9, lessonNum: 3, unitNum: 1,
        title: 'Deepfakes & Disinformation', subtitle: 'Detecting AI-generated content',
        emoji: '🎭', colour: '#7c3aed',
        bigIdea: 'Anyone can now create convincing fake video, audio and images. Can you tell the difference?',
        objectives: [
          'Identify signs of AI-generated images and video using visual inspection techniques',
          'Explain how synthetic media creates new challenges for trust and democracy',
          'Evaluate a set of media artefacts using verification tools and techniques',
        ],
        vocab: [
          { term: 'Deepfake', def: 'AI-generated video/audio making someone appear to say or do something they didn\'t' },
          { term: 'Synthetic media', def: 'Any media (image, video, audio) created or modified by AI' },
          { term: 'Media forensics', def: 'Techniques for detecting manipulated or AI-generated content' },
          { term: 'Liar\'s dividend', def: 'The way deepfakes let real footage be dismissed as fake' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Show 4 images — 2 real, 2 AI-generated. Students vote. Reveal. Then explain how you can tell. The tells are getting much harder to spot.' },
          teach: { mins: 12, points: [
            'What deepfakes are: AI trained on thousands of images of a face',
            'How to spot them: hands/fingers (AI still struggles), reflections, teeth, background consistency, lighting',
            'Audio deepfakes: voice cloning from 30 seconds of audio',
            'Tools being used: Midjourney, Stable Diffusion, ElevenLabs (voice)',
            'Real-world harms: election interference, financial fraud, harassment',
            'The liar\'s dividend: "that real video must be a deepfake"',
            'Verification tools: Google Lens, TinEye, Hive Moderation, InVID',
          ]},
          create: { mins: 38, task: 'Deepfake detection lab: students receive a pack of 12 images/short clips (pre-curated mix of real and AI-generated). For each: classify (real/fake), identify 2 specific tells, and record confidence (1-10). Then cross-check using Google Lens or TinEye. Final task: write a 200-word "Media Verification Guide" for a school newspaper editor — what checks to run before publishing any submitted image.', tools: ['Google Lens', 'TinEye', 'InVID WeVerify', 'Word Online'] },
          share: { mins: 5, activity: 'Which image fooled the most people? What made it convincing?' },
        },
        aiAngle: 'AI is creating the problem — and AI is also part of the detection solution. But humans must remain the final check.',
        tools: [
          { name: 'Google Lens', url: 'https://lens.google.com', free: true },
          { name: 'TinEye', url: 'https://tineye.com', free: true },
          { name: 'InVID WeVerify', url: 'https://weverify.eu/tools/', free: true },
        ],
        evidence: 'Detection lab worksheet with classifications and tells + Media Verification Guide',
        homework: { task: 'Find a news story that involved a deepfake or AI-generated image being shared as real. Write a summary: what happened, how it was detected, and what the consequences were.', mins: 20 },
        differentiation: {
          support: 'Images pre-labelled with one confirmed tell — students find the second',
          extension: 'Research legislation around deepfakes in the UK. What is currently legal or illegal? What protections exist?',
        },
      },
      {
        id: 'df-9-4', year: 9, lessonNum: 4, unitNum: 1,
        title: 'AI & Society', subtitle: 'Ethics, jobs, power and accountability',
        emoji: '⚖️', colour: '#7c3aed',
        bigIdea: 'AI is the most transformative technology since the internet. What role will you play?',
        objectives: [
          'Argue a position in a structured debate about AI ethics',
          'Identify who is accountable when AI systems cause harm',
          'Evaluate the impact of AI on employment using specific examples',
        ],
        vocab: [
          { term: 'Algorithmic bias', def: 'Systematic unfairness in AI outputs due to biased training data or design' },
          { term: 'Accountability', def: 'The principle that someone must be responsible for outcomes — including AI outcomes' },
          { term: 'Automation', def: 'Replacing human labour with machines or AI systems' },
          { term: 'AI governance', def: 'Laws, rules and standards that control how AI is developed and used' },
          { term: 'Augmentation', def: 'Using AI to enhance human capabilities rather than replace them' },
        ],
        timing: {
          hook: { mins: 5, activity: '"Which jobs do you want to do when you grow up?" Students name them. Teacher shows which ones AI is already doing. Then shows new jobs AI has created. "It\'s more complicated than robots taking all jobs."' },
          teach: { mins: 12, points: [
            'AI and jobs: tasks automated vs. roles created — not just "jobs taken"',
            'Jobs AI struggles to replace: those requiring empathy, physical dexterity, creativity and social trust',
            'Algorithmic bias case studies: hiring algorithms that discriminated, facial recognition failures',
            'Who is responsible when AI causes harm? Developer? Company? User?',
            'AI regulation: EU AI Act, UK approach, global divergence',
            'Existential risks: what do AI researchers actually worry about?',
          ]},
          create: { mins: 38, task: 'Oxford-style debate: class divided into 3 teams arguing different positions on the motion "AI will make the world fairer for everyone." Each team researches, prepares a 3-minute opening argument, then responds to the others. Followed by written individual task: 250-word structured response to "Should the UK government slow down AI development to protect workers? Justify your position with evidence."', tools: ['Word Online', 'Google', 'BBC / Guardian'] },
          share: { mins: 5, activity: 'Class vote: did the debate change anyone\'s mind? If yes, what argument was most persuasive?' },
        },
        aiAngle: 'This lesson is about AI but asks students to think as citizens, not just users.',
        tools: [{ name: 'Word Online', url: 'https://office.com', free: true }],
        evidence: 'Debate notes + 250-word written argument',
        homework: { task: 'Interview a family member or adult about their job. Ask: could AI do any part of this? Would that be a good thing? Write up the conversation as a 200-word report.', mins: 25 },
        differentiation: {
          support: 'Pre-researched argument cards with evidence snippets',
          extension: 'Read the UK Government\'s AI White Paper and summarise the 5 core principles for responsible AI in 5 sentences.',
        },
      },
    ],
  },

  {
    id: 7, year: 9,
    title: 'Data Power',
    subtitle: 'Turn numbers into insight and decisions',
    colour: '#00d4ff', emoji: '📊',
    lessons: [
      {
        id: 'df-9-5', year: 9, lessonNum: 5, unitNum: 2,
        title: 'Spreadsheet Modelling', subtitle: 'What-if analysis and absolute references',
        emoji: '🧮', colour: '#00d4ff',
        bigIdea: 'Spreadsheets aren\'t for storing numbers — they\'re for answering "what if?"',
        objectives: [
          'Use absolute cell references in formulas to build scalable models',
          'Create a what-if model with adjustable input cells',
          'Use IF statements to add conditional logic to a spreadsheet',
        ],
        vocab: [
          { term: 'Absolute reference', def: 'A cell address that doesn\'t change when copied — uses $ sign (e.g. $B$2)' },
          { term: 'Relative reference', def: 'A cell address that adjusts automatically when the formula is copied' },
          { term: 'IF statement', def: '=IF(condition, value_if_true, value_if_false)' },
          { term: 'Input cell', def: 'A cell users change to test different scenarios in a model' },
          { term: 'What-if analysis', def: 'Changing input values to see how outputs change' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Live demo: teacher breaks a spreadsheet by copying a formula that uses relative references when it should use absolute. "Has this ever happened to you? Here\'s why and how to fix it."' },
          teach: { mins: 12, points: [
            'Relative vs. absolute references: when to use each and why',
            'The $ sign: $B2 (fixed column), B$2 (fixed row), $B$2 (fully fixed)',
            'Building a model with input cells: highlight in yellow, don\'t hard-code values',
            'IF statements: =IF(B3>50, "Pass", "Fail")',
            'Nested IF for multiple conditions',
            'IFERROR: handling mistakes gracefully',
          ]},
          create: { mins: 38, task: 'Build a "Real World Model" — students choose from: (A) School Tuck Shop Profit Calculator: items, cost price, sell price, profit per item, total profit with a target profit cell (absolute ref). (B) Savings Goal Tracker: monthly income, savings %, months to reach goal (absolute ref for percentage). (C) Sports League Table: wins/draws/losses → points, conditional format top 3. Full IF statements and absolute references must be demonstrated.', tools: ['Excel Online'] },
          share: { mins: 5, activity: 'Demo challenge: teacher changes one input cell in each student\'s model — does it update correctly everywhere? Instant quality check.' },
        },
        aiAngle: 'Use AI to explain a formula you don\'t understand — but test it before trusting it. AI often hallucinates Excel Online formula syntax.',
        tools: [{ name: 'Excel Online', url: 'https://office.com', free: true }],
        evidence: 'Completed real-world model with absolute references, IF statements and input cells',
        homework: { task: 'Build a personal monthly budget using what you learned. Include absolute references for tax rate or savings percentage. Screenshot and save to portfolio.', mins: 25 },
        differentiation: {
          support: 'Skeleton model with structure ready — students complete the formulas',
          extension: 'Research VLOOKUP or XLOOKUP and use it to look up values in your model from a separate table.',
        },
      },
      {
        id: 'df-9-6', year: 9, lessonNum: 6, unitNum: 2,
        title: 'Data Storytelling', subtitle: 'Dashboards that make data sing',
        emoji: '📉', colour: '#00d4ff',
        bigIdea: 'Data without a story is just noise. The best analysts make the numbers talk.',
        objectives: [
          'Apply conditional formatting to highlight patterns in data',
          'Design a one-page dashboard that communicates insight to a specific audience',
          'Identify misleading data visualisation techniques',
        ],
        vocab: [
          { term: 'Conditional formatting', def: 'Automatic cell colour/style changes based on the cell\'s value' },
          { term: 'Dashboard', def: 'A visual summary of key data insights on one page for quick decisions' },
          { term: 'Data storytelling', def: 'Using visualisations to communicate a clear narrative from data' },
          { term: 'Truncated axis', def: 'A chart axis that doesn\'t start at zero — can make differences look bigger' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Show two charts of the same data — one with a y-axis starting at 0, one starting at a higher number to make a small change look dramatic. "This is used in politics, business and advertising every day."' },
          teach: { mins: 12, points: [
            'Conditional formatting: colour scales, data bars, icon sets, custom rules',
            'Sparklines: mini-charts inside a cell',
            'Dashboard layout: summary stats at top, charts in the middle, detail below',
            'Chart choice refresher: line (time), bar (comparison), scatter (relationship), pie (use sparingly)',
            'Misleading techniques: truncated axes, cherry-picked dates, missing context',
          ]},
          create: { mins: 38, task: 'Dashboard challenge: students receive a "messy dataset" (school-themed: mock attendance, grades by subject, extracurricular participation — all fictional). Task: clean the data, apply conditional formatting to highlight outliers, create 3 meaningful charts, and build a one-page dashboard for "Senior Leaders" with a clear headline message. Export as PDF.', tools: ['Excel Online'] },
          share: { mins: 5, activity: 'Data story share: each student states their dashboard\'s headline message in one sentence. Does the visual support it?' },
        },
        aiAngle: 'Use AI to suggest what type of chart is most appropriate for your data, or to write the interpretation paragraph — then verify the chart choice is correct.',
        tools: [{ name: 'Excel Online', url: 'https://office.com', free: true }],
        evidence: 'Data dashboard (exported PDF) with conditional formatting and 3 charts',
        homework: { task: 'Find a data visualisation from a news article or report. Evaluate it: what does it show well? Is anything misleading? Screenshot and annotate.', mins: 15 },
        differentiation: {
          support: 'Dashboard layout template pre-built — students add charts and formatting',
          extension: 'Use Google Looker Studio (free) to build an interactive dashboard from the same data.',
        },
      },
      {
        id: 'df-9-7', year: 9, lessonNum: 7, unitNum: 2,
        title: 'Algorithm Watch', subtitle: 'How platforms shape what you see — and think',
        emoji: '🌀', colour: '#00d4ff',
        bigIdea: 'Platforms don\'t show you reality — they show you a curated version designed to keep you scrolling.',
        objectives: [
          'Explain how recommendation algorithms work and why they prioritise engagement',
          'Identify the psychological techniques platforms use to maintain attention',
          'Design modifications to a fictional app that prioritise wellbeing over engagement',
        ],
        vocab: [
          { term: 'Recommendation algorithm', def: 'AI that decides what content to show you next to maximise engagement' },
          { term: 'Engagement', def: 'Interactions (clicks, likes, watch time) — what platforms are optimised to maximise' },
          { term: 'Filter bubble', def: 'A state where algorithms show you only content matching your existing views' },
          { term: 'Variable reward', def: 'Unpredictable rewards (like slot machines) that make scrolling addictive' },
          { term: 'Dark pattern', def: 'Design choices that manipulate users into actions against their interest' },
        ],
        timing: {
          hook: { mins: 5, activity: '"Why do you watch a 30-second video and then look up 3 hours later?" Students share experiences. Teacher builds towards "this is by design."' },
          teach: { mins: 12, points: [
            'How recommendation algorithms work: watch time, likes, shares, completion rate',
            'Why outrage travels fastest: high engagement',
            'Variable reward schedule: like pulling a slot machine lever (Skinner)',
            'Dark patterns: infinite scroll, autoplay, notification badges, "seen by" indicators',
            'Filter bubbles: political, cultural, product echo chambers',
            'The business model: your attention is sold to advertisers',
            'What platform designers say in private about their own products',
          ]},
          create: { mins: 38, task: 'Students are "ethical UX designers" hired by a fictional social media company that wants to redesign for wellbeing. (1) Audit a fictional app\'s dark patterns using a checklist. (2) Propose 5 specific design changes that reduce manipulation while keeping the app useful. (3) Mockup 2 of the changes as annotated wireframes (PowerPoint Online or paper sketch, photographed). (4) Write a 150-word pitch to the board: why ethical design is also good business.', tools: ['PowerPoint Online', 'Word Online'] },
          share: { mins: 5, activity: 'Share best design change idea. Class votes: would this actually help? Would people use an app that was less addictive?' },
        },
        aiAngle: 'AI is increasingly used to make recommendation algorithms more effective at capturing attention. The people building these systems include AI engineers.',
        tools: [{ name: 'PowerPoint Online', url: 'https://office.com', free: true }],
        evidence: 'Dark pattern audit + 5 redesign proposals + 2 wireframe mockups + pitch paragraph',
        homework: { task: 'Track your own screen time for 3 days. Note which apps take most of your time and whether that feels intentional. Write a 150-word personal reflection.', mins: 20 },
        differentiation: {
          support: 'Dark pattern checklist with image examples of each type',
          extension: 'Research the Digital Services Act (EU) or Online Safety Act (UK) — what rules exist about dark patterns? Are they working?',
        },
      },
    ],
  },

  {
    id: 8, year: 9,
    title: 'Create Like a Pro',
    subtitle: 'Brand identity, video production and campaign design',
    colour: '#ff6b6b', emoji: '🎬',
    lessons: [
      {
        id: 'df-9-8', year: 9, lessonNum: 8, unitNum: 3,
        title: 'Brand Identity', subtitle: 'Logo, colour, typography — build a visual system',
        emoji: '🎨', colour: '#ff6b6b',
        bigIdea: 'Every brand you trust was designed deliberately. Now you\'re the designer.',
        objectives: [
          'Create a consistent visual identity system (logo, colour palette, typography)',
          'Apply brand guidelines to produce on-brand marketing materials',
          'Evaluate a brand identity using professional design criteria',
        ],
        vocab: [
          { term: 'Brand identity', def: 'The visual system (logo, colours, fonts) that makes a brand instantly recognisable' },
          { term: 'Colour psychology', def: 'How colours create emotional associations — e.g. blue = trust, red = energy' },
          { term: 'Typography', def: 'The style, size and arrangement of text as a visual design element' },
          { term: 'Style guide', def: 'A document that defines how a brand should always be presented' },
          { term: 'Vector graphic', def: 'An image defined by mathematical paths — scalable without quality loss' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Logo quiz: show 20 logos with company name hidden. Students identify them. How do they know? Discuss the power of colour, shape and consistency.' },
          teach: { mins: 12, points: [
            'Brand identity vs. logo: the logo is just one element',
            'Colour psychology in famous brands: McDonald\'s red/yellow (hunger/energy), NHS blue (trust)',
            'Typography classes: serif (traditional), sans-serif (modern), display (character)',
            'The 60-30-10 colour rule: dominant, secondary, accent',
            'Style guides: why brands document every decision',
            'Canva Brand Kit: set colours, fonts, logo and apply across all materials',
          ]},
          create: { mins: 38, task: 'Students create a brand identity for a fictional school tech startup of their choosing (e.g. an app for homework tracking, a revision tool, a gaming club). Deliverables: (1) Logo (Canva — simple, vector-style). (2) Brand colour palette with 3 colours justified using colour psychology. (3) Typography pair (heading + body font) with rationale. (4) One marketing material using the brand (social post, flyer or poster). (5) One-page "mini style guide" showing how the brand should be used.', tools: ['Canva'] },
          share: { mins: 5, activity: 'Brand reveal: each student shows their logo without the company name. Can classmates guess what the company does just from the visual identity?' },
        },
        aiAngle: 'Use Canva\'s AI features to explore colour combinations and suggest brand concepts — but the final design decisions must be yours and justified.',
        tools: [{ name: 'Canva for Education', url: 'https://canva.com/education', free: true }],
        evidence: 'Logo + colour palette + typography pair + one marketing material + mini style guide',
        homework: { task: 'Find a rebrand (a company that changed its logo) from the last 5 years. Research why they did it and whether it worked. Write a 200-word analysis using design vocabulary.', mins: 25 },
        differentiation: {
          support: 'Limited palette choice (3 options per variable) to reduce decision paralysis',
          extension: 'Create a complete campaign pack: logo + poster + social post + email header, all consistently branded.',
        },
      },
      {
        id: 'df-9-9', year: 9, lessonNum: 9, unitNum: 3,
        title: 'Video & Audio', subtitle: 'Plan, shoot and edit a short film',
        emoji: '🎥', colour: '#ff6b6b',
        bigIdea: 'Video is the most powerful communication medium of your generation. Learn to use it.',
        objectives: [
          'Create a storyboard for a 30-60 second explainer video',
          'Apply basic video production principles (framing, lighting, audio)',
          'Edit and export a video with captions',
        ],
        vocab: [
          { term: 'Storyboard', def: 'A sequence of sketches/notes showing what each shot will look like' },
          { term: 'Rule of thirds', def: 'A composition guideline — place subjects along the grid lines, not dead centre' },
          { term: 'B-roll', def: 'Supplementary footage shown while someone is speaking' },
          { term: 'Captions', def: 'Text showing what is being said — essential for accessibility' },
          { term: 'Call to action', def: 'The thing you want the viewer to do after watching' },
        ],
        timing: {
          hook: { mins: 5, activity: '"You have one minute to make someone understand why AI matters. Go." Students get 60 seconds to plan a verbal explanation. Then discuss: how do professionals do this? Enter: video production.' },
          teach: { mins: 12, points: [
            'Storyboard: shot type (wide/mid/close), what\'s shown, what\'s said',
            'Shot composition: rule of thirds, avoid dead centre',
            'Lighting: face the light source, avoid windows behind you',
            'Audio: the most common mistake — bad audio destroys good video',
            'Editing basics: cut to music, transitions (cuts not wipes), captions',
            'Tools: CapCut (free, mobile), Clipchamp (Windows), iMovie (Mac), Canva video',
            'Exporting: MP4, 1080p, correct aspect ratio for platform',
          ]},
          create: { mins: 38, task: 'Students create a 30-60 second explainer video on one of: "How AI works for beginners", "Why digital literacy matters", "How to spot a phishing email". Process: (1) Storyboard (10 mins). (2) Record using device camera (10 mins). (3) Edit with captions in CapCut or Canva (18 mins). Export MP4 and upload to shared class folder.', tools: ['CapCut (mobile/web)', 'Canva', 'Clipchamp'] },
          share: { mins: 5, activity: 'Watch 3 videos as a class. One piece of specific praise for each. Focus on: was the message clear? Did they use visuals well?' },
        },
        aiAngle: 'AI tools can generate automatic captions (Clipchamp, CapCut) — but always review them, they make mistakes. AI can also generate B-roll images.',
        tools: [
          { name: 'CapCut', url: 'https://capcut.com', free: true },
          { name: 'Canva', url: 'https://canva.com/education', free: true },
          { name: 'Clipchamp', url: 'https://clipchamp.com', free: true },
        ],
        evidence: 'Storyboard + exported video (MP4) with captions',
        homework: { task: 'Watch your video back in 24 hours. Write 3 things you\'d improve if you could reshoot it. What did you learn about video production?', mins: 15 },
        differentiation: {
          support: 'Pre-made storyboard template with prompts for each shot',
          extension: 'Create a second version for a different platform (e.g. portrait for TikTok/Instagram vs. landscape for YouTube) and compare the experience.',
        },
        teacherNote: 'Book phones/tablets for recording. Students can use school devices or personal phones (check policy). Ensure you have a quiet space for recording — even a corridor works.',
      },
      {
        id: 'df-9-10', year: 9, lessonNum: 10, unitNum: 3,
        title: 'Campaign Design', subtitle: 'Multi-platform digital campaign for a real cause',
        emoji: '📢', colour: '#ff6b6b',
        bigIdea: 'Campaigns that change the world start with one clear message, perfectly communicated.',
        objectives: [
          'Develop a clear campaign message and call to action for a specific audience',
          'Create consistent digital campaign assets across 3 different formats',
          'Evaluate campaign effectiveness using design and communication criteria',
        ],
        vocab: [
          { term: 'Campaign', def: 'A coordinated set of messages designed to achieve a specific goal' },
          { term: 'Target audience', def: 'The specific group you are trying to reach and influence' },
          { term: 'Brand consistency', def: 'Using the same visual identity and tone across all campaign materials' },
          { term: 'Call to action (CTA)', def: 'The specific action you want your audience to take' },
          { term: 'Reach', def: 'How many people see your campaign content' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Show 3 famous campaign images with the text removed (e.g. Greenpeace, Nike, a public health campaign). Students guess the campaign and its message. Discuss: what makes a message stick?' },
          teach: { mins: 12, points: [
            'Campaign planning: problem → audience → message → format → CTA → measure',
            'Different platforms, different formats: Instagram (square/portrait image), Twitter/X (text + image), poster (A3 print), email (header + body)',
            'Consistency: same colours, fonts, tone across all materials',
            'Message hierarchy: what do you see first? What do you read next? What do you do?',
            'Tone of voice: the written personality of a brand',
            'Real campaigns: see how Scope, Cancer Research, Young Minds create campaigns',
          ]},
          create: { mins: 38, task: 'Students create a digital campaign for one of: digital wellbeing, online safety, AI awareness or a cause they care about. Deliverables for a full campaign pack: (1) Campaign strategy one-pager (audience, message, CTA, platforms). (2) Instagram post (1080×1080). (3) Poster (A4, printable). (4) Email header + brief email copy. All must be visually consistent and aimed at Year 8 students.', tools: ['Canva', 'Word Online'] },
          share: { mins: 5, activity: 'Campaign pitch: 45 seconds per student. Message, audience, why they\'ll care. Class votes: most likely to actually work.' },
        },
        aiAngle: 'Use AI to generate campaign slogans and test different message angles — then pick the best one and make it your own.',
        tools: [{ name: 'Canva', url: 'https://canva.com/education', free: true }],
        evidence: 'Campaign pack: strategy doc + Instagram post + poster + email header',
        homework: { task: 'Research one successful social media campaign (look at Young Minds, Scope or a brand you admire). Write a 200-word analysis of why it worked.', mins: 20 },
        differentiation: {
          support: 'Campaign brief pre-written — students choose the formats and create assets',
          extension: 'Calculate the potential reach of their campaign if it were real: how many people could be reached through each platform chosen?',
        },
      },
      {
        id: 'df-9-11', year: 9, lessonNum: 11, unitNum: 3,
        title: 'Accessible & Inclusive Design', subtitle: 'Design for everyone',
        emoji: '♿', colour: '#ff6b6b',
        bigIdea: '1 in 5 people in the UK have a disability. Design that excludes them isn\'t just unfair — it\'s bad design.',
        objectives: [
          'Explain four principles of accessible design and why they matter',
          'Test digital content for accessibility using a checklist and automated tools',
          'Redesign a piece of content to meet accessibility standards',
        ],
        vocab: [
          { term: 'WCAG', def: 'Web Content Accessibility Guidelines — the international standard for digital accessibility' },
          { term: 'Alt text', def: 'A written description of an image for screen reader users' },
          { term: 'Contrast ratio', def: 'The difference in brightness between text and background — must meet minimum standards' },
          { term: 'Screen reader', def: 'Software that reads digital content aloud for visually impaired users' },
          { term: 'Cognitive load', def: 'How much mental effort something requires — good design minimises this' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Demo a screen reader reading a badly designed webpage (lots of "click here" links, no alt text, poor structure). Then the same page with good accessibility. The difference is dramatic.' },
          teach: { mins: 12, points: [
            'The 4 POUR principles: Perceivable, Operable, Understandable, Robust',
            'Colour contrast: minimum 4.5:1 ratio for normal text',
            'Alt text: describe the meaning, not just the appearance — "A bar chart showing..." not "image"',
            'Headings: they\'re not just visual — screen readers navigate by them',
            'Captions and transcripts for audio/video',
            'Plain English: shorter sentences, common words, active voice',
            'Testing tools: WebAIM Contrast Checker, axe DevTools, WAVE',
          ]},
          create: { mins: 38, task: 'Accessibility audit: students receive a deliberately inaccessible document (a school newsletter with poor contrast, no headings, no alt text, small text, jargon). (1) Audit it against a 10-point checklist, scoring each item. (2) Use WebAIM Contrast Checker to test all colour combinations. (3) Rewrite/redesign it to meet accessibility standards. (4) Write a brief "Accessibility Report" explaining each change and why it matters.', tools: ['Word Online', 'WebAIM Contrast Checker', 'Canva'] },
          share: { mins: 5, activity: 'Before/after reveal. What was the most impactful single change they made?' },
        },
        aiAngle: 'AI tools are getting better at generating alt text automatically — but they still make mistakes. Always review AI-generated alt text for accuracy.',
        tools: [
          { name: 'WebAIM Contrast Checker', url: 'https://webaim.org/resources/contrastchecker/', free: true },
          { name: 'WAVE Accessibility Tool', url: 'https://wave.webaim.org', free: true },
        ],
        evidence: 'Accessibility audit + redesigned document + accessibility report',
        homework: { task: 'Check one website you use regularly for accessibility issues. Use WAVE (webaim.org). Note 3 issues and 2 things it does well.', mins: 20 },
        differentiation: {
          support: 'Checklist broken into "quick wins" vs "more complex" — support students focus on quick wins first',
          extension: 'Create an "Accessibility First Design Guide" — a one-page reference for students creating digital work.',
        },
      },
    ],
  },

  {
    id: 9, year: 9,
    title: 'Security & Wellbeing',
    subtitle: 'Stay protected, stay in control',
    colour: '#f59e0b', emoji: '🛡️',
    lessons: [
      {
        id: 'df-9-12', year: 9, lessonNum: 12, unitNum: 4,
        title: 'Cybersecurity Pro', subtitle: 'Real threats, realistic protection',
        emoji: '🔒', colour: '#f59e0b',
        bigIdea: 'Cyber attacks cost the UK billions per year. The most common entry point is human error.',
        objectives: [
          'Conduct a cybersecurity risk assessment for a realistic digital setup',
          'Explain the most common attack vectors and how they are mitigated',
          'Prioritise security improvements by risk level and feasibility',
        ],
        vocab: [
          { term: 'Attack vector', def: 'The method used to gain unauthorised access to a system' },
          { term: 'Social engineering', def: 'Manipulating people rather than systems to get access' },
          { term: 'Malware', def: 'Malicious software: viruses, ransomware, spyware, trojans' },
          { term: 'Ransomware', def: 'Malware that encrypts your files and demands payment to restore them' },
          { term: 'Zero-day vulnerability', def: 'A security flaw unknown to the developer — no patch exists yet' },
          { term: 'Penetration testing', def: 'Authorised hacking to find vulnerabilities before criminals do' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Show a real UK cyber attack case study (e.g. WannaCry NHS attack 2017 — public info). What failed? What was the human element? What did it cost?' },
          teach: { mins: 12, points: [
            'Attack types: phishing, malware, ransomware, man-in-the-middle, credential stuffing',
            'Most attacks exploit people, not just technology — social engineering',
            'The cyber kill chain: reconnaissance → delivery → exploitation → persistence',
            'Defences: MFA, updates, backups, least privilege, VPN on public Wi-Fi',
            'Incident response: what to do if you think you\'ve been hacked',
            'Cyber careers: ethical hacker, security analyst, pen tester — all in demand',
          ]},
          create: { mins: 38, task: 'Students receive a fictional profile of a teenager\'s digital life (named accounts, devices, habits, passwords). Task: produce a full "Cybersecurity Risk Assessment" — for each risk area (accounts, devices, networks, social media, physical), rate likelihood (1-5) and impact (1-5), giving a risk score. Then produce a "Top 5 Recommendations" report with justification. Finally, write a 100-word cover note for the fictional "client" explaining the most urgent action.', tools: ['Word Online', 'Excel Online'] },
          share: { mins: 5, activity: 'What was the #1 risk? Was it the same for everyone? Which recommendation would be hardest to follow — and why?' },
        },
        aiAngle: 'AI is increasingly used in both cyberattacks (more convincing phishing) and defences (anomaly detection, threat analysis). The arms race is accelerating.',
        tools: [{ name: 'Word Online', url: 'https://office.com', free: true }],
        evidence: 'Cybersecurity risk assessment + top 5 recommendations + client cover note',
        homework: { task: 'Check your own top 5 used apps/accounts. For each: is MFA on? Is the password strong? Are there any security alerts? Write up your personal audit.', mins: 20 },
        differentiation: {
          support: 'Risk matrix template with descriptions of each risk level',
          extension: 'Research how a penetration tester gets into a network legally. What qualifications are needed? What does a day in the job look like?',
        },
      },
      {
        id: 'df-9-13', year: 9, lessonNum: 13, unitNum: 4,
        title: 'Digital Workplace', subtitle: 'Professional digital skills for the real world',
        emoji: '💼', colour: '#f59e0b',
        bigIdea: 'The way you show up digitally at work will define your career. Start building the habits now.',
        objectives: [
          'Use professional collaboration tools effectively (shared calendars, task lists, meeting notes)',
          'Demonstrate professional written communication for workplace contexts',
          'Explain what a digital professional identity is and how to build one',
        ],
        vocab: [
          { term: 'Collaboration tool', def: 'Software that helps teams work together on shared tasks and documents' },
          { term: 'Asynchronous communication', def: 'Communication where people respond in their own time (email, comments)' },
          { term: 'Digital professional identity', def: 'How you present yourself in professional online contexts (LinkedIn, portfolios)' },
          { term: 'Minutes', def: 'A written record of what was discussed and decided in a meeting' },
          { term: 'Action item', def: 'A specific task assigned to a specific person with a deadline — from a meeting' },
        ],
        timing: {
          hook: { mins: 5, activity: '"What does a working week look like in a tech company?" Students guess. Teacher reveals: 40% of time in meetings, 30% writing emails/messages, 20% using collaborative tools, 10% actual "deep work". "The digital skills you\'re building are the ones you\'ll use most at work."' },
          teach: { mins: 12, points: [
            'Google Workspace / Microsoft 365 as professional tools',
            'Calendar management: invites, agenda, response etiquette',
            'Meeting notes: agenda before, action items after, assigned to named people with deadlines',
            'Asynchronous vs. synchronous communication: choosing the right channel',
            'Slack/Teams etiquette: when to DM vs. post in a channel, threading',
            'LinkedIn basics: professional digital identity — what Year 10+ students should think about',
          ]},
          create: { mins: 38, task: 'Mock workplace simulation: students work in teams of 3-4 as "Digital Futures project teams." (1) Create a shared Google Calendar with a 2-week project timeline. (2) Run a 5-minute team "meeting" and take minutes using a template (chair, note-taker, action items). (3) Write a professional project update email to the "teacher as client." (4) Create a shared task list in Google Tasks or Sheets with owner and deadline for each item.', tools: ['Google Calendar', 'Word Online', 'Excel Online', 'Outlook'] },
          share: { mins: 5, activity: 'Review: which team produced the most professional meeting minutes? What made them effective?' },
        },
        aiAngle: 'AI tools like Microsoft Copilot can take meeting notes, draft emails and summarise long documents — but the professional judgement of what to communicate still requires you.',
        tools: [
          { name: 'Google Calendar', url: 'https://outlook.live.com/calendar', free: true },
          { name: 'Google Workspace', url: 'https://microsoft365.com', free: true },
        ],
        evidence: 'Team calendar + meeting minutes + professional email + shared task list',
        homework: { task: 'Set up a basic LinkedIn profile (or plan one for when you turn 16). Research 3 jobs you\'re interested in and note which digital skills they require.', mins: 25 },
        differentiation: {
          support: 'Meeting minutes template and email frame pre-provided',
          extension: 'Research "remote-first" companies. Write a 200-word report on how digital communication skills become even more critical in remote work.',
        },
      },
    ],
  },

  {
    id: 10, year: 9,
    title: 'Portfolio Showcase',
    subtitle: 'Your best work, your way',
    colour: '#10b981', emoji: '🏆',
    lessons: [
      {
        id: 'df-9-14', year: 9, lessonNum: 14, unitNum: 5,
        title: 'Advanced Project Brief', subtitle: 'Plan a portfolio project using AI as a partner',
        emoji: '📋', colour: '#10b981',
        bigIdea: 'Your Year 9 project should be something you\'re genuinely proud to show anyone.',
        objectives: [
          'Analyse a complex project brief and produce a detailed project plan',
          'Use AI as a planning partner to stress-test ideas and identify gaps',
          'Create a professional project specification document',
        ],
        vocab: [
          { term: 'Project specification', def: 'A detailed document describing what will be built, for whom, and to what standard' },
          { term: 'Scope', def: 'The boundaries of a project — what is and isn\'t included' },
          { term: 'Milestone', def: 'A significant checkpoint in a project timeline' },
          { term: 'Risk', def: 'A potential problem that could affect the project — planned for in advance' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Reveal the 4 Year 9 project options with examples of outstanding finished work. "This is the bar. Two lessons to get there."' },
          teach: { mins: 10, points: [
            'Year 9 project options: (A) AI Ethics Magazine — 4-page digital magazine on an AI issue. (B) Digital Wellbeing Campaign — full campaign pack (brand, video, social assets, report). (C) Data Investigation — spreadsheet analysis of a real dataset + dashboard + written findings. (D) Tech Explainer Series — 3 × 60-second videos on AI topics for younger students.',
            'Planning: brief → audience → success criteria → scope → asset list → risks → timeline',
            'Using AI to stress-test your plan: "What have I missed? What could go wrong?"',
            'Project specification document: what real professionals write before starting',
          ]},
          create: { mins: 40, task: 'Students choose their project and produce a professional project specification (template provided): brief analysis, audience profile, 6 success criteria, scope statement (in/out), asset list, risk register (3 risks with mitigations), and a 2-session timeline. Then use AI to critique their plan — document the conversation and note what they changed as a result. Teacher approves all plans before Lesson 15.', tools: ['Word Online', 'Microsoft Copilot'] },
          share: { mins: 5, activity: 'Pair pitch: 60 seconds to sell your project concept. Partner asks one challenging question. Student answers it.' },
        },
        aiAngle: 'AI is explicitly used as a planning partner — but students must document what changed and why, demonstrating they\'re still in charge.',
        tools: [
          { name: 'Word Online', url: 'https://office.com', free: true },
          { name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com', free: true },
        ],
        evidence: 'Project specification document with AI conversation log and change notes',
        homework: { task: 'Gather all assets you need for your project. Do any research. Draft any written content. Arrive at Lesson 15 ready to build.', mins: 40 },
        differentiation: {
          support: 'Simplified project option (digital wellbeing poster pack) with more structure',
          extension: 'Include a "post-launch plan" — if this were a real product, how would you promote it and measure success?',
        },
        teacherNote: 'Approve every plan rigorously — the most common failure mode is over-ambitious scope. Help students cut down rather than scale up.',
      },
      {
        id: 'df-9-15', year: 9, lessonNum: 15, unitNum: 5,
        title: 'Production Studio', subtitle: 'Build something genuinely excellent',
        emoji: '🔧', colour: '#10b981',
        bigIdea: 'Craft matters. The gap between good and excellent is in the details.',
        objectives: [
          'Work independently to produce a high-quality multi-component digital project',
          'Document AI use throughout the production process',
          'Apply peer feedback to improve quality before final submission',
        ],
        vocab: [
          { term: 'Quality benchmark', def: 'A standard your work must meet or exceed' },
          { term: 'Proofing', def: 'Carefully checking for errors before finalising' },
          { term: 'Export settings', def: 'Choosing the right format, resolution and size for the output' },
        ],
        timing: {
          hook: { mins: 3, activity: 'Students review their project specification. Teacher sets the standard: "When you\'re done, show it to me. I should be genuinely impressed."' },
          teach: { mins: 2, points: ['Quality check at 40 minutes: test every success criterion. Final 10 minutes: peer review and polish.'] },
          create: { mins: 50, task: 'Students build their final Year 9 project. Teacher circulates — focus on quality, not just completion. At 40 minutes, every student does a success-criteria self-check. At 50 minutes, paired peer review: does it do everything the spec says? Document all AI use with timestamps and descriptions. Export all final files in agreed formats.', tools: ['Canva', 'Google Workspace', 'CapCut', 'Microsoft Copilot'] },
          share: { mins: 5, activity: 'Partner gives one specific improvement suggestion. Student responds: implement or defend why they won\'t.' },
        },
        aiAngle: 'AI use must be fully documented — what was asked, what was produced, what the student changed. This is practice for professional AI use norms.',
        tools: [
          { name: 'Canva', url: 'https://canva.com/education', free: true },
          { name: 'Microsoft Copilot', url: 'https://copilot.microsoft.com', free: true },
          { name: 'CapCut', url: 'https://capcut.com', free: true },
        ],
        evidence: 'Final project files + AI use log + peer feedback record',
        homework: { task: 'Polish your project at home. Proofread everything. Export all final files. Organise your complete portfolio. Write your final self-evaluation (template provided) before next lesson.', mins: 45 },
        differentiation: {
          support: 'Check-in at 15, 30 and 45 minutes with specific prompts',
          extension: 'Create a "making of" slide — how was the project built? What tools were used? What challenges were overcome?',
        },
      },
      {
        id: 'df-9-16', year: 9, lessonNum: 16, unitNum: 5,
        title: 'Digital Portfolio Day', subtitle: 'Showcase, celebrate, look ahead',
        emoji: '🎓', colour: '#10b981',
        bigIdea: 'Two years of Digital Futures. Look what you\'ve built.',
        objectives: [
          'Present a final Year 9 project to a real audience',
          'Evaluate their digital skills development across both years with specific evidence',
          'Articulate how Digital Futures skills connect to GCSE and career readiness',
        ],
        vocab: [
          { term: 'Portfolio curation', def: 'Selecting and presenting your best work to make a specific impression' },
          { term: 'Career readiness', def: 'Having the skills, habits and mindset employers actually look for' },
          { term: 'Digital literacy', def: 'The ability to confidently and critically use digital tools' },
        ],
        timing: {
          hook: { mins: 5, activity: 'Students view their Year 8 Lesson 1 "Digital Me" card. Then their Year 9 final project. The growth is visible. Let that moment land.' },
          teach: { mins: 5, points: [
            'Portfolio presentation: show the work, explain one decision, take a question',
            'GCSE connections: where Digital Futures skills appear in Computer Science, English, Media, Business and more',
            'Looking ahead: digital skills are in every career — every NHS job, every law firm, every creative studio',
          ]},
          create: { mins: 35, task: 'Portfolio showcase: students display final projects (screen or printed). Class gallery walk with sticky note feedback (physical or Padlet). Then structured self-evaluation: across 2 years, rate yourself 1-5 on each of the 8 digital literacy strands from the curriculum. Pick your top 3 most-improved skills and write one sentence of evidence for each. Complete the "Letter to my GCSE self" — 3 digital skills to develop in Year 10 and why.', tools: ['Padlet', 'Microsoft Forms'] },
          share: { mins: 15, activity: 'Teacher celebration: award recognitions — most creative, most improved, most technically impressive, most socially useful, most professionally presented. Every student receives something genuine. End with: "You are more digitally capable than most adults you know. Use it well."' },
        },
        aiAngle: 'Reflection: over two years, how has your relationship with AI changed? What do you know now that you didn\'t know in Year 8? What worries you? What excites you?',
        tools: [{ name: 'Padlet', url: 'https://padlet.com', free: true }],
        evidence: 'Final project (submitted) + 2-year self-evaluation + Letter to GCSE self + organised portfolio',
        homework: { task: 'No homework. You\'ve earned it. Optional: share your favourite project with someone outside school and teach them one thing you\'ve learned.', mins: 0 },
        differentiation: {
          support: 'Self-evaluation sentence starters for each skill strand',
          extension: 'Create a "Digital Futures highlight reel" — a 60-second video showcasing their best work from across the 2 years, with narration.',
        },
        teacherNote: 'Make this a genuine event. Consider inviting another teacher, form tutor or department head. Display student work in the corridor. This is a completion worth celebrating.',
      },
    ],
  },

];

// ── Helpers ───────────────────────────────────────────────────────
export function getAllDFLessons(): DFLesson[] {
  return DF_UNITS.flatMap(u => u.lessons);
}

export function getDFLessonsByYear(year: 8 | 9): DFLesson[] {
  return DF_UNITS.filter(u => u.year === year).flatMap(u => u.lessons);
}

export function getDFUnitsByYear(year: 8 | 9): DFUnit[] {
  return DF_UNITS.filter(u => u.year === year);
}

export const DF_BRAND = {
  name: 'Digital Futures',
  tagline: 'Master AI. Own Your Digital World.',
  primaryColour: '#00d4ff',
  secondaryColour: '#7c3aed',
  accentColour: '#ff6b6b',
  goldColour: '#ffd700',
  description: 'A world-class AI and digital skills curriculum for Year 8 and 9 students',
};
