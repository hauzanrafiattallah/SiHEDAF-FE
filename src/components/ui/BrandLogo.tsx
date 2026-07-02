import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  compact?: boolean;
};

export function BrandLogo({ compact = false }: BrandLogoProps) {
  const imageSize = compact ? 22 : 28;

  return (
    <Link
      aria-label="Kembali ke halaman utama SiHEDAF"
      className="inline-flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-400"
      href="/"
    >
      <Image
        alt="Logo SiHEDAF"
        height={imageSize}
        priority={!compact}
        src="/logo.png"
        width={imageSize}
      />
      <span
        className={
          compact
            ? "text-[13px] font-semibold tracking-[-0.03em] text-primary-900"
            : "text-[18px] font-semibold tracking-[-0.035em] text-primary-900"
        }
      >
        SiHEDAF
      </span>
    </Link>
  );
}
