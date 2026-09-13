// =====================================================================
// SERVER-SIDE DATA ACCESS — typed wrappers over Prisma
// =====================================================================

import "server-only";
import { db } from "./db";
import type { Product, Category, Brand, Review } from "./types";

function parseJSON<T>(v: string | null | undefined, fallback: T): T {
  if (!v) return fallback;
  try {
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
}

function toProduct(p: {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice: number | null;
  currency: string;
  thumbnail: string;
  images: string;
  categoryId: string;
  brandId: string | null;
  sizes: string | null;
  colors: string | null;
  stock: number;
  tags: string | null;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  rating: number;
  reviewCount: number;
  specifications: string | null;
  shippingInfo: string | null;
  createdAt: Date;
  category?: { id: string; name: string; slug: string; description: string | null; image: string | null } | null;
  brand?: { id: string; name: string; slug: string; logo: string | null } | null;
}): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    description: p.description,
    shortDescription: p.shortDescription,
    price: p.price,
    salePrice: p.salePrice,
    currency: p.currency,
    thumbnail: p.thumbnail,
    images: parseJSON<string[]>(p.images, [p.thumbnail]),
    categoryId: p.categoryId,
    category: p.category
      ? {
          id: p.category.id,
          name: p.category.name,
          slug: p.category.slug,
          description: p.category.description,
          image: p.category.image,
        }
      : undefined,
    brandId: p.brandId,
    brand: p.brand
      ? { id: p.brand.id, name: p.brand.name, slug: p.brand.slug, logo: p.brand.logo }
      : null,
    sizes: parseJSON<string[]>(p.sizes, []),
    colors: parseJSON<string[]>(p.colors, []),
    stock: p.stock,
    tags: parseJSON<string[]>(p.tags, []),
    featured: p.featured,
    bestSeller: p.bestSeller,
    newArrival: p.newArrival,
    rating: p.rating,
    reviewCount: p.reviewCount,
    specifications: parseJSON<Record<string, string> | null>(p.specifications, null),
    shippingInfo: p.shippingInfo,
    createdAt: p.createdAt.toISOString(),
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await db.product.findMany({
    include: { category: true, brand: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await db.product.findUnique({
    where: { slug },
    include: { category: true, brand: true },
  });
  return row ? toProduct(row) : null;
}

export async function getProductsByCategorySlug(categorySlug: string): Promise<Product[]> {
  const category = await db.category.findUnique({ where: { slug: categorySlug } });
  if (!category) return [];
  const rows = await db.product.findMany({
    where: { categoryId: category.id },
    include: { category: true, brand: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProduct);
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: {
      AND: [
        { categoryId },
        { id: { not: productId } },
      ],
    },
    take: limit,
    include: { category: true, brand: true },
  });
  return rows.map(toProduct);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  const rows = await db.product.findMany({
    where: { id: { in: ids } },
    include: { category: true, brand: true },
  });
  return rows.map(toProduct);
}

export async function getAllCategories(): Promise<Category[]> {
  const rows = await db.category.findMany({ orderBy: { name: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    image: r.image,
  }));
}

export async function getAllBrands(): Promise<Brand[]> {
  const rows = await db.brand.findMany({ orderBy: { name: "asc" } });
  return rows.map((r) => ({ id: r.id, name: r.name, slug: r.slug, logo: r.logo }));
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { featured: true },
    take: limit,
    include: { category: true, brand: true },
    orderBy: { rating: "desc" },
  });
  return rows.map(toProduct);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { bestSeller: true },
    take: limit,
    include: { category: true, brand: true },
    orderBy: { rating: "desc" },
  });
  return rows.map(toProduct);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: { newArrival: true },
    take: limit,
    include: { category: true, brand: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim();
  // SQLite LIKE is case-insensitive by default for ASCII
  const rows = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { shortDescription: { contains: q } },
        { description: { contains: q } },
        { sku: { contains: q } },
        { tags: { contains: q } },
      ],
    },
    take: 100,
    include: { category: true, brand: true },
  });
  return rows.map(toProduct);
}

export async function getContentPage(slug: string) {
  const row = await db.contentPage.findUnique({ where: { slug } });
  return row ? { slug: row.slug, title: row.title, body: row.body, updatedAt: row.updatedAt } : null;
}

export async function createNewsletterSubscriber(email: string) {
  return db.newsletterSubscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  });
}

export async function createContactMessage(input: { name: string; email: string; subject: string; message: string }) {
  return db.contactMessage.create({ data: input });
}

export async function createReview(input: { productId: string; author: string; rating: number; title?: string; comment: string }) {
  return db.review.create({ data: { ...input, verified: false } });
}

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
  const rows = await db.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    id: r.id,
    productId: r.productId,
    author: r.author,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    verified: r.verified,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function getOrdersByEmail(email: string) {
  return db.order.findMany({
    where: { email },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return db.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
}
