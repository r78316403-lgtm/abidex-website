# Abidex — Deployment Guide: GitHub → Cloudflare Pages

This guide walks you through deploying the Abidex website from GitHub to Cloudflare Pages with auto-deploy.

---

## Step 1: Prepare Your Local Repository

Your project is already initialized as a git repository. Run these commands in the project folder:

```bash
# Add all files
git add -A

# Commit
git commit -m "Abidex — Private Literary Society website ready for deployment"

# Check status
git status
```

---

## Step 2: Create a GitHub Repository

1. Go to **https://github.com/new**
2. **Repository name**: `abidex-website` (or any name you prefer)
3. **Description**: `Abidex — Private Literary Society & Managed Reader Experience`
4. Set to **Public** or **Private** (your choice)
5. **Do NOT** check "Add a README" or ".gitignore" — your project already has these
6. Click **Create repository**

---

## Step 3: Push Your Code to GitHub

After creating the repo, GitHub shows you commands. Use these (replace `YOUR_USERNAME` with your GitHub username):

```bash
# If you haven't set your git identity yet:
git config user.name "Your Name"
git config user.email "your-email@gmail.com"

# Add the remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/abidex-website.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

If prompted, enter your GitHub username and password (use a **Personal Access Token** as password — create one at https://github.com/settings/tokens with `repo` scope).

---

## Step 4: Connect Cloudflare Pages to GitHub

1. Go to **https://dash.cloudflare.com**
2. Sign in or create a free account
3. In the left sidebar, click **Workers & Pages**
4. Click **Create** → **Pages** → **Connect to Git**
5. **Connect your GitHub account** if not already connected:
   - Click **Connect Git**
   - Authorize Cloudflare on GitHub
   - Select your GitHub account
6. **Select your repository**: `abidex-website`
7. Click **Begin setup**

---

## Step 5: Configure Build Settings

On the "Set up builds and deployments" page, enter:

| Field | Value |
|---|---|
| **Project name** | `abidex` |
| **Production branch** | `main` |
| **Framework preset** | `Next.js` |
| **Build command** | `npx @cloudflare/next-on-pages` |
| **Build output directory** | `.vercel/output/static` |

### Environment Variables (click "Add variable" for each):

| Variable name | Value |
|---|---|
| `NODE_VERSION` | `20` |
| `SKIP_DEPENDENCY_INSTALLATION` | `false` |

> **Note**: If you have a `.env` file with payment keys or Google Sheets credentials, add those here too. Only add keys that don't contain secrets if this is a public repo.

### Advanced Settings:

1. Under **Settings** → **Functions** → **Compatibility flags**:
   - Add `nodejs_compat` to both Production and Preview
   - This is **required** for the AI chatbot API routes to work

2. Under **Settings** → **Build & Deploy**:
   - **Build command**: `npx @cloudflare/next-on-pages`
   - **Build output directory**: `.vercel/output/static`

---

## Step 6: Deploy

1. Click **Save and Deploy**
2. Cloudflare will now:
   - Clone your GitHub repo
   - Run the build command
   - Deploy to a `*.pages.dev` URL
3. Wait 2–5 minutes for the first build to complete
4. Your site will be live at: `https://abidex.pages.dev` (or whatever project name you chose)

---

## Step 7: Set Up Auto-Deploy from GitHub

This happens automatically! Once connected:

- Every time you `git push` to the `main` branch → Cloudflare auto-rebuilds and deploys
- Every pull request gets a preview deployment

To test:
```bash
# Make a change
git add -A
git commit -m "Update content"
git push origin main
```
Cloudflare will automatically rebuild and deploy within minutes.

---

## Step 8: Add a Custom Domain (Optional)

1. In Cloudflare Pages → your project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `abidex.com`)
4. Follow the DNS instructions Cloudflare provides
5. Cloudflare automatically provisions SSL

---

## Troubleshooting

### Build fails on Cloudflare

**Common issue**: `@cloudflare/next-on-pages` doesn't fully support Next.js 16 yet.

**Solution**: If the build fails, try this alternative approach:

1. In Cloudflare Pages settings, change the **Build command** to:
   ```
   npx @cloudflare/next-on-pages --experimental-minify
   ```
2. Make sure `NODE_VERSION` is set to `20`

### If Cloudflare build still fails — use Vercel instead

Vercel is the creator of Next.js and provides the best deployment experience:

1. Go to **https://vercel.com/new**
2. Import your GitHub repo
3. Vercel auto-detects Next.js — just click **Deploy**
4. Your site is live in 60 seconds at `https://abidex.vercel.app`
5. Auto-deploys from GitHub work the same way

### Chatbot doesn't work on Cloudflare

The AI chatbot uses `z-ai-web-dev-sdk` which needs Node.js compatibility. If it doesn't work on Cloudflare:

1. Make sure `nodejs_compat` flag is enabled (Step 5 above)
2. If still broken, the chatbot has a **keyword-based fallback** built in — it will still respond to common questions about services, pricing, contact info, etc.

### Committee form doesn't save on Cloudflare

The form uses an in-memory store that resets on each deploy. For persistent storage:
- Connect a database (Cloudflare D1, Supabase, or PlanetScale)
- Or have the form send data to your email via the WhatsApp/Email handoff buttons (which work regardless)

---

## Summary of What Happens

```
You write code locally
    ↓
git push origin main
    ↓
GitHub receives the code
    ↓
Cloudflare detects the push (auto-connected)
    ↓
Cloudflare clones the repo
    ↓
Runs: npx @cloudflare/next-on-pages
    ↓
Deploys to: https://abidex.pages.dev
    ↓
Site is live! 🎉
```

Every future `git push` to `main` triggers an automatic rebuild and deploy. No manual steps needed.
