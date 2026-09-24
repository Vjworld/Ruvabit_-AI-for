# Netlify Deployment Guide - Ruvabit Site

**Framework:** TanStack Start + React + Supabase  
**Deployment Target:** Netlify  
**Status:** Ready to Deploy  

---

## Quick Start (5 Minutes)

### Step 1: Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Authorize Netlify to access your repositories

### Step 2: Connect GitHub Repository
1. Click **"New site from Git"**
2. Select **GitHub** as your Git provider
3. Search for: `Ruvabit_-AI-for-Effortless-Business`
4. Click **Connect**

### Step 3: Configure Build Settings

Netlify should auto-detect TanStack Start. Confirm:

**Build Settings:**
- **Build command:** `npm run build`
- **Publish directory:** `dist/public`
- **Node version:** 18+ (recommended)

### Step 4: Set Environment Variables

Click **"Site settings"** → **"Build & deploy"** → **"Environment"**

Add these secrets from your Supabase project:

```
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 5: Deploy!
Click **"Deploy"** and wait ~5 minutes. ✅

---

## Detailed Setup Guide

### Prerequisites Checklist

- [ ] GitHub account with the repo pushed
- [ ] Supabase project created and running
- [ ] Supabase "leads" table with required columns
- [ ] Supabase API keys (anon + service role)
- [ ] Custom domain (optional)

### 1. Verify Supabase Setup

#### Required Table: "leads"

Your Supabase database must have a `leads` table with these columns:

```sql
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(120) NOT NULL,
  email varchar(200) NOT NULL,
  company varchar(160),
  phone varchar(40),
  team_size varchar(60),
  interest varchar(120),
  message varchar(4000),
  source_page varchar(200),
  stage varchar(50) DEFAULT 'new',
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);
```

#### Get Your Supabase Credentials

**Location:** Supabase Dashboard → Project Settings → API

1. **SUPABASE_URL:** Copy from "Project URL"
2. **SUPABASE_ANON_KEY:** Copy from "anon public" key
3. **SUPABASE_SERVICE_ROLE_KEY:** Copy from "service_role" key

⚠️ **Security Note:** Never commit these keys to GitHub. Always use Netlify environment variables.

### 2. Create Netlify Account

**Option A: With GitHub (Recommended)**
1. Visit [netlify.com/signup](https://netlify.com/signup)
2. Click "Sign up with GitHub"
3. Authorize Netlify to access your GitHub account
4. Accept the required permissions

**Option B: Email Signup**
1. Visit [netlify.com/signup](https://netlify.com/signup)
2. Enter email and password
3. Verify email
4. You'll be prompted to connect GitHub later

### 3. Connect Your GitHub Repository

#### First Time Setup

1. **Log in** to Netlify Dashboard
2. Click **"New site from Git"** (or "Create new site")
3. Choose **GitHub** as your provider
4. Select your repository: `Ruvabit_-AI-for-Effortless-Business`
5. Click **"Connect"**

#### Already Connected?
Skip to Step 4 (Configure Build Settings)

### 4. Configure Build Settings

After selecting your repo, you'll see build settings:

**Fill in:**
- **Build command:** `npm run build`
- **Publish directory:** `dist/public`
- **Node.js version:** 18.x or higher

**Other settings:**
- Keep defaults for now
- You can optimize later

### 5. Add Environment Variables

**Before deploying**, add your Supabase credentials:

1. **Don't deploy yet** — scroll down and look for environment variables
2. Click **"Add environment variables"**
3. Add these key-value pairs:

| Key | Value | Notes |
|---|---|---|
| SUPABASE_URL | https://your-project.supabase.co | From Supabase dashboard |
| SUPABASE_ANON_KEY | eyJ... (long string) | From Supabase API keys |
| SUPABASE_SERVICE_ROLE_KEY | eyJ... (long string) | From Supabase API keys |

### 6. Deploy

1. Click **"Deploy site"**
2. Watch the build logs for ~3-5 minutes
3. When complete, you'll see a green checkmark ✅

**Your site is now live!** You'll get a URL like:
```
https://name-random.netlify.app
```

### 7. Test the Contact Form

1. Visit your Netlify URL
2. Navigate to `/contact`
3. Fill out the contact form
4. Submit
5. Check Supabase → `leads` table for the new entry

✅ If you see the submission in the table, everything works!

---

## Environment Variables Reference

### What Each Variable Does

#### SUPABASE_URL
- **Purpose:** Tells the app where your Supabase database is
- **Format:** `https://[project-id].supabase.co`
- **Where to find:** Supabase Dashboard → Project Settings → Configuration

#### SUPABASE_ANON_KEY
- **Purpose:** Public key for browser requests (read-only by default)
- **Format:** Long JWT token starting with `eyJ...`
- **Where to find:** Supabase Dashboard → Settings → API → anon public

#### SUPABASE_SERVICE_ROLE_KEY
- **Purpose:** Admin key for server-side requests (can write/read)
- **Format:** Long JWT token starting with `eyJ...`
- **Where to find:** Supabase Dashboard → Settings → API → service_role
- **Security:** Never expose in frontend code

---

## Post-Deployment Configuration

### 1. Custom Domain (Optional)

**If you want a custom domain:**

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `ruvabit.com`)
4. Follow DNS configuration steps
5. Netlify will provision SSL certificate automatically

**Popular domain registrars:**
- Namecheap
- GoDaddy
- Google Domains
- Cloudflare

### 2. SSL/TLS Certificate

✅ **Automatic:** Netlify provides free SSL via Let's Encrypt

### 3. Enable Auto-Deploy

Netlify auto-deploys when you push to main branch. To control this:

1. **Site settings** → **Build & deploy** → **Deploy settings**
2. Choose auto-deploy behavior
3. Optional: Require manual approval for deployments

### 4. Monitor Performance

**Useful dashboards:**
- **Netlify Analytics:** Monitor site traffic and performance
- **Google Analytics:** If enabled (via environment variables)
- **Netlify Logs:** Debug build/runtime issues

---

## Troubleshooting

### Build Fails with "Cannot find module"

**Solution:** Netlify might have a different Node version

1. Add to your `netlify.toml`:
```toml
[build.environment]
  NODE_VERSION = "18.17.0"
```

2. Push to GitHub
3. Netlify auto-redeploys

### Contact Form Not Working

**Check:**
1. Environment variables are set correctly
2. Supabase "leads" table exists
3. Browser console for errors (F12 → Console)
4. Netlify function logs (Site settings → Functions)

### Slow Build Times

**Optimize:**
1. Clear Netlify cache (Site settings → Clear cache and deploy)
2. Optimize node_modules (remove unused dependencies)
3. Enable branch deploys for testing

---

## Advanced Configuration

### Create netlify.toml

Create a `netlify.toml` file in your project root for advanced config:

```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist/public"

[build.environment]
  NODE_VERSION = "18.17.0"

[dev]
  command = "npm run dev"
  port = 3000

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
```

### Rate Limiting

To prevent form spam:

1. Add to your contact form handler
2. Implement CAPTCHA (optional)
3. Use Netlify Functions for validation

### Analytics Setup

Add Google Analytics (if using):

1. **Environment variable:** `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX`
2. Netlify auto-injects on build
3. Monitor at Google Analytics dashboard

---

## Security Checklist

- [ ] Environment variables set in Netlify (not in code)
- [ ] Service role key never exposed in frontend
- [ ] HTTPS enabled (automatic)
- [ ] Supabase Row Level Security (RLS) configured
- [ ] Rate limiting on contact form
- [ ] CORS configured for Supabase

### Supabase Row Level Security (RLS)

Enable RLS on the "leads" table:

```sql
-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow inserts (form submissions)
CREATE POLICY "Allow anonymous inserts"
  ON leads FOR INSERT
  WITH CHECK (true);
```

---

## Going Live - Final Checklist

- [ ] Repository pushed to GitHub
- [ ] Netlify connected to GitHub repo
- [ ] Build command set: `npm run build`
- [ ] Publish directory: `dist/public`
- [ ] Environment variables added (all 3)
- [ ] Supabase "leads" table created
- [ ] RLS policies configured
- [ ] Site deployed successfully
- [ ] Contact form tested
- [ ] Form submission appears in Supabase
- [ ] Custom domain added (optional)
- [ ] Analytics configured (optional)

---

## Support & Resources

**Netlify Documentation:**
- [TanStack Start Deployment](https://tanstack.com/start/latest/docs/deployment)
- [Netlify Build Settings](https://docs.netlify.com/configure-builds/overview/)
- [Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)

**Supabase Documentation:**
- [Auth & API Keys](https://supabase.com/docs/guides/api)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Setup](https://supabase.com/docs/guides/database)

**Contact for Help:**
- Netlify Support: [support.netlify.com](https://support.netlify.com)
- Supabase Support: [discord.gg/bnncdtPxZS](https://discord.gg/bnncdtPxZS)

---

## Summary

**What You'll Have:**
✅ Live website on Netlify  
✅ Working contact form with Supabase database  
✅ Free SSL certificate  
✅ Auto-deploy from GitHub  
✅ Production-ready setup  

**Time to Live:** ~10 minutes from now

**Cost:** FREE (both Netlify and Supabase have generous free tiers)

---

**Next Step:** Start with Step 1 (Create Netlify Account) above! 🚀
