// POST /api/contact { name, email, subject, message }
import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/data-access";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { name?: string; email?: string; subject?: string; message?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const subject = (body.subject ?? "").trim();
  const message = (body.message ?? "").trim();
  if (name.length < 2) return NextResponse.json({ error: "Name is required" }, { status: 422 });
  if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Valid email required" }, { status: 422 });
  if (subject.length < 3) return NextResponse.json({ error: "Subject is required" }, { status: 422 });
  if (message.length < 10) return NextResponse.json({ error: "Message must be at least 10 characters" }, { status: 422 });
  try {
    await createContactMessage({ name, email, subject, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] insert failed:", err);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }
}
