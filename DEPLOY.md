# Deployment Guide — kingswoodcomputerscience.com

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Create repo: `kingswood-cs-web` (or your preferred name)
3. Make it **Public** (so Vercel can deploy)
4. Do **not** initialize with README (we have one)

## Step 2: Push to GitHub

```bash
cd C:\Users\garet\kingswood-cs-web
git remote add origin https://github.com/YOUR_USERNAME/kingswood-cs-web.git
git push -u origin main
```

## Step 3: Connect to Vercel

1. Go to https://vercel.com and log in
2. Click **"Add New..." → "Project"**
3. Import from GitHub → select `kingswood-cs-web`
4. **Framework Preset:** Astro (auto-detected)
5. **Root Directory:** `./` (default)
6. **Build Command:** `npm run build` (auto-detected)
7. **Output Directory:** `.astro/static` (auto-detected)

## Step 4: Set Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

```
PUBLIC_SUPABASE_URL=<your_supabase_project_url>
PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
```

Get these from Supabase → Project Settings → API keys.

## Step 5: Configure Custom Domain

1. In Vercel dashboard, go to **Settings → Domains**
2. Add domain: `kingswoodcomputerscience.com`
3. Update your domain registrar's DNS to point to Vercel:
   - Type: `CNAME`
   - Name: `kingswoodcomputerscience.com`
   - Value: `cname.vercel-dns.com` (Vercel will provide the exact value)

## Step 6: Set Up Microsoft Entra ID

1. Create a Supabase project (if not done): https://supabase.com
2. Go to **Auth → Providers → Azure**
3. Set up Azure AD OAuth:
   - **Tenant ID:** Your school's Azure tenant
   - **Client ID & Secret:** From Azure portal
4. Set **Redirect URL** to: `https://kingswoodcomputerscience.com/auth/callback`

## Step 7: Verify Deployment

After pushing and connecting Vercel:
- Vercel auto-deploys on `git push`
- Check https://kingswoodcomputerscience.com
- Test login with a school Microsoft account
- Check Digital Futures loads
- Verify question bank is accessible

## Next Steps

Once live:
- [ ] Populate more revision content (notes, flashcards)
- [ ] Set up Supabase database schema for tracking progress
- [ ] Test Microsoft SSO end-to-end
- [ ] Onboard first group of students
- [ ] Monitor analytics (Vercel dashboard)
- [ ] Gather feedback from teachers/students

## Troubleshooting

**Build fails on Vercel:**
- Check logs: Vercel dashboard → Deployments → View Logs
- Ensure all env vars are set

**Custom domain not working:**
- Allow up to 24 hours for DNS propagation
- Check domain registrar DNS settings

**Login not working:**
- Verify Supabase env vars are correct
- Check Azure AD OAuth configuration
- Ensure redirect URL matches exactly

---

Questions? Check CLAUDE.md for project structure and file locations.
