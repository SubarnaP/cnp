
import type { Booking, CountryOption } from '@/types/booking';
import { db } from './firebase'; // Mock db
import { generateBookingId } from './helpers';
import { PRICING_TIERS as DEFAULT_PRICING_TIERS } from './helpers'; // Import default pricing

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

export const getBookings = async (): Promise<Booking[]> => {
  try {
    // const bookingsCollection = collection(db, 'bookings');
    // const q = query(bookingsCollection, orderBy('createdAt', 'desc'));
    // const querySnapshot = await getDocs(q);
    // return querySnapshot.docs.map(doc => ({
    //   id: doc.id,
    //   ...doc.data(),
    //   createdAt: doc.data().createdAt.toDate(), // Convert Timestamp to Date
    // })) as Booking[];

    // Mock implementation
    console.log('Mock: Fetching all bookings from Firestore');
    const snapshot = await db.collection('bookings').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      // Ensure createdAt is a Date object if it's stored as a Firestore Timestamp
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt),
    })) as Booking[];
  } catch (error) {
    console.error('Error getting bookings: ', error);
    throw new Error('Failed to get bookings.');
  }
};

export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
  try {
    // const bookingDocRef = doc(db, 'bookings', bookingId);
    // const docSnap = await getDoc(bookingDocRef);
    // if (docSnap.exists()) {
    //   return {
    //     id: docSnap.id,
    //     ...docSnap.data(),
    //     createdAt: docSnap.data().createdAt.toDate(),
    //   } as Booking;
    // }
    // return null;

    // Mock implementation
    console.log(`Mock: Fetching booking by ID: ${bookingId}`);
    const docSnap = await db.collection('bookings').doc(bookingId).get();
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
         createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
      } as Booking;
    }
    return null;
  } catch (error) {
    console.error(`Error getting booking ${bookingId}: `, error);
    throw new Error(`Failed to get booking ${bookingId}.`);
  }
};
