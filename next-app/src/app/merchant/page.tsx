import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react"; // Ensure React is imported
import { DailySalesBarChartComponent } from "@/components/daily-sales-bar-chart";
const MerchantDashboardPage: React.FC = () => {
  return (
    <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6 lg:p-8">
      {/* Main content */}
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
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
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
        <DailySalesBarChartComponent />
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {["Alice Johnson", "Bob Smith", "Charlie Davis", "David Lee", "Emily Chen"].map(
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
                      <p className="text-sm font-medium leading-none">{name}</p>
                      <p className="text-sm text-muted-foreground">
                        {
                          [
                            "0xfda91...ef734",
                            "0xd0281...md592",
                            "0xmpl45...67890",
                            "0xhe962...83718",
                            "0xie031...34920",
                          ][i]
                        }
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      +${[140, 100, 238, 120, 150][i]}
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default MerchantDashboardPage;
