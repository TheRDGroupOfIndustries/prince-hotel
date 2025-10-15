// /api/create-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/booking';
import Quote from '@/models/quote';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const {
      quoteId,
      guests,
      checkIn,
      checkOut,
      nights,
    } = body;

    const quote = await Quote.findById(quoteId);

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Booking session expired or is invalid. Please try again.' },
        { status: 404 }
      );
    }

    const breakdown = quote.priceBreakdown as any;
    const perNightPrice = breakdown.totalPrice || 0;
    
    const subTotal = perNightPrice * nights;
    const taxes = subTotal * 0.05; // 5% GST
    const finalTotal = subTotal + taxes;

    let planName = 'Room Only';
    if (quote.selections.mealPlan === 'CP') {
      planName = 'CP (With Breakfast)';
    } else if (quote.selections.mealPlan === 'AP') {
      planName = 'AP (Breakfast + Dinner)';
    }

    const booking = new Booking({
      hotelName: "Hotel Prince Diamond Varanasi",
      // ✨ Save the roomId and numberOfRooms to the final booking record
      roomId: quote.roomId,
      roomName: quote.roomName,
      numberOfRooms: quote.numberOfRooms,
      plan: planName,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      nights,
      guests,
      roomPrice: subTotal,
      taxes,
      totalAmount: finalTotal,
      currency: 'INR',
      paymentStatus: 'pending',
      bookingStatus: 'pending',
    });
    
    const receiptId = booking._id.toString();

    const order = await razorpay.orders.create({
      amount: Math.round(finalTotal * 100),
      currency: 'INR',
      receipt: receiptId,
      notes: {
        bookingId: receiptId,
        roomName: quote.roomName,
      }
    });

    booking.razorpayOrderId = order.id;
    booking.bookingId = receiptId;
    await booking.save();

    await Quote.findByIdAndDelete(quoteId);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
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