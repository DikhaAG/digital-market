// src/app/admin/profile/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminProfileClient } from "./_components/AdminProfileClient";
import { SettingsService } from "@/server/services/settings.service";

export default async function AdminProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/admin/login");
  }

  // Fetch nomor WA admin secara SSR
  const adminContact = await SettingsService.getAdminContactCached();

  return (
    <AdminProfileClient
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role as "super_admin" | "admin" | "user",
        image: session.user.image,
        createdAt: session.user.createdAt,
      }}
      initialAdminPhone={adminContact.whatsappNumber}
    />
  );
}
