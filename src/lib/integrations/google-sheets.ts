// =====================================================================
// GOOGLE SHEETS INTEGRATION — SECURE SERVER-SIDE ONLY
// ---------------------------------------------------------------------
// Order rows are appended to a Google Sheet when an order is placed.
// Credentials are read from environment variables — NEVER exposed to
// the browser.
//
// To enable:
//   1. Create a Google service account in Google Cloud Console.
//   2. Enable the Google Sheets API for the project.
//   3. Share your spreadsheet with the service account email (Editor).
//   4. Add these to .env:
//        GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@project.iam.gserviceaccount.com
//        GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
//        GOOGLE_SHEETS_SPREADSHEET_ID=1Abc...      (from the sheet URL)
//        GOOGLE_SHEETS_RANGE=Orders!A:T            (optional; default)
//
// If credentials are missing, the integration silently no-ops and logs
// a warning so the order flow still completes for the customer.
// =====================================================================

import "server-only";
import { siteConfig } from "../site-config";
import type { Order } from "../types";

type GoogleJwt = {
  access_token: string;
  expires_in: number;
};

type GoogleConfig = {
  serviceAccountEmail: string;
  privateKey: string;
  spreadsheetId: string;
  range: string;
};

function loadConfig(): GoogleConfig | null {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? "";
  const privateKey = (process.env.GOOGLE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? "";
  const range = process.env.GOOGLE_SHEETS_RANGE ?? "Orders!A:T";

  if (!serviceAccountEmail || !privateKey || !spreadsheetId) {
    return null;
  }
  return { serviceAccountEmail, privateKey, spreadsheetId, range };
}

function base64url(input: string) {
  return Buffer.from(input, "utf-8").toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// Minimal JWT encoder (RS256) — avoids pulling in the `jsonwebtoken` dep.
async function createJwt(cfg: GoogleConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: cfg.serviceAccountEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const headerB64 = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(payload));
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(cfg.privateKey),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(signingInput));
  const sigB64 = Buffer.from(new Uint8Array(sig)).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${signingInput}.${sigB64}`;
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const lines = pem.replace(/\r/g, "").split("\n").filter((l) => !l.startsWith("-----"));
  const base64 = lines.join("");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function getAccessToken(cfg: GoogleConfig): Promise<string> {
  const jwt = await createJwt(cfg);
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }).toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google OAuth failed (${res.status}): ${text}`);
  }
  const data = (await res.json()) as GoogleJwt;
  return data.access_token;
}

type AppendableOrder = Pick<
  Order,
  | "orderNumber" | "firstName" | "lastName" | "email" | "phone"
  | "address" | "city" | "state" | "country" | "postalCode"
  | "subtotal" | "shipping" | "discount" | "total"
  | "paymentMethod" | "paymentStatus" | "orderStatus"
> & { items: { name: string; sku: string; quantity: number; price: number }[]; createdAt: string };

export async function appendOrderToSheet(order: AppendableOrder): Promise<{ ok: boolean; error?: string }> {
  const cfg = loadConfig();
  if (!cfg) {
    if (siteConfig.googleSheets.enabled) {
      console.warn(
        "[google-sheets] GOOGLE_SHEETS_SPREADSHEET_ID is set but credentials are incomplete. " +
        "Add GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY to .env to enable sheet sync."
      );
    } else {
      console.info("[google-sheets] Not configured (skipping). Set GOOGLE_SHEETS_* env vars to enable.");
    }
    return { ok: false, error: "not-configured" };
  }

  try {
    const token = await getAccessToken(cfg);
    const itemsSummary = order.items.map((i) => `${i.name} x${i.quantity}`).join(" | ");
    const productIds = order.items.map((i) => i.sku).join(", ");
    const quantities = order.items.map((i) => String(i.quantity)).join(", ");

    const row = [
      order.orderNumber,
      new Date(order.createdAt).toISOString(),
      order.firstName,
      order.lastName,
      order.email,
      order.phone,
      order.address,
      order.city,
      order.state,
      order.country,
      order.postalCode,
      itemsSummary,
      productIds,
      quantities,
      order.subtotal.toFixed(2),
      order.shipping.toFixed(2),
      order.discount.toFixed(2),
      order.total.toFixed(2),
      order.paymentMethod,
      order.paymentStatus,
      order.orderStatus,
    ];

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${cfg.spreadsheetId}/values/${encodeURIComponent(
        cfg.range
      )}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: [row] }),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Sheets API ${res.status}: ${text}`);
    }
    return { ok: true };
  } catch (err) {
    console.error("[google-sheets] append failed:", err);
    return { ok: false, error: String(err) };
  }
}
