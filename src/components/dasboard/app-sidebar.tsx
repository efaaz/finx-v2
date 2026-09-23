"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/dasboard/nav-main";
import { NavSecondary } from "@/components/dasboard/nav-secondary";
import { NavUser } from "@/components/dasboard/nav-user";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function AppSidebar() {
  const {
      data: user,
      isPending,
      isError,
    } = useCurrentUser();
  
    const currentUser = user ?? {
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "",
    };
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="ml-2">FinX</SidebarHeader>

      <SidebarContent className="ml-1.5 " >
        <NavMain />
        <NavSecondary />
      </SidebarContent>

      <SidebarFooter className="mb-4">
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
