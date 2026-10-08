"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/dasboard/nav-main";
import { NavSettings } from "@/components/dasboard/nav-Settings";
import { NavUser } from "@/components/dasboard/nav-user";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { NavManagement } from "./nav-managemet";
import { NavData } from "./nav-data";

export function AppSidebar() {
  const {
      data: user,
      isPending,
      isError,
    } = useCurrentUser();
  
    const currentUser = user ?? {
      name: "User",
      email: "user@example.com",
      avatar: "",
    };
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="ml-2">FinX</SidebarHeader>

      <SidebarContent className="ml-1.5 " >
        <NavMain />
        <NavManagement />
        <NavData />
        <NavSettings />
      </SidebarContent>

      <SidebarFooter className="mb-4">
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
