// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/booking';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status'); // 'pending', 'completed', 'failed'
    const bookingStatus = searchParams.get('bookingStatus'); // 'confirmed', 'cancelled'
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Strongly typed filter
    const filter: {
      paymentStatus?: string;
      bookingStatus?: string;
      createdAt?: {
        $gte?: Date;
        $lte?: Date;
      };
      $or?: Array<{
        [key: string]: { $regex: string; $options: string };
      }>;
    } = {};

    if (status && ['pending', 'completed', 'failed'].includes(status)) {
      filter.paymentStatus = status;
    }

    if (bookingStatus && ['confirmed', 'cancelled'].includes(bookingStatus)) {
      filter.bookingStatus = bookingStatus;
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    if (search) {
      filter.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { 'guests.firstName': { $regex: search, $options: 'i' } },
        { 'guests.lastName': { $regex: search, $options: 'i' } },
        { 'guests.email': { $regex: search, $options: 'i' } },
        { roomName: { $regex: search, $options: 'i' } },
        { hotelName: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [bookings, totalCount] = await Promise.all([
      Booking.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-razorpaySignature')
        .lean(),
      Booking.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}