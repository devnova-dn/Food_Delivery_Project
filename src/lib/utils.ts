import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function calculateDiscountPercentage(price: number, discountPrice: number): number {
  if (!discountPrice) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

export function getAverageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function validateEmail(email: string): boolean {
  const re = /^\S+@\S+\.\S+$/;
  return re.test(email);
}

export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true, message: 'Password is valid' };
}

export const categories = [
  { id: 'fresh-produce', name: 'Fresh Produce', icon: '🥬' },
  { id: 'dairy-eggs', name: 'Dairy & Eggs', icon: '🥛' },
  { id: 'meat-seafood', name: 'Meat & Seafood', icon: '🥩' },
  { id: 'bakery', name: 'Bakery', icon: '🥖' },
  { id: 'frozen-foods', name: 'Frozen Foods', icon: '❄️' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' },
  { id: 'snacks', name: 'Snacks', icon: '🍿' },
  { id: 'pantry', name: 'Pantry', icon: '🫙' },
  { id: 'organic', name: 'Organic', icon: '🌿' },
  { id: 'international', name: 'International', icon: '🌍' },
];

export const brands = [
  'GourmetHub',
  'Organic Valley',
  'Farm Fresh',
  'Natural Choice',
  'Premium Picks',
  'World Flavors',
  'Green Earth',
  'Local Harvest',
];
