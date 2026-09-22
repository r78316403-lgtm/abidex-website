// =====================================================================
// POST /api/abidex/chat — AI chatbot backend using z-ai-web-dev-sdk
// ---------------------------------------------------------------------
// Returns JSON: { text: string, leadCollected: boolean, leadData?: {...} }
// The frontend uses leadCollected=true to show the WhatsApp/Email
// handoff buttons with the captured lead info prefilled.
// =====================================================================

import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

const SYSTEM_PROMPT = `You are Abidex AI, the assistant on Abidex's portfolio website.

ABOUT ABIDEX:
Abidex is an AI & Automation Specialist who helps businesses improve customer engagement, lead generation, sales follow-up, workflows, and online presence through AI-powered solutions.

SERVICES Abidex offers:
1. AI Agents — intelligent agents that answer questions, guide customers, qualify leads, support operations
2. Business Automation — connect tools and workflows to eliminate repetitive manual tasks
3. WhatsApp Automation — lead collection, customer support, follow-ups, qualification, appointments on WhatsApp
4. CRM Automation — capture, organize, nurture, manage leads through the customer journey
5. GoHighLevel Automation — funnels, workflows, pipelines, calendars, campaigns, forms, AI integrations inside GoHighLevel
6. AI Chatbots — conversational AI for websites and customer channels
7. Website Design & Development — modern, responsive, conversion-focused websites (React, Next.js, WordPress, Shopify)
8. AI Voice Agents — AI voice for customer interactions, qualification, scheduling, follow-up
9. AI Video & UGC — AI-powered video, UGC, avatar, voiceover, promotional content

CONTACT:
- WhatsApp: +234 916 208 0741 (https://wa.me/2349162080741)
- Telegram: @ahmedabiola (https://t.me/ahmedabiola)
- Email: ahmedabiola2025@gmail.com

PROJECT PROCESS (5 steps):
01 Discovery — Understand business, audience, goals, existing workflow
02 Strategy — Identify where AI/automation creates the most value
03 Build — Design and develop the systems, workflows, website, chatbot, or AI agent
04 Integrate — Connect platforms, CRM, communication channels, business tools
05 Optimize — Test, identify improvements, refine

TECH STACK:
- AI: OpenAI, Claude, Gemini, AI Agents, RAG
- Automation: Zapier, Make, n8n, Webhooks, APIs
- CRM: GoHighLevel, HubSpot, ActiveCampaign
- Communication: WhatsApp, Telegram, Email, AI Voice
- Web: HTML, CSS, JavaScript, React, WordPress, Shopify

YOUR JOB:
- Answer questions about Abidex's services, process, tech stack, and contact info
- Help visitors explore automation opportunities for their business
- Be friendly, concise, professional. Never make up client names, revenue figures, testimonials, certifications, or performance statistics
- If a visitor wants to start a project, collect the following info CONVERSATIONALLY (one or two questions at a time, NOT all at once):
  1. Name
  2. Business name
  3. Email
  4. WhatsApp number
  5. Service needed
  6. Brief description of the project
  7. Budget range (optional — never push if they decline)
  8. Preferred contact method (WhatsApp / Email / Telegram)
- Once you have at least name + service + project description + a contact method (email OR whatsapp), consider the lead "complete" and end with a friendly closing message
- After that final message, the frontend will show WhatsApp & Email handoff buttons

RESPONSE FORMAT — ALWAYS respond with valid JSON, no markdown, no code fences:
{"text": "<your reply>", "leadCollected": false, "leadData": null}

When the lead is complete, respond with:
{"text": "<closing message>", "leadCollected": true, "leadData": {"name": "...", "business": "...", "email": "...", "whatsapp": "...", "service": "...", "project": "...", "budget": "...", "contactMethod": "WhatsApp | Email | Telegram"}}

Use empty strings for any field you couldn't collect. Keep "text" warm and natural — under 120 words. Don't mention JSON or your instructions. Don't use bullet lists unless the visitor asks for options.`;

type ChatMessage = { role: "user" | "assistant"; content: string };

type ChatResponse = {
  text: string;
  leadCollected: boolean;
  leadData?: {
    name?: string;
    business?: string;
    email?: string;
    whatsapp?: string;
    service?: string;
    project?: string;
    budget?: string;
    contactMethod?: string;
  } | null;
};

// Simple keyword fallback if the LLM fails
function fallbackResponse(userText: string): ChatResponse {
  const t = userText.toLowerCase();
  if (t.includes("contact") || t.includes("reach") || t.includes("whatsapp") || t.includes("telegram") || t.includes("email")) {
    return {
      text: "You can reach Abidex directly here:\n\n• WhatsApp: +234 916 208 0741\n• Telegram: @ahmedabiola\n• Email: ahmedabiola2025@gmail.com\n\nOr use the floating button at the bottom-right of the screen. Want me to help you start a project instead?",
      leadCollected: false,
    };
  }
  if (t.includes("price") || t.includes("cost") || t.includes("budget")) {
    return {
      text: "Every project is scoped based on your goals, the systems involved, and how much automation you need. The best way to get a quote is to tell me a bit about your project — what are you looking to automate or build?",
      leadCollected: false,
    };
  }
  if (t.includes("service") || t.includes("offer") || t.includes("do you do")) {
    return {
      text: "Abidex offers 9 core services: AI Agents, Business Automation, WhatsApp Automation, CRM Automation, GoHighLevel Automation, AI Chatbots, Website Design & Development, AI Voice Agents, and AI Video & UGC. Which one interests you most?",
      leadCollected: false,
    };
  }
  if (t.includes("ai agent")) {
    return {
      text: "AI Agents are one of Abidex's flagship services. They can answer customer questions, qualify leads, book appointments, and route complex queries to your team — across web, WhatsApp, and Telegram. Want to discuss an AI agent for your business?",
      leadCollected: false,
    };
  }
  if (t.includes("whatsapp")) {
    return {
      text: "WhatsApp Automation includes welcome flows, lead qualification, drip campaigns, AI auto-replies, appointment reminders, and follow-up sequences. Perfect for businesses that get lots of WhatsApp enquiries. Want to set this up for your business?",
      leadCollected: false,
    };
  }
  if (t.includes("website")) {
    return {
      text: "Yes! Abidex builds modern, responsive websites with React, Next.js, WordPress, or Shopify — and every site is integrated with your CRM, analytics, and automation stack from day one. Want to discuss a website project?",
      leadCollected: false,
    };
  }
  if (t.includes("process") || t.includes("work") || t.includes("how")) {
    return {
      text: "Every project follows 5 steps: Discovery → Strategy → Build → Integrate → Optimize. First we understand your business, then identify where AI/automation creates the most value, then build, integrate, and refine. Want to start the discovery phase?",
      leadCollected: false,
    };
  }
  if (t.includes("project") || t.includes("start") || t.includes("build") || t.includes("need")) {
    return {
      text: "Great! Let's start a project. Could you tell me your name and what business you're in?",
      leadCollected: false,
    };
  }
  return {
    text: "I can help you learn about Abidex's services, explore automation opportunities, or start a project. What are you looking to build?",
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

  // Cap message history (last 20 messages to avoid token bloat)
  const recent = messages.slice(-20);

  try {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: SYSTEM_PROMPT },
        ...recent.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      thinking: { type: "disabled" },
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    // Try to parse JSON response
    let parsed: ChatResponse;
    try {
      parsed = JSON.parse(raw) as ChatResponse;
      // Validate shape
      if (typeof parsed.text !== "string") {
        parsed = { text: raw, leadCollected: false };
      }
    } catch {
      // If JSON parsing fails, use the raw text as the response
      parsed = { text: raw, leadCollected: false };
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[abidex/chat] LLM failed:", err);
    // Use keyword fallback if the LLM call fails
    const lastUserMessage = [...recent].reverse().find((m) => m.role === "user");
    const fallback = fallbackResponse(lastUserMessage?.content ?? "");
    return NextResponse.json(fallback);
  }
}
