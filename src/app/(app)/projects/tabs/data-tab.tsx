"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Database, Activity, HardDrive } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { date: '2023-01-01', users: 120 },
  { date: '2023-01-02', users: 150 },
  { date: '2023-01-03', users: 130 },
  { date: '2023-01-04', users: 180 },
  { date: '2023-01-05', users: 210 },
  { date: '2023-01-06', users: 200 },
  { date: '2023-01-07', users: 240 },
];

const chartConfig = {
  users: {
    label: 'Users',
    color: 'hsl(var(--chart-1))',
  },
};

export function DataTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><PieChart /> Project Analytics</CardTitle>
          <CardDescription>Key metrics for your project's performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <AreaChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <Tooltip content={<ChartTooltipContent indicator="dot" />} />
              <Area dataKey="users" type="monotone" fill="var(--color-users)" fillOpacity={0.4} stroke="var(--color-users)" />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Database /> Database Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <p className="text-muted-foreground">All systems operational.</p>
            </div>
            <p className="text-2xl font-bold mt-2">99.98% <span className="text-sm font-normal text-muted-foreground">Uptime</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Activity /> API Health</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Average response time.</p>
            <p className="text-2xl font-bold mt-2">48ms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><HardDrive /> Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Total storage used.</p>
            <p className="text-2xl font-bold mt-2">12.5 GB / 50 GB</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
