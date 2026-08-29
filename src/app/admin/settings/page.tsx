// src/app/admin/settings/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSettingsClient } from "../_components/AdminSettingsClient";
import { SettingsService } from "@/server/services/settings.service";

export default async function AdminSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== "super_admin") {
    redirect("/admin?error=unauthorized");
  }

  const currentLogoSettings = await SettingsService.getBrandLogoCached();

  return <AdminSettingsClient initialSettings={currentLogoSettings} />;
}
