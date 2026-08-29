// src/components/admin/AppSidebar.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  Briefcase,
  Users,
  ShieldAlert,
  ChevronsUpDown,
  LogOutIcon,
  UserRound,
  Store,
  ShieldCheck,
  Settings,
} from "lucide-react";

import { NavMain, type NavItem } from "./NavMain";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";

const adminNavData: NavItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Categories & Features",
    url: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Gigs Saya",
    url: "/admin/gigs",
    icon: Briefcase,
  },
  {
    title: "Users & Sellers",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Pengaturan Logo",
    url: "/admin/settings",
    icon: Settings,
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string;
    email: string;
    image?: string | null;
    role: "super_admin" | "admin" | "user";
  };
}

function getInitials(name?: string) {
  if (!name) return "AD";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AppSidebar({ user: initialUser, ...props }: AppSidebarProps) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const { data: sessionData } = authClient.useSession();
  const currentUser = initialUser ?? {
    name: sessionData?.user?.name ?? "Pengelola",
    email: sessionData?.user?.email ?? "admin@marketplace.com",
    image: sessionData?.user?.image,
    role: (sessionData?.user as { role?: string })?.role ?? "admin",
  };

  const isSuperAdmin = currentUser.role === "super_admin";

  // Fitur Keamanan: Isolasi Navigasi berdasarkan Role Pengguna
  const filteredNavItems = React.useMemo(() => {
    if (isSuperAdmin) {
      return adminNavData;
    }
    // Seller (Admin) HANYA mendapatkan akses ke Dashboard dan Gigs miliknya
    return adminNavData.filter(
      (item) => item.url === "/admin" || item.url === "/admin/gigs",
    );
  }, [isSuperAdmin]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/admin/login");
          router.refresh();
        },
      },
    });
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <ShieldAlert className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold">Admin Console</span>
                <span className="truncate text-xs text-muted-foreground">
                  {isSuperAdmin ? "Super Admin Portal" : "Seller Panel"}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={filteredNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={currentUser.image ?? ""}
                        alt={currentUser.name}
                      />
                      <AvatarFallback className="rounded-lg font-bold bg-primary/10 text-primary">
                        {getInitials(currentUser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {currentUser.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {currentUser.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                  </SidebarMenuButton>
                }
              ></DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={currentUser.image ?? ""}
                        alt={currentUser.name}
                      />
                      <AvatarFallback className="rounded-lg font-bold bg-primary/10 text-primary">
                        {getInitials(currentUser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {currentUser.name}
                      </span>
                      <span className="truncate text-[11px] text-muted-foreground">
                        {currentUser.email}
                      </span>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                            isSuperAdmin
                              ? "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                              : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                          }`}
                        >
                          {isSuperAdmin ? (
                            <>
                              <ShieldCheck className="size-3" /> Super Admin
                            </>
                          ) : (
                            <>
                              <Store className="size-3" /> Seller (Admin)
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push("/admin/profile")}
                    className="cursor-pointer"
                  >
                    <UserRound className="mr-2 size-4" />
                    Profil Pengelola
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-destructive focus:bg-destructive/10"
                >
                  <LogOutIcon className="mr-2 size-4" />
                  Keluar (Log out)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
