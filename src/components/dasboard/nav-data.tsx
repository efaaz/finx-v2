"use client";
import Link from "next/link";
import { ImportIcon, Database, } from "lucide-react";

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
    title: "Import Data",
    url: "/dashboard/import-transactions",
    icon: ImportIcon,
  },
  {
    title: "Export Data",
    url: "/dashboard/export-transactions",
    icon: Database,
  },
];

export function NavData() {
  return (
    <SidebarGroup className="mt-6">
      <SidebarGroupLabel>Data</SidebarGroupLabel>

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