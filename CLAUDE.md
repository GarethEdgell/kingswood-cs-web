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

## Environment Variables
Set in Vercel:
```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

See `.env.example` for template.

## Deployment Checklist
- [ ] Build passes locally (`npm run build`)
- [ ] All new pages added to sitemap (if needed)
- [ ] Env vars set in Vercel dashboard
- [ ] Git push to main
- [ ] Vercel deploy completes successfully
- [ ] Test login/signup with Microsoft account
- [ ] Verify Digital Futures quizzes load
- [ ] Check revision question bank loads
