// =====================================================================
// ABIDEX — PERSONAL PORTFOLIO (single-scroll landing page)
// =====================================================================

import { Navbar } from "@/components/portfolio/navbar";
import { Hero } from "@/components/portfolio/hero";
import { TrustStrip } from "@/components/portfolio/trust-strip";
import { About } from "@/components/portfolio/about";
import { Services } from "@/components/portfolio/services";
import { AutomationShowcase } from "@/components/portfolio/automation-showcase";
import { Projects } from "@/components/portfolio/projects";
import { Process } from "@/components/portfolio/process";
import { WhyAbidex } from "@/components/portfolio/why-abidex";
import { TechStack } from "@/components/portfolio/tech-stack";
import { Testimonials } from "@/components/portfolio/testimonials";
import { Faq } from "@/components/portfolio/faq";
import { Contact } from "@/components/portfolio/contact";
import { Footer } from "@/components/portfolio/footer";
import { FloatingContact } from "@/components/portfolio/floating-contact";
import { AbidexChatbot } from "@/components/portfolio/chatbot";

export default function Page() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <About />
        <Services />
        <AutomationShowcase />
        <Projects />
        <Process />
        <WhyAbidex />
        <TechStack />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <FloatingContact />
      <AbidexChatbot />
    </div>
  );
}
