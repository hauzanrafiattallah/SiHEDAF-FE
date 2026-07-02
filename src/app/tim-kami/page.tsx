import type { Metadata } from "next";

import { FooterSection } from "@/components/sections/FooterSection";
import { HeaderSection } from "@/components/sections/HeaderSection";
import { TeamSection } from "@/components/sections/TeamSection";

export const metadata: Metadata = {
  title: "Tim Kami | SiHEDAF",
  description: "Tim pengembang SiHEDAF",
};

export default function TeamPage() {
  return (
    <div className="page-enter flex min-h-dvh flex-col bg-[#fbfbfb] text-primary-900">
      <HeaderSection activePage="team" />
      <main className="flex flex-1">
        <TeamSection />
      </main>
      <FooterSection />
    </div>
  );
}
