// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/booking';

// Simple authentication middleware (replace with your actual auth)
// const authenticateRequest = (request: NextRequest) => {
//   const authHeader = request.headers.get('authorization');
  
//   // In production, use proper JWT or API key validation
//   if (process.env.NODE_ENV === 'production') {
//     const expectedToken = process.env.ADMIN_API_TOKEN;
//     if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.slice(7) !== expectedToken) {
//       return false;
//     }
//   }
  
//   return true;
// };

export async function GET(request: NextRequest) {
  try {
    // Authenticate request
    // if (!authenticateRequest(request)) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    await connectDB();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status'); // 'pending', 'completed', 'failed'
    const bookingStatus = searchParams.get('bookingStatus'); // 'confirmed', 'cancelled'
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object
    const filter: any = {};

    // Filter by payment status
    if (status && ['pending', 'completed', 'failed'].includes(status)) {
      filter.paymentStatus = status;
    }

    // Filter by booking status
    if (bookingStatus && ['confirmed', 'cancelled'].includes(bookingStatus)) {
      filter.bookingStatus = bookingStatus;
    }

    // Filter by date range
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    // Search filter
    if (search) {
      filter.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { 'guests.firstName': { $regex: search, $options: 'i' } },
        { 'guests.lastName': { $regex: search, $options: 'i' } },
        { 'guests.email': { $regex: search, $options: 'i' } },
        { roomName: { $regex: search, $options: 'i' } },
        { hotelName: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const [bookings, totalCount] = await Promise.all([
      Booking.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-razorpaySignature') // Exclude sensitive data
        .lean(),
      Booking.countDocuments(filter)
    ]);

    // Calculate pagination info
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
          limit
        }
      }
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}