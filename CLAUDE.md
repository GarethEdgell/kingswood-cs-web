# Kingswood Computer Science — Claude Code Reference

## Project Overview
School site for Kingswood School students providing Digital Futures curriculum (Year 8 & 9), OCR GCSE & A Level Computer Science revision, and interactive learning tools.

**Live site:** https://kingswoodcomputerscience.com  
**Owner:** Gareth Edgell (CompSci Tutoring)

## Tech Stack
- **Astro** (SSR via Vercel adapter) with **Svelte** component islands (`client:load`)
- **Tailwind CSS** — utility classes only
- **TypeScript** throughout
- **Supabase** for auth (Microsoft Entra ID / Azure AD) and progress tracking
- Deploy: `git push` → Vercel auto-deploys from `main`

## Design
**Deep-space dark theme** — distinctly different from compscitutoring.com:
- Base: `#050a14` (near-black)
- Primary: `#00d4ff` (electric cyan)
- Secondary: `#7c3aed` (vibrant purple)
- Accent: `#00ff94` (neon green)
- CSS grid overlay for "mission control" feel

## Commands
```
npm run dev    # local dev server
npm run build  # build & type-check — always run before committing
```

## Key File Locations

### Pages
| Path | Purpose |
|------|---------|
| `src/pages/index.astro` | Homepage |
| `src/pages/digital-futures/` | Digital Futures curriculum hub (Y8 & Y9) |
| `src/pages/revision/` | Revision hub, exam board landing pages (OCR GCSE/A-Level) |
| `src/pages/tools/` | Interactive tools (binary, logic gates, LMC, FSM, algorithms, trace table) |
| `src/pages/login.astro` | Microsoft SSO login page |
| `src/pages/signup.astro` | Account creation page |
| `src/pages/dashboard.astro` | Student dashboard (progress tracking) |
| `src/pages/teacher/digital-futures.astro` | Teacher class management |

### Components
| Path | Purpose |
|------|---------|
| `src/components/Nav.astro` | Navigation bar (with auth state) |
| `src/components/Footer.astro` | Footer |

### Data
| Path | Purpose |
|------|---------|
| `src/data/digitalFutures.ts` | Digital Futures curriculum (34 lessons, Microsoft 365 tools) |
| `src/data/questions.ts` | OCR GCSE & A Level question bank (~2,300+ questions) |
| `src/data/specs.ts` | Topic metadata and question counts |
| `src/data/scSpecs.ts` | Specification checklist statements |

## Authentication
**Microsoft Entra ID / Azure AD** via Supabase:
- Students sign in with school @kingswood email
- Roles: `student`, `teacher`, `admin`
- Progress tracked per user in Supabase

## Digital Futures Curriculum
**Year 8** (17 lessons) + **Year 9** (17 lessons)  
All lessons use **Microsoft 365 tools** (not Google):
- OneDrive (cloud storage)
- Word Online, Excel Online, PowerPoint Online
- Microsoft Forms (quizzes)
- Teams (collaboration)
- Microsoft Copilot (AI)
- Canva (design, third-party)

Each lesson has: objectives, vocab, timing breakdown (hook/teach/create/share), AI angle, homework, differentiation

## Question Bank
**~2,300+ OCR questions** organized by topic:
- **OCR GCSE (J277):** 6 topics
- **OCR A Level (H446):** 7 topics

Each question includes: type (MCQ/short/long), difficulty, spec statement, options, explanation

## Git Workflow
- Branch: `main` — push directly, Vercel auto-deploys
- Always run `npm run build` before committing
- Commit messages: imperative mood, describe the why

## Assignments, Quizzes & Teacher-Mediated AI
- **Quizzes:** auto-graded MCQs in `src/data/dfQuizzes.ts` (one per lesson). Engine: `src/components/Quiz.svelte`; practice page `digital-futures/quiz/[id].astro`. Add a quiz by appending a `DFQuiz` keyed by lesson id.
- **Assignments/submissions:** Supabase tables in `SUPABASE_ASSIGNMENTS.sql` (run once in the SQL editor). Teachers create assignments on the class page; students submit via `digital-futures/assignment/[id].astro`.
- **Teacher-mediated AI (under-13 safe):** Year 8 students never call a live AI. They submit work + a prompt; the teacher batch-runs them server-side via `/api/assignments/[id]/run-ai`, which is the ONLY caller of `src/lib/ai.ts`. Provider is env-switched (`AI_PROVIDER=stub|anthropic`); stub works with no key.

## Environment Variables
Set in Vercel:
```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AI_PROVIDER=stub            # or 'anthropic' to enable real AI
ANTHROPIC_API_KEY=          # required when AI_PROVIDER=anthropic
AI_MODEL=                   # optional override (default claude-haiku-4-5-20251001)
```

See `.env.example` for template.

## Deployment Checklist
- [ ] Run `SUPABASE_ASSIGNMENTS.sql` in the Supabase SQL editor (first deploy of assignments/quizzes)
- [ ] Build passes locally (`npm run build`)
- [ ] All new pages added to sitemap (if needed)
- [ ] Env vars set in Vercel dashboard
- [ ] Git push to main
- [ ] Vercel deploy completes successfully
- [ ] Test login/signup with Microsoft account
- [ ] Verify Digital Futures quizzes load
- [ ] Check revision question bank loads
