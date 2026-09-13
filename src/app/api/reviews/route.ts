// POST /api/reviews { productId, author, rating, title?, comment }
import { NextResponse } from "next/server";
import { createReview, getReviewsByProduct } from "@/lib/data-access";

export async function POST(request: Request) {
  let body: { productId?: string; author?: string; rating?: number; title?: string; comment?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const productId = body.productId?.trim() ?? "";
  const author = body.author?.trim() ?? "";
  const rating = Number(body.rating);
  const title = body.title?.trim();
  const comment = body.comment?.trim() ?? "";
  if (!productId) return NextResponse.json({ error: "Product ID required" }, { status: 422 });
  if (author.length < 2) return NextResponse.json({ error: "Author name required" }, { status: 422 });
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return NextResponse.json({ error: "Rating must be 1-5" }, { status: 422 });
  if (comment.length < 5) return NextResponse.json({ error: "Review must be at least 5 characters" }, { status: 422 });

  try {
    await createReview({ productId, author, rating, title, comment });
    const reviews = await getReviewsByProduct(productId);
    return NextResponse.json({ ok: true, reviews });
  } catch (err) {
    console.error("[reviews] create failed:", err);
    return NextResponse.json({ error: "Review submission failed" }, { status: 500 });
  }
}
