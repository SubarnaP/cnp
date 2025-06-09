
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Users,
  CalendarDays,
  Search as SearchIcon,
  ArrowUpDown,
  Download,
  Filter,
  MapPin,
  CreditCard,
  CheckSquare,
  Clock,
  DollarSign,
  ListChecks,
  Loader2
} from 'lucide-react';
import { getBookings, type Booking } from '@/lib/firestore';
import {
  format,
  parseISO,
  isToday,
  isThisWeek,
  isThisMonth,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from 'date-fns';

type SortableBookingKeys = 
  | 'id' 
  | 'fullName' 
  | 'dateOfVisit' 
  | 'numberOfVisitors' 
  | 'paymentStatus' 
  | 'checkInStatus' 
  | 'totalPrice' 
  | 'country';


const getSortableCountry = (booking: Booking): string => {
  if (booking.visitors && booking.visitors.length > 0) {
    return booking.visitors[0].country;
  }
  return 'zzzz'; // Put N/A last when sorting
};


export default function VisitorsPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [checkInStatusFilter, setCheckInStatusFilter] = useState('all');

  const [sortConfig, setSortConfig] = useState<{ key: SortableBookingKeys; direction: 'ascending' | 'descending' } | null>({ key: 'dateOfVisit', direction: 'descending' });

  useEffect(() => {
    const fetchBookingsData = async () => {
      setIsLoading(true);
      try {
        const bookings = await getBookings();
        setAllBookings(bookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        // You might want to show a toast error here
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookingsData();
  }, []);

  const processedBookings = useMemo(() => {
    let filtered = [...allBookings];

    if (dateFilter !== 'all') {
      filtered = filtered.filter(booking => {
        try {
          const visitDate = parseISO(booking.dateOfVisit);
          if (dateFilter === 'today') return isToday(visitDate);
          if (dateFilter === 'week') return isThisWeek(visitDate, { weekStartsOn: 1 });
          if (dateFilter === 'month') return isThisMonth(visitDate);
          return true;
        } catch (e) { return false; } // Invalid date string
      });
    }

    if (countryFilter !== 'all') {
      filtered = filtered.filter(booking => 
        booking.visitors.some(v => v.country === countryFilter)
      );
    }

    if (paymentStatusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.paymentStatus === paymentStatusFilter);
    }

    if (checkInStatusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.checkInStatus === checkInStatusFilter);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(booking =>
        (booking.id?.toLowerCase().includes(lowerSearchTerm)) ||
        (booking.fullName.toLowerCase().includes(lowerSearchTerm)) ||
        (booking.phone.toLowerCase().includes(lowerSearchTerm)) ||
        (booking.email.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    if (sortConfig !== null) {
      filtered.sort((a, b) => {
        let valA: any;
        let valB: any;

        if (sortConfig.key === 'country') {
          valA = getSortableCountry(a);
          valB = getSortableCountry(b);
        } else {
          valA = a[sortConfig.key as keyof Booking];
          valB = b[sortConfig.key as keyof Booking];
        }
        
        if (valA == null && valB == null) return 0;
        if (valA == null) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valB == null) return sortConfig.direction === 'ascending' ? 1 : -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
        }
        
        if (sortConfig.key === 'dateOfVisit') {
             try {
                valA = parseISO(a.dateOfVisit).getTime();
                valB = parseISO(b.dateOfVisit).getTime();
                return sortConfig.direction === 'ascending' ? valA - valB : valB - valA;
             } catch (e) { /* handle invalid date if necessary */ }
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        const comparison = strA.localeCompare(strB);
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [allBookings, searchTerm, dateFilter, countryFilter, paymentStatusFilter, checkInStatusFilter, sortConfig]);

  const requestSort = (key: SortableBookingKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortableBookingKeys) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-1 h-3 w-3 opacity-30" />;
    }
    if (sortConfig.direction === 'ascending') {
      const UpArrow = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>;
      return <UpArrow />;
    }
    const DownArrow = () => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>;
    return <DownArrow/>;
  };

  const exportToCSV = useCallback((data: Booking[], filename: string) => {
    const headers = [
      "Booking ID", "Booker Name", "Visit Date", "Group Size", 
      "Countries", "Payment Status", "Check-In Status", "Entry Time", "Exit Time", "Total Price (NPR)"
    ];
    const csvRows = [headers.join(",")];

    let totalBookings = data.length;
    let totalVisitors = 0;
    let totalPriceCollected = 0;

    data.forEach(booking => {
      const row = [
        booking.id || 'N/A',
        booking.fullName,
        booking.dateOfVisit,
        booking.numberOfVisitors,
        booking.visitors.map(v => v.country).join('; '),
        booking.paymentStatus || 'N/A',
        booking.checkInStatus || 'N/A',
        booking.entryTime || 'N/A',
        booking.exitTime || 'N/A',
        booking.totalPrice
      ];
      csvRows.push(row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","));
      
      totalVisitors += booking.numberOfVisitors;
      if(booking.paymentStatus === 'Paid') {
        totalPriceCollected += booking.totalPrice;
      }
    });

    csvRows.push(""); 
    csvRows.push(`"Summary",`);
    csvRows.push(`"Total Bookings:","${totalBookings}"`);
    csvRows.push(`"Total Visitors:","${totalVisitors}"`);
    csvRows.push(`"Total Price Collected (Paid):","Rs. ${totalPriceCollected.toLocaleString()}"`);

    const blob = new Blob([csvRows.join("\n")], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, []);

  const handleDownloadReport = useCallback((reportType: 'daily' | 'weekly' | 'monthly') => {
    const today = new Date();
    let dataToExport: Booking[] = [];
    let filename = "visitors-report";
    let dateRangeData = [...allBookings]; // Use allBookings for report generation before search/UI filters are applied

    if (reportType === 'daily') {
      dataToExport = dateRangeData.filter(b => { try { return isToday(parseISO(b.dateOfVisit)); } catch { return false; }});
      filename = `visitors-daily-report-${format(today, 'yyyy-MM-dd')}.csv`;
    } else if (reportType === 'weekly') {
      const weekStart = startOfWeek(today, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
      dataToExport = dateRangeData.filter(b => {
        try {
          const visitDate = parseISO(b.dateOfVisit);
          return visitDate >= weekStart && visitDate <= weekEnd;
        } catch { return false; }
      });
      filename = `visitors-weekly-report-${format(weekStart, 'yyyy-MM-dd')}-to-${format(weekEnd, 'yyyy-MM-dd')}.csv`;
    } else if (reportType === 'monthly') {
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
       dataToExport = dateRangeData.filter(b => {
        try {
          const visitDate = parseISO(b.dateOfVisit);
          return visitDate >= monthStart && visitDate <= monthEnd;
        } catch { return false; }
      });
      filename = `visitors-monthly-report-${format(today, 'yyyy-MM')}.csv`;
    }
    
    if (dataToExport.length === 0) {
        alert(`No data available for ${reportType} report.`);
        return;
    }
    exportToCSV(dataToExport, filename);
  }, [allBookings, exportToCSV]);
  
  const columns: { key: SortableBookingKeys; label: string; icon?: React.ReactElement, sortable?: boolean, className?: string }[] = [
    { key: 'id', label: 'Booking ID', icon: <ListChecks />, sortable: true, className: "w-[180px]" },
    { key: 'fullName', label: 'Booker Name', icon: <Users />, sortable: true, className: "min-w-[150px]" },
    { key: 'dateOfVisit', label: 'Visit Date', icon: <CalendarDays />, sortable: true, className: "w-[150px]" },
    { key: 'numberOfVisitors', label: 'Group Size', icon: <Users />, sortable: true, className: "w-[100px] text-center" },
    { key: 'country', label: 'Countries', icon: <MapPin />, sortable: true, className: "min-w-[150px]" },
    { key: 'paymentStatus', label: 'Payment', icon: <CreditCard />, sortable: true, className: "w-[120px]" },
    { key: 'checkInStatus', label: 'Checked-In', icon: <CheckSquare />, sortable: true, className: "w-[130px]" },
    { key: 'entryTime', label: 'Entry Time', icon: <Clock />, sortable: false, className: "w-[100px]" },
    { key: 'exitTime', label: 'Exit Time', icon: <Clock />, sortable: false, className: "w-[100px]" },
  ];

  return (
    <div className="space-y-6 p-1 md:p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center">
            <Users className="mr-3 h-8 w-8 text-primary" /> Visitor Records
          </h1>
          <p className="text-sm text-muted-foreground">Manage and monitor visitor entries. Total Records: {processedBookings.length}</p>
        </div>
      </div>

      <Card className="p-4 space-y-4 shadow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-end">
          <div>
            <label htmlFor="search" className="block text-xs font-medium text-muted-foreground mb-1">Search Records</label>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="search" type="text" placeholder="ID, Name, Phone, Email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 h-9 text-sm"/>
            </div>
          </div>
          <div>
            <label htmlFor="dateFilter" className="block text-xs font-medium text-muted-foreground mb-1">Visit Date</label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger id="dateFilter" className="h-9 text-sm"><SelectValue placeholder="Filter by Date" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="countryFilter" className="block text-xs font-medium text-muted-foreground mb-1">Country Category</label>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger id="countryFilter" className="h-9 text-sm"><SelectValue placeholder="Filter by Country" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                <SelectItem value="Nepal">Nepal</SelectItem>
                <SelectItem value="SAARC">SAARC</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="paymentStatusFilter" className="block text-xs font-medium text-muted-foreground mb-1">Payment Status</label>
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger id="paymentStatusFilter" className="h-9 text-sm"><SelectValue placeholder="Payment Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Unpaid">Unpaid</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="checkInStatusFilter" className="block text-xs font-medium text-muted-foreground mb-1">Check-In Status</label>
            <Select value={checkInStatusFilter} onValueChange={setCheckInStatusFilter}>
              <SelectTrigger id="checkInStatusFilter" className="h-9 text-sm"><SelectValue placeholder="Check-In Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Checked-In">Checked-In</SelectItem>
                <SelectItem value="Not Checked-In">Not Checked-In</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button size="sm" variant="outline" onClick={() => handleDownloadReport('daily')}>
            <Download className="mr-2 h-4 w-4" /> Daily Report
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDownloadReport('weekly')}>
            <Download className="mr-2 h-4 w-4" /> Weekly Report
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDownloadReport('monthly')}>
            <Download className="mr-2 h-4 w-4" /> Monthly Report
          </Button>
        </div>
      </Card>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} onClick={() => col.sortable && requestSort(col.key)} className={`${col.className || ''} ${col.sortable ? "cursor-pointer hover:bg-muted/50" : ""}`}>
                  <div className="flex items-center text-xs uppercase tracking-wider text-muted-foreground">
                    {col.icon && React.cloneElement(col.icon, {className: "mr-1.5 h-3.5 w-3.5"})}
                    {col.label}
                    {col.sortable && getSortIcon(col.key)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                <TableRow><TableCell colSpan={columns.length} className="h-32 text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /></TableCell></TableRow>
            ) : processedBookings.length > 0 ? (
              processedBookings.map((booking) => (
                <TableRow key={booking.id} className="text-sm">
                  <TableCell className="font-medium py-2.5">{booking.id}</TableCell>
                  <TableCell className="py-2.5">{booking.fullName}</TableCell>
                  <TableCell className="py-2.5">{format(parseISO(booking.dateOfVisit), 'dd MMM yyyy')}</TableCell>
                  <TableCell className="text-center py-2.5">{booking.numberOfVisitors}</TableCell>
                  <TableCell className="py-2.5 text-xs">{booking.visitors.map(v => v.country).join(', ')}</TableCell>
                  <TableCell className="py-2.5">
                    <Badge className={`text-xs font-normal px-1.5 py-0.5 ${
                        booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700 border-green-300' :
                        booking.paymentStatus === 'Unpaid' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                        booking.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`} variant="outline"
                    >
                      {booking.paymentStatus || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Badge className={`text-xs font-normal px-1.5 py-0.5 ${
                        booking.checkInStatus === 'Checked-In' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-700 border-gray-300'
                      }`} variant="outline"
                    >
                      {booking.checkInStatus || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2.5">{booking.entryTime || 'N/A'}</TableCell>
                  <TableCell className="py-2.5">{booking.exitTime || 'N/A'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No visitor records match your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       <p className="pt-4 text-center text-xs text-muted-foreground">
        This is a read-only view for demonstration. Admin access control and further actions would be part of a full implementation.
      </p>
    </div>
  );
}
