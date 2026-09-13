// GET /api/products  → list all products (with optional filtering)
// Query params: ?category=slug&brand=slug&q=text&featured=1&bestseller=1&new=1&minPrice=&maxPrice=&sort=
import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/data-access";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const brand = searchParams.get("brand");
  const q = searchParams.get("q")?.toLowerCase() ?? "";
  const featured = searchParams.get("featured") === "1";
  const bestseller = searchParams.get("bestseller") === "1";
  const newArrival = searchParams.get("new") === "1";
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : null;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : null;
  const sort = searchParams.get("sort") ?? "featured";

  let products = await getAllProducts();

  if (category) products = products.filter((p) => p.category?.slug === category);
  if (brand) products = products.filter((p) => p.brand?.slug === brand);
  if (featured) products = products.filter((p) => p.featured);
  if (bestseller) products = products.filter((p) => p.bestSeller);
  if (newArrival) products = products.filter((p) => p.newArrival);
  if (q) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  if (minPrice != null) products = products.filter((p) => (p.salePrice ?? p.price) >= minPrice);
  if (maxPrice != null) products = products.filter((p) => (p.salePrice ?? p.price) <= maxPrice);

  switch (sort) {
    case "price-asc":
      products.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
      break;
    case "price-desc":
      products.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
      break;
    case "rating":
      products.sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      products.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      break;
    case "bestselling":
      products.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    default:
      products.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
  }

  return NextResponse.json({ products });
}
