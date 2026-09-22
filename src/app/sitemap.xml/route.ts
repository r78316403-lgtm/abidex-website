// =====================================================================
// SITEMAP.XML — dynamic sitemap including all products & categories
// =====================================================================

import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";
import { getAllProducts, getAllCategories } from "@/lib/data-access";

export const dynamic = "force-static";
export const revalidate = 3600; // refresh every hour

export async function GET() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  const today = new Date().toISOString().split("T")[0];

  // Static pages with priority and change frequency
  const staticPages = [
    { path: "", priority: "1.0", changefreq: "daily" },
    { path: "#/shop", priority: "0.9", changefreq: "daily" },
    { path: "#/about", priority: "0.7", changefreq: "monthly" },
    { path: "#/distributor", priority: "0.8", changefreq: "monthly" },
    { path: "#/five-year-plan", priority: "0.6", changefreq: "monthly" },
    { path: "#/contact", priority: "0.7", changefreq: "monthly" },
    { path: "#/faq", priority: "0.6", changefreq: "monthly" },
    { path: "#/shipping", priority: "0.5", changefreq: "monthly" },
    { path: "#/returns", priority: "0.5", changefreq: "monthly" },
    { path: "#/privacy", priority: "0.3", changefreq: "yearly" },
    { path: "#/terms", priority: "0.3", changefreq: "yearly" },
  ];

  const urls: string[] = [];

  // Static pages
  for (const p of staticPages) {
    urls.push(`  <url>
    <loc>${siteConfig.url}/${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`);
  }

  // Category pages
  for (const c of categories) {
    urls.push(`  <url>
    <loc>${siteConfig.url}/#/category/${c.slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  // Product pages (most important for SEO — these are the money pages)
  for (const p of products) {
    const lastmod = new Date(p.createdAt).toISOString().split("T")[0];
    urls.push(`  <url>
    <loc>${siteConfig.url}/#/product/${p.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>${p.thumbnail}</image:loc>
      <image:title>${escapeXml(p.name)}</image:title>
      <image:caption>${escapeXml(p.shortDescription)}</image:caption>
    </image:image>
  </url>`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
