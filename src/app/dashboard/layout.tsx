import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dasboard/app-sidebar";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Finx | Dashboard",
  description: "Finx is a finance management app that helps you track your income and expenses, manage your budget, and achieve your financial goals.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="">
        <header className="flex bg-sidebar rounded-r-2xl h-14 shrink-0 items-center border-b border-border px-4">
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
