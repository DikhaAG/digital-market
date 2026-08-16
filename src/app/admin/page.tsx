// src/app/admin/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { trpcServer } from "@/lib/trpc/server";
import { AdminDashboardClient } from "./_components/AdminDashboardClient";

export default async function AdminDashboardPage() {
  // 1. Verifikasi Sesi Server-Side
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // 2. Inisialisasi tRPC Server Caller (RSC Execution)
  const caller = await trpcServer();
  const isSuperAdmin = session.user.role === "super_admin";

  // 3. Parallel Data Fetching (< 50ms Latency Overhead)
  const [categoryTree, gigsAudit, adminAccounts] = await Promise.all([
    caller.admin.getCategoryTree(),
    caller.admin.getGigsForAudit({
      page: 1,
      limit: 8,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    isSuperAdmin ? caller.admin.getAllAdminAccounts() : Promise.resolve([]),
  ]);

  return (
    <AdminDashboardClient
      currentUser={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role as "super_admin" | "admin" | "user",
        image: session.user.image,
      }}
      categoryTree={categoryTree}
      initialGigs={gigsAudit.items}
      totalGigs={gigsAudit.total}
      adminAccounts={adminAccounts}
    />
  );
}
