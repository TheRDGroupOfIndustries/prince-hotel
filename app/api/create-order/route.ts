import { NextRequest, NextResponse } from 'next/server';
import { razorpay, generateBookingId } from '@/lib/razorpay';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/booking';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      hotelName,
      roomName,
      plan,
      checkIn,
      checkOut,
      nights,
      guests,
      roomPrice,
      taxes,
      totalAmount,
      currency = 'INR'
    } = body;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: currency,
      receipt: generateBookingId(),
      notes: {
        hotelName,
        roomName,
        plan,
        nights: nights.toString(),
      }
    });

    // Create booking record in database
    const booking = new Booking({
      bookingId: order.receipt,
      hotelName,
      roomName,
      plan,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      nights,
      guests,
      roomPrice,
      taxes,
      totalAmount,
      currency,
      razorpayOrderId: order.id,
      paymentStatus: 'pending',
      bookingStatus: 'confirmed'
    });

    await booking.save();

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      bookingId: booking.bookingId
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}