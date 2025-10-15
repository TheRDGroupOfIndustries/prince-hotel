"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/base/card"
import { CheckCircle, Mail, Phone, Users, Moon } from 'lucide-react'

// Inner component that uses useSearchParams
function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const [bookingDetails, setBookingDetails] = useState({
    bookingId: '',
    checkIn: '',
    checkOut: '',
    totalAmount: '',
    roomName: '',
    email: '',
    phone: '',
    guests: '0',
    nights: '0'
  })

  useEffect(() => {
    // Get all booking details from query parameters
    const bookingId = searchParams.get('bookingId') || 'BK' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const checkIn = searchParams.get('checkIn') || 'Not specified';
    const checkOut = searchParams.get('checkOut') || 'Not specified';
    const totalAmount = searchParams.get('totalAmount') ? `₹${parseInt(searchParams.get('totalAmount')!).toLocaleString('en-IN')}` : '₹0';
    const roomName = decodeURIComponent(searchParams.get('roomName') || 'Room');
    const email = decodeURIComponent(searchParams.get('email') || '');
    const phone = decodeURIComponent(searchParams.get('phone') || '');
    const guests = searchParams.get('guests') || '0';
    const nights = searchParams.get('nights') || '0';

    setBookingDetails({
      bookingId,
      checkIn,
      checkOut,
      totalAmount,
      roomName,
      email,
      phone,
      guests,
      nights
    });

    // Optional: Store booking details in localStorage for persistence
    localStorage.setItem('lastBooking', JSON.stringify({
      bookingId,
      checkIn,
      checkOut,
      totalAmount,
      roomName,
      email,
      phone,
      guests,
      nights,
      timestamp: new Date().toISOString()
    }));

  }, [searchParams])

  const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your booking has been successfully confirmed. A confirmation email has been sent to your email address.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-left">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Booking ID:</span>
                <span className="font-semibold text-blue-600">{bookingDetails.bookingId}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Room Type:</span>
                <span className="font-semibold">{bookingDetails.roomName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium flex items-center gap-1">
                  <Moon className="w-4 h-4" />
                  Stay Duration:
                </span>
                <span>{bookingDetails.nights} night{parseInt(bookingDetails.nights) > 1 ? 's' : ''}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Check-in:</span>
                <span className="font-semibold">{bookingDetails.checkIn}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Check-out:</span>
                <span className="font-semibold">{bookingDetails.checkOut}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Guests:
                </span>
                <span>{bookingDetails.guests} guest{parseInt(bookingDetails.guests) > 1 ? 's' : ''}</span>
              </div>

              {bookingDetails.email && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email:
                  </span>
                  <span className="text-sm">{bookingDetails.email}</span>
                </div>
              )}

              {bookingDetails.phone && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Phone:
                  </span>
                  <span>{bookingDetails.phone}</span>
                </div>
              )}

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center text-base">
                  <span className="text-gray-700 font-bold">Total Amount:</span>
                  <span className="font-bold text-green-600 text-lg">{bookingDetails.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You will receive a confirmation email within 5 minutes</li>
              <li>• Present your booking ID at the reception during check-in</li>
              <li>• Check-in time is from 12:00 PM onwards</li>
              <li>• Check-out time is before 11:00 AM</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => window.print()}
              className="flex items-center gap-2"
            >
              Print Confirmation
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Back to Home
            </Button>
          </div>

        
        </Card>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function BookingSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container max-w-2xl mx-auto px-4">
          <Card className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-16 w-16 bg-gray-300 rounded-full mx-auto mb-6"></div>
              <div className="h-8 bg-gray-300 rounded mb-4 w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-300 rounded mb-6 w-1/2 mx-auto"></div>
              <div className="h-48 bg-gray-300 rounded mb-6"></div>
              <div className="h-10 bg-gray-300 rounded w-48 mx-auto"></div>
            </div>
          </Card>
        </div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  )
}