"use client";
import avatar from "@/assets/avatar.jpg";

import {
  ChevronsUpDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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

interface User {
  name: string;
  email: string;
  avatar?: string | null;
}
import { logout } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface NavUserProps {
  user: User;
}

export function NavUser({ user }: NavUserProps) {
    const router = useRouter();
    const handleLogout = () => {
    logout();
    router.replace("/login");
    }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Image src={user.avatar? user.avatar: avatar} className="rounded-full"  alt="User Avatar" width={32} height={32} />
            </div>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {user.name}
              </span>

              <span className="truncate text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>

            <ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            side="top"
            className="w-[--anchor-width] min-w-56"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                My Account
              </DropdownMenuLabel>

              <DropdownMenuItem>
                <User />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Settings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <LogOut />
                <button onClick={() => handleLogout()} >
                  Log out
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}