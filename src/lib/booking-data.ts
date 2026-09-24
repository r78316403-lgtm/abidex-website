// =====================================================================
// AS REFERENCE — BOOKING DATA
// All services, FAQs, benefits, process steps, time slots
// =====================================================================

import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck, Clock, Sparkles, HeartHandshake, UserCheck,
  Calendar, CheckCircle2, Smile, CalendarDays, Star,
} from "lucide-react";

// --- Services (6 realistic placeholder services) ---
export type Service = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  duration: string;
  durationMinutes: number;
  price: string;
  priceValue: number;
  availability: "Available" | "Limited" | "By Appointment";
  image: string;
  included: string[];
  cancellation: string;
  category: string;
};

export const services: Service[] = [
  {
    id: "consultation",
    name: "Private Consultation",
    description:
      "A one-on-one session tailored to your needs — ask questions, get guidance, and plan your next steps.",
    longDescription:
      "Our Private Consultation gives you dedicated time with an experienced professional who listens to your goals, answers your questions, and helps you decide on the right path forward. Perfect for first-time clients or anyone with specific questions before committing to a longer service.",
    duration: "45 minutes",
    durationMinutes: 45,
    price: "₦15,000",
    priceValue: 15000,
    availability: "Available",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f44?auto=format&fit=crop&w=800&q=80",
    included: [
      "45-minute dedicated session",
      "Personalized recommendations",
      "Follow-up summary by email",
      "Priority booking for future services",
    ],
    cancellation: "Free cancellation up to 24 hours before your appointment. Within 24 hours, a 50% fee applies.",
    category: "Consultation",
  },
  {
    id: "premium-session",
    name: "Premium Experience Session",
    description:
      "An extended, in-depth session designed for those who want the full As Reference experience.",
    longDescription:
      "The Premium Experience Session is our flagship offering — a longer, more comprehensive appointment that combines consultation, hands-on service, and a personalized plan. Ideal for clients who want to make meaningful progress in a single visit.",
    duration: "90 minutes",
    durationMinutes: 90,
    price: "₦35,000",
    priceValue: 35000,
    availability: "Available",
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80",
    included: [
      "90-minute comprehensive session",
      "Personalized service plan",
      "Take-home materials",
      "Complimentary refreshments",
      "Priority follow-up support",
    ],
    cancellation: "Free cancellation up to 48 hours before your appointment. Within 48 hours, a 50% fee applies.",
    category: "Premium",
  },
  {
    id: "group-session",
    name: "Group Session",
    description:
      "Book for two or more and enjoy a shared experience — perfect for couples, families, or small teams.",
    longDescription:
      "Our Group Session is designed for 2–6 people who want to experience As Reference together. Whether it's a couple, a family, or a small team, you'll receive the same quality of personal attention in a comfortable group setting.",
    duration: "60 minutes",
    durationMinutes: 60,
    price: "₦25,000 / person",
    priceValue: 25000,
    availability: "Limited",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
    included: [
      "60-minute shared session",
      "Group facilitation",
      "Individual attention within the group",
      "Group summary and action plan",
    ],
    cancellation: "Free cancellation up to 48 hours before. Within 48 hours, a 50% fee applies per person.",
    category: "Group",
  },
  {
    id: "follow-up",
    name: "Follow-Up Appointment",
    description:
      "A shorter session for returning clients — review progress, adjust plans, and stay on track.",
    longDescription:
      "Designed for returning clients, the Follow-Up Appointment is a focused 30-minute session to review your progress, refine your plan, and address any new questions. Book this after any of our full services to keep your momentum going.",
    duration: "30 minutes",
    durationMinutes: 30,
    price: "₦10,000",
    priceValue: 10000,
    availability: "Available",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
    included: [
      "30-minute focused session",
      "Progress review",
      "Plan adjustments",
      "Email summary",
    ],
    cancellation: "Free cancellation up to 24 hours before your appointment.",
    category: "Follow-Up",
  },
  {
    id: "vip-day",
    name: "VIP Full-Day Experience",
    description:
      "A full day of dedicated service, consultation, and personalized attention — our most premium offering.",
    longDescription:
      "The VIP Full-Day Experience is the ultimate As Reference offering. You'll have a full day (6 hours) of dedicated professional attention, including consultation, hands-on service, breaks with refreshments, and a comprehensive take-home plan. Limited to one VIP booking per day.",
    duration: "6 hours",
    durationMinutes: 360,
    price: "₦120,000",
    priceValue: 120000,
    availability: "By Appointment",
    image: "https://images.unsplash.com/photo-1581578731548-cda46ef23905?auto=format&fit=crop&w=800&q=80",
    included: [
      "6 hours of dedicated service",
      "Personalized consultation",
      "Hands-on session",
      "Lunch and refreshments",
      "Comprehensive take-home plan",
      "30 days of priority email support",
    ],
    cancellation: "Free cancellation up to 7 days before. Within 7 days, a 75% fee applies.",
    category: "VIP",
  },
  {
    id: "quick-check",
    name: "Quick Check-In",
    description:
      "A brief 15-minute session for a single question or quick update — efficient and affordable.",
    longDescription:
      "The Quick Check-In is a 15-minute session for clients who just need a quick answer, a brief update, or a single decision reviewed. Perfect for staying on track between longer appointments.",
    duration: "15 minutes",
    durationMinutes: 15,
    price: "₦5,000",
    priceValue: 5000,
    availability: "Available",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad5c4c?auto=format&fit=crop&w=800&q=80",
    included: [
      "15-minute focused session",
      "Single-question focus",
      "Quick follow-up email",
    ],
    cancellation: "Free cancellation up to 12 hours before your appointment.",
    category: "Quick",
  },
];

// --- Benefits (4 cards) ---
export const benefits: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Easy Booking",
    description: "Book your preferred service without unnecessary steps.",
    icon: CalendarCheck,
  },
  {
    title: "Flexible Scheduling",
    description: "Choose a date and time that works for you.",
    icon: Clock,
  },
  {
    title: "Professional Experience",
    description: "Enjoy a smooth and organized customer journey.",
    icon: Sparkles,
  },
  {
    title: "Personal Support",
    description: "Get help whenever you need it.",
    icon: HeartHandshake,
  },
];

// --- How It Works (4 steps) ---
export const processSteps: { number: string; title: string; description: string; icon: LucideIcon }[] = [
  {
    number: "01",
    title: "Choose",
    description: "Select the service you need.",
    icon: UserCheck,
  },
  {
    number: "02",
    title: "Schedule",
    description: "Pick your preferred date and time.",
    icon: Calendar,
  },
  {
    number: "03",
    title: "Confirm",
    description: "Enter your information and confirm your booking.",
    icon: CheckCircle2,
  },
  {
    number: "04",
    title: "Enjoy",
    description: "Receive your confirmation and enjoy your experience.",
    icon: Smile,
  },
];

// --- Available time slots ---
export const timeSlots: { time: string; available: boolean }[] = [
  { time: "09:00 AM", available: true },
  { time: "10:00 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "12:00 PM", available: true },
  { time: "01:00 PM", available: false },
  { time: "02:00 PM", available: true },
  { time: "03:00 PM", available: true },
  { time: "04:00 PM", available: true },
  { time: "05:00 PM", available: false },
];

// --- FAQ (10 questions) ---
export const faqs: { question: string; answer: string }[] = [
  {
    question: "How do I make a booking?",
    answer:
      "Simply click any 'Book Now' button, choose your service, pick a date and time that works for you, enter your details, and confirm. You'll receive a confirmation with your booking reference immediately. The whole process takes less than two minutes.",
  },
  {
    question: "Can I choose a specific time?",
    answer:
      "Yes. After selecting your service and date, you'll see all available time slots for that day. Choose the one that works best for you. Time slots are first-come, first-served, so popular times may fill up — we recommend booking a few days in advance.",
  },
  {
    question: "Can I cancel my booking?",
    answer:
      "Yes. Cancellation is free up to 24 hours before your appointment (48 hours for premium and group services, 7 days for the VIP Full-Day Experience). Within the cancellation window, a partial fee may apply. To cancel, contact us via WhatsApp, Telegram, or email with your booking reference.",
  },
  {
    question: "Can I reschedule?",
    answer:
      "Absolutely. You can reschedule once for free up to 24 hours before your appointment. Just contact us with your booking reference and your preferred new date and time, and we'll take care of it.",
  },
  {
    question: "What happens after I book?",
    answer:
      "You'll see a confirmation screen with all your booking details and a reference number. We'll also send a confirmation to your email. If you don't see it within a few minutes, check your spam folder or contact us.",
  },
  {
    question: "Will I receive confirmation?",
    answer:
      "Yes. You'll receive an on-screen confirmation immediately after booking, plus an email confirmation with your booking reference, service details, date, time, and contact information. You can also add the booking to your calendar from the confirmation screen.",
  },
  {
    question: "Can I book for multiple people?",
    answer:
      "Yes. Our Group Session is designed for 2–6 people. For the booking widget, just select the number of people in your party. For larger groups or special arrangements, please contact us directly and we'll customize a booking for you.",
  },
  {
    question: "Can I make a last-minute booking?",
    answer:
      "We do our best to accommodate last-minute requests. If you need an appointment within the next 24 hours, please contact us directly via WhatsApp or phone — we'll check for any cancellations or newly opened slots and get back to you quickly.",
  },
  {
    question: "How can I contact As Reference?",
    answer:
      "You can reach us via WhatsApp at +234 703 756 8457, Telegram at @ahmedabiola, or email at profabiolabukclub@gmail.com. You can also use the contact form on this page. We typically respond within a few hours during business hours.",
  },
  {
    question: "What payment methods are available?",
    answer:
      "We accept bank transfer, card payment via Paystack, and cash on arrival for select services. Payment details are shared after your booking is confirmed. For premium and VIP services, a deposit may be required to secure your slot.",
  },
];

// --- Concierge chatbot suggested prompts ---
export const chatSuggestions: string[] = [
  "I want to book",
  "What services do you offer?",
  "What times are available?",
  "I have a question",
  "Talk to a person",
  "Contact As Reference",
];

// --- Trust indicators (hero) ---
export const trustIndicators: string[] = [
  "Easy Booking",
  "Flexible Scheduling",
  "Personal Support",
];
