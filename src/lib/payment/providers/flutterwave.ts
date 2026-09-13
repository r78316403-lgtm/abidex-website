// =====================================================================
// FLUTTERWAVE PROVIDER
// ---------------------------------------------------------------------
// To enable: add the following to your .env file:
//   PAYMENT_PROVIDER=flutterwave
//   FLUTTERWAVE_SECRET_KEY=FLWSECK-xxx     (server-only)
//   NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-xxx
//   FLUTTERWAVE_WEBHOOK_HASH=...          (secret hash for webhook)
// Docs: https://developer.flutterwave.com
// =====================================================================

import "server-only";
import type { PaymentProvider, InitiatePaymentInput, VerifyPaymentInput } from "../index";

class FlutterwaveProviderImpl implements PaymentProvider {
  name = "flutterwave";

  private get secretKey() {
    return process.env.FLUTTERWAVE_SECRET_KEY ?? "";
  }

  async initiate(input: InitiatePaymentInput) {
    if (!this.secretKey) {
      console.warn("[flutterwave] FLUTTERWAVE_SECRET_KEY not set. Returning placeholder checkout.");
      return {
        provider: this.name,
        authorizationUrl: `${input.callbackUrl}?provider=flutterwave&placeholder=1&ref=${input.orderNumber}`,
        reference: input.orderNumber,
      };
    }
    const body = {
      tx_ref: input.orderNumber,
      amount: input.amount,
      currency: input.currency,
      customer: {
        email: input.customer.email,
        name: `${input.customer.firstName} ${input.customer.lastName}`.trim(),
      },
      customizations: { title: `Order ${input.orderNumber}` },
      redirect_url: `${input.callbackUrl}?status=success&ref=${input.orderNumber}`,
    };
    const res = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((r) => r.json() as Promise<{ status: string; data: { link: string } }>)
      .catch(() => ({ status: "error", data: { link: "" } }));

    return {
      provider: this.name,
      authorizationUrl: res.data.link || `${input.callbackUrl}?status=success&ref=${input.orderNumber}`,
      reference: input.orderNumber,
    };
  }

  async verify(input: VerifyPaymentInput) {
    if (!this.secretKey) {
      console.warn("[flutterwave] FLUTTERWAVE_SECRET_KEY not set — cannot verify server-side.");
      return { verified: false, status: "pending" as const, rawResponse: input.payload };
    }
    if (!input.reference) {
      return { verified: false, status: "failed" as const };
    }
    const res = await fetch(
      `https://api.flutterwave.com/v3/transactions/${input.reference}/verify`,
      { headers: { Authorization: `Bearer ${this.secretKey}` } }
    ).then((r) => r.json() as Promise<{ data?: { status: string; amount: number; currency: string; id: number } }>)
      .catch(() => ({ data: undefined }));

    const paid = res.data?.status === "successful";
    return {
      verified: paid,
      status: paid ? ("paid" as const) : ("failed" as const),
      amount: res.data?.amount,
      currency: res.data?.currency,
      providerTransactionId: res.data?.id ? String(res.data.id) : undefined,
      rawResponse: res,
    };
  }

  parseWebhookEvent(body: unknown, headers: Record<string, string>) {
    const expectedHash = process.env.FLUTTERWAVE_WEBHOOK_HASH;
    if (expectedHash && headers["verif-hash"] !== expectedHash) {
      throw new Error("Invalid Flutterwave webhook signature.");
    }
    const event = body as { event?: string; data?: { tx_ref?: string; status?: string } };
    return {
      eventType: event.event ?? "unknown",
      reference: event.data?.tx_ref ?? "",
      status: event.data?.status === "successful" ? ("paid" as const) : ("pending" as const),
      raw: body,
    };
  }
}

export const FlutterwaveProvider = FlutterwaveProviderImpl;
