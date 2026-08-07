import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { TrustStrip } from "@/components/sections/trust-strip";
import { CategoryGrid } from "@/components/sections/category-grid";
import { LatestJobs } from "@/components/sections/latest-jobs";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f3fde8] text-[#161e11]">
      <Navbar />
      <main>
        <HeroSection />
        <TrustStrip />
        <CategoryGrid />
        <LatestJobs />
        <HowItWorks />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
