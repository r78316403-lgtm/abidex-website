// =====================================================================
// POST /api/committee — Selection Committee form submissions
// In-memory store for demo. Swap to Prisma + DB for production.
// =====================================================================

import { NextResponse } from "next/server";

type Submission = {
  id: string;
  name: string;
  email: string;
  book: string;
  message: string;
  createdAt: string;
};

const store: Submission[] = [];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { name?: string; email?: string; book?: string; message?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const book = (body.book ?? "").trim();
  const message = (body.message ?? "").trim();

  const errors: string[] = [];
  if (!name) errors.push("Name is required");
  if (!EMAIL_RE.test(email)) errors.push("Valid email is required");
  if (!book) errors.push("Book / Publication details are required");
  if (message.length < 10) errors.push("Message must be at least 10 characters");
  if (errors.length > 0) {
    return NextResponse.json({ error: "Validation failed", details: errors }, { status: 422 });
  }

  const submission: Submission = {
    id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name, email, book, message,
    createdAt: new Date().toISOString(),
  };
  store.push(submission);
  console.log(`[committee] Submission from ${name} <${email}> (${store.length} total)`);

  return NextResponse.json({ ok: true, id: submission.id });
}

// GET — admin preview
export async function GET() {
  const safe = store.map(({ email, ...rest }) => ({
    ...rest,
    email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
  }));
  return NextResponse.json({ count: store.length, submissions: safe });
}
