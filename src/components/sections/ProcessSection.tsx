import { SectionLabel } from "@/components/ui/SectionLabel";

const steps = [
  {
    title: "Kenakan Wristband SiHEDAF",
    description:
      "Pasang wearable device SiHEDAF pada pergelangan tangan. Sensor PPG otomatis aktif dan mulai merekam sinyal jantung.",
  },
  {
    title: "Rekam Sinyal PPG Berkala",
    description:
      "Perangkat merekam sinyal PPG setiap 3 menit dan mengirim data terkompresi ke server via koneksi nirkabel hemat energi.",
  },
  {
    title: "Analisis AI Klasifikasi AF",
    description:
      "Model AI memproses fitur temporal dari sinyal PPG dan mengklasifikasikan setiap segmen sebagai Normal atau AF Detected.",
  },
  {
    title: "Evaluasi Risiko & Notifikasi",
    description:
      "Hasil analisis tampil di dashboard. Jika AF terdeteksi, sistem mengirim notifikasi peringatan untuk tindakan pencegahan segera.",
  },
];

export function ProcessSection() {
  return (
    <section
      aria-labelledby="process-title"
      className="section-reveal bg-[#fbfbfb] px-5 py-24 sm:px-8 lg:px-10 lg:py-36"
      id="cara-kerja"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel>Cara Kerja</SectionLabel>
        <h2
          className="mt-9 max-w-[760px] text-[clamp(2.5rem,3.55vw,3.75rem)] leading-[1.02] font-medium tracking-[-0.055em] text-primary-900"
          id="process-title"
        >
          Langkah Sederhana,
          <span className="block">
            <span className="font-serif font-normal italic text-primary-300">
              Perlindungan
            </span>{" "}
            Maksimal
          </span>
        </h2>

        <ol className="mt-20 grid gap-12 lg:grid-cols-4 lg:gap-0">
          {steps.map((step, index) => (
            <li
              className="child-reveal relative border-primary-900/10 lg:min-h-[330px] lg:border-l lg:px-10 first:lg:border-l-0 first:lg:pl-0 last:lg:pr-0"
              key={step.title}
              style={{ "--child": index } as React.CSSProperties}
            >
              <span className="inline-flex h-10 items-center rounded-full border border-primary-300/60 px-5 text-[12px] font-semibold text-primary-300">
                Langkah {index + 1}
              </span>
              <h3 className="mt-12 max-w-[250px] text-[21px] leading-[1.2] font-semibold tracking-[-0.035em] text-primary-900">
                {step.title}
              </h3>
              <p className="mt-5 max-w-[280px] text-[14px] leading-[1.7] font-medium text-primary-900/42">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
