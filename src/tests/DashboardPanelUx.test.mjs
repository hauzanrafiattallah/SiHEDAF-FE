import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testsDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(testsDirectory, "../..");

async function readProjectFile(relativePath) {
  return readFile(path.join(projectDirectory, relativePath), "utf8");
}

test("uses Lucide panel icons instead of duplicate dashboard symbols", async () => {
  const [packageSource, shellSource, topbarSource] = await Promise.all([
    readProjectFile("package.json"),
    readProjectFile("src/components/dashboard/DashboardShell.tsx"),
    readProjectFile("src/components/dashboard/DashboardTopbar.tsx"),
  ]);
  const packageJson = JSON.parse(packageSource);

  assert.ok(packageJson.dependencies["lucide-react"]);
  assert.match(shellSource, /from "lucide-react"/);
  assert.match(shellSource, /PanelLeftClose/);
  assert.match(shellSource, /PanelLeftOpen/);
  assert.doesNotMatch(topbarSource, /h-3 w-px bg-\[#505860\]/);
});

test("lets floating and rail controls toggle shared shell state", async () => {
  const [shellSource, topbarSource, panelSource, overviewSource] = await Promise.all([
    readProjectFile("src/components/dashboard/DashboardShell.tsx"),
    readProjectFile("src/components/dashboard/DashboardTopbar.tsx"),
    readProjectFile("src/components/dashboard/NotificationPanel.tsx"),
    readProjectFile("src/components/dashboard/DashboardOverview.tsx"),
  ]);

  assert.match(shellSource, /isNotifOpenMobile/);
  assert.match(shellSource, /isNotifOpenDesktop/);
  assert.match(shellSource, /setNotifState/);
  assert.match(shellSource, /<NotificationPanel/);
  assert.match(shellSource, /transition-\[transform,width,opacity,visibility\]/);
  assert.match(shellSource, /PanelRightOpen/);
  assert.doesNotMatch(topbarSource, /notificationsOpen/);
  assert.doesNotMatch(topbarSource, /onToggleNotifications/);
  assert.match(panelSource, /PanelRightClose/);
  assert.match(panelSource, /onClose/);
  assert.doesNotMatch(overviewSource, /NotificationPanel/);
});

test("does not animate static dashboard cards as if they were clickable", async () => {
  const globalStyles = await readProjectFile("src/app/globals.css");

  assert.doesNotMatch(globalStyles, /\.dashboard-card:hover/);
  assert.doesNotMatch(globalStyles, /\.dashboard-card\s*\{[^}]*transition:/s);
});
