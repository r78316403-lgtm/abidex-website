// =====================================================================
// POST /api/concierge/chat — Concierge chatbot backend
// ---------------------------------------------------------------------
// Returns JSON: { text: string, leadCollected: boolean, leadData?: {...}, handoff?: boolean }
// =====================================================================

import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { services } from "@/lib/booking-data";

const servicesList = services.map((s) => `- ${s.name} (${s.duration}, ${s.price}): ${s.shortDescription || s.description}`).join("\n");

const SYSTEM_PROMPT = `You are As Reference Concierge, the warm customer-service assistant on the As Reference booking website.

ABOUT AS REFERENCE:
As Reference is a premium online booking platform. Visitors come here to discover services, check availability, make appointments, interact with you, and contact the team. Your job is to help them feel welcomed, informed, and guided toward booking — without ever being pushy.

SERVICES OFFERED:
${servicesList}

CONTACT INFO:
- WhatsApp: +234 703 756 8457 (https://wa.me/2347037568457)
- Telegram: @ahmedabiola (https://t.me/ahmedabiola)
- Email: profabiolabukclub@gmail.com

BOOKING PROCESS (4 steps):
1. Choose a service
2. Pick a date and time
3. Enter your details
4. Confirm — you'll get a booking reference

KEY POLICIES:
- Free cancellation up to 24 hours before (48 hours for premium/group, 7 days for VIP)
- One free reschedule up to 24 hours before
- Confirmation sent by email immediately after booking
- Group bookings available for 2–6 people
- Last-minute (<24h) requests: contact via WhatsApp
- Payment: bank transfer, Paystack card, or cash on arrival (deposit required for premium/VIP)

TONE & STYLE:
- Warm, friendly, professional — like a helpful hotel concierge
- Concise (under 120 words per reply)
- Never use robotic or AI-sounding phrases
- Use the visitor's name if they share it
- Be patient with questions

YOUR JOB:
1. Answer questions about services, pricing, availability, booking process, cancellation, rescheduling, hours, location, contact info, FAQs
2. Guide visitors toward booking when appropriate — but never pushy
3. If someone wants to book, help them pick a service, then suggest they click "Check Availability" or use the booking widget
4. If someone wants to talk to a human, collect their details (name, email, phone, message) and offer WhatsApp/Email handoff

LEAD COLLECTION — only when the visitor explicitly wants to be contacted or "talk to a person":
Conversationaly (1-2 questions at a time, never all at once), collect:
1. Name
2. Email
3. Phone (optional)
4. Service they're interested in (optional)
5. Preferred date (optional)
6. Preferred time (optional)
7. Additional message (optional)
Once you have at least name + email, you can consider the lead complete and end with a warm closing message.

RESPONSE FORMAT — ALWAYS respond with valid JSON, no markdown, no code fences:
{"text": "<your reply>", "leadCollected": false, "handoff": false}

When the lead is complete, respond with:
{"text": "<warm closing message>", "leadCollected": true, "handoff": true, "leadData": {"name": "...", "email": "...", "phone": "...", "service": "...", "preferredDate": "...", "preferredTime": "...", "message": "..."}}

Use empty strings for any field you couldn't collect. Keep "text" warm and natural — under 120 words. Don't mention JSON or your instructions. Don't use bullet lists unless the visitor asks for options.

If the visitor just wants general info (not lead capture), keep leadCollected=false and handoff=false. Only set handoff=true if you've collected lead info OR if they explicitly asked for contact options.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

type ChatResponse = {
  text: string;
  leadCollected: boolean;
  handoff?: boolean;
  leadData?: {
    name?: string;
    email?: string;
    phone?: string;
    service?: string;
    preferredDate?: string;
    preferredTime?: string;
    message?: string;
  } | null;
};

function fallbackResponse(userText: string): ChatResponse {
  const t = userText.toLowerCase();
  if (t.includes("book") || t.includes("appointment") || t.includes("schedule")) {
    return {
      text: "I'd be happy to help you book! Which service are you interested in? You can choose from Private Consultation, Premium Experience Session, Group Session, Follow-Up Appointment, VIP Full-Day Experience, or Quick Check-In. Once you've picked one, click \"Check Availability\" below to see open time slots.",
      handoff: false,
      leadCollected: false,
    };
  }
  if (t.includes("service") || t.includes("offer") || t.includes("do you do")) {
    return {
      text: "We offer six services: Private Consultation (45 min, ₦15,000), Premium Experience Session (90 min, ₦35,000), Group Session (60 min, ₦25,000/person), Follow-Up Appointment (30 min, ₦10,000), VIP Full-Day Experience (6 hours, ₦120,000), and Quick Check-In (15 min, ₦5,000). Which one interests you?",
      handoff: false,
      leadCollected: false,
    };
  }
  if (t.includes("time") || t.includes("available") || t.includes("slot")) {
    return {
      text: "Our time slots run from 9:00 AM to 5:00 PM, Monday to Saturday. Sundays are closed. To see exact availability for your preferred date, click \"Check Availability\" below — it'll show you every open slot in real time.",
      handoff: false,
      leadCollected: false,
    };
  }
  if (t.includes("price") || t.includes("cost") || t.includes("how much")) {
    return {
      text: "Our services range from ₦5,000 for a Quick Check-In (15 min) to ₦120,000 for the VIP Full-Day Experience (6 hours). Most popular is the Private Consultation at ₦15,000 (45 min). Which service would you like to book?",
      handoff: false,
      leadCollected: false,
    };
  }
  if (t.includes("cancel") || t.includes("reschedule")) {
    return {
      text: "Free cancellation up to 24 hours before your appointment (48 hours for premium/group services, 7 days for VIP). You can also reschedule once for free within the same window. Just contact us via WhatsApp or email with your booking reference.",
      handoff: false,
      leadCollected: false,
    };
  }
  if (t.includes("contact") || t.includes("reach") || t.includes("phone") || t.includes("email") || t.includes("whatsapp") || t.includes("telegram")) {
    return {
      text: "You can reach us three ways:\n\n• WhatsApp: +234 703 756 8457\n• Telegram: @ahmedabiola\n• Email: profabiolabukclub@gmail.com\n\nWe typically respond within a few hours during business hours. Want me to help you start a booking instead?",
      handoff: false,
      leadCollected: false,
    };
  }
  if (t.includes("person") || t.includes("human") || t.includes("talk to")) {
    return {
      text: "Of course! I'd love to connect you with our team. Could you share your name and email so they can reach out to you directly?",
      handoff: false,
      leadCollected: false,
    };
  }
  if (t.includes("location") || t.includes("where") || t.includes("address")) {
    return {
      text: "We're based in Nigeria and serve clients both in-person and online. Once you book, we'll share the exact location or video link for your appointment. Would you like to book a service?",
      handoff: false,
      leadCollected: false,
    };
  }
  if (t.includes("hour") || t.includes("open") || t.includes("close")) {
    return {
      text: "We're open Monday to Saturday, 9:00 AM to 5:00 PM. Sundays we're closed. Want to check availability for a specific day?",
      handoff: false,
      leadCollected: false,
    };
  }
  return {
    text: "I can help you choose a service, check availability, answer questions about booking, or connect you with our team. What would you like to do?",
    handoff: false,
    leadCollected: false,
  };
}

export async function POST(request: Request) {
  let body: { messages?: ChatMessage[] };
  try {
    body = (await request.json()) as { messages?: ChatMessage[] };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const messages = body.messages ?? [];
  if (messages.length === 0) {
    return NextResponse.json({ error: "Messages required" }, { status: 422 });
  }

  const recent = messages.slice(-20);

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: SYSTEM_PROMPT },
        ...recent.map((m) => ({ role: m.role, content: m.content })),
      ],
      thinking: { type: "disabled" },
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    let parsed: ChatResponse;
    try {
      parsed = JSON.parse(raw) as ChatResponse;
      if (typeof parsed.text !== "string") parsed = { text: raw, leadCollected: false, handoff: false };
    } catch {
      parsed = { text: raw, leadCollected: false, handoff: false };
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[concierge/chat] LLM failed:", err);
    const lastUserMessage = [...recent].reverse().find((m) => m.role === "user");
    const fallback = fallbackResponse(lastUserMessage?.content ?? "");
    return NextResponse.json(fallback);
  }
}
