// POST /api/newsletter { email }
import { NextResponse } from "next/server";
import { createNewsletterSubscriber } from "@/lib/data-access";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: string };
  try {
    body = (await request.json()) as { email?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 422 });
  }
  try {
    await createNewsletterSubscriber(email);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter] insert failed:", err);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
