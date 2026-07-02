import { LineIcon } from "@/components/ui/LineIcon";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function AboutSection() {
  return (
    <section
      aria-labelledby="about-title"
      className="bg-[#f8f8f8] px-5 py-24 sm:px-6 lg:px-8 lg:py-28"
      id="tentang"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center">
          <SectionLabel>Tentang SiHEDAF</SectionLabel>
          <h2
            aria-label="Stroke adalah Ancaman yang Bisa Dicegah"
            className="mx-auto mt-8 max-w-[600px] text-[36px] leading-[1.02] font-medium tracking-[-0.055em] text-primary-900 sm:text-[44px]"
            id="about-title"
          >
            <span className="font-serif font-normal italic text-primary-300">
              Stroke
            </span>{" "}
            adalah Ancaman
            <span className="block">yang Bisa Dicegah</span>
          </h2>
          <p className="mx-auto mt-7 max-w-[670px] text-[12px] leading-5 font-medium text-primary-900/43">
            Atrial Fibrillation adalah faktor risiko utama stroke yang sering kali
            tidak terdeteksi. Teknologi PPG dan AI membuka peluang pencegahan yang
            lebih baik.
          </p>
        </div>

        <div className="mt-14 grid rounded-[30px] bg-primary-900/[0.035] p-2 md:grid-cols-2 md:grid-rows-2">
          <article className="min-h-[315px] rounded-[25px] bg-white p-7 shadow-[0_8px_30px_rgba(0,39,88,0.02)] sm:p-9 md:row-span-2">
            <p className="text-[50px] leading-none font-semibold tracking-[-0.06em] text-primary-300">
              5x
            </p>
            <p className="mt-5 max-w-[360px] text-[13px] leading-5 font-medium text-primary-900/45">
              Penderita AF memiliki risiko stroke 5–7 kali lebih tinggi dibanding
              populasi umum.
            </p>
            <ul className="mt-8 space-y-4 pl-4 text-[11px] leading-[1.55] font-medium text-primary-900/72 marker:text-primary-900">
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

          <article className="mt-2 min-h-[153px] rounded-[25px] bg-white p-7 shadow-[0_8px_30px_rgba(0,39,88,0.02)] md:mt-0 md:ml-2">
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary-50 text-primary-300">
              <LineIcon className="size-6" name="pulse" />
            </span>
            <h3 className="mt-4 text-[16px] font-semibold tracking-[-0.035em] text-primary-900">
              Sinyal PPG Akurat
            </h3>
            <p className="mt-2 text-[11px] leading-[1.55] font-medium text-primary-900/43">
              Sensor photoplethysmography pada wristband menangkap sinyal irama
              jantung dengan presisi tinggi secara non-invasif.
            </p>
          </article>

          <article className="mt-2 min-h-[153px] rounded-[25px] bg-white p-7 shadow-[0_8px_30px_rgba(0,39,88,0.02)] md:ml-2">
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary-50 text-primary-300">
              <LineIcon className="size-6" name="scan" />
            </span>
            <h3 className="mt-4 text-[16px] font-semibold tracking-[-0.035em] text-primary-900">
              AI Klasifikasi AF
            </h3>
            <p className="mt-2 text-[11px] leading-[1.55] font-medium text-primary-900/43">
              Model yang terlatih mengklasifikasikan sinyal sebagai Normal Rhythm
              atau AF Detected dengan akurasi di atas 90%.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
