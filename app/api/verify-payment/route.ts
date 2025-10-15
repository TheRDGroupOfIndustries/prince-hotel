// /api/verify-payment/route.ts

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/booking';
import { Room } from '@/models/room';

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature.' }, { status: 400 });
    }

    // Update booking status
    const updatedBooking = await Booking.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        $set: {
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentStatus: 'completed',
          bookingStatus: 'confirmed',
        },
      },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ success: false, error: 'Booking not found.' }, { status: 404 });
    }

    // ✨ DECREMENT INVENTORY - This is the critical part
    console.log('Attempting to decrement inventory:', {
      roomId: updatedBooking.roomId,
      numberOfRooms: updatedBooking.numberOfRooms,
      bookingId: updatedBooking._id
    });

    try {
      const roomUpdateResult = await Room.findByIdAndUpdate(
        updatedBooking.roomId,
        { $inc: { inventory: -updatedBooking.numberOfRooms } },
        { new: true } // Return the updated document
      );

      if (!roomUpdateResult) {
        console.error(`CRITICAL: Room not found for ID ${updatedBooking.roomId}`);
      } else {
        console.log(`Successfully updated inventory for Room ${roomUpdateResult.name}. New inventory: ${roomUpdateResult.inventory}`);
      }
    } catch (inventoryError) {
      console.error(
        `CRITICAL: Failed to update inventory for Room ID ${updatedBooking.roomId} after Booking ID ${updatedBooking._id} was confirmed.`,
        inventoryError
      );
      // Consider sending an alert/notification to admin here
    }
    
    // Send confirmation email
    try {
      const primaryGuest = updatedBooking.guests[0];
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-mail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${primaryGuest.firstName} ${primaryGuest.lastName}`,
          email: primaryGuest.email,
          phone: primaryGuest.phone,
          roomName: updatedBooking.roomName,
          plan: updatedBooking.plan,
          checkIn: updatedBooking.checkIn,
          checkOut: updatedBooking.checkOut,
          nights: updatedBooking.nights,
          guests: updatedBooking.guests,
          totalAmount: updatedBooking.totalAmount,
          currency: updatedBooking.currency,
        }),
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json({ success: true, bookingId: updatedBooking.bookingId });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}