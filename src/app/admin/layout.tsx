// src/app/admin/layout.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "./_components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Eksekusi verifikasi sesi di Server Level
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* Sidebar-07 Primitive */}
      <AppSidebar variant="inset" />

      {/* Inset Main Content Wrapper */}
      <SidebarInset>
        {/* Header Admin dengan Sidebar Trigger & Status */}
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="font-bold text-sm sm:text-base text-foreground tracking-tight">
              Control Panel
            </h1>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
