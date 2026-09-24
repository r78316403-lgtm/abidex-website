// =====================================================================
// ABIDEX — PRIVATE LITERARY SOCIETY (single-scroll landing page)
// =====================================================================

import { Navbar } from "@/components/literary/navbar";
import { Hero } from "@/components/literary/hero";
import { Philosophy } from "@/components/literary/philosophy";
import { Residency } from "@/components/literary/residency";
import { ReviewVelocity } from "@/components/literary/review-velocity";
import { Curators } from "@/components/literary/curators";
import { OperatingPrinciple } from "@/components/literary/operating-principle";
import { Voices } from "@/components/literary/voices";
import { CommitteeForm } from "@/components/literary/committee-form";
import { Footer } from "@/components/literary/footer";
import { FloatingContact } from "@/components/literary/floating-contact";

export default function Page() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <Residency />
        <ReviewVelocity />
        <Curators />
        <OperatingPrinciple />
        <Voices />
        <CommitteeForm />
      </main>
      <Footer />
      <FloatingContact />
    </div>
  );
}
