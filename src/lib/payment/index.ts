// =====================================================================
// PAYMENT SERVICE — modular provider abstraction
// ---------------------------------------------------------------------
// Active provider is selected by the PAYMENT_PROVIDER env var.
// To add a new provider: create a file in ./providers/ implementing
// the PaymentProvider interface and register it in the `providers`
// map below. No other code changes required.
// =====================================================================

import "server-only";
import { siteConfig } from "../site-config";
import type { OrderInput } from "../types";

export type InitiatePaymentInput = {
  orderNumber: string;
  amount: number;
  currency: string;
  customer: OrderInput["customer"];
  items: OrderInput["items"];
  // URL the provider should redirect back to after payment
  callbackUrl: string;
};

export type InitiatePaymentResult =
  | {
      provider: string;
      authorizationUrl: string;     // redirect URL for hosted checkout
      reference: string;            // merchant-side reference
    }
  | {
      provider: string;
      clientSecret?: string;        // e.g. Stripe PaymentIntent secret
      reference: string;
      paymentIntentId?: string;
    };

export type VerifyPaymentInput = {
  reference: string;
  // For webhook verification
  payload?: unknown;
  headers?: Record<string, string>;
  signature?: string;
};

export type VerifyPaymentResult = {
  verified: boolean;
  status: "paid" | "pending" | "failed";
  amount?: number;
  currency?: string;
  providerTransactionId?: string;
  rawResponse?: unknown;
};

export type PaymentProvider = {
  name: string;
  initiate(input: InitiatePaymentInput): Promise<InitiatePaymentResult>;
  verify(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;
  // Build a server-side webhook handler for this provider.
  // Return type is intentionally flexible since providers vary.
  parseWebhookEvent(body: unknown, headers: Record<string, string>): {
    eventType: string;
    reference: string;
    status: "paid" | "pending" | "failed";
    raw: unknown;
  };
};

// --- Provider registry ---
import { StripeProvider } from "./providers/stripe";
import { PaystackProvider } from "./providers/paystack";
import { FlutterwaveProvider } from "./providers/flutterwave";
import { CodProvider } from "./providers/cod";

const providers: Record<string, () => PaymentProvider> = {
  stripe: () => new StripeProvider(),
  paystack: () => new PaystackProvider(),
  flutterwave: () => new FlutterwaveProvider(),
  cod: () => new CodProvider(),
};

export function getPaymentProvider(): PaymentProvider {
  const name = siteConfig.payment.provider;
  const factory = providers[name];
  if (!factory) {
    throw new Error(
      `Unknown payment provider "${name}". Set PAYMENT_PROVIDER to one of: ${Object.keys(providers).join(", ")}`
    );
  }
  return factory();
}

export function listAvailableProviders(): string[] {
  return Object.keys(providers);
}

export type { PaymentProvider };
