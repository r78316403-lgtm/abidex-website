# KEDI Healthcare — E-Commerce Platform

A complete, modern, responsive e-commerce website for **KEDI Healthcare Ind. Nig. Ltd.** — a leading Nigerian health and wellness company offering quality herbal products, vitamins & supplements, and wellness equipment.

Built with Next.js 16, TypeScript, Prisma, Tailwind CSS 4, and shadcn/ui. Aligned with the KEDI brand: green & gold color palette, NGN pricing, Paystack/Flutterwave payment integration, and KEDI-specific content (Five Year Development Plan, Distributor opportunity, founder quote, focus areas).

---

## Brand Alignment with kedihealth.com

This platform mirrors the brand identity of [kedihealth.com](https://www.kedihealth.com):

| Element | Value |
|---|---|
| **Brand name** | KEDI Healthcare (legal: KEDI HEALTHCARE IND. NIG. LTD.) |
| **Tagline** | Open Up To A New Life With KEDI |
| **Slogan** | KEDI Brings You Health, Wealth, and Happiness! |
| **Founder / Chairman** | Mr. William Zhao |
| **Currency** | Nigerian Naira (₦) |
| **Default payment** | Paystack (Flutterwave also available) |
| **Color palette** | Deep herbal green primary + warm gold accent |
| **Hours** | Mon–Fri 9am to 5pm |
| **Programs highlighted** | Five-Year Plan 2024–2028, 2026 Car Award, KEDI Impact Fund, Aloe House |

### Product Catalog (56 products)

**3 categories** matching KEDI's structure:

1. **Herbal Medicine** (24 products) — Reishi, Cordyceps, Vigor Essential, Eve's Care, Golden Six, Gastrifort, Colon Cleanser, Magilim, Jointeez, Menstrual Reg, Eye Beta, Haemocare, Cardiovascular Support, Nasal Guard, Detox Kit, Stress Relief Tea, Liver Care, Memory Boost, Sleep Well, Prostate Care, Diabetes Care Tea, Hypertension Support, Immune Booster
2. **Vitamins & Supplements** (16 products) — Zenith Gold/Fem, V-Ca, Omega-3, Calcium, Multi-Vitamin, Vitamin E, B-Complex, Iron+Folic, Zinc, Vitamin D3, Magnesium, Probiotic, Collagen, Kids Gummies, Spirulina
3. **Equipment & Massagers** (16 products) — Blood Circulation Massager, Cervical Neck Massager, Foot Spa, BP Monitor, Pulse Oximeter, Infrared Thermometer, TENS, Handheld Massager, Acupuncture Pen, Eye Massager, Glucometer, Mini Massage Gun, Heat Therapy Belt, Steam Inhaler, Hot Water Bottle, KEDI Wellness Gift Box

**7 focus area tags** (matching KEDI's "Our Focus" navigation):
Man Power · Lady Care · Immune Boosting · Pain Relief · Vitamins/Body Nourishment · Disease Curative · Disease Preventive

### KEDI-specific Pages

- `/about` — KEDI's story, founder, mission
- `/distributor` — Become a KEDI distributor (replaces generic About for the business opportunity)
- `/five-year-plan` — KEDI Five Years Development Plan (2024–2028)
- `/faq` — KEDI-specific FAQs (NAFDAC, ordering, distributor, etc.)
- `/shipping` — Nigerian shipping info (Lagos 1-2 days, nationwide 3-5 days)
- `/returns` — 7-day return policy
- `/privacy`, `/terms` — KEDI-specific legal pages

### Homepage Sections (KEDI-aligned)

1. Hero: "Open Up To A New Life With KEDI" with Shop Now / Become a Distributor CTAs
2. Trust bar: Nationwide shipping · 7-day returns · NAFDAC-registered · Real KEDI support
3. Founder quote: "KEDI Brings You Health, Wealth, and Happiness!" — Mr. William Zhao
4. Shop by category (3 KEDI categories)
5. Featured products
6. Five Year Development Plan promo banner
7. Best sellers
8. Wellness focus areas (7 KEDI focus tags as clickable pills)
9. New arrivals
10. Distributor opportunity (with 2026 Car Award, Impact Fund, Aloe House)
11. Benefits (NAFDAC, fast fair shipping, easy returns)
12. Testimonials from Nigerian customers (Lagos, Abuja, Kano)
13. Newsletter signup
14. FAQ preview
15. Final CTA

---

## How to Customize Further

### 1. Business Information

Edit **`src/lib/site-config.ts`** — single source of truth for KEDI brand info. Replace placeholder contact info (email, phone, WhatsApp, address) with the real values.

### 2. Brand Colors

Edit **`src/app/globals.css`** — change the CSS variables in `:root` to adjust the green primary or gold accent.

### 3. Products

Edit **`scripts/seed-data.ts`** and re-run:
```bash
bun run scripts/seed.ts
```

To fully reset the database (deletes everything and re-seeds):
```bash
rm db/custom.db && bun run db:push && bun run scripts/seed.ts
```

Then restart the dev server so Prisma picks up the new DB.

### 4. Content Pages

Edit the `body` field in `scripts/seed.ts` (`contentPages` array) and re-run the seed, OR update the `ContentPage` table directly. The UI fetches these dynamically at `/api/content/[slug]`.

### 5. Payment Provider

Set `PAYMENT_PROVIDER` in `.env` to `paystack` (default), `flutterwave`, `stripe`, or `cod`. Add the matching credentials. See `.env.example`.

### 6. Google Sheets Sync

Set the `GOOGLE_SHEETS_*` env vars to enable automatic order row appending. See README below.

---

## Environment Variables

Create `.env` from `.env.example`:

```env
# Database (SQLite default — change to postgres:// for production)
DATABASE_URL=file:/home/z/my-project/db/custom.db

# Payment provider: paystack | flutterwave | stripe | cod
PAYMENT_PROVIDER=paystack

# Paystack (https://dashboard.paystack.com/#/settings/developer)
PAYSTACK_SECRET_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=

# Flutterwave (alternative)
FLUTTERWAVE_SECRET_KEY=
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_WEBHOOK_HASH=

# Google Sheets (optional)
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEETS_SPREADSHEET_ID=
GOOGLE_SHEETS_RANGE=Orders!A:T
```

---

## Project Structure

```
prisma/
  schema.prisma              # Database schema (products, orders, customers, etc.)
scripts/
  seed-data.ts              # 56 KEDI products + 3 categories + 3 brands
  seed.ts                   # Idempotent seed runner (KEDI content pages included)
src/
  app/
    api/                    # REST endpoints (/api/products, /api/orders, etc.)
    layout.tsx              # Root layout with KEDI metadata
    page.tsx                # Route dispatcher (hash-based SPA)
    globals.css             # KEDI green & gold design tokens
  components/
    ecommerce/              # Navbar, Footer, ProductCard, CartSheet, AppShell
    pages/                  # All page components (home, shop, product, checkout, etc.)
    providers.tsx           # Theme + QueryClient + Router + Cart sheet
    ui/                     # shadcn/ui component library
  lib/
    payment/                # Paystack, Flutterwave, Stripe, COD implementations
    integrations/
      google-sheets.ts      # Secure server-side Google Sheets writer
    cart-store.ts           # Zustand cart store (persisted)
    wishlist-store.ts      # Wishlist, recently-viewed, customer stores
    data-access.ts          # Server-side data access wrappers
    order-service.ts        # Order creation + payment verification
    router.tsx              # Hash-based SPA router + <Link>
    site-config.ts          # ⭐ KEDI brand config — edit this first
    types.ts                # Shared TypeScript types
```

---

## Verified

- ESLint passes clean
- Agent-browser end-to-end testing confirmed:
  - KEDI home page renders with all KEDI-specific sections
  - 3 KEDI categories with 56 products
  - Prices display in ₦ (Nigerian Naira)
  - Product detail pages work (Reishi, Vigor Essential, etc.)
  - Add-to-cart + cart sheet + checkout flow works with NGN totals
  - Distributor page, Five-Year Plan page, About page all render KEDI content
  - Mobile menu shows KEDI-specific navigation
  - Footer shows KEDI brand columns (Shop, Company, Help, Contact)

---

## Production Checklist

- [ ] Replace placeholder contact info in `src/lib/site-config.ts` (email, phone, WhatsApp, address)
- [ ] Replace placeholder product images with real KEDI product photography
- [ ] Set `PAYMENT_PROVIDER=paystack` and add Paystack credentials in `.env`
- [ ] Set `GOOGLE_SHEETS_*` env vars to enable order sync
- [ ] Change `siteConfig.url` to the real KEDI domain
- [ ] Update `metadataBase` in `src/app/layout.tsx`
- [ ] Configure Paystack/Flutterwave webhook URL to point to `/api/payment/webhook`
- [ ] Run `bun run db:push` on production database
- [ ] Run `bun run scripts/seed.ts` to load KEDI products
- [ ] Set up NAFDAC registration numbers on each product (via `specifications` field in seed-data)
- [ ] Test a real end-to-end purchase with live Paystack credentials

---

## Deployment

### Vercel (recommended)
1. Push to GitHub
2. Import into Vercel
3. Set env vars in dashboard
4. Change `DATABASE_URL` to managed Postgres
5. Run `bun run db:push` and `bun run scripts/seed.ts` on production DB

### Self-hosted
```bash
bun run build
bun run start
```

Use Caddy/Nginx for HTTPS, PM2/systemd for process management.
