// =====================================================================
// CASH-ON-DELIVERY (COD) PROVIDER
// ---------------------------------------------------------------------
// For markets where COD is the primary payment method. No credentials
// required. Orders are created with payment_status=pending and
// confirmed manually when cash is collected at delivery.
// =====================================================================

import "server-only";
import type { PaymentProvider, InitiatePaymentInput, InitiatePaymentResult, VerifyPaymentInput, VerifyPaymentResult } from "../index";

class CodProviderImpl implements PaymentProvider {
  name = "cod" as const;

  async initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult> {
    return {
      provider: this.name,
      authorizationUrl: `${input.callbackUrl}?provider=cod&status=success&ref=${input.orderNumber}`,
      reference: input.orderNumber,
    };
  }

  async verify(_input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    return { verified: false, status: "pending" };
  }

  parseWebhookEvent(): { eventType: string; reference: string; status: "paid" | "pending" | "failed"; raw: unknown } {
    return {
      eventType: "cod.noop",
      reference: "",
      status: "pending",
      raw: null,
    };
  }
}

export const CodProvider = CodProviderImpl;
