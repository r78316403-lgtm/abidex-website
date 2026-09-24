// =====================================================================
// POST /api/leads — newsletter & contact form submissions
// In-memory store for demo. For production, swap to Prisma + DB.
// =====================================================================

import { NextResponse } from "next/server";

type Lead = {
  id: string;
  type: "newsletter" | "contact";
  firstName?: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
  createdAt: string;
};

// In-memory store (resets on server restart — use a DB for production)
const store: Lead[] = [];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const type = body.type as string;
  const email = (body.email as string)?.trim().toLowerCase() ?? "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "A valid email is required" }, { status: 422 });
  }

  if (type === "newsletter") {
    const firstName = (body.firstName as string)?.trim() ?? "";
    const lead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: "newsletter",
      firstName,
      email,
      createdAt: new Date().toISOString(),
    };
    store.push(lead);
    console.log(`[leads] Newsletter subscription: ${email} (${store.length} total)`);
    return NextResponse.json({ ok: true, id: lead.id });
  }

  if (type === "contact") {
    const name = (body.name as string)?.trim() ?? "";
    const phone = (body.phone as string)?.trim() ?? "";
    const service = (body.service as string)?.trim() ?? "";
    const message = (body.message as string)?.trim() ?? "";
    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 422 });
    if (message.length < 10) return NextResponse.json({ error: "Message must be at least 10 characters" }, { status: 422 });

    const lead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: "contact",
      firstName: name,
      email,
      phone,
      service,
      message,
      createdAt: new Date().toISOString(),
    };
    store.push(lead);
    console.log(`[leads] Contact inquiry from ${name} <${email}> (${store.length} total)`);
    return NextResponse.json({ ok: true, id: lead.id });
  }

  return NextResponse.json({ error: "Unknown lead type. Use 'newsletter' or 'contact'." }, { status: 422 });
}

// GET — admin preview (would be auth-protected in production)
export async function GET() {
  // Strip emails for privacy in this preview
  const safe = store.map(({ email, ...rest }) => ({ ...rest, email: email.replace(/(.{2}).*(@.*)/, "$1***$2") }));
  return NextResponse.json({ count: store.length, leads: safe });
}
