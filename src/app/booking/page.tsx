
import BookingForm from '@/components/BookingForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Tickets - ParkConnect',
  description: 'Book your entry tickets for Chitwan National Park.',
};

export default function BookingPage() {
  return (
    <div className="py-8">
      <BookingForm />
    </div>
  );
}
