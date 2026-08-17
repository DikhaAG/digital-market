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

  if (!["admin", "super_admin"].includes(session.user.role)) {
    redirect("/login?error=unauthorized");
  }

  return (
    <AdminUsersClient
      currentUser={{
        id: session.user.id,
        role: session.user.role as "super_admin" | "admin" | "user",
      }}
    />
  );
}
