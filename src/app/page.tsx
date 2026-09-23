// =====================================================================
// AS REFERENCE — BOOKING WEBSITE (single-scroll landing page)
// =====================================================================

import { Navbar } from "@/components/booking/navbar";
import { Hero } from "@/components/booking/hero";
import { TrustBenefits } from "@/components/booking/trust-benefits";
import { Services } from "@/components/booking/services";
import { HowItWorks } from "@/components/booking/how-it-works";
import { Availability } from "@/components/booking/availability";
import { About } from "@/components/booking/about";
import { Testimonials } from "@/components/booking/testimonials";
import { Faq } from "@/components/booking/faq";
import { LeadGen } from "@/components/booking/lead-gen";
import { Contact } from "@/components/booking/contact";
import { FinalCta } from "@/components/booking/final-cta";
import { Footer } from "@/components/booking/footer";
import { FloatingContact } from "@/components/booking/floating-contact";
import { ConciergeChatbot } from "@/components/booking/chatbot";
import { BookingFlowModal } from "@/components/booking/booking-flow-modal";
import { ServiceDetailModal } from "@/components/booking/service-detail-modal";
import { BookingFlowProvider } from "@/components/booking/booking-context";

export default function Page() {
  return (
    <BookingFlowProvider>
      <div className="overflow-x-hidden">
        <Navbar />
        <main>
          <Hero />
          <TrustBenefits />
          <Services />
          <HowItWorks />
          <Availability />
          <About />
          <Testimonials />
          <Faq />
          <LeadGen />
          <Contact />
          <FinalCta />
        </main>
        <Footer />
        <FloatingContact />
        <ConciergeChatbot />
        {/* Global modals controlled by BookingFlowProvider */}
        <BookingFlowModal />
        <ServiceDetailModal />
      </div>
    </BookingFlowProvider>
  );
}
