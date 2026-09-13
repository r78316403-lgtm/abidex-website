// =====================================================================
// POST /api/payment/webhook — provider webhook receiver
// ---------------------------------------------------------------------
// Routes the webhook event to the configured provider, which verifies
// the signature and parses the event. If verification succeeds and
// the event indicates a successful payment, the matching order's
// payment_status is updated to "paid".
// =====================================================================

import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payment";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const headers: Record<string, string> = {};
  request.headers.forEach((v, k) => { headers[k] = v; });

  let body: unknown;
  const contentType = headers["content-type"] ?? "";
  try {
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      body = await request.text();
    }
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  let provider;
  try {
    provider = getPaymentProvider();
  } catch (err) {
    console.error("[webhook] provider not configured:", err);
    return NextResponse.json({ error: "Provider not configured" }, { status: 500 });
  }

  let event;
  try {
    event = provider.parseWebhookEvent(body, headers);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Webhook verification failed";
    console.warn(`[webhook] ${provider.name} rejected event: ${msg}`);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (!event.reference) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const order = await db.order.findFirst({
    where: {
      OR: [
        { orderNumber: event.reference },
        { paymentReference: event.reference },
      ],
    },
  });
  if (!order) {
    console.warn(`[webhook] Order not found for reference ${event.reference}`);
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (event.status === "paid" && order.paymentStatus !== "paid") {
    await db.order.update({
      where: { id: order.id },
      data: { paymentStatus: "paid", orderStatus: "confirmed" },
    });
    console.info(`[webhook] Order ${order.orderNumber} marked paid via ${provider.name} webhook`);
  }

  return NextResponse.json({ ok: true });
}
