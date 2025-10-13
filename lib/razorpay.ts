// lib/razorpay.ts
import Razorpay from 'razorpay';

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export function generateBookingId(): string {
  return 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
}