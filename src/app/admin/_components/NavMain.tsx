"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarGroupLabel>Management Console</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;

            // Jika item memiliki sub-items, gunakan Collapsible (Pola sidebar-07)
            if (item.items && item.items.length > 0) {
              return (
                <Collapsible
                  key={item.title}
                  render={
                    <SidebarMenuItem>
                      <CollapsibleTrigger
                        render={
                          <SidebarMenuButton tooltip={item.title}>
                            {Icon && <Icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        }
                      ></CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                render={
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                }
                              ></SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  }
                  defaultOpen={item.isActive}
                  className="group/collapsible"
                ></Collapsible>
              );
            }

            // Item menu biasa (Single Link)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={
                    <Link href={item.url}>
                      {Icon && <Icon />}
                      <span>{item.title}</span>
                    </Link>
                  }
                  tooltip={item.title}
                ></SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
