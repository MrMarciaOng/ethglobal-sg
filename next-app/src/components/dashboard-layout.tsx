"use client";

import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Layout,
  ShoppingBag,
  Users,
  Settings,
  Menu,
  Search,
  DollarSign,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { title: "Transactions", icon: Layout },
    { title: "Disputes", icon: ShoppingBag },
    { title: "Settings", icon: Settings },
  ];

  const Sidebar = ({ className = "", collapsed = false }) => (
    <ScrollArea
      className={cn("pb-12 flex flex-col h-full bg-background", className)}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2
            className={cn(
              "mb-2 px-4 text-lg font-semibold tracking-tight",
              collapsed ? "sr-only" : "block"
            )}
          >
            Dashboard
          </h2>
          <div className="space-y-1">
            {menuItems.map(({ title, icon: Icon }) => (
              <Button
                key={title}
                variant="ghost"
                className={cn(
                  "w-full justify-start",
                  collapsed ? "h-12 w-12 p-0" : "px-4"
                )}
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
          <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6 lg:p-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Total Revenue", icon: DollarSign, value: "$24,000" },
                {
                  title: "Number of Transactions",
                  icon: ShoppingCart,
                  value: "3,456",
                },
                { title: "New Customers", icon: Users, value: "+2,234" },
                { title: "Avg. Order Value", icon: TrendingUp, value: "$340" },
              ].map(({ title, icon: Icon, value }, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      Chart Placeholder
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {["Alice Johnson", "Bob Smith", "Charlie Davis"].map(
                      (name, i) => (
                        <div key={i} className="flex items-center">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {
                                [
                                  "0xfda91...ef734",
                                  "0xd0281...md592",
                                  "0xmpl45...67890",
                                ][i]
                              }
                            </p>
                          </div>
                          <div className="ml-auto font-medium">
                            +${[140, 100, 238][i]}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
