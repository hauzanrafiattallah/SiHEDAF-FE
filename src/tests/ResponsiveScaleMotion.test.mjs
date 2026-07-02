import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testsDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourceDirectory = path.resolve(testsDirectory, "..");

async function readSource(relativePath) {
  return readFile(path.join(sourceDirectory, relativePath), "utf8");
}

test("uses a large sticky public navbar and viewport-height hero", async () => {
  const [header, hero] = await Promise.all([
    readSource("components/sections/HeaderSection.tsx"),
    readSource("components/sections/HeroSection.tsx"),
  ]);

  assert.match(header, /sticky top-0/);
  assert.match(header, /h-\[(?:64|68|72)px\]/);
  assert.match(header, /max-w-\[1440px\]/);
  assert.match(hero, /min-h-\[calc\(100svh-/);
  assert.doesNotMatch(hero, /min-h-\[680px\]/);
});

test("adds global smooth scrolling and progressive reveal motion", async () => {
  const globalStyles = await readSource("app/globals.css");

  assert.match(globalStyles, /scroll-behavior:\s*smooth/);
  assert.match(globalStyles, /scroll-padding-top/);
  assert.match(globalStyles, /overscroll-behavior-y/);
  assert.match(globalStyles, /\.page-enter/);
  assert.match(globalStyles, /\.section-reveal/);
  assert.match(globalStyles, /prefers-reduced-motion/);
});

test("separates the landing CTA from a larger footer", async () => {
  const [cta, footer] = await Promise.all([
    readSource("components/sections/CtaSection.tsx"),
    readSource("components/sections/FooterSection.tsx"),
  ]);

  assert.match(cta, /pb-(?:16|20|24|28|32)/);
  assert.match(footer, /min-h-\[(?:72|80|88|96)px\]/);
  assert.match(footer, /max-w-\[1440px\]/);
});

test("removes unreadable 8px and 9px type from application components", async () => {
  const componentFiles = [
    "components/auth/AuthInput.tsx",
    "components/auth/AuthShell.tsx",
    "components/auth/LoginForm.tsx",
    "components/auth/RegisterForm.tsx",
    "components/dashboard/DashboardOverview.tsx",
    "components/dashboard/DashboardSidebar.tsx",
    "components/dashboard/DashboardTopbar.tsx",
    "components/dashboard/EditProfileView.tsx",
    "components/dashboard/HistoryView.tsx",
    "components/dashboard/NotificationPanel.tsx",
    "components/dashboard/ProfileView.tsx",
    "components/dashboard/SignalChart.tsx",
    "components/sections/FooterSection.tsx",
    "components/sections/HeaderSection.tsx",
    "components/sections/ProcessSection.tsx",
    "components/ui/TeamCard.tsx",
  ];
  const sources = await Promise.all(componentFiles.map(readSource));

  assert.doesNotMatch(sources.join("\n"), /text-\[(?:8|9)px\]/);
});

test("scales auth and dashboard shells without CSS zoom", async () => {
  const [authShell, dashboardShell, globalStyles] = await Promise.all([
    readSource("components/auth/AuthShell.tsx"),
    readSource("components/dashboard/DashboardShell.tsx"),
    readSource("app/globals.css"),
  ]);

  assert.match(authShell, /min-h-dvh/);
  assert.match(authShell, /max-w-\[(?:560|580|600)px\]/);
  assert.match(dashboardShell, /lg:w-\[(?:232|240|248)px\]/);
  assert.match(dashboardShell, /h-\[(?:68|72)px\]/);
  assert.doesNotMatch(globalStyles, /\bzoom\s*:/);
});
