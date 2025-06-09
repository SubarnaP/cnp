
export interface Visitor {
  id: string; // For client-side keying
  name: string;
  country: 'Nepal' | 'SAARC' | 'Other';
}

export interface Booking {
  id?: string; // Firestore document ID
  fullName: string;
  email: string;
  phone: string;
  dateOfVisit: string; // YYYY-MM-DD
  numberOfVisitors: number;
  visitors: Omit<Visitor, 'id'>[]; // Store without client-side id
  totalPrice: number;
  createdAt: Date; // Or Firestore Timestamp
  status?: 'Pending' | 'Confirmed' | 'Cancelled'; // Optional general booking status

  // New fields for visitor database view
  paymentStatus?: 'Paid' | 'Unpaid' | 'Failed';
  checkInStatus?: 'Checked-In' | 'Not Checked-In';
  entryTime?: string | null; // e.g., "10:30 AM"
  exitTime?: string | null;  // e.g., "04:15 PM"
}

export type CountryOption = 'Nepal' | 'SAARC' | 'Other';

export const countryCategories: { label: string; value: CountryOption }[] = [
  { label: 'Nepali', value: 'Nepal' },
  { label: 'SAARC Country', value: 'SAARC' },
  { label: 'Other Country', value: 'Other' },
];

