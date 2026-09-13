# Mercato — Production-Ready E-Commerce Platform

A complete, modern, responsive e-commerce website built with Next.js 16, TypeScript, Prisma, Tailwind CSS 4, and shadcn/ui. Designed to scale from the 58 seeded placeholder products to hundreds or thousands of products without touching the frontend.

---

## What's Built

**Full customer journey**
- Browse / search / filter / sort 58 products across 6 categories
- Product detail page with image gallery, variations, related items, reviews
- Persistent shopping cart (localStorage + slide-out cart sheet)
- Multi-step checkout (contact info → delivery address → payment method)
- Order confirmation page with status timeline + server-side payment verification
- Wishlist with "move all to cart"
- Account sign-in (guest checkout supported)
- Order history lookup by email
- Contact page, FAQ, About, Shipping, Returns, Privacy, Terms — all editable via the database

**Architecture**
- **Routing**: hash-based SPA router. All pages render through `/` so the entire experience lives on one externally-visible route while remaining fully deep-linkable (e.g. `/#/product/aria-wireless-noise-cancelling-headphones`).
- **Data layer**: Prisma + SQLite. Centralized schema for products, categories, brands, orders, customers, reviews, content pages, newsletter subscribers, contact messages.
- **State**: Zustand stores for cart, wishlist, recently-viewed, and customer session — all persisted to localStorage.
- **Server data**: TanStack Query for caching + refetching.
- **Payment**: modular provider registry (`src/lib/payment/`) with Stripe, Paystack, Flutterwave, and Cash-on-Delivery implementations. Each provider is a self-contained class. Adding a new gateway takes one file.
- **Google Sheets**: server-side order sync via JWT-signed service account. Credentials never touch the browser.
- **SEO**: per-page metadata, Open Graph, Twitter cards, JSON-LD structured data on product pages, semantic HTML, mobile-first responsive design.

---

## Project Structure

```
prisma/
  schema.prisma              # Database schema (products, orders, customers, etc.)
scripts/
  seed-data.ts              # 58 placeholder products + 6 categories + 8 brands
  seed.ts                   # Idempotent seed runner
src/
  app/
    api/                    # All REST endpoints (see "API Routes" below)
    layout.tsx              # Root layout, fonts, metadata
    page.tsx                # Route dispatcher — renders the right page by URL hash
    globals.css             # Design tokens + custom utilities
  components/
    ecommerce/              # Navbar, Footer, ProductCard, CartSheet, AppShell, etc.
    pages/                  # All page components (home, shop, product, checkout, etc.)
    providers.tsx           # Theme + QueryClient + Router + Cart sheet
    ui/                     # shadcn/ui component library
  lib/
    payment/                # Payment provider abstraction (Stripe / Paystack / Flutterwave / COD)
      providers/            # One file per provider
    integrations/
      google-sheets.ts      # Secure server-side Google Sheets writer
    cart-store.ts           # Zustand cart store (persisted)
    wishlist-store.ts      # Wishlist, recently-viewed, customer stores (persisted)
    data-access.ts          # Server-side data access wrappers
    order-service.ts        # Order creation + server-side payment verification
    router.tsx              # Hash-based SPA router + <Link> component
    site-config.ts          # ⭐ Single source of truth for business info
    types.ts                # Shared TypeScript types
    db.ts                   # Prisma client singleton
    use-search.ts           # Client-side search hook
```

---

## How to Customize

### 1. Business Information (name, contact, social, shipping rates)

Edit **`src/lib/site-config.ts`** — every UI element reads from this single file, so updating it propagates everywhere automatically.

```ts
export const siteConfig = {
  name: "Mercato",                    // ← your business name
  tagline: "Considered goods for everyday life",
  description: "...",
  url: "https://your-store.com",      // ← your domain (for SEO + payment callbacks)
  contact: {
    email: "hello@your-store.com",
    phone: "+1 (555) 012-3456",
    whatsapp: "+15550123456",         // international format, no "+"
    address: "...",
    hours: "Mon-Fri 9am-6pm, Sat 10am-4pm",
  },
  social: { instagram, twitter, facebook, youtube, pinterest },
  currency: { code: "USD", symbol: "$", position: "before" },
  shipping: { freeThreshold: 50, standardRate: 5.99, expressRate: 19.99 },
  payment: { provider: "stripe" },   // or "paystack" | "flutterwave" | "cod"
  legal: { registrationYear: 2024, legalName: "Mercato Retail Ltd." },
};
```

### 2. Brand Colors & Typography

Edit **`src/app/globals.css`** — change the CSS variables in the `:root` block. The current palette uses an espresso primary (`oklch(0.22 0.02 60)`) and an ember accent (`oklch(0.62 0.18 35)`). Update the `--accent`, `--primary`, etc. tokens to retheme the entire site.

Typography: the layout uses Inter (body) and Playfair Display (display headings). To switch fonts, update the imports in `src/app/layout.tsx`.

### 3. Products

**Add a new product** — append an entry to the `products` array in `scripts/seed-data.ts`, then run:

```bash
bun run scripts/seed.ts
```

The seed script is idempotent (it upserts), so it's safe to re-run.

To replace the placeholder catalog with real products: edit `scripts/seed-data.ts` directly. The UI dynamically reads from the database — no code changes required.

You can also add products at runtime via the Prisma client or an admin dashboard (the data model is ready for one; you'd just build UI on top of `src/lib/data-access.ts`).

### 4. Content Pages (About, FAQ, Shipping, Returns, Privacy, Terms)

Edit the `body` field in `scripts/seed.ts` (`contentPages` array) and re-run the seed, OR update the rows directly in the `ContentPage` table. The UI fetches these dynamically at `/api/content/[slug]`.

### 5. Payment Provider

Set `PAYMENT_PROVIDER` in `.env` to one of:
- `stripe` (default — supports Visa, Mastercard, Amex worldwide)
- `paystack` (Nigeria + supported African countries)
- `flutterwave` (Africa + global)
- `cod` (cash on delivery — no external integration required)

Then add the provider-specific credentials (see "Environment Variables" below).

To add a **new** payment provider:
1. Create `src/lib/payment/providers/yourprovider.ts` implementing the `PaymentProvider` interface.
2. Register it in `src/lib/payment/index.ts` `providers` map.
3. Set `PAYMENT_PROVIDER=yourprovider` in `.env`.

No other code changes are required — checkout, verification, and webhooks all use the abstraction.

### 6. Google Sheets Sync

When an order is placed, a row is appended to your Google Sheet. To enable:

1. Create a Google Cloud service account.
2. Enable the Google Sheets API for the project.
3. In your Google Sheet, click **Share** and add the service account email as an Editor.
4. Add the following to `.env`:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=1Abc...          # from the sheet URL
GOOGLE_SHEETS_RANGE=Orders!A:T                # optional, defaults to "Orders!A:T"
```

If credentials are missing, the integration silently no-ops — the customer's checkout flow still completes.

The sheet will receive these columns (in order):
Order ID | Order Date | First Name | Last Name | Email | Phone | Address | City | State | Country | Postal Code | Products | Product IDs | Quantities | Subtotal | Shipping | Discount | Total | Payment Method | Payment Status | Order Status

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Database (already set by the scaffold — SQLite by default)
DATABASE_URL=file:/home/z/my-project/db/custom.db

# Payment provider selection
PAYMENT_PROVIDER=stripe         # stripe | paystack | flutterwave | cod

# Stripe (only if PAYMENT_PROVIDER=stripe)
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Paystack (only if PAYMENT_PROVIDER=paystack)
PAYSTACK_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxx

# Flutterwave (only if PAYMENT_PROVIDER=flutterwave)
FLUTTERWAVE_SECRET_KEY=FLWSECK-xxx
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxx
FLUTTERWAVE_WEBHOOK_HASH=...

# Google Sheets (optional — leave blank to disable)
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEETS_SPREADSHEET_ID=
GOOGLE_SHEETS_RANGE=Orders!A:T
```

**Security notes:**
- All `*_SECRET_KEY`, `*_WEBHOOK_*`, `GOOGLE_PRIVATE_KEY`, and `PAYSTACK_SECRET_KEY` values are server-only. They are never exposed to the browser.
- Only keys prefixed with `NEXT_PUBLIC_` are visible to the client. The codebase uses these exclusively for non-sensitive public keys (e.g., Stripe publishable key).
- Payment status is **never** set to "paid" based on client-side state. The flow is:
  1. Customer submits order → `POST /api/orders` → server creates order row with `payment_status=pending`.
  2. Server calls the provider's `initiate()` to get an authorization URL.
  3. Customer is redirected to the provider's hosted checkout.
  4. Provider redirects back to `/order/[number]`.
  5. The confirmation page calls `POST /api/orders/verify` which calls the provider's server-side `verify()` to authoritatively check payment status.
  6. Optionally, the provider's webhook hits `POST /api/payment/webhook` for async updates (e.g., refunds, disputes).

---

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/products` | List products (supports query params: `?category=`, `?brand=`, `?q=`, `?featured=1`, `?bestseller=1`, `?new=1`, `?minPrice=`, `?maxPrice=`, `?sort=`) |
| GET | `/api/products/search?q=` | Search products by name, SKU, tags, description |
| GET | `/api/products/[slug]` | Single product + related + reviews |
| GET | `/api/categories` | All categories |
| GET | `/api/brands` | All brands |
| GET | `/api/content/[slug]` | Static content page (about, faq, shipping, returns, privacy, terms) |
| POST | `/api/orders` | Create order + initiate payment (validated server-side) |
| GET | `/api/orders?email=` | List orders by customer email |
| GET | `/api/orders/[orderNumber]` | Fetch a single order by its public number |
| POST | `/api/orders/verify` | Server-side payment verification |
| POST | `/api/payment/webhook` | Payment provider webhook receiver |
| POST | `/api/newsletter` | Newsletter signup |
| POST | `/api/contact` | Contact form submission |
| POST | `/api/reviews` | Submit a product review |

---

## Deployment

### Vercel (recommended)

1. Push the repo to GitHub.
2. Import the project into Vercel.
3. Set all environment variables in the Vercel dashboard.
4. For Stripe/Paystack/Flutterwave webhooks, set the webhook URL to `https://your-domain.com/api/payment/webhook`.
5. Change `DATABASE_URL` to a managed Postgres or MySQL connection string (and update `prisma/schema.prisma`'s `datasource` `provider` to match).
6. Run `bun run db:push` and `bun run scripts/seed.ts` once on the production database.

### Self-hosted (Docker)

A standalone build is configured in `next.config.ts` (`output: "standalone"`):

```bash
bun run build
bun run start
```

Use any process manager (PM2, systemd, etc.) to keep it alive, and a reverse proxy (Caddy, Nginx) for HTTPS termination.

---

## Adding Future Features

The architecture is intentionally ready for:

- **More payment gateways** — add a file in `src/lib/payment/providers/` and register it in `index.ts`.
- **Multiple currencies / languages** — extend `site-config.ts`, add `next-intl` (already installed).
- **Coupon codes** — add a `Coupon` model in Prisma, apply in `order-service.ts`'s `createOrder`.
- **Inventory management** — already tracked via `Product.stock`; add an admin UI on top of `data-access.ts`.
- **Shipping integrations** (Shippo, EasyPost) — implement in `src/lib/integrations/` similar to `google-sheets.ts`.
- **Email/SMS/WhatsApp notifications** — add a notification service and call from `order-service.ts`.
- **Customer reviews** — already implemented (`Review` model, `/api/reviews`, UI in product page tab).
- **Abandoned cart recovery** — the cart is already persisted in localStorage; add a server-side cart-on-email-collection + a cron job.
- **Analytics** (Meta Pixel, GA, GTM) — add the snippet to `src/app/layout.tsx`.
- **CRM integration** — POST to your CRM from `order-service.ts` similar to the Google Sheets call.
- **AI shopping assistant / chatbot** — drop the `z-ai-web-dev-sdk` (already installed) into a new page or widget.
- **Recommendation engine** — extend `getRelatedProducts` in `data-access.ts` to use co-purchase history.

---

## Testing the Site

The platform has been end-to-end tested with the agent browser:

✓ Home page renders (hero, featured, bestsellers, new arrivals, categories, promo, testimonials, newsletter, FAQ preview, final CTA)
✓ Navigation works (desktop nav, mobile menu, footer links, breadcrumbs)
✓ Product browsing (shop grid, category filter, sorting dropdown)
✓ Product detail page (image gallery, color/size selection, add-to-cart, related products)
✓ Cart (add, update quantity, remove, empty state, slide-out sheet)
✓ Checkout (form validation, payment method selection, server-side order creation)
✓ Order confirmation (status timeline, items list, delivery address, payment status)
✓ Search (live search dropdown, search results page, empty state)
✓ Wishlist (add, remove, move all to cart)
✓ Account (sign in, dashboard, order history lookup)
✓ Static pages (About, FAQ, Contact form, Shipping, Returns, Privacy, Terms)
✓ 404 page
✓ Mobile responsiveness (375px / 414px viewports)
✓ Desktop responsiveness (1920px viewport)
✓ Sticky footer (pushed down naturally when content overflows)

The payment provider returns a placeholder redirect when credentials aren't configured, so the full checkout flow is testable end-to-end without live keys.

---

## Production Checklist Before Going Live

- [ ] Replace business information in `src/lib/site-config.ts`
- [ ] Replace placeholder products in `scripts/seed-data.ts` with your real catalog
- [ ] Replace placeholder images with your real product photography
- [ ] Set `PAYMENT_PROVIDER` in `.env` and add the provider's credentials
- [ ] Set `GOOGLE_SHEETS_*` env vars to enable order sync
- [ ] Change `siteConfig.url` to your real domain
- [ ] Update `metadataBase` in `src/app/layout.tsx` to your real domain
- [ ] Configure the payment provider's webhook URL to point to your production `/api/payment/webhook`
- [ ] Run `bun run db:push` on your production database
- [ ] Run `bun run scripts/seed.ts` to load your products
- [ ] Set up analytics (GA, Meta Pixel) by editing `src/app/layout.tsx`
- [ ] Configure a managed database (Postgres/MySQL) instead of SQLite for production
- [ ] Set up email delivery for order confirmations (e.g., Resend, SendGrid)
- [ ] Test a real end-to-end purchase with live payment credentials
