'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Function to generate random sales data for the last 7 days
const generateRandomData = () => {
  const data = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      day: days[date.getDay()],
      date: date.toISOString().split('T')[0],
      sales: Math.floor(Math.random() * 300) + 100, // Random sales between 100 and 399
    });
  }

  return data;
};

export function DailySalesBarChartComponent() {
  const data = generateRandomData();

  return (
    <Card className="col-span-4 w-full max-w-7xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Daily Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px] sm:h-[500px] md:h-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))'
                }}
                labelFormatter={(label) => `Date: ${data.find(item => item.day === label)?.date}`}
              />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}