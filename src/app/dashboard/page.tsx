
"use client" 
// Changed to client component for mock data fetching and potential future client-side filtering/search

import { useEffect, useState } from 'react';
import BookingCard from '@/components/BookingCard';
import { getBookings } from '@/lib/firestore';
import type { Booking } from '@/types/booking';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Search, Filter, Loader2, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/DatePickerWithRange"; // Assuming this component exists or will be created
import type { DateRange } from "react-day-picker";

// Placeholder for DatePickerWithRange if not provided by shadcn/ui by default
// You would typically create this component separately
const DatePickerWithRangePlaceholder = ({ date, onDateChange }: { date?: DateRange, onDateChange: (range?: DateRange) => void }) => (
  <Button variant="outline" onClick={() => onDateChange(undefined)}>
    Date Range Picker (Placeholder) {date ? `${date.from} - ${date.to}` : ''}
  </Button>
);


export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        const fetchedBookings = await getBookings();
        // Add a mock status for demonstration
        const bookingsWithStatus = fetchedBookings.map(b => ({ ...b, status: Math.random() > 0.5 ? 'Confirmed' : 'Pending' } as Booking));
        setBookings(bookingsWithStatus);
        setFilteredBookings(bookingsWithStatus);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load bookings. Please try again later.');
        setBookings([]);
        setFilteredBookings([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  useEffect(() => {
    let tempBookings = bookings;

    if (searchTerm) {
      tempBookings = tempBookings.filter(booking =>
        booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.id && booking.id.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (countryFilter !== 'all') {
      tempBookings = tempBookings.filter(booking =>
        booking.visitors.some(v => v.country === countryFilter)
      );
    }
    
    if (dateRange?.from && dateRange?.to) {
        tempBookings = tempBookings.filter(booking => {
            const visitDate = new Date(booking.dateOfVisit);
            return visitDate >= dateRange.from! && visitDate <= dateRange.to!;
        });
    }


    setFilteredBookings(tempBookings);
  }, [searchTerm, countryFilter, dateRange, bookings]);

  const handleExportCSV = () => {
    // Basic CSV export logic
    if (filteredBookings.length === 0) return;
    const headers = ['Booking ID', 'Full Name', 'Email', 'Phone', 'Date of Visit', 'Num Visitors', 'Total Price', 'Status', 'Created At', 'Visitor Names', 'Visitor Countries'];
    const rows = filteredBookings.map(b => [
      b.id,
      b.fullName,
      b.email,
      b.phone,
      b.dateOfVisit,
      b.numberOfVisitors,
      b.totalPrice,
      b.status,
      new Date(b.createdAt).toISOString(),
      b.visitors.map(v => v.name).join(' | '),
      b.visitors.map(v => v.country).join(' | ')
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bookings_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-destructive/10 p-4 rounded-md">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">Error Loading Bookings</h2>
        <p className="text-destructive/80">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-card rounded-lg shadow">
        <h1 className="text-3xl font-headline text-primary">Visitor Bookings Dashboard</h1>
        <Button onClick={handleExportCSV} disabled={filteredBookings.length === 0}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-card rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, ID..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by country..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="Nepal">Nepali</SelectItem>
            <SelectItem value="SAARC">SAARC</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Using placeholder as DatePickerWithRange may not exist in user's current shadcn setup */}
        <DatePickerWithRangePlaceholder date={dateRange} onDateChange={setDateRange} />
      </div>

      {filteredBookings.length === 0 ? (
         <div className="text-center py-10 bg-secondary/20 p-4 rounded-md">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-muted-foreground">No Bookings Found</h2>
            <p className="text-muted-foreground/80">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}

// Minimal DatePickerWithRange component example (if you don't have one from shadcn)
// This is a very basic example. A real one would use react-day-picker and Popover.
// const DatePickerWithRange: React.FC<{ date?: DateRange, onDateChange: (range?: DateRange) => void }> = ({ date, onDateChange }) => {
//   return (
//     <Button variant="outline" onClick={() => onDateChange(undefined)}>
//       Date Range (Example) {date ? `${date.from} - ${date.to}` : ''}
//     </Button>
//   );
// };
