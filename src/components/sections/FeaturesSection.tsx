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
      className="bg-[#f8f8f8] px-5 py-24 sm:px-6 lg:px-8 lg:py-28"
      id="fitur"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex justify-start md:justify-end">
          <SectionLabel>Fitur</SectionLabel>
        </div>

        <div className="mt-12 grid items-end gap-8 md:grid-cols-2">
          <p className="max-w-[500px] text-[12px] leading-5 font-medium text-primary-900/43">
            Kombinasi hardware wearable hemat energi dengan AI analisis sinyal
            untuk perlindungan kesehatan jantung yang komprehensif.
          </p>
          <h2
            className="max-w-[590px] text-[36px] leading-[1.02] font-medium tracking-[-0.055em] text-primary-900 sm:text-[44px] md:justify-self-end md:text-right"
            id="features-title"
          >
            Teknologi Pemantauan{" "}
            <span className="font-serif font-normal italic text-primary-300">
              Cerdas
            </span>
            <span className="block">yang Kamu Butuhkan</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-3 md:grid-cols-3">
          {features.map((feature) => (
            <article
              className="min-h-[205px] rounded-[26px] bg-white p-8 shadow-[0_8px_30px_rgba(0,39,88,0.015)]"
              key={feature.title}
            >
              <LineIcon
                className="size-10 text-primary-300"
                name={feature.icon}
              />
              <h3 className="mt-8 text-[17px] font-semibold tracking-[-0.04em] text-primary-900">
                {feature.title}
              </h3>
              <p className="mt-3 max-w-[270px] text-[11px] leading-[1.6] font-medium text-primary-900/42">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
