import { LineIcon } from "@/components/ui/LineIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";

const features = [
  {
    icon: "heart" as const,
    title: "Pemantauan Berkala",
    description:
      "PPG dari wearable device dipantau secara terus-menerus 24/7.",
  },
  {
    icon: "spark" as const,
    title: "AI Detection",
    description:
      "Model AI menganalisis sinyal untuk mendeteksi AF dengan akurasi tinggi.",
  },
  {
    icon: "chart" as const,
    title: "Analisis Mendalam",
    description:
      "PPG dari wearable device dipantau secara terus-menerus 24/7.",
  },
];

export function FeaturesSection() {
  return (
    <section
      aria-labelledby="features-title"
      className="section-reveal bg-[#f8f8f8] px-5 py-24 sm:px-8 lg:px-10 lg:py-36"
      id="fitur"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex justify-start md:justify-end">
          <SectionLabel>Fitur</SectionLabel>
        </div>

        <div className="mt-14 grid items-end gap-10 md:grid-cols-2">
          <p className="max-w-[620px] text-[15px] leading-[1.7] font-medium text-primary-900/43 sm:text-[16px]">
            Kombinasi hardware wearable hemat energi dengan AI analisis sinyal
            untuk perlindungan kesehatan jantung yang komprehensif.
          </p>
          <h2
            className="max-w-[760px] text-[clamp(2.5rem,3.55vw,3.75rem)] leading-[1.02] font-medium tracking-[-0.055em] text-primary-900 md:justify-self-end md:text-right"
            id="features-title"
          >
            Teknologi Pemantauan{" "}
            <span className="font-serif font-normal italic text-primary-300">
              Cerdas
            </span>
            <span className="block">yang Kamu Butuhkan</span>
          </h2>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <article
              className="dashboard-card min-h-[270px] rounded-[30px] bg-white p-9 shadow-[0_8px_30px_rgba(0,39,88,0.02)]"
              key={feature.title}
            >
              <LineIcon
                className="size-12 text-primary-300"
                name={feature.icon}
              />
              <h3 className="mt-9 text-[21px] font-semibold tracking-[-0.04em] text-primary-900">
                {feature.title}
              </h3>
              <p className="mt-4 max-w-[360px] text-[14px] leading-[1.7] font-medium text-primary-900/42">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
