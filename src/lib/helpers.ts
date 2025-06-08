
import type { Visitor, CountryOption } from '@/types/booking';

export const PRICING_TIERS: Record<CountryOption, number> = {
  Nepal: 100,
  SAARC: 200,
  Other: 500,
};

export const calculateTotalPrice = (visitors: Pick<Visitor, 'country'>[]): number => {
  return visitors.reduce((total, visitor) => {
    return total + (PRICING_TIERS[visitor.country] || 0);
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
