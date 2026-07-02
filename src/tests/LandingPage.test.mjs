import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testsDirectory = path.dirname(fileURLToPath(import.meta.url));
const sourceDirectory = path.resolve(testsDirectory, "..");
const appDirectory = path.join(sourceDirectory, "app");
const componentPaths = [
  "components/sections/HeaderSection.tsx",
  "components/sections/HeroSection.tsx",
  "components/sections/AboutSection.tsx",
  "components/sections/FeaturesSection.tsx",
  "components/sections/ProcessSection.tsx",
  "components/sections/CtaSection.tsx",
  "components/sections/FooterSection.tsx",
  "components/ui/BrandLogo.tsx",
  "components/ui/SectionLabel.tsx",
  "components/ui/ArrowIcon.tsx",
  "components/ui/LineIcon.tsx",
];

async function findMissingComponents() {
  const checks = await Promise.all(
    componentPaths.map(async (componentPath) => {
      try {
        await access(path.join(sourceDirectory, componentPath));
        return null;
      } catch {
        return componentPath;
      }
    }),
  );

  return checks.filter(Boolean);
}

test("defines the landing page as PascalCase Server Components", async () => {
  const missingComponents = await findMissingComponents();

  assert.deepEqual(missingComponents, [], "landing-page components are missing");

  for (const componentPath of componentPaths) {
    const filename = path.basename(componentPath);
    const source = await readFile(path.join(sourceDirectory, componentPath), "utf8");

    assert.match(filename, /^[A-Z][A-Za-z]+(?:\.test)?\.(?:tsx|mjs)$/);
    assert.doesNotMatch(source, /["']use client["']/);
  }
});

test("composes the reference sections, content, assets, and anchors", async (context) => {
  if ((await findMissingComponents()).length > 0) {
    context.skip("landing-page components have not been implemented yet");
    return;
  }

  const pageSource = await readFile(path.join(appDirectory, "page.tsx"), "utf8");
  const sectionSources = await Promise.all(
    componentPaths.map((componentPath) =>
      readFile(path.join(sourceDirectory, componentPath), "utf8"),
    ),
  );
  const allSource = [pageSource, ...sectionSources].join("\n");
  const orderedSections = [
    "HeaderSection",
    "HeroSection",
    "AboutSection",
    "FeaturesSection",
    "ProcessSection",
    "CtaSection",
    "FooterSection",
  ];

  let previousIndex = -1;
  for (const section of orderedSections) {
    const sectionIndex = pageSource.indexOf(`<${section}`);
    assert.ok(sectionIndex > previousIndex, `${section} is missing or out of order`);
    previousIndex = sectionIndex;
  }

  for (const copy of [
    "Deteksi Dini Risiko",
    "Stroke",
    "dengan AI",
    "Pemantauan Jantung Portabel",
    "Stroke adalah Ancaman",
    "5x",
    "Teknologi Pemantauan",
    "Langkah Sederhana",
    "Pantau Kesehatan Kamu",
  ]) {
    assert.ok(allSource.includes(copy), `missing reference copy: ${copy}`);
  }

  assert.match(allSource, /src="\/logo\.png"/);
  assert.match(allSource, /src="\/watch\.png"/);
  assert.match(allSource, /from "next\/image"/);

  for (const anchor of ["tentang", "fitur", "cara-kerja"]) {
    assert.match(
      allSource,
      new RegExp(`href(?:=|:)\\s*["']/?#${anchor}["']`),
      `missing #${anchor} link`,
    );
    assert.ok(allSource.includes(`id="${anchor}"`), `missing #${anchor} target`);
  }

  assert.match(allSource, /href(?:=|:)\s*["']\/tim-kami["']/);
});
