# KEDI Healthcare — SEO & Google Ranking Guide

This guide explains the SEO infrastructure built into your site and the steps you need to take to rank on Google.

---

## ✅ What's Already Built (Technical SEO)

### 1. Per-page metadata (titles, descriptions, canonical)
Every page dynamically sets:
- `<title>` tag (unique per page, e.g. "Reishi Herbal Capsules — Buy Online in Nigeria | KEDI Healthcare")
- `<meta name="description">` (compelling, keyword-rich, ~150 chars)
- `<link rel="canonical">` (prevents duplicate content)
- Open Graph + Twitter Card tags (for social sharing)
- Robots meta (`index, follow` for content pages, `noindex, nofollow` for cart/checkout/account)

### 2. Structured data (JSON-LD) for Google rich results
- **Organization schema** (knowledge panel, sitelinks search bar)
- **WebSite schema** (with SearchAction for Google sitelinks search)
- **HealthAndBeautyBusiness schema** (local business listing)
- **Product schema** on every product page (price, availability, ratings, brand)
- **BreadcrumbList schema** on product/category/content pages (breadcrumb trails in SERP)
- **FAQPage schema** on the FAQ page (FAQ rich results)
- **ItemList schema** on category/shop pages (carousel eligibility)

### 3. Sitemap (`/sitemap.xml`)
Dynamic sitemap including:
- All static pages (home, shop, about, distributor, contact, etc.)
- All 3 category pages
- All 56 product pages with `<image>` tags for Google Image search
- Auto-refreshes every hour

Submit this URL in Google Search Console: `https://www.kedihealth.com/sitemap.xml`

### 4. Robots.txt (`/robots.txt`)
- Allows Googlebot, Bingbot, Twitterbot, Facebookbot full access
- Blocks `/api/`, `/checkout`, `/cart`, `/account`, `/orders`, `/order/` (private pages)
- References the sitemap location
- Sets a 1-second crawl delay

### 5. Open Graph image (`/og-image.png`)
1200×630 PNG showing KEDI branding — used when anyone shares your site on WhatsApp, Facebook, Twitter, LinkedIn. Looks professional.

### 6. favicons + web manifest
- `favicon.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`
- `manifest.json` for PWA support
- KEDI green theme color (#1f5a3e) in browser chrome on mobile

### 7. Semantic HTML & accessibility
- Proper `<h1>`, `<h2>`, `<h3>` hierarchy (one `<h1>` per page)
- `<main>`, `<header>`, `<footer>`, `<nav>`, `<article>`, `<section>` semantic tags
- `alt` text on all product images
- `aria-label` on icon-only buttons
- Keyboard navigation support

### 8. Mobile-first responsive design
- Tested at 375px (iPhone), 768px (tablet), 1280px (laptop), 1920px (desktop)
- Mobile-friendly = ranking boost in Google's mobile-first index

### 9. Performance optimizations
- Next.js 16 with Turbopack
- Lazy-loaded images (`loading="lazy"`)
- Code-splitting via React.lazy + Suspense
- Tailwind CSS 4 (minimal CSS bundle)
- Persistent cart in localStorage (no server round-trips)
- Stale-while-revalidate caching with TanStack Query

### 10. Internal linking
- Footer links to all major sections (Shop, Categories, Distributor, About, Contact, FAQ, Shipping, Returns, Privacy, Terms)
- Breadcrumbs on product & category pages
- "Related products" on every product page
- "Recently viewed" on every product page
- Cross-links between About → Distributor → Contact

---

## 🚀 What You Need to Do to Rank on Google

### Step 1: Set up Google Search Console (CRITICAL)

1. Go to **https://search.google.com/search-console**
2. Sign in with `isiaqmusa123456abc@gmail.com`
3. Click **Add property** → **URL prefix** → enter `https://www.kedihealth.com`
4. Verify ownership. Choose **HTML tag** method — copy the `content=` value
5. Add it to your `.env`:
   ```
   GOOGLE_SITE_VERIFICATION=your_verification_code_here
   ```
6. Redeploy the site
7. Back in Search Console, click **Verify**

### Step 2: Submit your sitemap

1. In Search Console → **Sitemaps**
2. Enter `sitemap.xml` (relative URL)
3. Click **Submit**
4. Wait 2-7 days for Google to crawl all your pages

### Step 3: Set up Google Analytics 4 (optional but recommended)

1. Go to **https://analytics.google.com**
2. Create a property for kedihealth.com
3. Get your Measurement ID (looks like `G-XXXXXXXXXX`)
4. Add to `.env`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
5. Redeploy — the GA4 script will be added automatically

### Step 4: Set up Google Business Profile (CRITICAL for local SEO)

1. Go to **https://business.google.com**
2. Add KEDI Healthcare as a business
3. Verify the address
4. Add hours, photos, services, products
5. This gets you into Google Maps + Local Pack results when people search "herbal medicine near me" or "KEDI distributor Lagos"

### Step 5: Add real NAFDAC numbers + product photography

Currently, products use Unsplash placeholder images. To rank well:
1. Replace each product's `thumbnail` and `images` URLs in `scripts/seed-data.ts` with real product photos
2. Add NAFDAC registration numbers to each product's `specifications` field
3. Run `bun run scripts/seed.ts` to update the database
4. Real, original product images are a major ranking signal — Google prefers unique images over stock photos

### Step 6: Content marketing (BIGGEST long-term lever)

Google ranks sites that have fresh, helpful content. Some ideas:
- Start a **blog** at `/#/blog` with articles like:
  - "5 Benefits of Reishi Mushroom for Immune Health"
  - "Why Nigerian Men Are Choosing Vigor Essential"
  - "How to Become a Successful KEDI Distributor in 2026"
  - "The Science Behind Cordyceps: A Nigerian's Guide"
- Each article targets a long-tail keyword (e.g. "Reishi mushroom benefits Nigeria")
- Add internal links from articles to relevant products
- Aim for 1-2 articles per week

### Step 7: Get backlinks (off-page SEO)

- Get listed in Nigerian directories (Vconnect, Finelib, Bizbang Nigeria)
- Partner with Nigerian health bloggers for guest posts
- Get featured in NAFDAC's registered companies list (if applicable)
- Distributor testimonials on social media with links back to your site
- Press releases when you launch new programs (Five-Year Plan, Car Award)

### Step 8: Enable Google Tag Manager + Meta Pixel (optional)

For advanced tracking & retargeting:
```
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=1234567890
```

---

## 📊 Keywords to Target

The site is optimized for these primary keywords (already in titles, descriptions, content):

**Brand keywords (easy to rank):**
- "KEDI Healthcare Nigeria"
- "KEDI herbal products"
- "KEDI distributor"

**Product keywords (medium difficulty):**
- "Reishi capsules Nigeria"
- "Cordyceps supplements Lagos"
- "Vigor Essential man power"
- "Golden Six capsules"
- "buy herbal medicine online Nigeria"
- "blood circulation massager Nigeria"

**Informational keywords (top of funnel):**
- "herbal medicine for immune system Nigeria"
- "natural supplements for men's health Lagos"
- "Chinese herbal medicine Nigeria"
- "NAFDAC registered herbal products"

**Transactional keywords (bottom of funnel):**
- "buy Reishi capsules online"
- "Paystack herbal store Nigeria"
- "herbal medicine delivery Lagos"
- "KEDI products price list"

---

## 📈 Monitoring Your Rankings

After deploying:
1. **Search Console → Performance** — see which queries bring clicks
2. **Search Console → Coverage** — make sure all 70+ pages are indexed
3. **Search Console → Core Web Vitals** — monitor page speed
4. **Google Analytics → Engagement** — see which pages people stay on

Expect to see:
- Indexed pages: 2-4 weeks after sitemap submission
- First organic impressions: 4-8 weeks
- Meaningful organic traffic: 3-6 months
- Page 1 rankings for brand keywords: 1-2 months
- Page 1 rankings for product keywords: 6-12 months

---

## 🔧 Technical Files Modified for SEO

| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root metadata, JSON-LD, GA, GTM, Meta Pixel, favicon refs |
| `src/lib/site-config.ts` | SEO config + contact info + social links |
| `src/lib/use-seo.ts` | Client-side SEO hook (updates meta per route) |
| `src/lib/structured-data.ts` | JSON-LD schema builders |
| `src/app/sitemap.xml/route.ts` | Dynamic sitemap |
| `public/robots.txt` | Crawler directives |
| `public/og-image.png` | Social share image (1200×630) |
| `public/manifest.json` | PWA manifest |
| `public/favicon.png`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | Favicons |
| All `src/components/pages/*.tsx` | Per-page SEO via `useSeo()` hook |

---

## 🎯 Summary

Your site now has **production-grade SEO infrastructure** that matches what top Nigerian e-commerce sites (Jumia, Konga, PharmacyDirect) use. The remaining work is:
1. **Verify in Google Search Console** (5 minutes)
2. **Submit sitemap** (1 minute)
3. **Replace placeholder product images with real photos** (1-2 days)
4. **Add NAFDAC registration numbers** (1 day)
5. **Start a blog** (ongoing)
6. **Build backlinks** (ongoing)

With consistent content + the technical SEO already in place, you should see first-page rankings for "KEDI Healthcare" within 1-2 months and meaningful organic traffic within 6 months.
