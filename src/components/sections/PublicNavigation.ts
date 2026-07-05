export type PublicPage = "home" | "team";

export const publicNavigation = [
  { label: "Tentang", href: "/#tentang", page: "home" },
  { label: "Fitur", href: "/#fitur", page: "home" },
  { label: "Cara Kerja", href: "/#cara-kerja", page: "home" },
  { label: "Tim Kami", href: "/tim-kami", page: "team" },
] as const;
