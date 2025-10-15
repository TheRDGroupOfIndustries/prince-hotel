"use client"

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/base/card"
import { Input } from "@/components/base/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, differenceInDays, addDays } from 'date-fns'
import { CalendarIcon, Mail, Phone, Loader2, Clock } from 'lucide-react'

// --- Type Definitions ---
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface QuoteData {
  roomName: string;
  numberOfRooms: number;
  selections: {
    adults: number;
    children: { age: number }[];
    mealPlan: 'EP' | 'CP';
  };
  priceBreakdown: any;
  createdAt: string;
}

interface Guest {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
}

interface PaymentSuccessData {
  bookingId: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
  roomName: string;
  guests: Guest[];
  email: string;
  phone: string;
}

const formatTime = (seconds: number) => {
  if (seconds < 0) seconds = 0;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

// Inner component that uses useSearchParams
function BookingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date>(() => new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date>(() => addDays(new Date(), 2));
  
  const [primaryGuest, setPrimaryGuest] = useState({ email: '', phone: '' });
  const [guests, setGuests] = useState<Guest[]>([]);
  
  const [totalNights, setTotalNights] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const quoteId = searchParams.get('quoteId');
    if (quoteId) {
      fetch(`/api/booking/details/${quoteId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setQuoteData(data.details);
            setGuests(Array.from({ length: data.details.selections.adults }, (_, i) => ({
              id: `guest-${i + 1}`,
              title: 'Mr',
              firstName: '',
              lastName: ''
            })));
            
            const createdAt = new Date(data.details.createdAt).getTime();
            const expiresAt = createdAt + (15 * 60 * 1000); // 15 minutes
            const now = Date.now();
            const initialSecondsLeft = Math.round((expiresAt - now) / 1000);
            setTimeLeft(Math.max(0, initialSecondsLeft));

          } else {
            alert(data.error || 'Booking session has expired. Please select a room again.');
            router.push('/');
          }
        });
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nights = differenceInDays(checkOutDate, checkInDate);
      setTotalNights(nights > 0 ? nights : 1);
    }
  }, [checkInDate, checkOutDate]);

  const finalPriceSummary = useMemo(() => {
    if (!quoteData) return null;
    const breakdown = quoteData.priceBreakdown;
    
    const basePriceTotal = (breakdown.basePrice || 0) * totalNights;
    const extraAdultsCostTotal = (breakdown.extraAdultsCost || 0) * totalNights;
    const extraChildrenStayCostTotal = (breakdown.extraChildrenStayCost || 0) * totalNights;
    const breakfastCostTotal = (breakdown.breakfastCost || 0) * totalNights;
    
    const subTotal = basePriceTotal + extraAdultsCostTotal + extraChildrenStayCostTotal + breakfastCostTotal;
    const taxes = subTotal * 0.05; // 5% GST
    const finalTotal = subTotal + taxes;

    return { 
      basePriceTotal,
      extraAdultsCostTotal,
      extraChildrenStayCostTotal,
      breakfastCostTotal,
      subTotal, 
      taxes, 
      finalTotal 
    };
  }, [quoteData, totalNights]);

  const updateGuest = (id: string, field: keyof Guest, value: string) => {
    setGuests(guests.map(guest => 
      guest.id === id ? { ...guest, [field]: value } : guest
    ));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const generateBookingId = () => {
    return 'BK' + Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handlePayNow = async () => {
    const quoteId = searchParams.get('quoteId');
    if (!quoteData || !finalPriceSummary || !quoteId) return;

    setIsProcessing(true);

    try {
      await loadRazorpayScript();
      
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quoteId,
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
          nights: totalNights,
          guests: guests.map(g => ({ ...g, email: primaryGuest.email, phone: primaryGuest.phone })),
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const bookingId = generateBookingId();
      const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

      const successData: PaymentSuccessData = {
        bookingId,
        checkIn: format(checkInDate, 'EEE d MMM yyyy'),
        checkOut: format(checkOutDate, 'EEE d MMM yyyy'),
        totalAmount: fmt.format(finalPriceSummary.finalTotal),
        roomName: quoteData.roomName,
        guests: guests,
        email: primaryGuest.email,
        phone: primaryGuest.phone
      };

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Hotel Prince Diamond Varanasi',
        description: `Booking for ${quoteData.roomName}`,
        order_id: orderData.order.id,
        handler: async function (response: any) {
          const verificationResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: JSON.stringify(successData) // Pass booking data to backend
            }),
          });
          const verificationData = await verificationResponse.json();
          if (verificationData.success) {
            // Pass all details to booking success page via query params
            const params = new URLSearchParams({
              bookingId: successData.bookingId,
              checkIn: successData.checkIn,
              checkOut: successData.checkOut,
              totalAmount: successData.totalAmount.replace('₹', '').replace(',', ''),
              roomName: encodeURIComponent(successData.roomName),
              email: encodeURIComponent(successData.email),
              phone: encodeURIComponent(successData.phone),
              guests: guests.length.toString(),
              nights: totalNights.toString()
            });
            window.location.href = `/booking-success?${params.toString()}`;
          } else {
            alert('Payment verification failed. Please contact support.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${guests[0]?.firstName} ${guests[0]?.lastName}`,
          email: primaryGuest.email,
          contact: primaryGuest.phone,
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
  };
  
  const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

  if (!quoteData || !finalPriceSummary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
          <div className="text-lg font-semibold text-gray-600 mt-4">Loading booking details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Complete Your Booking</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Select Your Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkin">Check-in Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkInDate ? format(checkInDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={checkInDate} onSelect={(date) => date && setCheckInDate(date)} disabled={(date) => date < addDays(new Date(), -1)} initialFocus/>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout">Check-out Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOutDate ? format(checkOutDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={checkOutDate} onSelect={(date) => date && setCheckOutDate(date)} disabled={(date) => date <= checkInDate} initialFocus/>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Guest Details</h3>
              <div className="space-y-6">
                {guests.map((guest, index) => (
                  <div key={guest.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Adult {index + 1} {index === 0 && '(Primary)'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${guest.id}`}>Title</Label>
                        <Select value={guest.title} onValueChange={(value) => updateGuest(guest.id, 'title', value)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mr">Mr</SelectItem>
                            <SelectItem value="Ms">Ms</SelectItem>
                            <SelectItem value="Mrs">Mrs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-3 grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`firstName-${guest.id}`}>First Name</Label>
                          <Input id={`firstName-${guest.id}`} type="text" value={guest.firstName} onChange={(e) => updateGuest(guest.id, 'firstName', e.target.value)} placeholder="First Name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`lastName-${guest.id}`}>Last Name</Label>
                          <Input id={`lastName-${guest.id}`} type="text" value={guest.lastName} onChange={(e) => updateGuest(guest.id, 'lastName', e.target.value)} placeholder="Last Name" />
                        </div>
                      </div>
                    </div>
                    {index === 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="email"><Mail className="w-4 h-4 inline mr-2" /> Email Address</Label>
                          <Input id="email" type="email" value={primaryGuest.email} onChange={(e) => setPrimaryGuest({...primaryGuest, email: e.target.value})} placeholder="email@example.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone"><Phone className="w-4 h-4 inline mr-2" /> Mobile Number</Label>
                          <Input id="phone" type="tel" value={primaryGuest.phone} onChange={(e) => setPrimaryGuest({...primaryGuest, phone: e.target.value})} placeholder="+91 " />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 sticky top-6">
              <div className={`mb-4 p-3 rounded-md text-center ${timeLeft < 300 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                <div className="flex items-center justify-center gap-2">
                  <Clock size={18} />
                  {timeLeft > 0 ? (
                    <p className="font-semibold">
                      Session expires in: {formatTime(timeLeft)}
                    </p>
                  ) : (
                    <p className="font-semibold">Booking session expired</p>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4">Price Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price ({totalNights} nights)</span>
                  <span className="font-semibold">{fmt.format(finalPriceSummary.basePriceTotal)}</span>
                </div>
                {finalPriceSummary.extraAdultsCostTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Extra Adult Charges</span>
                    <span className="font-semibold">{fmt.format(finalPriceSummary.extraAdultsCostTotal)}</span>
                  </div>
                )}
                {finalPriceSummary.extraChildrenStayCostTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Extra Child (10+) Charges</span>
                    <span className="font-semibold">{fmt.format(finalPriceSummary.extraChildrenStayCostTotal)}</span>
                  </div>
                )}
                {quoteData.selections.mealPlan === 'CP' && finalPriceSummary.breakfastCostTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Breakfast Cost</span>
                    <span className="font-semibold">{fmt.format(finalPriceSummary.breakfastCostTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees (5%)</span>
                  <span className="font-semibold">{fmt.format(finalPriceSummary.taxes)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-600">{fmt.format(finalPriceSummary.finalTotal)}</span>
                  </div>
                </div>
              </div>
              <Button 
                className="w-full mt-6 py-3 text-lg"
                onClick={handlePayNow}
                disabled={!guests[0]?.firstName || !guests[0]?.lastName || !primaryGuest.email || !primaryGuest.phone || isProcessing || timeLeft <= 0}
              >
                {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : 'Pay Now'}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
          <div className="text-lg font-semibold text-gray-600 mt-4">Loading booking page...</div>
        </div>
      </div>
    }>
      <BookingPageContent />
    </Suspense>
  );
}