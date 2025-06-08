
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
  status?: 'Pending' | 'Confirmed' | 'Cancelled'; // Optional status
}

export type CountryOption = 'Nepal' | 'SAARC' | 'Other';

export const countryCategories: { label: string; value: CountryOption }[] = [
  { label: 'Nepali', value: 'Nepal' },
  { label: 'SAARC Country', value: 'SAARC' },
  { label: 'Other Country', value: 'Other' },
];
