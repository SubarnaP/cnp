
import type { Visitor, CountryOption } from '@/types/booking';
import type { PricingConfig } from './firestore'; // Import PricingConfig

// This PRICING_TIERS constant now serves as the DEFAULT fallback
export const PRICING_TIERS: PricingConfig = {
  Nepal: 100,
  SAARC: 200,
  Other: 1000,
};

// This global calculateTotalPrice might be less used if forms calculate it with their own fetched prices.
// However, it can still be useful for other parts of the app or as a reference.
// It's updated to accept a pricingConfig argument.
export const calculateTotalPrice = (
  visitors: Pick<Visitor, 'country'>[],
  pricingConfig: PricingConfig = PRICING_TIERS // Default to PRICING_TIERS if no config passed
): number => {
  return visitors.reduce((total, visitor) => {
    return total + (pricingConfig[visitor.country as keyof PricingConfig] || 0);
  }, 0);
};

// Basic email validation regex
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Basic phone validation (simple check for 10 digits)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

export const generateBookingId = (): string => {
  return `CNP-${Date.now().toString(36).slice(-4).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
};
