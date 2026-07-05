import { AboutSection } from "@/components/sections/AboutSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { FooterSection } from "@/components/sections/FooterSection";
import { HeaderSection } from "@/components/sections/HeaderSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessSection } from "@/components/sections/ProcessSection";

export default function Home() {
  return (
    <div className="min-h-dvh overflow-x-clip bg-[#fbfbfb] text-primary-900">
      <HeaderSection />
      <div className="page-enter">
        <main>
          <HeroSection />
          <AboutSection />
          <FeaturesSection />
          <ProcessSection />
          <CtaSection />
        </main>
        <FooterSection />
      </div>
    </div>
  );
}
