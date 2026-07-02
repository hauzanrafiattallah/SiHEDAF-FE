import { LineIcon } from "@/components/ui/LineIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function AboutSection() {
  return (
    <section
      aria-labelledby="about-title"
      className="section-reveal bg-[#f8f8f8] px-5 py-24 sm:px-8 lg:px-10 lg:py-36"
      id="tentang"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="text-center">
          <SectionLabel>Tentang SiHEDAF</SectionLabel>
          <h2
            aria-label="Stroke adalah Ancaman yang Bisa Dicegah"
            className="mx-auto mt-9 max-w-[780px] text-[clamp(2.5rem,3.55vw,3.75rem)] leading-[1.02] font-medium tracking-[-0.055em] text-primary-900"
            id="about-title"
          >
            <span className="font-serif font-normal italic text-primary-300">
              Stroke
            </span>{" "}
            adalah Ancaman
            <span className="block">yang Bisa Dicegah</span>
          </h2>
          <p className="mx-auto mt-8 max-w-[820px] text-[15px] leading-[1.7] font-medium text-primary-900/43 sm:text-[16px]">
            Atrial Fibrillation adalah faktor risiko utama stroke yang sering kali
            tidak terdeteksi. Teknologi PPG dan AI membuka peluang pencegahan yang
            lebih baik.
          </p>
        </div>

        <div className="mt-16 grid rounded-[34px] bg-primary-900/[0.035] p-2.5 md:grid-cols-2 md:grid-rows-2">
          <article className="dashboard-card min-h-[390px] rounded-[29px] bg-white p-8 shadow-[0_8px_30px_rgba(0,39,88,0.02)] sm:p-11 md:row-span-2">
            <p className="text-[64px] leading-none font-semibold tracking-[-0.06em] text-primary-300">
              5x
            </p>
            <p className="mt-6 max-w-[470px] text-[16px] leading-[1.6] font-medium text-primary-900/45">
              Penderita AF memiliki risiko stroke 5–7 kali lebih tinggi dibanding
              populasi umum.
            </p>
            <ul className="mt-9 max-w-[560px] space-y-5 pl-5 text-[14px] leading-[1.65] font-medium text-primary-900/72 marker:text-primary-900">
              <li className="list-disc pl-1">
                Sekitar 20–25% stroke iskemik disebabkan oleh emboli kardiogenik
                dari Atrial Fibrilasi.
              </li>
              <li className="list-disc pl-1">
                Hampir 50% kasus AF tidak terdiagnosis karena sering tanpa gejala
                (silent AF).
              </li>
              <li className="list-disc pl-1">
                AF sering tidak menimbulkan gejala sehingga sulit dideteksi tanpa
                monitoring berkelanjutan.
              </li>
            </ul>
          </article>

          <article className="dashboard-card mt-2.5 min-h-[194px] rounded-[29px] bg-white p-8 shadow-[0_8px_30px_rgba(0,39,88,0.02)] md:mt-0 md:ml-2.5">
            <span className="inline-flex size-13 items-center justify-center rounded-full bg-primary-50 text-primary-300">
              <LineIcon className="size-7" name="pulse" />
            </span>
            <h3 className="mt-5 text-[20px] font-semibold tracking-[-0.035em] text-primary-900">
              Sinyal PPG Akurat
            </h3>
            <p className="mt-2.5 max-w-[560px] text-[14px] leading-[1.65] font-medium text-primary-900/43">
              Sensor photoplethysmography pada wristband menangkap sinyal irama
              jantung dengan presisi tinggi secara non-invasif.
            </p>
          </article>

          <article className="dashboard-card mt-2.5 min-h-[194px] rounded-[29px] bg-white p-8 shadow-[0_8px_30px_rgba(0,39,88,0.02)] md:ml-2.5">
            <span className="inline-flex size-13 items-center justify-center rounded-full bg-primary-50 text-primary-300">
              <LineIcon className="size-7" name="scan" />
            </span>
            <h3 className="mt-5 text-[20px] font-semibold tracking-[-0.035em] text-primary-900">
              AI Klasifikasi AF
            </h3>
            <p className="mt-2.5 max-w-[560px] text-[14px] leading-[1.65] font-medium text-primary-900/43">
              Model yang terlatih mengklasifikasikan sinyal sebagai Normal Rhythm
              atau AF Detected dengan akurasi di atas 90%.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
