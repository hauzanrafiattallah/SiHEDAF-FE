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
    name: "Nama",
  },
];

export function TeamSection() {
  return (
    <section
      aria-labelledby="team-title"
      className="w-full bg-[#fbfbfb] pt-10 pb-12"
    >
      <div className="text-center">
        <SectionLabel>Tim Kami</SectionLabel>
        <h1
          className="mx-auto mt-4 max-w-[430px] text-[30px] leading-[1.04] font-medium tracking-[-0.055em] text-primary-900"
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

      <div className="mx-auto mt-8 grid w-[calc(100%-32px)] max-w-[1200px] grid-cols-1 gap-3 sm:w-[86.5%] sm:grid-cols-2 md:grid-cols-4">
        {teamMembers.map((member) => (
          <TeamCard key={member.role} {...member} />
        ))}
      </div>
    </section>
  );
}
