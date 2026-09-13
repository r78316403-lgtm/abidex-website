// =====================================================================
// ORDER SERVICE — secure order creation, payment verification,
// Google Sheets sync. All server-side.
// =====================================================================

import "server-only";
import { db } from "./db";
import { getPaymentProvider, type PaymentProvider } from "./payment";
import { appendOrderToSheet } from "./integrations/google-sheets";
import { siteConfig } from "./site-config";
import type { CartItem, CustomerInfo, ShippingInfo } from "./types";

// ---------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s()]{7,}$/;

export function validateCheckoutInput(input: {
  customer: CustomerInfo;
  shipping: ShippingInfo;
  items: CartItem[];
  paymentMethod: string;
}): string[] {
  const errors: string[] = [];
  const { customer, shipping, items, paymentMethod } = input;

  if (!customer.firstName?.trim()) errors.push("First name is required");
  if (!customer.lastName?.trim()) errors.push("Last name is required");
  if (!EMAIL_RE.test(customer.email ?? "")) errors.push("A valid email is required");
  if (!PHONE_RE.test(customer.phone ?? "")) errors.push("A valid phone number is required");

  if (!shipping.address?.trim()) errors.push("Street address is required");
  if (!shipping.city?.trim()) errors.push("City is required");
  if (!shipping.state?.trim()) errors.push("State/Region is required");
  if (!shipping.country?.trim()) errors.push("Country is required");
  if (!shipping.postalCode?.trim()) errors.push("Postal code is required");

  if (!items?.length) errors.push("Cart is empty");
  for (const it of items) {
    if (it.quantity < 1) errors.push(`Quantity for ${it.name} must be at least 1`);
    if (it.quantity > it.stock) errors.push(`Only ${it.stock} of ${it.name} available`);
  }
  if (!["stripe", "paystack", "flutterwave", "cod"].includes(paymentMethod)) {
    errors.push("Invalid payment method");
  }
  return errors;
}

// ---------------------------------------------------------------------
// Order creation
// ---------------------------------------------------------------------
export function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `MC-${ts}-${rand}`;
}

export type CreateOrderResult = {
  orderNumber: string;
  payment: {
    provider: string;
    authorizationUrl?: string;
    clientSecret?: string;
    paymentIntentId?: string;
    reference: string;
  };
};

export async function createOrder(input: {
  customer: CustomerInfo;
  shipping: ShippingInfo;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: "stripe" | "paystack" | "flutterwave" | "cod";
}): Promise<CreateOrderResult> {
  const errors = validateCheckoutInput(input);
  if (errors.length) throw new Error(`Validation errors: ${errors.join("; ")}`);

  const orderNumber = generateOrderNumber();
  const isCod = input.paymentMethod === "cod";
  const paymentStatus = isCod ? "pending" : "pending";
  const orderStatus = isCod ? "confirmed" : "pending";

  // Create order row
  const order = await db.order.create({
    data: {
      orderNumber,
      firstName: input.customer.firstName,
      lastName: input.customer.lastName,
      email: input.customer.email,
      phone: input.customer.phone,
      address: input.shipping.address,
      city: input.shipping.city,
      state: input.shipping.state,
      country: input.shipping.country,
      postalCode: input.shipping.postalCode,
      deliveryInstructions: input.shipping.deliveryInstructions ?? null,
      subtotal: input.subtotal,
      shipping: input.shippingCost,
      discount: input.discount,
      total: input.total,
      paymentMethod: input.paymentMethod,
      paymentStatus,
      orderStatus,
      items: {
        create: input.items.map((i) => ({
          productId: i.productId,
          name: i.name,
          slug: i.slug,
          sku: i.sku,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
          size: i.size ?? null,
          color: i.color ?? null,
        })),
      },
    },
    include: { items: true },
  });

  // Initiate payment (non-blocking for COD)
  let provider: PaymentProvider;
  try {
    provider = getPaymentProvider();
  } catch (err) {
    // Provider not configured — keep order as pending, let merchant
    // resolve offline.
    console.error("Payment provider not configured:", err);
    return {
      orderNumber: order.orderNumber,
      payment: {
        provider: input.paymentMethod,
        authorizationUrl: `/order/${order.orderNumber}?pending=1`,
        reference: order.orderNumber,
      },
    };
  }

  const baseUrl = siteConfig.url || "http://localhost:3000";
  const callbackUrl = `${baseUrl}/#/order/${order.orderNumber}`;

  let payment: CreateOrderResult["payment"] = {
    provider: provider.name,
    reference: order.orderNumber,
  };

  try {
    const initResult = await provider.initiate({
      orderNumber: order.orderNumber,
      amount: input.total,
      currency: siteConfig.currency.code,
      customer: input.customer,
      items: input.items,
      callbackUrl,
    });
    payment = {
      provider: provider.name,
      authorizationUrl: "authorizationUrl" in initResult ? initResult.authorizationUrl : undefined,
      clientSecret: "clientSecret" in initResult ? initResult.clientSecret : undefined,
      paymentIntentId: "paymentIntentId" in initResult ? initResult.paymentIntentId : undefined,
      reference: initResult.reference,
    };

    // Update order with reference
    await db.order.update({
      where: { id: order.id },
      data: { paymentReference: payment.reference },
    });
  } catch (err) {
    console.error("Payment initiation failed:", err);
    // Order is still recorded; customer can be asked to retry.
  }

  // Sync to Google Sheets (best-effort, doesn't block checkout)
  void appendOrderToSheet({
    orderNumber: order.orderNumber,
    firstName: order.firstName,
    lastName: order.lastName,
    email: order.email,
    phone: order.phone,
    address: order.address,
    city: order.city,
    state: order.state,
    country: order.country,
    postalCode: order.postalCode,
    subtotal: order.subtotal,
    shipping: order.shipping,
    discount: order.discount,
    total: order.total,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    items: order.items.map((i) => ({
      name: i.name,
      sku: i.sku,
      quantity: i.quantity,
      price: i.price,
    })),
    createdAt: order.createdAt.toISOString(),
  }).then((res) => {
    if (!res.ok && res.error !== "not-configured") {
      console.warn(`[sheets] Order ${order.orderNumber} sync failed:`, res.error);
    }
  });

  return { orderNumber: order.orderNumber, payment };
}

// ---------------------------------------------------------------------
// Payment verification — server-side, authoritative
// ---------------------------------------------------------------------
export async function verifyOrderPayment(orderNumber: string): Promise<{
  verified: boolean;
  status: string;
  paymentStatus: string;
  orderStatus: string;
}> {
  const order = await db.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) throw new Error("Order not found");

  // Already paid — skip re-verification.
  if (order.paymentStatus === "paid") {
    return { verified: true, status: "paid", paymentStatus: order.paymentStatus, orderStatus: order.orderStatus };
  }

  let provider: PaymentProvider;
  try {
    provider = getPaymentProvider();
  } catch (err) {
    return {
      verified: false,
      status: "pending",
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
    };
  }

  const result = await provider.verify({ reference: order.paymentReference ?? orderNumber });

  if (result.verified && result.status === "paid") {
    const updated = await db.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        transactionId: result.providerTransactionId ?? null,
      },
    });
    return {
      verified: true,
      status: "paid",
      paymentStatus: updated.paymentStatus,
      orderStatus: updated.orderStatus,
    };
  }
  if (result.status === "failed") {
    const updated = await db.order.update({
      where: { id: order.id },
      data: { paymentStatus: "failed" },
    });
    return {
      verified: false,
      status: "failed",
      paymentStatus: updated.paymentStatus,
      orderStatus: updated.orderStatus,
    };
  }
  return {
    verified: false,
    status: "pending",
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
  };
}
