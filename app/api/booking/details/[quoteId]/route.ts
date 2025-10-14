import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Quote from '@/models/quote';
import mongoose from 'mongoose';

export async function GET(request: Request, { params }: { params: { quoteId: string } }) {
  const { quoteId } = params;

  if (!quoteId || !mongoose.Types.ObjectId.isValid(quoteId)) {
    return NextResponse.json({ success: false, error: 'Invalid Quote ID' }, { status: 400 });
  }

  await dbConnect();

  try {
    const quote = await Quote.findById(quoteId);

    if (!quote) {
      return NextResponse.json({ success: false, error: 'Booking session expired or not found' }, { status: 404 });
    }

    // Return the trusted details from the database
    return NextResponse.json({ success: true, details: quote });
  } catch (error) {
    console.error('Error fetching quote details:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}