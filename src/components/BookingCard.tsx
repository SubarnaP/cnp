
import type { Booking } from '@/types/booking';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, DollarSign, Tag, Mail, Phone, ListChecks } from 'lucide-react';
import { format } from 'date-fns';

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl font-headline text-primary">Booking ID: {booking.id}</CardTitle>
                <CardDescription>Booked by: {booking.fullName}</CardDescription>
            </div>
            <Badge variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}>
                {booking.status || 'Pending'}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Visit Date: {format(new Date(booking.dateOfVisit), 'PPP')}</span>
        </div>
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Total Paid: Rs. {booking.totalPrice.toLocaleString()}</span>
        </div>
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Visitors: {booking.numberOfVisitors}</span>
        </div>
         <div className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Email: {booking.email}</span>
        </div>
        <div className="flex items-center">
          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>Phone: {booking.phone}</span>
        </div>
        
        {booking.visitors && booking.visitors.length > 0 && (
          <div className="pt-2">
            <h4 className="font-semibold mb-1 flex items-center"><ListChecks className="h-4 w-4 mr-2 text-primary" />Visitor Details:</h4>
            <ul className="list-disc list-inside pl-2 space-y-1 max-h-32 overflow-y-auto bg-secondary/20 p-2 rounded-md">
              {booking.visitors.map((visitor, index) => (
                <li key={index} className="text-xs">
                  {visitor.name} (<Badge variant="outline" className="text-xs px-1 py-0">{visitor.country}</Badge>)
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <p>Booked on: {format(new Date(booking.createdAt), 'PPpp')}</p>
      </CardFooter>
    </Card>
  );
}
