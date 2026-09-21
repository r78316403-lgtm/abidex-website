// =====================================================================
// SEED SCRIPT — KEDI HEALTHCARE
// Run: bun run scripts/seed.ts
// Idempotent — re-running upserts and skips existing data.
// =====================================================================
import { PrismaClient } from "@prisma/client";
import { categories, brands, products } from "./seed-data";

const db = new PrismaClient();

async function main() {
  console.log("Seeding KEDI Healthcare database...");

  // Categories
  for (const c of categories) {
    await db.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, image: c.image },
      create: { name: c.name, slug: c.slug, description: c.description, image: c.image },
    });
    console.log(`  Category: ${c.name}`);
  }

  // Brands
  for (const b of brands) {
    await db.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name },
      create: { name: b.name, slug: b.slug },
    });
    console.log(`  Brand: ${b.name}`);
  }

  // Products
  for (const p of products) {
    const category = await db.category.findUnique({ where: { slug: p.categorySlug } });
    if (!category) throw new Error(`Category not found: ${p.categorySlug}`);

    const brand = p.brandName
      ? await db.brand.findFirst({ where: { name: p.brandName } })
      : null;
    if (p.brandName && !brand) throw new Error(`Brand not found: ${p.brandName}`);

    const data = {
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.description,
      shortDescription: p.shortDescription,
      price: p.price,
      salePrice: p.salePrice ?? null,
      currency: p.currency ?? "NGN",
      thumbnail: p.thumbnail,
      images: JSON.stringify(p.images),
      categoryId: category.id,
      brandId: brand?.id ?? null,
      sizes: p.sizes ? JSON.stringify(p.sizes) : null,
      colors: p.colors ? JSON.stringify(p.colors) : null,
      stock: p.stock,
      tags: p.tags ? JSON.stringify(p.tags) : null,
      featured: p.featured ?? false,
      bestSeller: p.bestSeller ?? false,
      newArrival: p.newArrival ?? false,
      rating: p.rating ?? 0,
      reviewCount: p.reviewCount ?? 0,
      specifications: p.specifications ? JSON.stringify(p.specifications) : null,
      shippingInfo: p.shippingInfo ?? null,
    };

    await db.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: { ...data, sku: p.sku },
    });
  }
  console.log(`  Products: ${products.length} loaded`);

  // Content pages — KEDI-specific copy
  const contentPages = [
    {
      slug: "about",
      title: "About KEDI Healthcare",
      body: `KEDI Healthcare Ind. Nig. Ltd. is a leading health and wellness company committed to improving lives through quality herbal products, wellness solutions, and rewarding business opportunities.

Founded on the philosophy that good health is the foundation of a good life, KEDI has supported Nigerian families for nearly two decades with carefully formulated Chinese herbal medicines, daily nutrition supplements, and reliable health equipment. Our products draw on thousands of years of traditional Chinese medicine and modern quality standards.

Through innovation, health education, and community engagement, KEDI Healthcare empowers individuals and families to achieve better health and financial growth. For years, we have supported communities with wellness products, educational programs, and business opportunities for aspiring distributors.

Our founder and chairman, Mr. William Zhao, set out with a simple mission: bring health, wealth, and happiness to every home we touch. That mission continues to guide everything we do — from the herbs we source to the distributors we train to the communities we serve.

"KEDI BRINGS YOU HEALTH, WEALTH, AND HAPPINESS!" — Mr. William Zhao, Founder / Chairman`,
    },
    {
      slug: "distributor",
      title: "Become a KEDI Distributor",
      body: `KEDI Healthcare provides rewarding business opportunities for individuals who want to build a sustainable income while promoting wellness.

Through our distributor network, thousands of people have transformed their lives by sharing quality healthcare products and growing successful businesses of their own. Whether you're looking for a side income or a full-time career, KEDI gives you the tools, training, and community to succeed.

What you get as a KEDI distributor:

— Wholesale pricing on the full KEDI catalog
— Weekly seminars and training sessions across the country
— Marketing materials and product education
— Personal mentorship from senior distributors
— Access to the 2026 Car Award and other incentive programs
— Eligibility for the KEDI Impact Fund

Becoming a distributor is simple. Sign up, attend an orientation seminar near you, and start sharing KEDI products with your network. Our team supports you every step of the way.

Seminars & Training every week across the country. Find one near you.`,
    },
    {
      slug: "five-year-plan",
      title: "KEDI Five Years Development Plan (2024 – 2028)",
      body: `The KEDI Healthcare Five Years Development Plan is a corporate blueprint that contains different development plans and strategies about the Company's market penetration, distributors' compensation, and corporate efforts for the next five business years.

The plan outlines our commitments across three pillars:

1. Product Innovation — expanding our herbal medicine, vitamins, and equipment lines with new formulas developed by Chinese and Nigerian health experts.

2. Distributor Empowerment — enhanced compensation structures, the 2026 Car Award, the KEDI Impact Fund, and new training centres across Nigeria's six geopolitical zones.

3. Community Impact — the Aloe House initiative, free health screening programs, and partnerships with local health authorities.

This plan is our public commitment to our distributors, customers, and the communities we serve. We will report progress annually.`,
    },
    {
      slug: "faq",
      title: "Frequently Asked Questions",
      body: `Answers to the most common questions about KEDI products, ordering, shipping, returns, and becoming a distributor. If you can't find what you're looking for, our team is one message away via the Contact page.

Q: Are KEDI products safe?
A: Yes. All KEDI products are formulated with quality-sourced herbs and manufactured under strict quality standards. They are registered with Nigeria's NAFDAC. As with any supplement, consult your healthcare provider if you are pregnant, nursing, or managing a medical condition.

Q: How do I place an order?
A: Browse our catalog, add products to your cart, and proceed to checkout. We accept payment via Paystack, Flutterwave, and cash on delivery in select areas.

Q: How long does delivery take?
A: Orders within Lagos typically arrive within 1-2 business days. Nationwide delivery takes 3-5 business days. Express shipping is available at checkout.

Q: What's your return policy?
A: Items can be returned within 7 days of delivery if unopened and in original packaging. Refunds are processed within 5 business days. See our Returns page for full details.

Q: How do I become a KEDI distributor?
A: Visit our Distributor page to learn more, or attend one of our weekly training seminars held across the country.

Q: Can I take KEDI products alongside my prescription medication?
A: Always consult your healthcare provider before combining herbal supplements with prescription medication.`,
    },
    {
      slug: "shipping",
      title: "Shipping & Delivery",
      body: `KEDI Healthcare ships nationwide across Nigeria from our Lagos fulfillment centre.

Delivery times:
— Lagos: 1-2 business days
— Major cities (Abuja, Port Harcourt, Kano, Ibadan): 2-3 business days
— Other locations: 3-5 business days
— Express shipping (next-day in Lagos): available at checkout

Free standard shipping is included on all orders above ₦50,000. Below that threshold, standard shipping is ₦2,500 and express is ₦5,500.

You'll receive an order confirmation by email immediately after checkout, and a tracking number once your order leaves our warehouse. Orders are processed Monday-Friday between 9am and 5pm.`,
    },
    {
      slug: "returns",
      title: "Returns & Refund Policy",
      body: `Your wellness matters — if something isn't right, we'll make it right.

Items can be returned within 7 days of delivery for a full refund, as long as they are unopened and in original packaging. Refunds are processed within 5 business days of receiving your return.

For health and safety reasons, opened supplements, herbal products, and equipment that has been used cannot be returned unless defective.

To start a return, contact our customer care team with your order number and the reason for return. We'll send return instructions and a confirmation once your refund is processed.

Damaged or incorrect items received: please contact us within 48 hours of delivery with photos and we'll arrange a replacement at no cost.`,
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      body: `Your data is yours. KEDI Healthcare collects only what's needed to fulfill your orders, process payments, and improve our services. We never sell your information to third parties.

This policy explains what we collect, why we collect it, and how you can control it.

Information we collect: your name, email, phone number, delivery address, and order history — collected when you place an order or sign up as a distributor.

How we use it: to process and ship your orders, communicate about your orders, send you KEDI news and offers (only if you opt in), and improve our product offerings.

Your rights: you can request a copy of your data, ask us to correct it, or ask us to delete it (subject to record-keeping requirements). Contact privacy@kedihealth.com to exercise any of these rights.`,
    },
    {
      slug: "terms",
      title: "Terms & Conditions",
      body: `By using this website and placing an order with KEDI Healthcare, you agree to the terms outlined here. They cover the use of the website, ordering, payment, delivery, and the responsibilities of both parties.

Products are sold for personal use only. Resale of KEDI products without an active distributor agreement is not permitted.

Prices are listed in Nigerian Naira (₦) and are subject to change without notice. Promotional pricing is valid for the period stated on the website.

KEDI Healthcare is not liable for any direct, indirect, or consequential damages arising from the use of our products. Our products are not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before starting any new supplement.

These terms are governed by the laws of the Federal Republic of Nigeria.`,
    },
  ];

  for (const page of contentPages) {
    await db.contentPage.upsert({
      where: { slug: page.slug },
      update: { title: page.title, body: page.body },
      create: page,
    });
    console.log(`  Content: ${page.title}`);
  }

  const productCount = await db.product.count();
  const categoryCount = await db.category.count();
  const brandCount = await db.brand.count();
  console.log(`\nSeed complete: ${productCount} products, ${categoryCount} categories, ${brandCount} brands.`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
