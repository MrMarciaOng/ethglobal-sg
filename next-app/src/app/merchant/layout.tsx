"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Layout,
  ShoppingBag,
  Settings,
  Menu,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { title: "Dashboard", icon: ShoppingBag, url: "/merchant/" },
    { title: "Transactions", icon: Layout, url: "/merchant/transactions" },
    { title: "Profile", icon: Settings, url: "/merchant/profile" },
  ];

  const Sidebar = ({ className = "", collapsed = false }) => (
    <ScrollArea
      className={cn("pb-12 flex flex-col h-full bg-background", className)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {menuItems.map(({ title, icon: Icon, url }) => (
              <Button
                key={title}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  collapsed ? "h-12 w-12 p-0" : "px-4"
                )}
                onClick={() => router.push(url)}
              >
                <Icon className={cn("h-4 w-4", collapsed && "mx-auto")} />
                {!collapsed && <span className="ml-2">{title}</span>}
                {collapsed && <span className="sr-only">{title}</span>}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop Sidebar */}
        <aside
          className={cn(
            "hidden lg:flex transition-all duration-300 ease-in-out",
            sidebarOpen ? "w-64" : "w-16"
          )}
        >
          <div className="flex h-full flex-col border-r">
            <div
              className={cn(
                "flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6",
                sidebarOpen ? "justify-between" : "justify-center"
              )}
            >
              <h1
                className={cn(
                  "text-lg font-semibold transition-opacity flex items-center", // Removed h-14
                  sidebarOpen ? "opacity-100 " : "hidden"
                )}
              >
                Merchant Portal
              </h1>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-all flex items-center justify-center h-14", // Removed w-14
                  sidebarOpen ? "ml-auto" : ""
                )}
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
            <Sidebar collapsed={!sidebarOpen} />
          </div>
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <div className="w-full flex-1">
              <form>
                <div className="relative h-10">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full bg-background pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] h-full"
                  />
                </div>
              </form>
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
            <Avatar>
              <AvatarFallback>DM</AvatarFallback>
            </Avatar>
          </header>

          {/* Main content */}
          {children}
        </div>
      </div>
    </ThemeProvider>
  );
}
