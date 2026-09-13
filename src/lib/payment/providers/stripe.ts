// =====================================================================
// STRIPE PROVIDER
// ---------------------------------------------------------------------
// To enable: add the following to your .env file:
//   PAYMENT_PROVIDER=stripe
//   STRIPE_SECRET_KEY=sk_live_xxx        (server-only)
//   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
//   STRIPE_WEBHOOK_SECRET=whsec_xxx      (for webhook verification)
// Docs: https://stripe.com/docs/payments/checkout
// =====================================================================

import "server-only";
import type { PaymentProvider, InitiatePaymentInput, VerifyPaymentInput } from "../index";

type StripeConfig = {
  secretKey: string;
  webhookSecret: string;
};

function loadConfig(): StripeConfig {
  const secretKey = process.env.STRIPE_SECRET_KEY ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  return { secretKey, webhookSecret };
}

class StripeProviderImpl implements PaymentProvider {
  name = "stripe";

  async initiate(input: InitiatePaymentInput) {
    const { secretKey } = loadConfig();
    if (!secretKey) {
      // Credentials not configured yet — return a placeholder that
      // makes the architecture obvious without breaking the build.
      console.warn("[stripe] STRIPE_SECRET_KEY not set. Returning placeholder checkout.");
      return {
        provider: this.name,
        authorizationUrl: `${input.callbackUrl}?provider=stripe&placeholder=1&ref=${input.orderNumber}`,
        reference: input.orderNumber,
      };
    }
    // Real Stripe Checkout Session creation would go here.
    // Using fetch so we don't add a Stripe SDK dependency until credentials
    // are actually configured (keeps the build lean for placeholder mode).
    const session = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        mode: "payment",
        "payment_method_types[]": "card",
        "line_items[0][quantity]": "1",
        "line_items[0][price_data][currency]": input.currency.toLowerCase(),
        "line_items[0][price_data][product_data][name]": `Order ${input.orderNumber}`,
        "line_items[0][price_data][unit_amount_decimal]": String(Math.round(input.amount * 100)),
        success_url: `${input.callbackUrl}?status=success&ref=${input.orderNumber}`,
        cancel_url: `${input.callbackUrl}?status=cancel&ref=${input.orderNumber}`,
        client_reference_id: input.orderNumber,
      }).toString(),
    }).then((r) => r.json() as Promise<{ url: string; id: string }>);

    return {
      provider: this.name,
      authorizationUrl: session.url,
      reference: input.orderNumber,
      paymentIntentId: session.id,
    };
  }

  async verify(input: VerifyPaymentInput) {
    const { secretKey } = loadConfig();
    if (!secretKey) {
      // Placeholder mode — never auto-verify. Mark as pending so the
      // merchant can manually confirm orders via the admin / dashboard.
      console.warn("[stripe] STRIPE_SECRET_KEY not set — cannot verify server-side.");
      return { verified: false, status: "pending" as const, rawResponse: input.payload };
    }
    if (!input.reference) {
      return { verified: false, status: "failed" as const };
    }
    // Server-side verify by retrieving the Checkout Session.
    const session = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${input.reference}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    ).then((r) => r.json() as Promise<{ payment_status?: string; amount_total?: number; currency?: string }>)
      .catch(() => ({}));

    const paid = session.payment_status === "paid";
    return {
      verified: paid,
      status: paid ? ("paid" as const) : ("failed" as const),
      amount: session.amount_total ? session.amount_total / 100 : undefined,
      currency: session.currency?.toUpperCase(),
      rawResponse: session,
    };
  }

  parseWebhookEvent(body: unknown, headers: Record<string, string>) {
    const { webhookSecret } = loadConfig();
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET not configured — cannot verify webhook signature.");
    }
    // Real Stripe webhook verification uses the Stripe-Signature header
    // and the webhook secret to compute an HMAC. When wiring this up:
    //   1. Install the `stripe` SDK.
    //   2. Call `stripe.webhooks.constructEvent(body, sig, secret)`.
    //   3. Return the verified event type & metadata.
    // Placeholder returns the shape consumers expect.
    const event = body as { type?: string; data?: { object?: { client_reference_id?: string; payment_status?: string } } };
    return {
      eventType: event.type ?? "unknown",
      reference: event.data?.object?.client_reference_id ?? "",
      status: event.data?.object?.payment_status === "paid" ? ("paid" as const) : ("pending" as const),
      raw: body,
    };
  }
}

export const StripeProvider = StripeProviderImpl;
