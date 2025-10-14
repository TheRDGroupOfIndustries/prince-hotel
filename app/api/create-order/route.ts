import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay'; // Assuming razorpay instance is exported
import connectDB from '@/lib/mongodb';
import Booking from '@/models/booking'; // Your existing final Booking model
import Quote from '@/models/quote'; // The temporary Quote model we created

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // ✨ 1. The API now expects a `quoteId` instead of all the price details.
    const body = await request.json();
    const {
      quoteId,
      guests,
      checkIn,
      checkOut,
      nights,
    } = body;

    // ✨ 2. Fetch the secure, temporary quote from the database.
    const quote = await Quote.findById(quoteId);

    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Booking session expired or is invalid. Please try again.' },
        { status: 404 }
      );
    }

    // ✨ 3. Recalculate the final total securely on the server based on the quote's data.
    const breakdown = quote.priceBreakdown as any; // Cast as any to access properties
    const perNightPrice = breakdown.totalPrice || 0;
    
    const subTotal = perNightPrice * nights;
    const taxes = subTotal * 0.05; // 5% GST
    const finalTotal = subTotal + taxes;

    // 4. Create a permanent booking record with a "pending" status.
    const booking = new Booking({
      hotelName: "Hotel Prince Diamond Varanasi", // Or fetch from a config
      roomName: quote.roomName,
      plan: quote.selections.mealPlan === 'CP' ? 'With Breakfast' : 'Room Only',
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      nights,
      guests,
      roomPrice: subTotal,
      taxes,
      totalAmount: finalTotal,
      currency: 'INR',
      paymentStatus: 'pending',
      bookingStatus: 'pending', // Will be confirmed after successful payment
    });
    
    // The receipt for Razorpay should be unique, so we use the new booking's ID.
    const receiptId = booking._id.toString();

    // 5. Create the Razorpay order using the SERVER-CALCULATED final total.
    const order = await razorpay.orders.create({
      amount: Math.round(finalTotal * 100), // Amount in paise
      currency: 'INR',
      receipt: receiptId,
      notes: {
        bookingId: receiptId,
        roomName: quote.roomName,
      }
    });

    // 6. Save the Razorpay Order ID to our booking record.
    booking.razorpayOrderId = order.id;
    booking.bookingId = receiptId; // Set your internal bookingId
    await booking.save();

    // ✨ 7. Clean up by deleting the now-used temporary quote.
    await Quote.findByIdAndDelete(quoteId);

    // 8. Return the order details to the frontend to open the Razorpay modal.
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