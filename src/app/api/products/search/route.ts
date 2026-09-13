// GET /api/products/search?q=text
import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/data-access";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  if (!q || q.trim().length < 2) {
    return NextResponse.json({ products: [] });
  }
  const products = await searchProducts(q);
  return NextResponse.json({ products });
}
