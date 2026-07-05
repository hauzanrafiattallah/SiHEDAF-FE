import { SectionLabel } from "@/components/ui/SectionLabel";
import { TeamCard } from "@/components/ui/TeamCard";

const teamMembers = [
  {
    role: "UI/UX Designer",
    name: "Casta Garneta",
    linkedInLabel: "https://www.linkedin.com/in/castagarneta/",
  },
  {
    role: "Frontend Developer",
    name: "Nama",
  },
  {
    role: "Backend Developer",
    name: "Nama",
  },
  {
    role: "AI Developer",
    name: "Agung Ramadhan",
    linkedInLabel: "https://www.linkedin.com/in/agung-ramadhan08/",
    imageSrc: "/team/agung.png",
  },
];

export function TeamSection() {
  return (
    <section
      aria-labelledby="team-title"
      className="section-reveal w-full bg-[#fbfbfb] pt-16 pb-24 lg:pt-20 lg:pb-32"
    >
      <div className="text-center">
        <SectionLabel>Tim Kami</SectionLabel>
        <h1
          className="mx-auto mt-6 max-w-[620px] text-[clamp(2.5rem,3.5vw,3.75rem)] leading-[1.04] font-medium tracking-[-0.055em] text-primary-900"
          id="team-title"
        >
          Tim Pengembang
          <span className="block">
            dibalik{" "}
            <span className="font-serif font-normal italic text-primary-300">
              SiHEDAF
            </span>
          </span>
        </h1>
      </div>

      <div className="mx-auto mt-14 grid w-[calc(100%-32px)] max-w-[1440px] grid-cols-1 gap-5 sm:w-[calc(100%-64px)] sm:grid-cols-2 md:grid-cols-4">
        {teamMembers.map((member) => (
          <TeamCard key={member.role} {...member} />
        ))}
      </div>
    </section>
  );
}
