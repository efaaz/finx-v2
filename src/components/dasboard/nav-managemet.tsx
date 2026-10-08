"use client";
import Link from "next/link";
import { HelpCircle, Settings, Tags } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Categories",
    url: "/dashboard/categories",
    icon: Tags,
  }
];

export function NavManagement() {
  return (
    <SidebarGroup className="mt-6">
      <SidebarGroupLabel>Management</SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton tooltip={item.title}>
                  <Link href={item.url} className="flex items-center gap-2">
                    <Icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}