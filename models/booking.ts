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
  bookingStatus:'pending'| 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const GuestSchema = new Schema({
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: false }, // Make optional
  phone: { type: String, required: false }  // Make optional
});

const BookingSchema = new Schema({
  bookingId: { type: String, required: true, unique: true },
  hotelName: { type: String, required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true }, // ✨ Add this
  roomName: { type: String, required: true },
  numberOfRooms: { type: Number, required: true },
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
  bookingStatus: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, {
  timestamps: true
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);