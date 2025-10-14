import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/booking';

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // 1. Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ success: false, error: 'Invalid payment signature.' }, { status: 400 });
    }

    // 2. If signature is valid, find and update the booking
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

    // ✨ 3. TRIGGER THE CONFIRMATION EMAIL
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
      // If email fails, don't fail the entire transaction. Just log the error.
      console.error("Failed to send confirmation email:", emailError);
    }

    return NextResponse.json({ success: true, bookingId: updatedBooking.bookingId });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}