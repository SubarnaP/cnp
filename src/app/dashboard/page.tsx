
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, CalendarDays, CalendarRange, Calendar, TrendingUp, Search, Bell, Settings, Info } from 'lucide-react';
import { format } from 'date-fns';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  iconBgColor: string;
  iconTextColor: string;
  domestic: number;
  international: number;
}

function StatCard({ title, value, icon, iconBgColor, iconTextColor, domestic, international }: StatCardProps) {
  return (
    <Card className="shadow-sm rounded-xl">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${iconBgColor}`}>
            {React.cloneElement(icon, { className: `h-6 w-6 ${iconTextColor}` })}
          </div>
        </div>
        <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <span className="h-2 w-2 bg-blue-500 rounded-full mr-1.5 shrink-0"></span>
            <span>Domestic: {domestic.toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5 shrink-0"></span>
            <span>International: {international.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();
    setCurrentDate(format(today, "MMMM d, yyyy | EEEE"));
  }, []);

  return (
    <div className="space-y-6 p-1 md:p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Visitor Management Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of park visitor activities and statistics</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="pl-9 h-9 w-full md:w-64 rounded-md" />
          </div>
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>

      {/* Live Visitor Count / Today's Date Section */}
      <Card className="w-full p-6 rounded-xl shadow-md">
        <CardContent className="flex flex-col md:flex-row justify-between items-center p-0">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-700/30 p-3 rounded-full">
              <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Live Visitor Count</p>
              <p className="text-4xl font-bold text-foreground">487</p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-300 px-3 py-1 text-sm dark:bg-green-800/50 dark:text-green-300 dark:border-green-700">Active</Badge>
          </div>
          <div className="text-left md:text-right mt-4 md:mt-0">
            <p className="text-sm text-muted-foreground">Today's Date</p>
            <p className="text-lg font-semibold text-foreground">{currentDate || 'Loading date...'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Visitors"
          value="214"
          icon={<CalendarDays />}
          iconBgColor="bg-blue-100 dark:bg-blue-700/30"
          iconTextColor="text-blue-500 dark:text-blue-400"
          domestic={156}
          international={58}
        />
        <StatCard
          title="This Week"
          value="1,345"
          icon={<CalendarRange />}
          iconBgColor="bg-purple-100 dark:bg-purple-700/30"
          iconTextColor="text-purple-500 dark:text-purple-400"
          domestic={890}
          international={455}
        />
        <StatCard
          title="This Month"
          value="5,678"
          icon={<Calendar />}
          iconBgColor="bg-orange-100 dark:bg-orange-700/30"
          iconTextColor="text-orange-500 dark:text-orange-400"
          domestic={3245}
          international={2433}
        />
        <StatCard
          title="Year to Date"
          value="38,459"
          icon={<TrendingUp />}
          iconBgColor="bg-red-100 dark:bg-red-700/30"
          iconTextColor="text-red-500 dark:text-red-400"
          domestic={22134}
          international={16325}
        />
      </div>
        <div className="mt-6 p-4 bg-blue-50 border border-blue-300 rounded-xl text-sm text-blue-700 flex items-start dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300">
            <Info className="h-5 w-5 mr-3 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <div>
                <strong>Demo Dashboard:</strong> The data displayed here is for illustrative purposes only and does not reflect real-time park visitor statistics. The booking list functionality has been replaced by this overview.
            </div>
        </div>
    </div>
  );
}
