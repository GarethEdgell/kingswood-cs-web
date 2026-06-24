// Digital Futures — lesson quizzes
// Auto-graded multiple-choice quizzes, one per lesson (keyed by lesson id).
//
// To add a quiz for a new lesson: append a DFQuiz with the matching lessonId.
// `correctIndex` is 0-based into `options`. Grading happens server-side in
// /api/submissions/submit, so the client is never trusted with the answer key
// for assigned quizzes.

export interface DFQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DFQuiz {
  lessonId: string;
  questions: DFQuizQuestion[];
}

export const DF_QUIZZES: DFQuiz[] = [
  // ═══════════════════════════════ YEAR 8 ═══════════════════════════════

  {
    lessonId: 'df-8-1',
    questions: [
      { id: 'df-8-1-q1', question: 'What is a digital portfolio?', options: ['A type of cloud password', 'A curated collection of your best digital work', 'A folder that deletes old files automatically', 'A social media profile'], correctIndex: 1, explanation: 'A portfolio is a curated collection of your best digital work, kept organised in one place.' },
      { id: 'df-8-1-q2', question: 'Which of these is a good naming convention?', options: ['final FINAL doc(2)', 'untitled', 'Y8_L01_DigitalMe_Aisha', 'asdf123'], correctIndex: 2, explanation: 'A consistent convention like Year_LessonNum_Task_FirstName makes files easy to find later.' },
      { id: 'df-8-1-q3', question: 'What is the main benefit of cloud storage?', options: ['Files take up space on your hard drive', 'You can access your files from anywhere and are less likely to lose them', 'It makes files print faster', 'It deletes files after a week'], correctIndex: 1, explanation: 'Cloud storage saves files on internet servers so you can reach them anywhere and not lose work.' },
      { id: 'df-8-1-q4', question: 'Which file format is the "professional standard" for sharing finished, locked documents?', options: ['.docx', '.pdf', '.csv', '.png'], correctIndex: 1, explanation: 'PDF locks the layout so it looks the same everywhere — the professional standard for finished work.' },
      { id: 'df-8-1-q5', question: 'Why does digital organisation matter?', options: ['It looks tidy but saves no time', 'Searching for lost files wastes hours you could spend working', 'It is required by law', 'It makes files bigger'], correctIndex: 1, explanation: 'Good organisation saves time — searching for disorganised files costs hours.' },
    ],
  },
  {
    lessonId: 'df-8-2',
    questions: [
      { id: 'df-8-2-q1', question: 'What does version history let you do?', options: ['Make files smaller', 'Roll back to an earlier saved state of a file', 'Email a file to yourself', 'Change the file format'], correctIndex: 1, explanation: 'Version history tracks every change so you can recover an earlier version after a mistake.' },
      { id: 'df-8-2-q2', question: 'Which file type is best when you want a document that cannot easily be edited?', options: ['.docx', '.pdf', '.csv', '.txt'], correctIndex: 1, explanation: 'PDF locks the content, making it the right choice for a finished, non-editable document.' },
      { id: 'df-8-2-q3', question: 'What is a backup?', options: ['A faster internet connection', 'A copy of your file in a second location in case the first is lost', 'A deleted file', 'A compressed file'], correctIndex: 1, explanation: 'A backup is a second copy kept elsewhere so you are protected if the original is lost.' },
      { id: 'df-8-2-q4', question: 'What does compression do to a file?', options: ['Makes it larger', 'Makes it smaller so it is faster to share', 'Locks it with a password', 'Converts it to a PDF'], correctIndex: 1, explanation: 'Compression (e.g. zipping) reduces file size so it transfers faster.' },
      { id: 'df-8-2-q5', question: 'Which sharing setting lets someone change your document?', options: ['View', 'Comment', 'Edit', 'Preview'], correctIndex: 2, explanation: 'Edit access allows others to change the document; view and comment do not.' },
    ],
  },
  {
    lessonId: 'df-8-3',
    questions: [
      { id: 'df-8-3-q1', question: 'What is the difference between CC and BCC?', options: ['CC is hidden, BCC is visible', 'CC recipients are visible to all; BCC recipients are hidden', 'They are the same thing', 'BCC sends the email faster'], correctIndex: 1, explanation: 'CC recipients can be seen by everyone; BCC recipients are hidden from other recipients.' },
      { id: 'df-8-3-q2', question: 'Which is the most professional subject line?', options: ['hi', '(no subject)', 'RE: History homework — extension request', 'URGENT!!! READ NOW'], correctIndex: 2, explanation: 'A specific, useful subject line tells the reader exactly what the email is about.' },
      { id: 'df-8-3-q3', question: 'What does "tone" mean in communication?', options: ['The font size', 'The feeling conveyed by your word choices', 'How loud you type', 'The email address'], correctIndex: 1, explanation: 'Tone is the feeling your word choices convey — formal or informal.' },
      { id: 'df-8-3-q4', question: 'What is the recommended structure for a formal email body?', options: ['Request only', 'Context → request → thank you', 'A single emoji', 'As many words as possible'], correctIndex: 1, explanation: 'A clear body gives context, makes the request, then thanks the reader.' },
      { id: 'df-8-3-q5', question: 'What is the "#1 office mistake" mentioned in the lesson?', options: ['Forgetting an attachment', 'Using Reply All when you meant to Reply', 'Spelling the subject wrong', 'Sending at night'], correctIndex: 1, explanation: 'Hitting Reply All instead of Reply is a classic, embarrassing email mistake.' },
    ],
  },
  {
    lessonId: 'df-8-4',
    questions: [
      { id: 'df-8-4-q1', question: 'How does generative AI produce its responses?', options: ['It looks up exact answers in a database', 'It predicts likely next words based on its training data', 'It asks a human in real time', 'It copies Wikipedia word for word'], correctIndex: 1, explanation: 'Generative AI predicts the most likely next words/pixels from patterns in its training data.' },
      { id: 'df-8-4-q2', question: 'What is a "hallucination" in AI?', options: ['When AI refuses to answer', 'When AI confidently states something false', 'When AI is switched off', 'A type of image AI makes'], correctIndex: 1, explanation: 'A hallucination is when AI confidently produces information that is simply wrong.' },
      { id: 'df-8-4-q3', question: 'Which of these should you NEVER enter into an AI tool?', options: ['A made-up topic', 'Your real name, school, passwords or personal problems', 'A maths question', 'A poem idea'], correctIndex: 1, explanation: 'Never share personal details, passwords or sensitive information with AI tools.' },
      { id: 'df-8-4-q4', question: 'AI is generally GOOD at which of these?', options: ['Guaranteeing correct facts', 'Brainstorming, drafting and explaining', 'Doing precise maths reliably', 'Knowing today’s news'], correctIndex: 1, explanation: 'AI is strong at brainstorming, drafting and explaining — but weak on facts, maths and current events.' },
      { id: 'df-8-4-q5', question: 'What is a "prompt"?', options: ['The AI’s answer', 'The instruction or question you give the AI', 'The training data', 'A type of error'], correctIndex: 1, explanation: 'A prompt is the instruction or question you give to an AI.' },
    ],
  },
  {
    lessonId: 'df-8-5',
    questions: [
      { id: 'df-8-5-q1', question: 'What do the letters RCTF stand for in prompt writing?', options: ['Read, Copy, Test, Finish', 'Role, Context, Task, Format', 'Repeat, Check, Try, Fix', 'Request, Cancel, Try, Format'], correctIndex: 1, explanation: 'RCTF = Role, Context, Task, Format — a framework for strong prompts.' },
      { id: 'df-8-5-q2', question: 'What does "iteration" mean when prompting?', options: ['Asking once and accepting the answer', 'Improving through repeated attempts that build on the last', 'Deleting your prompt', 'Using a longer password'], correctIndex: 1, explanation: 'Iteration means refining your prompt over repeated attempts to improve the result.' },
      { id: 'df-8-5-q3', question: 'Why does specifying an output format help?', options: ['It slows the AI down', 'It tells the AI how to structure its response (list, table, etc.)', 'It hides your prompt', 'It is never useful'], correctIndex: 1, explanation: 'Specifying a format (bullets, table, word limit) shapes how the AI presents its answer.' },
      { id: 'df-8-5-q4', question: 'Which prompt is likely to give the best result?', options: ['tell me about dogs', 'You are a vet. Explain to a Year 8 student, in 5 bullet points, how to care for a puppy.', 'dogs???', 'write something'], correctIndex: 1, explanation: 'A specific prompt with role, audience, task and format gets a far better answer than a vague one.' },
      { id: 'df-8-5-q5', question: 'What is "few-shot" prompting?', options: ['Asking only one short question', 'Giving the AI a few examples of what you want', 'Prompting late at night', 'Using fewer words'], correctIndex: 1, explanation: 'Few-shot prompting gives the AI example outputs so it copies the pattern you want.' },
    ],
  },
  {
    lessonId: 'df-8-6',
    questions: [
      { id: 'df-8-6-q1', question: 'Why does AI sometimes produce false information?', options: ['It lies on purpose', 'It predicts likely words rather than checking verified facts', 'Its internet is slow', 'It is always correct'], correctIndex: 1, explanation: 'AI predicts plausible words; it does not verify facts, so it can be confidently wrong.' },
      { id: 'df-8-6-q2', question: 'What does it mean to "cross-reference" a claim?', options: ['Delete it', 'Check it against a second, reliable, independent source', 'Translate it', 'Repeat it louder'], correctIndex: 1, explanation: 'Cross-referencing checks a claim against an independent reliable source to confirm it.' },
      { id: 'df-8-6-q3', question: 'Which is the best example of a primary source?', options: ['A random social media post', 'Official government statistics or published research', 'An AI summary', 'A meme'], correctIndex: 1, explanation: 'Primary sources are original evidence — government stats, official sites, published research.' },
      { id: 'df-8-6-q4', question: 'Where does AI bias come from?', options: ['The colour of the screen', 'Patterns in the human-written training data', 'The time of day', 'The user’s password'], correctIndex: 1, explanation: 'AI inherits human biases present in the text it was trained on.' },
      { id: 'df-8-6-q5', question: 'What is the "too smooth" warning sign?', options: ['AI text is full of typos', 'AI sounds confident and certain even when it might be wrong', 'AI takes too long', 'AI uses too many emojis'], correctIndex: 1, explanation: 'AI rarely sounds uncertain, so confident, smooth text is not proof it is correct.' },
    ],
  },
  {
    lessonId: 'df-8-7',
    questions: [
      { id: 'df-8-7-q1', question: 'What is academic integrity?', options: ['Letting AI do all your work', 'Honest representation of your own work and the help you received', 'Never using any tools', 'Copying a friend'], correctIndex: 1, explanation: 'Academic integrity means honestly representing your own work and any help you used.' },
      { id: 'df-8-7-q2', question: 'What belongs in an AI use statement?', options: ['Only the final mark', 'What you asked, what the AI said, and what YOU changed', 'Your password', 'Nothing — keep it secret'], correctIndex: 1, explanation: 'An AI use statement declares what you asked, what AI produced, and what you changed.' },
      { id: 'df-8-7-q3', question: 'Which is the BEST way to use AI on your own writing?', options: ['Ask it to write the whole thing and submit it', 'Ask it for feedback, then improve the work yourself', 'Copy its answer word for word', 'Hide that you used it'], correctIndex: 1, explanation: 'Using AI as a feedback coach, then doing the rewriting yourself, keeps you in charge of your learning.' },
      { id: 'df-8-7-q4', question: 'What does "human oversight" mean?', options: ['AI watches the human', 'Humans must check and take responsibility for AI outputs', 'Humans never check AI', 'AI works without people'], correctIndex: 1, explanation: 'Human oversight is the principle that people must review and take responsibility for AI outputs.' },
      { id: 'df-8-7-q5', question: 'Which AI feedback prompt is most useful for improving an essay?', options: ['"Is this good?"', '"What is the weakest argument and how could I strengthen it?"', '"Write it for me"', '"Make it longer"'], correctIndex: 1, explanation: 'Specific feedback prompts (weakest argument, unclear parts) help you genuinely improve your own work.' },
    ],
  },
  {
    lessonId: 'df-8-8',
    questions: [
      { id: 'df-8-8-q1', question: 'What do the four CRAP design principles stand for?', options: ['Colour, Rhythm, Angle, Print', 'Contrast, Repetition, Alignment, Proximity', 'Crop, Resize, Adjust, Publish', 'Clarity, Range, Aspect, Pixels'], correctIndex: 1, explanation: 'CRAP = Contrast, Repetition, Alignment, Proximity — the four core design principles.' },
      { id: 'df-8-8-q2', question: 'What does "proximity" mean in design?', options: ['Using bright colours', 'Grouping related items together so layout makes sense', 'Making text bold', 'Adding more fonts'], correctIndex: 1, explanation: 'Proximity groups related elements together so the layout reads logically.' },
      { id: 'df-8-8-q3', question: 'How many fonts should a clean design typically use?', options: ['As many as possible', 'A maximum of about two', 'Exactly seven', 'None'], correctIndex: 1, explanation: 'Keeping to about two fonts (one heading, one body) looks consistent and professional.' },
      { id: 'df-8-8-q4', question: 'What is "hierarchy" in design?', options: ['Putting everything the same size', 'Making the most important thing the most visually prominent', 'Using only black and white', 'Aligning to the left only'], correctIndex: 1, explanation: 'Visual hierarchy makes the most important element stand out the most.' },
      { id: 'df-8-8-q5', question: 'What is the 60-30-10 rule about?', options: ['Font sizes', 'A balanced colour split: dominant, secondary, accent', 'Image resolution', 'Page margins'], correctIndex: 1, explanation: 'The 60-30-10 rule balances a dominant colour, a secondary colour and an accent.' },
    ],
  },
  {
    lessonId: 'df-8-9',
    questions: [
      { id: 'df-8-9-q1', question: 'What is the "one idea per slide" principle?', options: ['Put everything on one slide', 'Each slide should focus on a single clear idea', 'Use one word per presentation', 'Never use slides'], correctIndex: 1, explanation: 'Each slide should carry one idea so the audience is not overloaded.' },
      { id: 'df-8-9-q2', question: 'What are speaker notes for?', options: ['Reading aloud word for word', 'Prompts for the presenter that the audience does not see', 'The slide title', 'Replacing the slides'], correctIndex: 1, explanation: 'Speaker notes are private prompts for the presenter — not to be read aloud verbatim.' },
      { id: 'df-8-9-q3', question: 'Why does knowing your audience matter for a presentation?', options: ['It does not matter', 'It changes every design and content decision', 'It only changes the colour', 'It sets the file name'], correctIndex: 1, explanation: 'The audience shapes the language, visuals and content of every slide.' },
      { id: 'df-8-9-q4', question: 'What is the "squint test"?', options: ['Checking spelling', 'Squinting to see if the most important thing still stands out', 'Testing the projector', 'Counting the words'], correctIndex: 1, explanation: 'If you squint and can still tell what matters most, your visual hierarchy works.' },
      { id: 'df-8-9-q5', question: 'Which is better practice for slide text?', options: ['14 bullet points of full sentences', 'Few words, supported by images', 'Walls of paragraphs', 'WordArt everywhere'], correctIndex: 1, explanation: 'Less text and more visuals communicate more clearly than dense bullet points.' },
    ],
  },
  {
    lessonId: 'df-8-10',
    questions: [
      { id: 'df-8-10-q1', question: 'How does every spreadsheet formula begin?', options: ['With a # sign', 'With an = sign', 'With the word SUM', 'With a space'], correctIndex: 1, explanation: 'All spreadsheet formulas start with the = sign.' },
      { id: 'df-8-10-q2', question: 'What does =AVERAGE() do?', options: ['Adds all values', 'Finds the mean of the values', 'Finds the largest value', 'Counts the cells'], correctIndex: 1, explanation: 'AVERAGE returns the mean of the selected values.' },
      { id: 'df-8-10-q3', question: 'What is a cell reference like B3?', options: ['A formula error', 'The address of a cell used in formulas', 'A chart type', 'A file format'], correctIndex: 1, explanation: 'A cell reference (e.g. B3) is the address of a cell, used so formulas update automatically.' },
      { id: 'df-8-10-q4', question: 'Which chart type best shows change over time?', options: ['Pie chart', 'Line chart', 'Bar chart for categories', 'No chart'], correctIndex: 1, explanation: 'Line charts are designed to show how a value changes over time.' },
      { id: 'df-8-10-q5', question: 'Why is =B3+C3 better than =5+7?', options: ['It is shorter', 'It updates automatically when the cell values change', 'It is more colourful', 'It uses less memory'], correctIndex: 1, explanation: 'Using cell references means the result recalculates whenever the data changes.' },
    ],
  },
  {
    lessonId: 'df-8-11',
    questions: [
      { id: 'df-8-11-q1', question: 'What do the steps of SIFT stand for?', options: ['Search, Index, Find, Type', 'Stop, Investigate the source, Find better coverage, Trace claims', 'Save, Import, Format, Test', 'Sort, Insert, Filter, Total'], correctIndex: 1, explanation: 'SIFT = Stop, Investigate the source, Find better coverage, Trace claims.' },
      { id: 'df-8-11-q2', question: 'Which Creative Commons licence means "free to use, no conditions"?', options: ['CC BY', 'CC0', 'CC BY-NC', 'CC BY-SA'], correctIndex: 1, explanation: 'CC0 places work in the public domain with no conditions.' },
      { id: 'df-8-11-q3', question: 'What is copyright?', options: ['A way to share files faster', 'Legal protection for creators — using their work without permission can be illegal', 'A type of search engine', 'A free image site'], correctIndex: 1, explanation: 'Copyright legally protects creators; using their work without permission can be illegal.' },
      { id: 'df-8-11-q4', question: 'What does the search technique site:bbc.co.uk do?', options: ['Blocks the BBC', 'Limits results to that one website', 'Searches images only', 'Finds PDF files'], correctIndex: 1, explanation: 'site: limits a search to a specific website.' },
      { id: 'df-8-11-q5', question: 'What does "public domain" mean?', options: ['Owned by a company', 'Work with no copyright restrictions, free to use', 'Only for teachers', 'Requires payment'], correctIndex: 1, explanation: 'Public domain work has no copyright restrictions and is free to use.' },
    ],
  },
  {
    lessonId: 'df-8-12',
    questions: [
      { id: 'df-8-12-q1', question: 'What makes the strongest password?', options: ['A short word with a number', 'A long passphrase of several random words', 'Your name', 'password123'], correctIndex: 1, explanation: 'Length beats complexity — a long passphrase of random words is very strong.' },
      { id: 'df-8-12-q2', question: 'What does MFA (multi-factor authentication) add?', options: ['A longer password only', 'A second check beyond the password', 'Faster login', 'A new email address'], correctIndex: 1, explanation: 'MFA adds a second factor (something you have or are) on top of your password.' },
      { id: 'df-8-12-q3', question: 'Which is a warning sign of phishing?', options: ['A specific, expected message from a known person', 'Urgency, a generic greeting and a suspicious link', 'Correct spelling', 'A normal subject line'], correctIndex: 1, explanation: 'Phishing often uses urgency, generic greetings, odd URLs and spelling errors.' },
      { id: 'df-8-12-q4', question: 'What is social engineering?', options: ['Hacking hardware', 'Manipulating people, not systems, to gain access', 'Building social media apps', 'Encrypting files'], correctIndex: 1, explanation: 'Social engineering manipulates people rather than breaking technical systems.' },
      { id: 'df-8-12-q5', question: 'What is a data breach?', options: ['A strong password', 'When hackers access and steal stored personal data', 'A backup', 'A software update'], correctIndex: 1, explanation: 'A data breach is when stored personal data is accessed and stolen.' },
    ],
  },
  {
    lessonId: 'df-8-13',
    questions: [
      { id: 'df-8-13-q1', question: 'What is a digital footprint?', options: ['A type of shoe', 'The trail of data left by everything you do online', 'A password manager', 'A file format'], correctIndex: 1, explanation: 'Your digital footprint is the data trail left by your online activity.' },
      { id: 'df-8-13-q2', question: 'What is "permanence" in this context?', options: ['Posts vanish instantly', 'Deleted posts may still exist in screenshots, caches and backups', 'Files cannot be saved', 'Nothing is ever recorded'], correctIndex: 1, explanation: 'Even deleted content can survive in screenshots, caches and backups.' },
      { id: 'df-8-13-q3', question: 'Which is an example of PASSIVE footprint data?', options: ['A photo you post', 'Location data and cookies collected without you noticing', 'A comment you write', 'A like you give'], correctIndex: 1, explanation: 'Passive data (location, cookies, clicks) is collected without you actively sharing it.' },
      { id: 'df-8-13-q4', question: 'Who might be able to see your online activity?', options: ['Only you', 'Platforms, employers, universities and even police', 'Nobody', 'Only your friends'], correctIndex: 1, explanation: 'Many parties can access aspects of your footprint, from platforms to employers.' },
      { id: 'df-8-13-q5', question: 'What is the "5-year rule" suggested in the lesson?', options: ['Delete everything every 5 years', 'Would you be proud of this post in 5 years?', 'Post 5 times a year', 'Change passwords every 5 years'], correctIndex: 1, explanation: 'A useful test before posting: would you still be proud of it in five years?' },
    ],
  },
  {
    lessonId: 'df-8-14',
    questions: [
      { id: 'df-8-14-q1', question: 'What is the difference between misinformation and disinformation?', options: ['There is none', 'Misinformation is shared without intent to deceive; disinformation is deliberate', 'Disinformation is always true', 'Misinformation is only images'], correctIndex: 1, explanation: 'Intent is the difference: misinformation is accidental, disinformation is deliberate.' },
      { id: 'df-8-14-q2', question: 'What is an echo chamber?', options: ['A music studio', 'An environment where you only meet opinions matching your own', 'A type of phone', 'A search engine'], correctIndex: 1, explanation: 'An echo chamber surrounds you only with views that match your own.' },
      { id: 'df-8-14-q3', question: 'Why does outrage often travel fastest online?', options: ['It is always true', 'It drives high engagement, which algorithms reward', 'It is shorter', 'Platforms ban it'], correctIndex: 1, explanation: 'Algorithms reward engagement, and outrage generates lots of it.' },
      { id: 'df-8-14-q4', question: 'What is confirmation bias?', options: ['Confirming your password', 'The tendency to believe information that matches what you already think', 'A type of algorithm', 'A fact-checking tool'], correctIndex: 1, explanation: 'Confirmation bias makes us readily accept claims that fit our existing beliefs.' },
      { id: 'df-8-14-q5', question: 'What should you do before sharing a viral claim?', options: ['Share it immediately', 'Apply SIFT and check it against reliable sources', 'Add an emoji', 'Delete your account'], correctIndex: 1, explanation: 'Check before sharing — use SIFT and reliable fact-checkers.' },
    ],
  },
  {
    lessonId: 'df-8-15',
    questions: [
      { id: 'df-8-15-q1', question: 'What is a project brief?', options: ['A short break', 'A description of what a client or task requires', 'A type of file', 'A password'], correctIndex: 1, explanation: 'A brief describes what the client or task requires.' },
      { id: 'df-8-15-q2', question: 'What are success criteria?', options: ['Vague hopes', 'Specific, measurable standards the finished work must meet', 'The deadline only', 'The file format'], correctIndex: 1, explanation: 'Success criteria are specific, measurable standards for the finished work.' },
      { id: 'df-8-15-q3', question: 'Which is the best-defined audience?', options: ['Everyone', 'Year 7 students starting secondary school', 'People', 'The internet'], correctIndex: 1, explanation: 'A specific audience ("Year 7 students") guides every design decision; "everyone" does not.' },
      { id: 'df-8-15-q4', question: 'What is an asset list?', options: ['A list of your money', 'All the files, images and resources needed before building begins', 'The success criteria', 'A timeline'], correctIndex: 1, explanation: 'An asset list gathers all resources needed before you start building.' },
      { id: 'df-8-15-q5', question: 'Why plan before building?', options: ['It wastes time', 'A clear plan and realistic timeline make the build achievable', 'Plans are never used', 'To avoid choosing an audience'], correctIndex: 1, explanation: 'Real projects start with a clear brief, criteria and realistic plan.' },
    ],
  },
  {
    lessonId: 'df-8-16',
    questions: [
      { id: 'df-8-16-q1', question: 'What is a draft?', options: ['The final printed version', 'A working version that will be refined before the final', 'A deleted file', 'A backup'], correctIndex: 1, explanation: 'A draft is a working version you will improve before finalising.' },
      { id: 'df-8-16-q2', question: 'In the final project, how should AI be used?', options: ['To write the whole product', 'For planning and feedback — not to build it for you', 'Not at all', 'To replace the brief'], correctIndex: 1, explanation: 'AI may help with planning and feedback, but the student creates the actual product.' },
      { id: 'df-8-16-q3', question: 'What does "iteration" mean during a build?', options: ['Giving up', 'Improving through repeated rounds of feedback and changes', 'Printing once', 'Saving the file'], correctIndex: 1, explanation: 'Iteration is improving the work through repeated feedback and revision.' },
      { id: 'df-8-16-q4', question: 'What should you check your work against halfway through?', options: ['The clock only', 'Your success criteria', 'A friend’s project', 'The colour scheme'], correctIndex: 1, explanation: 'A mid-point review against the success criteria keeps the project on track.' },
      { id: 'df-8-16-q5', question: 'What format is usually used to export a finished project for submission?', options: ['.tmp', '.pdf', '.exe', '.zip only'], correctIndex: 1, explanation: 'PDF is the usual final export format for submission.' },
    ],
  },
  {
    lessonId: 'df-8-17',
    questions: [
      { id: 'df-8-17-q1', question: 'What makes a good evaluation?', options: ['Only praise', 'A balanced, honest judgement of what went well and what could improve', 'Only criticism', 'No detail'], correctIndex: 1, explanation: 'A good evaluation is honest and balanced — strengths and areas to improve.' },
      { id: 'df-8-17-q2', question: 'What is "evidence" when evaluating your work?', options: ['A general feeling', 'Specific examples from your work that support a claim', 'Someone else’s opinion', 'A guess'], correctIndex: 1, explanation: 'Evidence means specific examples from your work backing up your judgement.' },
      { id: 'df-8-17-q3', question: 'What are transferable skills?', options: ['Skills only useful once', 'Skills learned in one context that apply to many others', 'Computer passwords', 'File formats'], correctIndex: 1, explanation: 'Transferable skills carry across many different situations.' },
      { id: 'df-8-17-q4', question: 'Why present your work to others?', options: ['It is pointless', 'Sharing is the final and important step of a project', 'To hide mistakes', 'To avoid feedback'], correctIndex: 1, explanation: 'Sharing your work is the final, valuable step — it builds confidence and invites feedback.' },
      { id: 'df-8-17-q5', question: 'A good self-evaluation should be...', options: ['Vague and short', 'Honest, specific and forward-looking', 'Only about others', 'Skipped'], correctIndex: 1, explanation: 'Strong self-evaluation is honest, specific and looks ahead to what to develop next.' },
    ],
  },

  // ═══════════════════════════════ YEAR 9 ═══════════════════════════════

  {
    lessonId: 'df-9-1',
    questions: [
      { id: 'df-9-1-q1', question: 'What is a Large Language Model (LLM)?', options: ['A physical robot', 'An AI trained on massive text datasets to predict likely next words', 'A search engine', 'A spreadsheet'], correctIndex: 1, explanation: 'An LLM is trained on huge text datasets to predict likely next words.' },
      { id: 'df-9-1-q2', question: 'What is a "token" in an LLM?', options: ['A login key', 'A chunk of text (roughly a word or part of a word) the AI processes', 'A type of bias', 'A payment'], correctIndex: 1, explanation: 'A token is a chunk of text — about a word or part of one — that the model processes.' },
      { id: 'df-9-1-q3', question: 'What does a higher "temperature" setting do?', options: ['Makes output more focused and predictable', 'Makes output more creative and random', 'Speeds up the computer', 'Deletes the response'], correctIndex: 1, explanation: 'Higher temperature = more creative/random; lower = more focused/predictable.' },
      { id: 'df-9-1-q4', question: 'Why is AI training data a source of bias?', options: ['It is too small', 'Internet text is unbalanced and reflects human biases', 'It is perfectly neutral', 'It is encrypted'], correctIndex: 1, explanation: 'Training data skews toward certain languages and viewpoints, carrying human biases.' },
      { id: 'df-9-1-q5', question: 'What is the "context window"?', options: ['A pop-up advert', 'How much text the AI can "see" at once, like working memory', 'The screen size', 'The training set'], correctIndex: 1, explanation: 'The context window is how much text the model can consider at once.' },
    ],
  },
  {
    lessonId: 'df-9-2',
    questions: [
      { id: 'df-9-2-q1', question: 'What is "role prompting"?', options: ['Choosing a username', 'Asking the AI to behave as a specific expert or character', 'Rolling dice', 'Setting the temperature'], correctIndex: 1, explanation: 'Role prompting asks the AI to act as a particular expert or persona.' },
      { id: 'df-9-2-q2', question: 'What does chain-of-thought prompting ask the AI to do?', options: ['Answer instantly', 'Show its reasoning step by step', 'Use fewer words', 'Ignore the question'], correctIndex: 1, explanation: 'Chain-of-thought asks the AI to reason step by step before answering.' },
      { id: 'df-9-2-q3', question: 'What is few-shot prompting?', options: ['Giving no examples', 'Giving 2-3 examples of the output you want before asking', 'Prompting quickly', 'Using a short password'], correctIndex: 1, explanation: 'Few-shot prompting provides examples so the AI matches the desired format.' },
      { id: 'df-9-2-q4', question: 'What is a system prompt?', options: ['An error message', 'Instructions that set the AI’s behaviour for the whole conversation', 'A reboot command', 'The first user message only'], correctIndex: 1, explanation: 'A system prompt sets the AI’s behaviour across the entire conversation.' },
      { id: 'df-9-2-q5', question: 'When evaluating an impressive AI output, you should ask:', options: ['Does it look impressive?', 'Is it genuinely good and correct, not just impressive-looking?', 'How long is it?', 'What colour is it?'], correctIndex: 1, explanation: 'Critically judge whether the output is actually accurate and useful, not just slick.' },
    ],
  },
  {
    lessonId: 'df-9-3',
    questions: [
      { id: 'df-9-3-q1', question: 'What is a deepfake?', options: ['A deep-sea photo', 'AI-generated video/audio making someone appear to say or do something they did not', 'A strong password', 'A real recording'], correctIndex: 1, explanation: 'A deepfake is synthetic media that fakes a real person’s words or actions.' },
      { id: 'df-9-3-q2', question: 'Which is a common visual "tell" of AI-generated images?', options: ['Perfect hands and fingers', 'Odd hands/fingers, strange reflections or inconsistent backgrounds', 'Correct lighting always', 'A watermark only'], correctIndex: 1, explanation: 'AI still often struggles with hands, reflections and background consistency.' },
      { id: 'df-9-3-q3', question: 'What is "synthetic media"?', options: ['Printed newspapers', 'Any media created or modified by AI', 'Live television only', 'Handwritten notes'], correctIndex: 1, explanation: 'Synthetic media is any image, video or audio created or altered by AI.' },
      { id: 'df-9-3-q4', question: 'What is the "liar’s dividend"?', options: ['Money from lying', 'When real footage can be dismissed as a fake', 'A deepfake tool', 'A fact-checking site'], correctIndex: 1, explanation: 'The liar’s dividend lets people dismiss genuine footage by claiming it is fake.' },
      { id: 'df-9-3-q5', question: 'Which tool helps verify whether an image appeared elsewhere first?', options: ['A calculator', 'Reverse image search (e.g. TinEye, Bing Image Search)', 'A spreadsheet', 'A word processor'], correctIndex: 1, explanation: 'Reverse image search traces where an image has appeared before.' },
    ],
  },
  {
    lessonId: 'df-9-4',
    questions: [
      { id: 'df-9-4-q1', question: 'What is algorithmic bias?', options: ['A maths error', 'Systematic unfairness in AI outputs due to biased data or design', 'A fast algorithm', 'A type of chart'], correctIndex: 1, explanation: 'Algorithmic bias is systematic unfairness caused by biased training data or design.' },
      { id: 'df-9-4-q2', question: 'What does "accountability" mean for AI?', options: ['AI is never responsible', 'Someone must be responsible for outcomes, including AI outcomes', 'Only users are blamed', 'Nobody is responsible'], correctIndex: 1, explanation: 'Accountability means a person or organisation must answer for AI outcomes.' },
      { id: 'df-9-4-q3', question: 'Which jobs are HARDEST for AI to replace?', options: ['All jobs equally', 'Those needing empathy, dexterity, creativity and social trust', 'Only office jobs', 'None — AI replaces everything'], correctIndex: 1, explanation: 'Roles requiring empathy, physical dexterity, creativity and trust resist automation.' },
      { id: 'df-9-4-q4', question: 'What is "augmentation"?', options: ['Replacing humans with AI', 'Using AI to enhance human capabilities rather than replace them', 'Making AI larger', 'Deleting jobs'], correctIndex: 1, explanation: 'Augmentation uses AI to enhance, not replace, human capability.' },
      { id: 'df-9-4-q5', question: 'What is AI governance?', options: ['A type of AI model', 'Laws, rules and standards controlling how AI is developed and used', 'The AI’s training data', 'A prompt technique'], correctIndex: 1, explanation: 'AI governance is the set of laws, rules and standards regulating AI.' },
    ],
  },
  {
    lessonId: 'df-9-5',
    questions: [
      { id: 'df-9-5-q1', question: 'What does an absolute reference like $B$2 do when copied?', options: ['It changes with every cell', 'It stays fixed on the same cell', 'It deletes the cell', 'It turns into text'], correctIndex: 1, explanation: 'Absolute references ($B$2) do not change when the formula is copied.' },
      { id: 'df-9-5-q2', question: 'What does a relative reference do when copied down a column?', options: ['Stays the same', 'Adjusts automatically to the new row', 'Causes an error', 'Becomes absolute'], correctIndex: 1, explanation: 'Relative references shift automatically as the formula is copied.' },
      { id: 'df-9-5-q3', question: 'What is the correct structure of an IF statement?', options: ['=IF(value, condition)', '=IF(condition, value_if_true, value_if_false)', '=IF(true, false)', '=IF()'], correctIndex: 1, explanation: 'IF takes a condition, a value if true, and a value if false.' },
      { id: 'df-9-5-q4', question: 'What is an input cell in a model?', options: ['A cell that never changes', 'A cell users change to test different scenarios', 'A locked cell', 'A chart'], correctIndex: 1, explanation: 'Input cells are the values users adjust to run what-if scenarios.' },
      { id: 'df-9-5-q5', question: 'What is "what-if analysis"?', options: ['Guessing randomly', 'Changing input values to see how outputs change', 'Deleting formulas', 'Formatting cells'], correctIndex: 1, explanation: 'What-if analysis changes inputs to observe the effect on outputs.' },
    ],
  },
  {
    lessonId: 'df-9-6',
    questions: [
      { id: 'df-9-6-q1', question: 'What does conditional formatting do?', options: ['Adds a new sheet', 'Automatically changes a cell’s style based on its value', 'Deletes data', 'Prints the file'], correctIndex: 1, explanation: 'Conditional formatting changes cell colour/style automatically based on the value.' },
      { id: 'df-9-6-q2', question: 'What is a dashboard?', options: ['A car part', 'A visual summary of key data on one page for quick decisions', 'A single formula', 'A backup'], correctIndex: 1, explanation: 'A dashboard summarises key insights visually on one page.' },
      { id: 'df-9-6-q3', question: 'How can a "truncated axis" mislead?', options: ['It starts at zero honestly', 'It does not start at zero, making small differences look huge', 'It removes the data', 'It adds colour'], correctIndex: 1, explanation: 'A truncated axis exaggerates small differences by not starting at zero.' },
      { id: 'df-9-6-q4', question: 'What is data storytelling?', options: ['Making up data', 'Using visualisations to communicate a clear narrative from data', 'Hiding data', 'Deleting charts'], correctIndex: 1, explanation: 'Data storytelling communicates a clear message through visualisation.' },
      { id: 'df-9-6-q5', question: 'Which chart best shows the relationship between two variables?', options: ['Pie chart', 'Scatter chart', 'Single bar', 'No chart'], correctIndex: 1, explanation: 'Scatter charts reveal relationships between two variables.' },
    ],
  },
  {
    lessonId: 'df-9-7',
    questions: [
      { id: 'df-9-7-q1', question: 'What do recommendation algorithms mainly try to maximise?', options: ['Your wellbeing', 'Engagement (clicks, likes, watch time)', 'Your sleep', 'Accuracy of news'], correctIndex: 1, explanation: 'Recommendation algorithms optimise for engagement to keep you on the platform.' },
      { id: 'df-9-7-q2', question: 'What is a filter bubble?', options: ['A screen protector', 'A state where you only see content matching your existing views', 'A type of advert', 'A privacy setting'], correctIndex: 1, explanation: 'A filter bubble shows you only content that fits your existing views.' },
      { id: 'df-9-7-q3', question: 'What is a "variable reward"?', options: ['A fixed prize', 'Unpredictable rewards (like a slot machine) that make scrolling addictive', 'A discount code', 'A subscription'], correctIndex: 1, explanation: 'Unpredictable, variable rewards make scrolling compulsive, like a slot machine.' },
      { id: 'df-9-7-q4', question: 'What is a "dark pattern"?', options: ['A night mode', 'A design choice that manipulates users against their own interest', 'A colour scheme', 'A loading icon'], correctIndex: 1, explanation: 'Dark patterns are designs that trick users into acting against their interests.' },
      { id: 'df-9-7-q5', question: 'How do most free platforms actually make money?', options: ['Selling the app', 'Selling your attention to advertisers', 'Charging per scroll', 'Donations only'], correctIndex: 1, explanation: 'Free platforms monetise your attention by selling it to advertisers.' },
    ],
  },
  {
    lessonId: 'df-9-8',
    questions: [
      { id: 'df-9-8-q1', question: 'What is a brand identity?', options: ['Just a logo', 'The visual system (logo, colours, fonts) that makes a brand recognisable', 'A password', 'A slogan only'], correctIndex: 1, explanation: 'Brand identity is the whole visual system, not just the logo.' },
      { id: 'df-9-8-q2', question: 'What is colour psychology?', options: ['Mixing paint', 'How colours create emotional associations (e.g. blue = trust)', 'A printing setting', 'A font style'], correctIndex: 1, explanation: 'Colour psychology is how colours trigger emotional associations.' },
      { id: 'df-9-8-q3', question: 'What is a style guide?', options: ['A fashion magazine', 'A document defining how a brand should always be presented', 'A single poster', 'A colour picker'], correctIndex: 1, explanation: 'A style guide documents how the brand must always be presented.' },
      { id: 'df-9-8-q4', question: 'What is a vector graphic?', options: ['A photo that pixelates when enlarged', 'An image defined by maths paths, scalable without quality loss', 'A video file', 'A spreadsheet chart'], correctIndex: 1, explanation: 'Vector graphics use mathematical paths so they scale without losing quality.' },
      { id: 'df-9-8-q5', question: 'Which is a sans-serif design quality?', options: ['Traditional with small "feet" on letters', 'Modern and clean without serifs', 'Always handwritten', 'Only used for headings'], correctIndex: 1, explanation: 'Sans-serif fonts are clean and modern, without the small strokes (serifs).' },
    ],
  },
  {
    lessonId: 'df-9-9',
    questions: [
      { id: 'df-9-9-q1', question: 'What is a storyboard?', options: ['A finished film', 'A sequence of sketches/notes showing what each shot will look like', 'A microphone', 'An editing app'], correctIndex: 1, explanation: 'A storyboard plans each shot before filming.' },
      { id: 'df-9-9-q2', question: 'What is the "rule of thirds"?', options: ['Film for three minutes', 'Place subjects along grid lines, not dead centre', 'Use three cameras', 'Edit in three steps'], correctIndex: 1, explanation: 'The rule of thirds places subjects along grid lines for stronger composition.' },
      { id: 'df-9-9-q3', question: 'What is B-roll?', options: ['The main interview', 'Supplementary footage shown while someone is speaking', 'A camera brand', 'A type of caption'], correctIndex: 1, explanation: 'B-roll is extra footage shown over narration or speech.' },
      { id: 'df-9-9-q4', question: 'Why are captions important?', options: ['They slow the video', 'They make the video accessible and watchable without sound', 'They replace audio', 'They are decoration'], correctIndex: 1, explanation: 'Captions aid accessibility and let people watch without sound.' },
      { id: 'df-9-9-q5', question: 'What is the most common mistake that ruins good video?', options: ['Too many captions', 'Bad audio', 'Using a tripod', 'Filming outdoors'], correctIndex: 1, explanation: 'Poor audio destroys otherwise good video — sound quality matters hugely.' },
    ],
  },
  {
    lessonId: 'df-9-10',
    questions: [
      { id: 'df-9-10-q1', question: 'What is a campaign?', options: ['A single advert', 'A coordinated set of messages designed to achieve a specific goal', 'A logo', 'A font'], correctIndex: 1, explanation: 'A campaign is a coordinated set of messages aimed at a goal.' },
      { id: 'df-9-10-q2', question: 'What is a call to action (CTA)?', options: ['A complaint', 'The specific action you want your audience to take', 'A phone number', 'A hashtag only'], correctIndex: 1, explanation: 'A CTA tells the audience exactly what action to take.' },
      { id: 'df-9-10-q3', question: 'Why does brand consistency matter in a campaign?', options: ['It does not', 'Using the same identity across materials makes the campaign recognisable', 'It saves paper', 'It hides the message'], correctIndex: 1, explanation: 'Consistent visuals and tone make a campaign cohesive and recognisable.' },
      { id: 'df-9-10-q4', question: 'What does "reach" measure?', options: ['How far you can stretch', 'How many people see your campaign content', 'The file size', 'The number of fonts'], correctIndex: 1, explanation: 'Reach is how many people see your content.' },
      { id: 'df-9-10-q5', question: 'What is the right order for planning a campaign?', options: ['Format → measure → problem', 'Problem → audience → message → format → CTA → measure', 'Measure → CTA → audience', 'Message → font → colour'], correctIndex: 1, explanation: 'Effective campaign planning flows problem → audience → message → format → CTA → measure.' },
    ],
  },
  {
    lessonId: 'df-9-11',
    questions: [
      { id: 'df-9-11-q1', question: 'What is WCAG?', options: ['A coding language', 'The international standard for digital accessibility', 'A web browser', 'A font'], correctIndex: 1, explanation: 'WCAG = Web Content Accessibility Guidelines, the accessibility standard.' },
      { id: 'df-9-11-q2', question: 'What makes good alt text?', options: ['The word "image"', 'A description of the meaning, e.g. "A bar chart showing sales rising"', 'The file name', 'Nothing — leave it blank'], correctIndex: 1, explanation: 'Good alt text describes the meaning of the image, not just that it is an image.' },
      { id: 'df-9-11-q3', question: 'What is contrast ratio about?', options: ['Image sharpness', 'The brightness difference between text and background', 'Font choice', 'File size'], correctIndex: 1, explanation: 'Contrast ratio measures text-to-background brightness; it must meet a minimum (e.g. 4.5:1).' },
      { id: 'df-9-11-q4', question: 'How do screen reader users often navigate a page?', options: ['By colour', 'By its headings', 'By image size', 'By scrolling only'], correctIndex: 1, explanation: 'Properly structured headings let screen reader users navigate the page.' },
      { id: 'df-9-11-q5', question: 'What do the POUR principles stand for?', options: ['Print, Open, Use, Read', 'Perceivable, Operable, Understandable, Robust', 'Plan, Order, Update, Review', 'Pixel, Output, Upload, Run'], correctIndex: 1, explanation: 'POUR = Perceivable, Operable, Understandable, Robust.' },
    ],
  },
  {
    lessonId: 'df-9-12',
    questions: [
      { id: 'df-9-12-q1', question: 'What is an attack vector?', options: ['A type of antivirus', 'The method used to gain unauthorised access to a system', 'A backup tool', 'A firewall setting'], correctIndex: 1, explanation: 'An attack vector is the method used to break into a system.' },
      { id: 'df-9-12-q2', question: 'What is ransomware?', options: ['Free software', 'Malware that encrypts your files and demands payment to restore them', 'A password manager', 'A backup service'], correctIndex: 1, explanation: 'Ransomware encrypts files and demands payment for their release.' },
      { id: 'df-9-12-q3', question: 'What is a zero-day vulnerability?', options: ['A flaw with an available patch', 'A security flaw unknown to the developer, with no patch yet', 'A daily backup', 'A strong password'], correctIndex: 1, explanation: 'A zero-day is an unknown flaw with no fix yet available.' },
      { id: 'df-9-12-q4', question: 'What is penetration testing?', options: ['Illegal hacking', 'Authorised hacking to find vulnerabilities before criminals do', 'Deleting data', 'A type of malware'], correctIndex: 1, explanation: 'Penetration testing is authorised hacking to find weaknesses first.' },
      { id: 'df-9-12-q5', question: 'What is the most common entry point for cyber attacks?', options: ['Hardware failure', 'Human error / social engineering', 'Power cuts', 'Slow internet'], correctIndex: 1, explanation: 'Most attacks exploit people through social engineering, not just technology.' },
    ],
  },
  {
    lessonId: 'df-9-13',
    questions: [
      { id: 'df-9-13-q1', question: 'What is asynchronous communication?', options: ['A live phone call', 'Communication where people respond in their own time (e.g. email)', 'Texting only', 'A video meeting'], correctIndex: 1, explanation: 'Asynchronous communication lets people respond in their own time, like email.' },
      { id: 'df-9-13-q2', question: 'What are "minutes" in a workplace?', options: ['The meeting length', 'A written record of what was discussed and decided', 'A type of email', 'A countdown timer'], correctIndex: 1, explanation: 'Minutes are the written record of a meeting’s discussion and decisions.' },
      { id: 'df-9-13-q3', question: 'What is an action item?', options: ['A film scene', 'A specific task assigned to a named person with a deadline', 'A meeting room', 'An email signature'], correctIndex: 1, explanation: 'An action item is a specific task with an owner and deadline.' },
      { id: 'df-9-13-q4', question: 'What is a digital professional identity?', options: ['A gaming avatar', 'How you present yourself professionally online (e.g. LinkedIn, portfolios)', 'A password', 'A personal blog only'], correctIndex: 1, explanation: 'Your digital professional identity is how you present yourself in professional online spaces.' },
      { id: 'df-9-13-q5', question: 'When is it better to use a channel post rather than a private DM?', options: ['When the information is relevant to the whole team', 'Always DM everything', 'When it is a secret', 'Never post in channels'], correctIndex: 0, explanation: 'Post in a channel when the team needs the information; DM for one-to-one matters.' },
    ],
  },
  {
    lessonId: 'df-9-14',
    questions: [
      { id: 'df-9-14-q1', question: 'What is a project specification?', options: ['A receipt', 'A detailed document describing what will be built, for whom and to what standard', 'A single image', 'A password list'], correctIndex: 1, explanation: 'A specification details what will be built, for whom, and to what standard.' },
      { id: 'df-9-14-q2', question: 'What is project "scope"?', options: ['The colour palette', 'The boundaries of a project — what is and is not included', 'The deadline only', 'The budget only'], correctIndex: 1, explanation: 'Scope defines what is and is not included in the project.' },
      { id: 'df-9-14-q3', question: 'What is a milestone?', options: ['A type of font', 'A significant checkpoint in a project timeline', 'A risk', 'An asset'], correctIndex: 1, explanation: 'A milestone is a significant checkpoint in the timeline.' },
      { id: 'df-9-14-q4', question: 'What is a project risk?', options: ['A guaranteed success', 'A potential problem that could affect the project, planned for in advance', 'A finished task', 'A colour choice'], correctIndex: 1, explanation: 'A risk is a potential problem you plan to mitigate in advance.' },
      { id: 'df-9-14-q5', question: 'What is the most common failure mode when planning a project?', options: ['Too little ambition', 'Over-ambitious scope', 'Too many milestones', 'Too much proofreading'], correctIndex: 1, explanation: 'Over-ambitious scope is the most common reason projects fail to finish well.' },
    ],
  },
  {
    lessonId: 'df-9-15',
    questions: [
      { id: 'df-9-15-q1', question: 'What is a quality benchmark?', options: ['A park bench', 'A standard your work must meet or exceed', 'A file format', 'A deadline'], correctIndex: 1, explanation: 'A quality benchmark is the standard the work must meet or beat.' },
      { id: 'df-9-15-q2', question: 'What is "proofing"?', options: ['Proving you did the work', 'Carefully checking for errors before finalising', 'Printing the work', 'Exporting to PDF'], correctIndex: 1, explanation: 'Proofing is carefully checking for errors before you finalise.' },
      { id: 'df-9-15-q3', question: 'What do "export settings" control?', options: ['The password', 'The format, resolution and size of the output', 'The font only', 'The deadline'], correctIndex: 1, explanation: 'Export settings determine the output format, resolution and size.' },
      { id: 'df-9-15-q4', question: 'How should AI use be handled in this project?', options: ['Kept secret', 'Fully documented — what was asked, produced and changed', 'Used to build everything', 'Avoided entirely'], correctIndex: 1, explanation: 'AI use must be fully documented, modelling professional AI norms.' },
      { id: 'df-9-15-q5', question: 'Where is the gap between "good" and "excellent" usually found?', options: ['In the file name', 'In the details and craft', 'In the deadline', 'In the colour only'], correctIndex: 1, explanation: 'Craft and attention to detail separate excellent work from merely good work.' },
    ],
  },
  {
    lessonId: 'df-9-16',
    questions: [
      { id: 'df-9-16-q1', question: 'What is portfolio curation?', options: ['Deleting all your work', 'Selecting and presenting your best work to make a specific impression', 'Printing everything', 'Hiding your work'], correctIndex: 1, explanation: 'Curation is choosing and presenting your best work deliberately.' },
      { id: 'df-9-16-q2', question: 'What is career readiness?', options: ['Having a CV only', 'Having the skills, habits and mindset employers look for', 'Being over 18', 'Owning a laptop'], correctIndex: 1, explanation: 'Career readiness is having the skills, habits and mindset employers value.' },
      { id: 'df-9-16-q3', question: 'What is digital literacy?', options: ['Reading e-books', 'The ability to confidently and critically use digital tools', 'Typing speed only', 'Owning a phone'], correctIndex: 1, explanation: 'Digital literacy is confidently and critically using digital tools.' },
      { id: 'df-9-16-q4', question: 'Why present a portfolio rather than just keep the files?', options: ['It wastes time', 'Presenting shows your growth and communicates your skills to others', 'To hide weak work', 'It is required by law'], correctIndex: 1, explanation: 'Presenting your portfolio communicates your skills and demonstrates growth.' },
      { id: 'df-9-16-q5', question: 'Digital Futures skills are useful in...', options: ['Only computer science', 'Almost every career, from the NHS to creative studios', 'No real jobs', 'Only IT support'], correctIndex: 1, explanation: 'Digital skills apply across nearly every career and subject.' },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────
export function getQuizForLesson(lessonId: string): DFQuiz | undefined {
  return DF_QUIZZES.find(q => q.lessonId === lessonId);
}

export function hasQuiz(lessonId: string): boolean {
  return DF_QUIZZES.some(q => q.lessonId === lessonId);
}
