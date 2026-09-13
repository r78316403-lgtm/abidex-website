// =====================================================================
// SEED SCRIPT
// Run: bun run scripts/seed.ts
// Idempotent — re-running upserts and skips existing data.
// =====================================================================
import { PrismaClient } from "@prisma/client";
import { categories, brands, products } from "./seed-data";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

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
      currency: p.currency ?? "USD",
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
    console.log(`  Product: ${p.name}`);
  }

  // Sample content pages
  const contentPages = [
    {
      slug: "about",
      title: "About Us",
      body: "We started [BUSINESS_NAME] with a simple goal: bring thoughtfully designed products to people who care about quality, not hype. Every product we stock has been tested, used, and worn by our team before it earns a spot in the catalog. We partner with makers who treat their craft and their workers well, and we keep our prices fair by selling direct.",
    },
    {
      slug: "faq",
      title: "Frequently Asked Questions",
      body: "Answers to the most common questions about ordering, shipping, returns, and product care. If you can't find what you're looking for, our team is one message away via the Contact page.",
    },
    {
      slug: "shipping",
      title: "Shipping & Delivery",
      body: "We ship worldwide from our fulfillment center. Standard delivery typically takes 3-7 business days within the country and 7-21 days for international orders, depending on destination. Express options are available at checkout. You'll receive tracking the moment your order leaves the warehouse.",
    },
    {
      slug: "returns",
      title: "Returns & Refund Policy",
      body: "If something isn't right, we'll make it right. Items can be returned within 30 days of delivery for a full refund, as long as they're in original condition with tags. Refunds are processed within 5 business days of receiving your return.",
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      body: "Your data is yours. We collect only what's needed to fulfill orders and improve the store. We never sell your information to third parties. This policy explains what we collect, why, and how you can control it.",
    },
    {
      slug: "terms",
      title: "Terms & Conditions",
      body: "By using this site and placing an order, you agree to the terms outlined here. They cover the use of the website, ordering, payment, delivery, and the responsibilities of both parties.",
    },
  ];

  for (const page of contentPages) {
    await db.contentPage.upsert({
      where: { slug: page.slug },
      update: { title: page.title, body: page.body },
      create: page,
    });
    console.log(`  Content page: ${page.title}`);
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
