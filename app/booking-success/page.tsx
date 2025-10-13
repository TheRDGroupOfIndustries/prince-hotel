
"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/base/card"
import { CheckCircle, Download, Mail } from 'lucide-react'

export default function BookingSuccess() {
  const searchParams = useSearchParams()
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  useEffect(() => {
    // You can fetch booking details from API or pass via query params
    const bookingId = searchParams.get('bookingId')
    if (bookingId) {
      // Fetch booking details
    }
  }, [searchParams])

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
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-semibold">BK123456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hotel:</span>
                <span>Hotel Prince Diamond Varanasi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span>Mon 13 Oct 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span>Wed 15 Oct 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold">₹5,820</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Button className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Invoice
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Resend Email
            </Button> */}
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}