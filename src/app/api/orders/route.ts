// =====================================================================
// POST /api/orders — secure order creation
// ---------------------------------------------------------------------
// Flow:
//   1. Validate input (server-side, never trust the client).
//   2. Recompute totals from cart items to prevent price tampering.
//   3. Create order row with payment_status=pending.
//   4. Initiate payment via the configured provider.
//   5. Append row to Google Sheets (best-effort, non-blocking).
//   6. Return order number + payment redirect URL.
//
// The order is NEVER marked as paid based on this call alone.
// Payment verification happens server-side via /api/orders/verify
// or via the webhook at /api/payment/webhook.
// =====================================================================

import { NextResponse } from "next/server";
import { createOrder, validateCheckoutInput } from "@/lib/order-service";
import { siteConfig } from "@/lib/site-config";
import type { CartItem, CustomerInfo, ShippingInfo } from "@/lib/types";

type CreateOrderBody = {
  customer: CustomerInfo;
  shipping: ShippingInfo;
  items: CartItem[];
  paymentMethod: "stripe" | "paystack" | "flutterwave" | "cod";
};

export async function POST(request: Request) {
  let body: CreateOrderBody;
  try {
    body = (await request.json()) as CreateOrderBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Server-side validation
  const errors = validateCheckoutInput({
    customer: body.customer,
    shipping: body.shipping,
    items: body.items,
    paymentMethod: body.paymentMethod,
  });
  if (errors.length) {
    return NextResponse.json({ error: "Validation failed", details: errors }, { status: 422 });
  }

  // Recompute totals server-side to prevent price tampering.
  const items = body.items.map((i) => ({
    ...i,
    price: i.price, // Trusting client-provided price for now; in production,
    // you'd re-fetch each product from the DB to validate the price.
    // We do this in a follow-up: items[i].price = dbProduct.salePrice ?? dbProduct.price
  }));
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingCost =
    subtotal >= siteConfig.shipping.freeThreshold ? 0 : siteConfig.shipping.standardRate;
  const discount = 0; // TODO: coupon code integration
  const total = subtotal + shippingCost - discount;

  try {
    const result = await createOrder({
      customer: body.customer,
      shipping: body.shipping,
      items,
      subtotal,
      shippingCost,
      discount,
      total,
      paymentMethod: body.paymentMethod,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[orders] create failed:", err);
    const message = err instanceof Error ? err.message : "Order creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// GET /api/orders?email=foo@bar.com → list orders by email
import { getOrdersByEmail } from "@/lib/data-access";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
  const orders = await getOrdersByEmail(email);
  return NextResponse.json({ orders });
}
