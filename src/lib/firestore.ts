
import type { Booking, CountryOption } from '@/types/booking';
import { db } from './firebase'; // Mock db
import { generateBookingId } from './helpers';
import { PRICING_TIERS as DEFAULT_PRICING_TIERS } from './helpers'; // Import default pricing
import { format, subDays, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, newDate } from 'date-fns';


// In a real app, you'd use Firebase SDK:
// import { collection, addDoc, getDocs, doc, getDoc, setDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export interface PricingConfig {
  Nepal: number;
  SAARC: number;
  Other: number;
}

const PRICING_CONFIG_DOC_PATH = 'settings/pricingConfig';

export const getPricingConfig = async (): Promise<PricingConfig> => {
  try {
    // const pricingDocRef = doc(db, PRICING_CONFIG_DOC_PATH);
    // const docSnap = await getDoc(pricingDocRef);
    // if (docSnap.exists()) {
    //   return docSnap.data() as PricingConfig;
    // }
    // console.warn('Pricing config not found in Firestore, returning default prices.');
    // return DEFAULT_PRICING_TIERS; // Fallback to default

    // Mock implementation
    console.log('Mock: Fetching pricing config from Firestore');
    const docSnap = await db.collection('settings').doc('pricingConfig').get();
     if (docSnap.exists() && docSnap.data()) {
      // Ensure the data matches the PricingConfig structure, otherwise return defaults
      const data = docSnap.data();
      if (typeof data.Nepal === 'number' && typeof data.SAARC === 'number' && typeof data.Other === 'number') {
        return data as PricingConfig;
      }
    }
    console.warn('Mock: Pricing config not found or invalid in Firestore, returning default prices.');
    return DEFAULT_PRICING_TIERS; // Fallback to default
  } catch (error) {
    console.error('Error getting pricing config: ', error);
    // In case of error, also fallback to default to ensure app functionality
    return DEFAULT_PRICING_TIERS;
  }
};

export const updatePricingConfig = async (newPrices: PricingConfig): Promise<void> => {
  try {
    // const pricingDocRef = doc(db, PRICING_CONFIG_DOC_PATH);
    // await setDoc(pricingDocRef, newPrices);

    // Mock implementation
    console.log('Mock: Updating pricing config in Firestore', newPrices);
    await db.collection('settings').doc('pricingConfig').set(newPrices);
  } catch (error) {
    console.error('Error updating pricing config: ', error);
    throw new Error('Failed to update pricing config.');
  }
};


export const addBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<string> => {
  try {
    // const bookingsCollection = collection(db, 'bookings');
    // const docRef = await addDoc(bookingsCollection, {
    //   ...bookingData,
    //   createdAt: serverTimestamp(),
    // });
    // return docRef.id;

    // Mock implementation
    const newId = generateBookingId();
    console.log('Mock: Adding booking to Firestore', { id: newId, ...bookingData, createdAt: new Date() });
    await db.collection('bookings').doc(newId).set({ ...bookingData, createdAt: new Date() });
    return newId;
  } catch (error) {
    console.error('Error adding booking: ', error);
    throw new Error('Failed to add booking.');
  }
};

const mockBookingsData: Booking[] = [
  { id: 'CNP-MOCK1-BOOK', fullName: 'Alice Wonderland', email: 'alice@example.com', phone: '9800000001', dateOfVisit: format(new Date(2024, 7, 15), 'yyyy-MM-dd'), numberOfVisitors: 2, visitors: [{name: 'Alice W.', country: 'Other'}, {name: 'Mad Hatter', country: 'SAARC'}], totalPrice: 1200, createdAt: new Date(2024, 7, 1, 10, 30), paymentStatus: 'Paid', checkInStatus: 'Checked-In', entryTime: '10:00 AM', exitTime: '03:00 PM', status: 'Confirmed' },
  { id: 'CNP-MOCK2-BOOK', fullName: 'Charlie Brown', email: 'charlie@example.com', phone: '9800000002', dateOfVisit: format(new Date(), 'yyyy-MM-dd'), numberOfVisitors: 1, visitors: [{name: 'Charlie B.', country: 'Nepal'}], totalPrice: 100, createdAt: new Date(2024, 7, 2, 11,0), paymentStatus: 'Unpaid', checkInStatus: 'Not Checked-In', entryTime: null, exitTime: null, status: 'Pending' },
  { id: 'CNP-MOCK3-BOOK', fullName: 'Diana Prince', email: 'diana@example.com', phone: '9800000003', dateOfVisit: format(subDays(new Date(), 3), 'yyyy-MM-dd'), numberOfVisitors: 3, visitors: [{name: 'Diana P.', country: 'Other'}, {name:'Steve T.', country:'Other'}, {name:'Etta C.', country:'Other'}], totalPrice: 3000, createdAt: new Date(2024, 7, 3, 12, 15), paymentStatus: 'Paid', checkInStatus: 'Not Checked-In', entryTime: null, exitTime: null, status: 'Confirmed' },
  { id: 'CNP-MOCK4-BOOK', fullName: 'Bruce Wayne', email: 'bruce@example.com', phone: '9800000004', dateOfVisit: format(addDays(new Date(), 5), 'yyyy-MM-dd'), numberOfVisitors: 1, visitors: [{name: 'Bruce W.', country: 'Other'}], totalPrice: 1000, createdAt: new Date(2024, 7, 4, 14,0), paymentStatus: 'Failed', checkInStatus: 'Not Checked-In', entryTime: null, exitTime: null, status: 'Cancelled' },
  { id: 'CNP-MOCK5-BOOK', fullName: 'Clark Kent', email: 'clark@example.com', phone: '9800000005', dateOfVisit: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'), numberOfVisitors: 4, visitors: [{name:'Clark K.', country:'SAARC'},{name:'Lois L.', country:'SAARC'}, {name:'Jimmy O.', country:'Nepal'}, {name:'Perry W.', country:'Other'}], totalPrice: 1700, createdAt: new Date(2024, 7, 5, 9, 45), paymentStatus: 'Paid', checkInStatus: 'Checked-In', entryTime: '09:30 AM', exitTime: null, status: 'Confirmed' },
  { id: 'CNP-MOCK6-SCAN', fullName: 'Peter Parker', email: 'peter@example.com', phone: '9800000006', dateOfVisit: format(new Date(), 'yyyy-MM-dd'), numberOfVisitors: 1, visitors: [{ name: 'Peter P.', country: 'SAARC' }], totalPrice: 200, createdAt: new Date(2024, 6, 15, 10,0), paymentStatus: 'Paid', checkInStatus: 'Checked-In', entryTime: '11:00 AM', exitTime: '04:00 PM', status: 'Confirmed' },
  { id: 'CNP-MOCK7-DATA', fullName: 'Tony Stark', email: 'tony@example.com', phone: '9800000007', dateOfVisit: format(subDays(new Date(), 10), 'yyyy-MM-dd'), numberOfVisitors: 2, visitors: [{ name: 'Tony S.', country: 'Other' }, { name: 'Pepper P.', country: 'Other' }], totalPrice: 2000, createdAt: new Date(2024, 6, 10, 12,0), paymentStatus: 'Paid', checkInStatus: 'Not Checked-In', entryTime: null, exitTime: null, status: 'Confirmed' },
];


export const getBookings = async (): Promise<Booking[]> => {
  try {
    // Mock implementation
    console.log('Mock: Fetching all bookings from Firestore');
    // Simulating a Firestore call delay
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    // Create a deep copy of mock data to prevent unintentional modifications if this function is called multiple times
    // and to simulate fetching fresh data each time.
    const bookingsToReturn = mockBookingsData.map(booking => ({
        ...booking,
        createdAt: new Date(booking.createdAt) // Ensure createdAt is a Date object
    }));
    return bookingsToReturn;

  } catch (error) {
    console.error('Error getting bookings: ', error);
    throw new Error('Failed to get bookings.');
  }
};

export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
  try {
    // Mock implementation
    console.log(`Mock: Fetching booking by ID: ${bookingId}`);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const foundBooking = mockBookingsData.find(b => b.id === bookingId);

    if (foundBooking) {
      return { ...foundBooking, createdAt: new Date(foundBooking.createdAt) };
    }
    // Special mock for scanner page
    if (bookingId === 'CNP-MOCK1-SCAN') {
        return {
            id: 'CNP-MOCK1-SCAN',
            fullName: 'Scanned User Test',
            email: 'scan@example.com',
            phone: '9800000000',
            dateOfVisit: format(new Date(), 'yyyy-MM-dd'),
            numberOfVisitors: 1,
            visitors: [{ name: 'Scanned Visitor', country: 'Nepal' }],
            totalPrice: 100,
            createdAt: new Date(),
            status: 'Confirmed',
            paymentStatus: 'Paid',
            checkInStatus: 'Not Checked-In',
        };
    }
    return null;
  } catch (error) {
    console.error(`Error getting booking ${bookingId}: `, error);
    throw new Error(`Failed to get booking ${bookingId}.`);
  }
};

