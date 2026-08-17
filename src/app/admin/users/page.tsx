// src/app/admin/users/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminUsersClient } from "./_components/AdminUsersClient";

export default async function AdminUsersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.banned) {
    redirect("/login?error=banned");
  }

  // Best Practice 2026: Strict RBAC check (Eksklusif Super Admin)
  if (session.user.role !== "super_admin") {
    redirect("/admin?error=unauthorized");
  }

  return (
    <AdminUsersClient
      currentUser={{
        id: session.user.id,
        role: "super_admin",
      }}
    />
  );
}
