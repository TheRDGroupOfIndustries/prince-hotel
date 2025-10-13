"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/base/card"
import { Input } from "@/components/base/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, differenceInDays } from 'date-fns'
import { CalendarIcon, Plus, Minus, Mail, Phone, Star, CheckCircle, Info, Loader2 } from 'lucide-react'

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Guest {
  id: string
  title: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface BookingData {
  roomName: string
  plan: string
  price: number
  originalPrice?: number
  currency: string
  perks: string[]
  cancellationPolicy: string
  roomPhoto?: string
  roomAmenities?: string[]
}

export default function BookingPage() {
  const searchParams = useSearchParams()
  const [bookingData, setBookingData] = useState<BookingData | null>(null)
  const [checkInDate, setCheckInDate] = useState<Date>(() => new Date(2025, 9, 13))
  const [checkOutDate, setCheckOutDate] = useState<Date>(() => new Date(2025, 9, 15))
  const [guests, setGuests] = useState<Guest[]>([
    {
      id: '1',
      title: 'Mr',
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  ])
  const [totalNights, setTotalNights] = useState(2)
  const [totalPrice, setTotalPrice] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const dataParam = searchParams.get('data')
    
    if (dataParam) {
      try {
        const data = JSON.parse(dataParam)
        setBookingData(data)
        setTotalPrice(data.price * totalNights)
      } catch (error) {
        console.error('Error parsing booking data:', error)
      }
    }
  }, [searchParams, totalNights])

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nights = differenceInDays(checkOutDate, checkInDate)
      setTotalNights(nights > 0 ? nights : 1)
    }
  }, [checkInDate, checkOutDate])

  useEffect(() => {
    if (bookingData) {
      setTotalPrice(bookingData.price * totalNights)
    }
  }, [totalNights, bookingData])

  const addGuest = () => {
    if (guests.length < 4) {
      setGuests([...guests, {
        id: Date.now().toString(),
        title: 'Mr',
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
      }])
    }
  }

  const removeGuest = (id: string) => {
    if (guests.length > 1) {
      setGuests(guests.filter(guest => guest.id !== id))
    }
  }

  const updateGuest = (id: string, field: keyof Guest, value: string) => {
    setGuests(guests.map(guest => 
      guest.id === id ? { ...guest, [field]: value } : guest
    ))
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  const handlePayNow = async () => {
    if (!bookingData) return;

    setIsProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Razorpay SDK failed to load. Please check your connection.');
        setIsProcessing(false);
        return;
      }

      // Create order
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hotelName: "Hotel Prince Diamond Varanasi",
          roomName: bookingData.roomName,
          plan: bookingData.plan,
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
          nights: totalNights,
          guests: guests.map(guest => ({
            title: guest.title,
            firstName: guest.firstName,
            lastName: guest.lastName,
            email: guest.email,
            phone: guest.phone
          })),
          roomPrice: bookingData.price * totalNights,
          taxes: bookingData.price * totalNights * 0.18,
          totalAmount: bookingData.price * totalNights * 1.18,
          currency: bookingData.currency
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

    
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Hotel Prince Diamond Varanasi',
        description: `Booking for ${bookingData.roomName} - ${bookingData.plan}`,
        image: '/logo.png',
        order_id: orderData.order.id,
        handler: async function (response: any) {
          // Verify payment
          const verificationResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verificationData = await verificationResponse.json();

          if (verificationData.success) {
           await fetch('/api/send-mail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: guests[0].firstName + " " + guests[0].lastName,
        email: guests[0].email,
        phone: guests[0].phone,
        roomName: bookingData.roomName,
        plan: bookingData.plan,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        nights: totalNights,
        guests,
        totalAmount: bookingData.price * totalNights * 1.18,
        currency: bookingData.currency,
        orderId: orderData.order.id,
        paymentId: response.razorpay_payment_id
      }),
    });
            // Redirect to success page or home
            window.location.href = '/booking-success';
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: `${guests[0].firstName} ${guests[0].lastName}`,
          email: guests[0].email,
          contact: guests[0].phone,
        },
        notes: {
          address: "Hotel Prince Diamond Varanasi",
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  }

  const fmt = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: bookingData?.currency || "INR",
  })

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-600">Loading booking details...</div>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
          <p className="text-gray-600 mt-2">Hotel Prince Diamond Varanasi</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hotel & Room Info */}
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Hotel Prince Diamond Varanasi</h2>
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">
                    Building No. 217/3, Dakshini Kakarmatta, DLW Road Kakarmatta Varanasi Uttar Pradesh 221010, Varanasi, India
                  </p>
                </div>
                <div className="w-20 h-20 rounded-lg overflow-hidden">
                  <img 
                    src={bookingData.roomPhoto || "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/202407231708234688-d10e7d2d-5aa2-4d12-bc5a-542842fe52c2.jpg"} 
                    alt="Hotel" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Check-in/Check-out */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">CHECK IN</p>
                  <p className="font-semibold text-gray-900">
                    {format(checkInDate, 'EEE')} <span className="font-bold">{format(checkInDate, 'dd MMM')}</span> {format(checkInDate, 'yyyy')}
                  </p>
                  <p className="text-sm text-gray-600">11 AM</p>
                </div>
                <div className="text-center flex items-center justify-center">
                  <p className="text-sm text-gray-600">{totalNights} Night{totalNights > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CHECK OUT</p>
                  <p className="font-semibold text-gray-900">
                    {format(checkOutDate, 'EEE')} <span className="font-bold">{format(checkOutDate, 'dd MMM')}</span> {format(checkOutDate, 'yyyy')}
                  </p>
                  <p className="text-sm text-gray-600">12 PM</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-semibold text-gray-900">
                  {totalNights} Nights | {guests.length} Adult{guests.length > 1 ? 's' : ''} | 1 Room
                </p>
              </div>
            </Card>

            {/* Room Details */}
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{bookingData.roomName}</h3>
                  <p className="text-gray-600 mt-1">{guests.length} Adults</p>
                  
                  {/* Plan Details */}
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">{bookingData.plan}</h4>
                    <ul className="space-y-2">
                      {bookingData.perks.map((perk, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="text-green-600 w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{perk}</span>
                        </li>
                      ))}
                      {bookingData.cancellationPolicy && (
                        <li className="flex items-start gap-2 text-sm text-gray-500">
                          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{bookingData.cancellationPolicy}</span>
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Room Amenities */}
                  {bookingData.roomAmenities && bookingData.roomAmenities.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Room Amenities</h4>
                      <ul className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                        {bookingData.roomAmenities.slice(0, 6).map((amenity, index) => (
                          <li key={index}>• {amenity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button className="text-blue-600 font-semibold">See Inclusions</button>
              </div>
            </Card>

            {/* Date Selection */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Select Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkin">Check-in Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkInDate ? format(checkInDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkInDate}
                        onSelect={(date) => date && setCheckInDate(date)}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout">Check-out Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOutDate ? format(checkOutDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={checkOutDate}
                        onSelect={(date) => date && setCheckOutDate(date)}
                        disabled={(date) => date <= checkInDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </Card>

            {/* Guest Details */}
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Guest Details</h3>
                <Button
                  onClick={addGuest}
                  disabled={guests.length >= 4}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Guest
                </Button>
              </div>

              <div className="space-y-6">
                {guests.map((guest, index) => (
                  <div key={guest.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold text-gray-900">
                        Guest {index + 1} {index === 0 && '(Primary)'}
                      </h4>
                      {index > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGuest(guest.id)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${guest.id}`}>Title</Label>
                        <Select
                          value={guest.title}
                          onValueChange={(value) => updateGuest(guest.id, 'title', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mr">Mr</SelectItem>
                            <SelectItem value="Ms">Ms</SelectItem>
                            <SelectItem value="Mrs">Mrs</SelectItem>
                            <SelectItem value="Dr">Dr</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-3 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`firstName-${guest.id}`}>First Name</Label>
                          <Input
                            id={`firstName-${guest.id}`}
                            type="text"
                            value={guest.firstName}
                            onChange={(e) => updateGuest(guest.id, 'firstName', e.target.value)}
                            placeholder="First Name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`lastName-${guest.id}`}>Last Name</Label>
                          <Input
                            id={`lastName-${guest.id}`}
                            type="text"
                            value={guest.lastName}
                            onChange={(e) => updateGuest(guest.id, 'lastName', e.target.value)}
                            placeholder="Last Name"
                          />
                        </div>
                      </div>
                    </div>

                    {index === 0 && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">
                              <Mail className="w-4 h-4 inline mr-2" />
                              Email Address
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={guest.email}
                              onChange={(e) => updateGuest(guest.id, 'email', e.target.value)}
                              placeholder="email@example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">
                              <Phone className="w-4 h-4 inline mr-2" />
                              Mobile Number
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={guest.phone}
                              onChange={(e) => updateGuest(guest.id, 'phone', e.target.value)}
                              placeholder="+91 "
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Label className="flex items-center">
                            <input type="checkbox" className="rounded border-gray-300 mr-2" />
                            <span className="text-sm text-gray-700">Enter GST Details (Optional)</span>
                          </Label>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Price Summary */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Price Summary</h3>
              
              <div className="space-y-3">
                {bookingData.originalPrice && bookingData.originalPrice > bookingData.price && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Original Price</span>
                    <span className="text-sm text-gray-400 line-through">{fmt.format(bookingData.originalPrice * totalNights)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Price ({totalNights} nights)</span>
                  <span className="font-semibold">{fmt.format(bookingData.price * totalNights)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees (18%)</span>
                  <span className="font-semibold">{fmt.format(bookingData.price * totalNights * 0.18)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-600">
                      {fmt.format(bookingData.price * totalNights * 1.18)}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full mt-6 py-3 text-lg"
                onClick={handlePayNow}
                disabled={!guests[0].firstName || !guests[0].lastName || !guests[0].email || !guests[0].phone || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </Button>

              {/* Important Information */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Important Information</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Unmarried couples are not allowed</li>
                  <li>• Local IDs not allowed</li>
                  <li>• Primary Guest should be at least 18 years of age</li>
                  <li>• Passport, Aadhaar, Driving License and Govt. ID are accepted as ID proof(s)</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}