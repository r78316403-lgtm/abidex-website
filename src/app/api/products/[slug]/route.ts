// GET /api/products/:slug → product + related + reviews
import { NextResponse } from "next/server";
import { getProductBySlug, getRelatedProducts, getReviewsByProduct } from "@/lib/data-access";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const [related, reviews] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId, 8),
    getReviewsByProduct(product.id),
  ]);
  return NextResponse.json({ product, related, reviews });
}
