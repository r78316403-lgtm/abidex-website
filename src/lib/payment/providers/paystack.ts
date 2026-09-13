// =====================================================================
// PAYSTACK PROVIDER
// ---------------------------------------------------------------------
// To enable: add the following to your .env file:
//   PAYMENT_PROVIDER=paystack
//   PAYSTACK_SECRET_KEY=sk_live_xxx        (server-only)
//   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxx
// Docs: https://paystack.com/docs/payments/accept-payments
// =====================================================================

import "server-only";
import type { PaymentProvider, InitiatePaymentInput, VerifyPaymentInput } from "../index";

class PaystackProviderImpl implements PaymentProvider {
  name = "paystack";

  private get secretKey() {
    return process.env.PAYSTACK_SECRET_KEY ?? "";
  }

  async initiate(input: InitiatePaymentInput) {
    if (!this.secretKey) {
      console.warn("[paystack] PAYSTACK_SECRET_KEY not set. Returning placeholder checkout.");
      return {
        provider: this.name,
        authorizationUrl: `${input.callbackUrl}?provider=paystack&placeholder=1&ref=${input.orderNumber}`,
        reference: input.orderNumber,
      };
    }
    const body = {
      email: input.customer.email,
      amount: Math.round(input.amount * 100), // kobo
      currency: input.currency,
      reference: input.orderNumber,
      callback_url: `${input.callbackUrl}?status=success&ref=${input.orderNumber}`,
      metadata: {
        order_number: input.orderNumber,
        items: input.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      },
    };
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((r) => r.json() as Promise<{ status: boolean; data: { authorization_url: string; reference: string } }>)
      .catch(() => ({ status: false, data: { authorization_url: "", reference: input.orderNumber } }));

    return {
      provider: this.name,
      authorizationUrl: res.data.authorization_url || `${input.callbackUrl}?status=success&ref=${input.orderNumber}`,
      reference: res.data.reference || input.orderNumber,
    };
  }

  async verify(input: VerifyPaymentInput) {
    if (!this.secretKey) {
      console.warn("[paystack] PAYSTACK_SECRET_KEY not set — cannot verify server-side.");
      return { verified: false, status: "pending" as const, rawResponse: input.payload };
    }
    if (!input.reference) {
      return { verified: false, status: "failed" as const };
    }
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${input.reference}`,
      { headers: { Authorization: `Bearer ${this.secretKey}` } }
    ).then((r) => r.json() as Promise<{ status: boolean; data?: { status: string; amount: number; currency: string; id: number } }>)
      .catch(() => ({ status: false, data: undefined }));

    const paid = res.data?.status === "success";
    return {
      verified: paid,
      status: paid ? ("paid" as const) : ("failed" as const),
      amount: res.data?.amount ? res.data.amount / 100 : undefined,
      currency: res.data?.currency,
      providerTransactionId: res.data?.id ? String(res.data.id) : undefined,
      rawResponse: res,
    };
  }

  parseWebhookEvent(body: unknown) {
    const event = body as { event?: string; data?: { reference?: string; status?: string } };
    return {
      eventType: event.event ?? "unknown",
      reference: event.data?.reference ?? "",
      status: event.data?.status === "success" ? ("paid" as const) : ("pending" as const),
      raw: body,
    };
  }
}

export const PaystackProvider = PaystackProviderImpl;
