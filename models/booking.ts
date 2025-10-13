// models/Booking.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  hotelName: string;
  roomName: string;
  plan: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  guests: {
    title: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }[];
  roomPrice: number;
  taxes: number;
  totalAmount: number;
  currency: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingStatus: 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const GuestSchema = new Schema({
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }
});

const BookingSchema = new Schema({
  bookingId: { type: String, required: true, unique: true },
  hotelName: { type: String, required: true },
  roomName: { type: String, required: true },
  plan: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  nights: { type: Number, required: true },
  guests: [GuestSchema],
  roomPrice: { type: Number, required: true },
  taxes: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  bookingStatus: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, {
  timestamps: true
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);