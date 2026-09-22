// =====================================================================
// ABIDEX — CONTENT DATA
// All services, projects, FAQs, tech stack, process steps, etc.
// =====================================================================

import type { LucideIcon } from "lucide-react";
import {
  Bot, Workflow, MessageCircle, Database, LayoutDashboard, MessagesSquare,
  Globe, Mic, Video, Search, Zap, Brain, Network, Cpu, Sparkles,
  ClipboardList, PenTool, Plug, Gauge, Users, Target, Layers, Link2,
} from "lucide-react";

// --- Trust strip capabilities ---
export const capabilities: string[] = [
  "AI Agents",
  "Automation",
  "CRM Systems",
  "WhatsApp Automation",
  "GoHighLevel",
  "AI Chatbots",
  "Websites",
  "Lead Generation",
  "AI Voice Agents",
  "AI Video",
];

// --- Services (9) ---
export type Service = {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  longDescription: string;
  features: string[];
};

export const services: Service[] = [
  {
    id: "ai-agents",
    title: "AI Agents",
    icon: Bot,
    description:
      "Build intelligent AI agents capable of answering questions, guiding customers, qualifying leads, and supporting business operations.",
    longDescription:
      "Custom AI agents trained on your business context. They can handle customer questions, qualify leads, book appointments, and route complex queries to your team — available 24/7 across web, WhatsApp, and Telegram.",
    features: ["Custom knowledge base", "Multi-channel deployment", "Lead qualification", "Handoff to humans"],
  },
  {
    id: "business-automation",
    title: "Business Automation",
    icon: Workflow,
    description:
      "Connect tools and workflows to eliminate repetitive manual tasks and improve operational efficiency.",
    longDescription:
      "Map and automate the repetitive processes that drain your team's time — data entry, follow-ups, notifications, reporting, sync between apps. Built with Zapier, Make, n8n, and custom webhooks.",
    features: ["Workflow mapping", "Tool integration", "Trigger-based actions", "Error monitoring"],
  },
  {
    id: "whatsapp-automation",
    title: "WhatsApp Automation",
    icon: MessageCircle,
    description:
      "Create automated WhatsApp experiences for lead collection, customer support, follow-ups, qualification, and appointment workflows.",
    longDescription:
      "Turn WhatsApp into a 24/7 sales and support channel. Automated greetings, qualification flows, follow-up sequences, appointment reminders, and AI-powered replies — all on the world's most-used messenger.",
    features: ["Welcome flows", "Drip campaigns", "AI auto-replies", "Appointment booking"],
  },
  {
    id: "crm-automation",
    title: "CRM Automation",
    icon: Database,
    description:
      "Build automated CRM workflows that capture, organize, nurture, and manage leads throughout the customer journey.",
    longDescription:
      "Make sure no lead falls through the cracks. Auto-enrich contacts, segment them by behaviour, trigger nurture sequences, and update deal stages automatically — across GoHighLevel, HubSpot, and ActiveCampaign.",
    features: ["Auto-lead capture", "Pipeline automation", "Nurture sequences", "Deal stage updates"],
  },
  {
    id: "gohighlevel-automation",
    title: "GoHighLevel Automation",
    icon: LayoutDashboard,
    description:
      "Create funnels, workflows, pipelines, calendars, campaigns, forms, automations, and AI-powered systems inside GoHighLevel.",
    longDescription:
      "Full GoHighLevel build-outs: sales funnels, automated workflows, opportunity pipelines, calendar booking, email/SMS campaigns, custom forms, and AI integrations that turn GHL into your business's central nervous system.",
    features: ["Funnel builds", "Workflow automation", "Pipeline setup", "AI integrations"],
  },
  {
    id: "ai-chatbots",
    title: "AI Chatbots",
    icon: MessagesSquare,
    description:
      "Deploy conversational AI experiences for websites and customer communication channels.",
    longDescription:
      "On-site AI chatbots that understand your business, answer visitor questions in real time, qualify leads, and book meetings — all branded to match your site. Built with OpenAI, Claude, and modern chat frameworks.",
    features: ["Custom training", "Lead capture forms", "Meeting booking", "Brand-matched UI"],
  },
  {
    id: "website-design",
    title: "Website Design & Development",
    icon: Globe,
    description:
      "Create modern, responsive websites designed around usability, credibility, and conversion.",
    longDescription:
      "Conversion-focused websites built with React, Next.js, WordPress, or Shopify. Every site is mobile-first, fast, SEO-ready, and integrates with your CRM, analytics, and automation stack from day one.",
    features: ["Responsive design", "SEO-ready", "CRM integration", "Performance-optimized"],
  },
  {
    id: "ai-voice-agents",
    title: "AI Voice Agents",
    icon: Mic,
    description:
      "Build AI-powered voice experiences for customer interactions, qualification, scheduling, and follow-up.",
    longDescription:
      "AI voice agents that can answer inbound calls, qualify leads, book appointments, and follow up with customers — all in natural-sounding conversation. Perfect for high-volume businesses that can't afford to miss calls.",
    features: ["Inbound call handling", "Lead qualification", "Appointment scheduling", "CRM logging"],
  },
  {
    id: "ai-video-ugc",
    title: "AI Video & UGC",
    icon: Video,
    description:
      "Create AI-powered video, UGC, avatar, voiceover, and promotional content systems for businesses.",
    longDescription:
      "Scalable video content systems using AI avatars, voiceovers, and templated workflows. Produce promotional videos, product demos, and UGC-style ads at a fraction of traditional production costs.",
    features: ["AI avatar videos", "Voiceover generation", "Templated workflows", "Bulk content production"],
  },
];

// --- Automation showcase workflow ---
export const workflowSteps: { label: string; icon: LucideIcon }[] = [
  { label: "Visitor", icon: Users },
  { label: "Website / Social / WhatsApp", icon: Globe },
  { label: "AI Agent", icon: Bot },
  { label: "Lead Qualification", icon: Target },
  { label: "CRM", icon: Database },
  { label: "Automated Follow-Up", icon: MessageCircle },
  { label: "Appointment Booking", icon: ClipboardList },
  { label: "Sales Team", icon: Users },
];

// --- Projects (4 demo / concept projects) ---
export type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  technologies: string[];
  problem: string;
  solution: string;
  workflow: string[];
  techStack: string[];
  outcome: string; // Expected / Intended Outcome
  demo: boolean;
  accent: string; // tailwind gradient classes
};

export const projects: Project[] = [
  {
    id: "sandbar-ai-restaurant",
    name: "Sand Bar AI Restaurant Agent",
    category: "AI Agent • Hospitality",
    description:
      "AI-powered restaurant assistant with conversational support, customer questions, WhatsApp/Telegram contact options, and automated customer journeys.",
    technologies: ["OpenAI", "WhatsApp API", "Telegram Bot API", "Next.js"],
    problem:
      "Restaurants receive repetitive questions daily — menu, hours, reservations, dietary options — and lose customers when staff can't respond fast enough, especially outside business hours.",
    solution:
      "An AI agent trained on the restaurant's menu, policies, and FAQs that answers instantly, qualifies reservation requests, and routes complex queries to staff via WhatsApp or Telegram.",
    workflow: [
      "Visitor lands on restaurant website",
      "AI agent greets and offers help",
      "Agent answers menu / hours / location questions",
      "For reservations, agent collects date / time / party size",
      "Booking sent to WhatsApp / Telegram for staff confirmation",
      "Auto-follow-up reminder sent to customer before visit",
    ],
    techStack: ["OpenAI GPT-4", "WhatsApp Business API", "Telegram Bot API", "Next.js", "Tailwind CSS"],
    outcome:
      "Faster response times, reduced repetitive questions for staff, more reservations captured outside business hours, and a modern brand experience that differentiates the restaurant.",
    demo: true,
    accent: "from-blue-500/20 to-violet-500/20",
  },
  {
    id: "real-estate-ai-leads",
    name: "Real Estate AI Lead System",
    category: "AI Automation • Real Estate",
    description:
      "A concept showing how AI can qualify property leads, collect information, and trigger automated follow-up.",
    technologies: ["AI Agent", "CRM", "WhatsApp", "n8n"],
    problem:
      "Real estate agents receive many enquiries but can't follow up with all of them quickly. Leads go cold before they're contacted, and qualifying them manually is time-consuming.",
    solution:
      "An AI agent on the property website that asks qualifying questions (budget, location, timeline, property type), then routes qualified leads into the CRM with automated WhatsApp follow-up sequences.",
    workflow: [
      "Visitor browses property listings",
      "AI agent opens with personalized greeting",
      "Agent asks: budget, location, timeline, property type",
      "Qualified leads added to CRM with tags",
      "Automated WhatsApp follow-up sent within minutes",
      "Agent notified of hot leads for personal call",
    ],
    techStack: ["OpenAI", "GoHighLevel CRM", "WhatsApp API", "n8n", "Webhooks"],
    outcome:
      "Faster lead response times, automatic lead qualification, consistent follow-up, and more time for agents to focus on closing deals instead of chasing cold leads.",
    demo: true,
    accent: "from-violet-500/20 to-cyan-500/20",
  },
  {
    id: "ecommerce-ai-experience",
    name: "E-commerce AI Experience",
    category: "AI Chatbot • E-commerce",
    description:
      "AI-powered customer support and product discovery experience for an online store.",
    technologies: ["AI Chatbot", "RAG", "Product Catalog", "React"],
    problem:
      "Online stores lose sales when customers can't find what they're looking for or wait too long for support answers. Search alone doesn't handle natural questions like 'what's best for sensitive skin?'",
    solution:
      "A conversational AI shopping assistant that understands the product catalog, recommends products based on customer needs, answers shipping/returns questions, and recovers abandoned carts.",
    workflow: [
      "Customer visits online store",
      "AI assistant offers help finding products",
      "Customer describes need in natural language",
      "Agent recommends 2-3 matching products",
      "Customer clicks through to product page",
      "If cart abandoned, automated follow-up email/SMS sent",
    ],
    techStack: ["OpenAI", "RAG", "Pinecone Vector DB", "Shopify API", "React"],
    outcome:
      "Higher conversion rates, larger average order values, reduced support tickets, and recovered abandoned-cart revenue through timely automated follow-ups.",
    demo: true,
    accent: "from-cyan-500/20 to-blue-500/20",
  },
  {
    id: "gohighlevel-automation-system",
    name: "GoHighLevel Automation System",
    category: "CRM Automation • SaaS",
    description:
      "CRM, pipeline, workflow, appointment booking, and automated follow-up system.",
    technologies: ["GoHighLevel", "Workflows", "Pipelines", "AI"],
    problem:
      "Service businesses use multiple disconnected tools — separate calendar, separate CRM, separate email marketing — and waste hours moving data between them. Leads slip through the cracks.",
    solution:
      "A complete GoHighLevel build-out: unified CRM, automated workflows, opportunity pipeline, calendar booking, email/SMS campaigns, and AI-powered follow-up — all under one roof.",
    workflow: [
      "Lead captured via form / landing page / chat",
      "Auto-added to CRM with source and tags",
      "Opportunity created in pipeline",
      "Instant SMS + email follow-up triggered",
      "Appointment booking link sent",
      "Pre-appointment reminder + post-appointment recap",
    ],
    techStack: ["GoHighLevel", "Twilio SMS", "SendGrid Email", "Stripe", "Zapier"],
    outcome:
      "One unified system replaces 5+ disconnected tools, faster lead response, more appointments booked, and a clean view of every lead's journey through the pipeline.",
    demo: true,
    accent: "from-blue-500/20 to-emerald-500/20",
  },
];

// --- Process (5 steps) ---
export const processSteps: {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    number: "01",
    title: "Discovery",
    description:
      "Understand the business, audience, goals, and existing workflow.",
    icon: Search,
  },
  {
    number: "02",
    title: "Strategy",
    description:
      "Identify where AI and automation can create the most value.",
    icon: Brain,
  },
  {
    number: "03",
    title: "Build",
    description:
      "Design and develop the required systems, workflows, website, chatbot, or AI agent.",
    icon: PenTool,
  },
  {
    number: "04",
    title: "Integrate",
    description:
      "Connect the relevant platforms, CRM, communication channels, and business tools.",
    icon: Plug,
  },
  {
    number: "05",
    title: "Optimize",
    description:
      "Test the system, identify improvements, and refine the experience.",
    icon: Gauge,
  },
];

// --- Why Abidex (6 benefits) ---
export const benefits: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Business-Focused",
    description:
      "Technology is built around business goals rather than technology alone.",
    icon: Target,
  },
  {
    title: "Automation-First",
    description:
      "Reduce repetitive work and create connected workflows.",
    icon: Zap,
  },
  {
    title: "AI-Powered",
    description:
      "Use AI where it can improve communication, efficiency, and customer experience.",
    icon: Sparkles,
  },
  {
    title: "Custom Solutions",
    description:
      "Build systems around each business instead of forcing every business into the same template.",
    icon: Layers,
  },
  {
    title: "Modern User Experience",
    description:
      "Create clean, responsive, easy-to-use digital experiences.",
    icon: Cpu,
  },
  {
    title: "Connected Systems",
    description:
      "Connect websites, CRM, WhatsApp, AI agents, forms, calendars, and automation tools.",
    icon: Link2,
  },
];

// --- Technology stack ---
export const techStack: { category: string; items: string[]; icon: LucideIcon }[] = [
  {
    category: "AI",
    items: ["OpenAI", "Claude", "Gemini", "AI Agents", "RAG"],
    icon: Brain,
  },
  {
    category: "Automation",
    items: ["Zapier", "Make", "n8n", "Webhooks", "APIs"],
    icon: Workflow,
  },
  {
    category: "CRM",
    items: ["GoHighLevel", "HubSpot", "ActiveCampaign"],
    icon: Database,
  },
  {
    category: "Communication",
    items: ["WhatsApp", "Telegram", "Email", "AI Voice"],
    icon: MessageCircle,
  },
  {
    category: "Web",
    items: ["HTML", "CSS", "JavaScript", "React", "WordPress", "Shopify"],
    icon: Globe,
  },
];

// --- FAQ ---
export const faqs: { question: string; answer: string }[] = [
  {
    question: "What does Abidex help businesses automate?",
    answer:
      "I help businesses automate lead capture, follow-ups, customer communication, appointment booking, CRM workflows, WhatsApp and Telegram responses, internal processes, and AI-powered customer support. The goal is to reduce repetitive manual work so your team can focus on higher-value tasks.",
  },
  {
    question: "Can you build custom AI agents?",
    answer:
      "Yes. I build AI agents trained on your business context — your products, services, FAQs, and policies. They can answer questions, qualify leads, book appointments, and route complex queries to your team across web, WhatsApp, and Telegram.",
  },
  {
    question: "Can you automate WhatsApp lead follow-up?",
    answer:
      "Yes. WhatsApp automation is one of my core services. I can set up welcome flows, lead qualification, drip campaigns, AI-powered auto-replies, appointment reminders, and follow-up sequences — all triggered automatically based on what the customer does.",
  },
  {
    question: "Can you integrate AI with my CRM?",
    answer:
      "Yes. I integrate AI agents and automation with GoHighLevel, HubSpot, ActiveCampaign, and most modern CRMs via API. Leads captured by the AI are automatically added to your CRM, tagged, and routed through your existing pipeline.",
  },
  {
    question: "Do you build websites as well?",
    answer:
      "Yes. I design and develop modern, responsive websites with React, Next.js, WordPress, or Shopify. Every site I build is integrated with your CRM, analytics, and automation stack from day one — not just a static brochure.",
  },
  {
    question: "Can you connect multiple business tools together?",
    answer:
      "Yes. That's a big part of what I do. I use Zapier, Make, n8n, and custom webhooks to connect your website, CRM, WhatsApp, email, calendar, forms, AI agents, and any other tools — so data flows automatically and nothing falls through the cracks.",
  },
  {
    question: "Do you work with existing systems?",
    answer:
      "Yes. I rarely recommend starting from scratch. I audit what you already have — your website, CRM, funnels, communication channels — and build automation and AI on top of those systems. New tools are only added when they clearly fill a gap.",
  },
  {
    question: "How do I start a project?",
    answer:
      "Easiest way is to click the WhatsApp or Email button anywhere on this site. Tell me what you want to automate, improve, or build, and I'll reply with thoughts on the best approach. From there we can schedule a discovery call if it makes sense.",
  },
];

// --- What I Focus On (honest alternative to fake testimonials) ---
export const focusStatements: string[] = [
  "Clear communication.",
  "Practical automation.",
  "Better customer experiences.",
  "Scalable systems.",
];

// --- AI chatbot suggested prompts ---
export const chatSuggestions: string[] = [
  "What can you automate?",
  "I need an AI agent",
  "I need WhatsApp automation",
  "I need a website",
  "I want to discuss a project",
  "How can I contact Abidex?",
];
