// =====================================================================
// POST /api/orders/verify — server-side payment verification
// ---------------------------------------------------------------------
// Called by the frontend after the customer is redirected back from
// the payment provider. The actual verification happens server-side
// using the configured provider's API. The order status is NEVER
// updated based on client-side state alone.
// =====================================================================

import { NextResponse } from "next/server";
import { verifyOrderPayment } from "@/lib/order-service";

export async function POST(request: Request) {
  let body: { orderNumber?: string };
  try {
    body = (await request.json()) as { orderNumber?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.orderNumber) {
    return NextResponse.json({ error: "orderNumber required" }, { status: 422 });
  }
  try {
    const result = await verifyOrderPayment(body.orderNumber);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Verification failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
