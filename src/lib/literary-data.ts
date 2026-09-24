// =====================================================================
// ABIDEX — LITERARY DATA
// All content for the 8 sections of the literary society site
// =====================================================================

import type { LucideIcon } from "lucide-react";
import {
  BookOpen, Users, Star, Calendar, MessageSquare, Sparkles,
  Shield, Heart, PenTool, CheckCircle2, Quote,
} from "lucide-react";

// --- Stats (Our Foundation) ---
export const stats: { value: string; label: string; suffix?: string }[] = [
  { value: "150", suffix: "+", label: "Global Hub Members", desc: "An engaged, international reading community." },
  { value: "120", suffix: "+", label: "Active Social Salon Readers", desc: "Readers participating in private discourse channels." },
  { value: "150", suffix: "+", label: "Average Goodreads Reviews per Selection", desc: "Consistent review velocity across major platforms." },
  { value: "18", label: "Standout Authors Per Annual Cycle", desc: "A deliberately limited, high-attention residency cohort." },
];

// --- Residency stages ---
export const residencyStages: { number: string; title: string; description: string }[] = [
  {
    number: "01",
    title: "Selection & Onboarding",
    description: "A chosen title enters the residency and is introduced to the engaged reader base.",
  },
  {
    number: "02",
    title: "Structured Deep-Dives",
    description: "Guided, analytical reading through private salons and chapter-level discussion.",
  },
  {
    number: "03",
    title: "Review Velocity",
    description: "Sustained, high-quality commentary translates into measurable review-cluster momentum.",
  },
  {
    number: "04",
    title: "Permanent Recognition",
    description: "Long-tail engagement cements lasting intellectual recognition for the work.",
  },
];

// --- Residency calendar months (Oct–Dec sample) ---
export const calendarMonths: { month: string; picks: string; days: (number | null)[]; pickDays: number[] }[] = [
  {
    month: "October",
    picks: "2 picks",
    days: buildDays(2025, 9), // Oct 2025 (0-indexed: 9 = October)
    pickDays: [2, 16],
  },
  {
    month: "November",
    picks: "1 pick",
    days: buildDays(2025, 10),
    pickDays: [13],
  },
  {
    month: "December",
    picks: "2 picks",
    days: buildDays(2025, 11),
    pickDays: [4, 18],
  },
];

function buildDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// --- Review Velocity features ---
export const reviewFeatures: { label: string; icon: LucideIcon }[] = [
  { label: "Private Channels", icon: Shield },
  { label: "Social Salons", icon: Users },
  { label: "Analytical Commentary", icon: PenTool },
  { label: "Authentic Feedback", icon: Heart },
];

// --- Curators / Selection Committee ---
export const curators: { role: string; description: string }[] = [
  { role: "Literary Specialists", description: "Deep expertise across genres and narrative traditions." },
  { role: "Academic Minds", description: "Scholarly rigor applied to every selection." },
  { role: "Cultural Curators", description: "A refined eye for lasting cultural contribution." },
];

// --- Voices / Testimonials ---
export const voices: { quote: string; author: string; role: string; type: "author" | "reader" }[] = [
  {
    quote:
      "The depth of discussion generated around my book was staggering. Abidex didn't just give me readers; they gave my work a legacy, treating the text with a level of consideration that is incredibly rare in the modern publishing landscape.",
    author: "R.A.",
    role: "Residency Alumnus",
    type: "author",
  },
  {
    quote:
      "In a sea of surface-level internet commentary, this salon is a sanctuary. The discussions are consistently high-signal, challenging, and deeply rewarding.",
    author: "C.S.",
    role: "Core Salon Member",
    type: "reader",
  },
];

// --- Navigation ---
export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Selection Committee", href: "#committee" },
  { label: "How We Operate", href: "#operate" },
  { label: "Voices", href: "#voices" },
  { label: "Contact", href: "#contact" },
];
