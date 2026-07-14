import type { Metadata } from "next";
import localFont from "next/font/local";

import { HashRouteRedirect } from "@/components/auth/HashRouteRedirect";
import { AppToaster } from "@/components/ui/AppToaster";

import "./globals.css";

const switzer = localFont({
  src: "./fonts/switzer-variable.woff2",
  variable: "--font-switzer",
  weight: "100 900",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SiHEDAF",
  description: "SiHEDAF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${switzer.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <HashRouteRedirect />
        <AppToaster />
      </body>
    </html>
  );
}
