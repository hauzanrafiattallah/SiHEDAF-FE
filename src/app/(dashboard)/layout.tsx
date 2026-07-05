import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getCurrentProfile } from "@/features/profile/server/services/ProfileService";
import { withSessionRefresh } from "@/features/auth/session/server/WithSessionRefresh";
import { SessionServiceError } from "@/features/auth/session/server/SessionServiceError";
import type { UserProfile } from "@/features/profile/shared/ProfileTypes";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialUser: UserProfile | null = null;

  try {
    initialUser = await withSessionRefresh((accessToken) =>
      getCurrentProfile(accessToken),
    );
  } catch (error) {
    if (error instanceof SessionServiceError && error.status === 401) {
      redirect("/login");
    }
  }

  return <DashboardShell initialUser={initialUser}>{children}</DashboardShell>;
}
