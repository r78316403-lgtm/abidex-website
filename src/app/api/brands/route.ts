import { NextResponse } from "next/server";
import { getAllBrands } from "@/lib/data-access";

export async function GET() {
  const brands = await getAllBrands();
  return NextResponse.json(brands);
}
