# Digital Futures — Teacher Guide

**Site:** https://kingswoodcomputerscience.com
**Curriculum:** Digital Futures (Years 8 & 9) + self-guided GCSE/A-Level resources
**Written by:** a senior examiner in Computer Science and AI

---

## 1. What Digital Futures is

Digital Futures is a digital-skills and AI-literacy curriculum. It teaches pupils to
**create with technology, think critically about AI, and work safely online** — all built
on Microsoft 365, the platform used across the school.

- **Years 8 & 9:** one taught period per fortnight, following a structured sequence of lessons.
- **Years 10 & 11:** a self-guided course pupils work through independently.
- Every lesson is fully resourced: objectives, vocabulary, a timed plan (hook → teach →
  create → share), an AI angle, homework and differentiation.

Delivery is by **specialist Computer Science teachers**.

---

## 2. How pupils log in (anonymised accounts)

To protect pupil privacy, **no pupil name or email is stored.** Each pupil has an
anonymous username made of their **class code + a number**.

| Class | Code | Usernames |
|------|------|-----------|
| 9A | ic1 | `ic1-1` … `ic1-28` |
| 9B | ic2 | `ic2-1` … `ic2-28` |
| 9C | ic3 | `ic3-1` … `ic3-28` |
| 9D | ic4 | `ic4-1` … `ic4-28` |
| 9E | ic5 | `ic5-1` … `ic5-28` |
| 9F | ic6 | `ic6-1` … `ic6-28` |
| 9G | ic7 | `ic7-1` … `ic7-28` |

**To log in:** pupils go to `/login`, type their **username** (e.g. `ic1-3`) and the
**password** on their login card. They do **not** type an email address.

> You decide which pupil uses which number — keep your own private paper register
> mapping real names to numbers. The system never sees the name.

---

## 3. Teacher (master) accounts

There are **5 master teacher accounts**: usernames `teacher1` … `teacher5`.
They have the **admin** role, which means they can:

- see every class and its progress
- generate progress reports
- **reset any pupil's password**

Log in exactly like a pupil — type `teacher1` (not an email) and your password.
Your logins are in **`credentials/teachers.csv`** after setup.

---

## 4. Resetting passwords

Two ways — both master-teacher only.

**In the app (easiest):**
1. Log in as a teacher → **Teacher Dashboard → 🔑 Passwords & Accounts** (`/teacher/accounts`).
2. **One pupil:** type their username (e.g. `ic1-3`) → *Reset password*.
3. **Whole class:** click the class tile (e.g. 9A) → confirm. All 28 get fresh passwords.
4. The new password(s) are shown **once** — copy them with *Copy all* and note them down.

**In bulk from a spreadsheet:** the initial setup writes a CSV per class to the
`credentials/` folder, which you print and cut into login cards.

---

## 5. First-time setup (one-off, technical)

This creates all the accounts. Done once by whoever has the Supabase service key.

1. Open PowerShell in the project folder.
2. Set the two values (service key from **Supabase → Settings → API → service_role**):
   ```powershell
   $env:SUPABASE_URL="https://fwudtosslyvtzqxztohl.supabase.co"
   $env:SUPABASE_SERVICE_KEY="<service_role key>"
   node scripts/seed-school.mjs
   ```
3. It creates 5 teachers, 7 classes and 28 pupils per class, and writes credential CSVs
   to the **`credentials/`** folder (git-ignored — never committed).
4. Print `credentials/ic1-9A.csv` … one card per pupil. Keep `teachers.csv` for staff.

Re-running is safe: existing accounts are left untouched (passwords unchanged). To change
passwords, use the reset tools in section 4.

---

## 6. Using the class dashboard

- **Teacher Dashboard** (`/teacher/digital-futures`) lists your classes with pupil counts.
- Click a class to see the **pupil list**, lessons completed and average scores.
- **Generate Reports** writes a personalised progress paragraph for each pupil, drawn
  from their real per-lesson scores. Copy them straight into your reporting system.

---

## 7. Keeping the system online

The database is on Supabase's free tier, which **pauses a project after 7 days with no
activity**. Two safeguards are in place / recommended:

1. **Automatic (already set up):** a daily "keep-alive" job (`/api/keep-alive`, run by
   Vercel Cron at 06:00) pings the database so it never goes idle.
2. **Recommended for real classes:** upgrade Supabase to the **Pro plan (~$25/month)**,
   which removes pausing entirely and adds daily backups. Worth it once pupils rely on it.

If the site ever shows a database error after a long holiday, log into Supabase and click
**Restore/Resume** on the project — it comes back in a couple of minutes with all data intact.

---

## 8. Troubleshooting

| Problem | Fix |
|--------|-----|
| Pupil "invalid login" | Check they typed the **username only** (no email), and the exact password. Reset it if unsure. |
| "Welcome back, Student" but no teacher tools | The account isn't a teacher — use a `teacher1–5` login. |
| Whole class can't log in after a holiday | Supabase paused — resume it in the Supabase dashboard (section 7). |
| Reset button says "server not configured" | `SUPABASE_SERVICE_ROLE_KEY` is missing in Vercel → add it in Vercel → Settings → Environment Variables and redeploy. |

---

## 9. Data & safeguarding summary (for your records)

- **No pupil names or emails** are stored — accounts are anonymous codes only.
- The name↔number mapping stays **offline, with the class teacher**.
- Pupils cannot self-register; accounts are created centrally.
- Year 8 pupils never call a live AI directly; AI tasks are teacher-mediated.
- Passwords are teacher-resettable at any time.
