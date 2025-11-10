"use client"

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/base/card"
import { Input } from "@/components/base/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, differenceInDays, addDays } from 'date-fns'
import {  Mail, Phone, Loader2, Clock, UserPlus, X } from 'lucide-react'
import { useDateContext } from "@/app/context/dateContext"
import { facebookEvents } from '@/lib/facebookPixel'
// --- Type Definitions ---
interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayWindow {
  Razorpay: new (options: RazorpayOptions) => {
    open: () => void;
  };
}

declare global {
  interface Window extends RazorpayWindow {
    isRazorpayLoaded?: boolean;
  }
}

interface PriceBreakdown {
  basePrice?: number;
  perRoomBasePrice?: number;
  originalBasePrice?: number;
  isDynamicPricing?: boolean;
  extraAdults?: number; 
  extraAdultsCost?: number;
  chargeableChildrenForStay?: number; 
  extraChildrenStayCost?: number;
  breakfastCost?: number;
  dinnerCost?: number;
  numChargeableForMeals?: number;
  totalPrice?: number;
}

interface QuoteData {
  roomName: string;
  numberOfRooms: number;
  selections: {
    adults: number;
    children: { age: number }[];
    mealPlan: 'EP' | 'CP' | 'AP';
  };
  priceBreakdown: PriceBreakdown;
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

// Helper function to reset time to midnight for consistent date calculations
const resetTimeToMidnight = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

// Inner component that uses useSearchParams
function BookingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get dates from global context
  const { checkInDate: contextCheckIn, checkOutDate: contextCheckOut
    // , setCheckInDate, setCheckOutDate 
  } = useDateContext();
  
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  
  // Use context dates or fallback to defaults
  const [checkInDate, setLocalCheckInDate] = useState<Date>(() => 
    contextCheckIn || resetTimeToMidnight(new Date())
  );
  const [checkOutDate, setLocalCheckOutDate] = useState<Date>(() => 
    contextCheckOut || resetTimeToMidnight(addDays(new Date(), 2))
  );
  
  const [primaryGuest, setPrimaryGuest] = useState({ email: '', phone: '' });
  const [guests, setGuests] = useState<Guest[]>([
    {
      id: 'guest-1',
      title: 'Mr',
      firstName: '',
      lastName: ''
    }
  ]);
  
  const [totalNights, setTotalNights] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  // Sync local state with context when context changes
  useEffect(() => {
    if (contextCheckIn) {
      setLocalCheckInDate(resetTimeToMidnight(contextCheckIn));
    }
  }, [contextCheckIn]);

  useEffect(() => {
    if (contextCheckOut) {
      setLocalCheckOutDate(resetTimeToMidnight(contextCheckOut));
    }
  }, [contextCheckOut]);

  useEffect(() => {
    const quoteId = searchParams.get('quoteId');
    if (quoteId) {
      fetch(`/api/booking/details/${quoteId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setQuoteData(data.details);
             facebookEvents.viewContent(
            `Booking: ${data.details.roomName}`, 
            `quote-${quoteId}`,
            data.details.priceBreakdown.totalPrice
          )
            // Initialize with primary guest only
            setGuests([{
              id: 'guest-1',
              title: 'Mr',
              firstName: '',
              lastName: ''
            }]);

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

  // Fixed date calculation logic
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const start = resetTimeToMidnight(checkInDate);
      const end = resetTimeToMidnight(checkOutDate);
      
      const nights = differenceInDays(end, start);
      setTotalNights(nights > 0 ? nights : 1);
    }
  }, [checkInDate, checkOutDate]);

  // Fixed date change handlers - update both local state and global context
  // const handleCheckInChange = (date: Date | undefined) => {
  //   if (!date) return;
    
  //   const newCheckIn = resetTimeToMidnight(date);
  //   setLocalCheckInDate(newCheckIn);
  //   setCheckInDate(newCheckIn); // Update global context
    
  //   // If check-out is before or equal to new check-in, adjust check-out
  //   if (checkOutDate && newCheckIn >= checkOutDate) {
  //     const newCheckOut = resetTimeToMidnight(addDays(newCheckIn, 1));
  //     setLocalCheckOutDate(newCheckOut);
  //     setCheckOutDate(newCheckOut); // Update global context
  //   }
  // };

  // const handleCheckOutChange = (date: Date | undefined) => {
  //   if (!date) return;
    
  //   const newCheckOut = resetTimeToMidnight(date);
    
  //   // Ensure check-out is after check-in
  //   if (newCheckOut <= checkInDate) {
  //     const minCheckOut = resetTimeToMidnight(addDays(checkInDate, 1));
  //     setLocalCheckOutDate(minCheckOut);
  //     setCheckOutDate(minCheckOut); // Update global context
  //   } else {
  //     setLocalCheckOutDate(newCheckOut);
  //     setCheckOutDate(newCheckOut); // Update global context
  //   }
  // };

  const finalPriceSummary = useMemo(() => {
    if (!quoteData) return null;
    const breakdown = quoteData.priceBreakdown;
    
    // Use perRoomBasePrice if available (from dynamic pricing), otherwise use basePrice
    // This logic assumes perRoomBasePrice is the price for ONE room per night.
    const basePricePerNight = breakdown.perRoomBasePrice || breakdown.originalBasePrice || 0;
    
    const basePriceTotal = basePricePerNight * totalNights * (quoteData.numberOfRooms || 1);
    const extraAdultsCostTotal = (breakdown.extraAdultsCost || 0) * totalNights;
    const extraChildrenStayCostTotal = (breakdown.extraChildrenStayCost || 0) * totalNights;
    const breakfastCostTotal = (breakdown.breakfastCost || 0) * totalNights;
    const dinnerCostTotal = (breakdown.dinnerCost || 0) * totalNights;
    
    const subTotal = basePriceTotal + extraAdultsCostTotal + extraChildrenStayCostTotal + breakfastCostTotal + dinnerCostTotal;
    const taxes = subTotal * 0.05; // 5% GST
    const finalTotal = subTotal + taxes;

    return { 
      basePriceTotal,
      extraAdultsCostTotal,
      extraChildrenStayCostTotal,
      breakfastCostTotal,
      dinnerCostTotal,
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

  const addGuest = () => {
    const newGuest: Guest = {
      id: `guest-${Date.now()}`,
      title: 'Mr',
      firstName: '',
      lastName: ''
    };
    setGuests([...guests, newGuest]);
  };

  const removeGuest = (id: string) => {
    // Prevent removing the primary guest (first guest)
    if (id === 'guest-1') return;
    setGuests(guests.filter(guest => guest.id !== id));
  };

  const isPrimaryGuestValid = () => {
    const primary = guests[0];
    return primary?.firstName.trim() !== '' && 
           primary?.lastName.trim() !== '' && 
           primaryGuest.email.trim() !== '' && 
           primaryGuest.phone.trim() !== '';
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
     if (!finalPriceSummary) return;
     facebookEvents.initiateCheckout(finalPriceSummary.finalTotal)
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
          totalAmount: finalPriceSummary.finalTotal
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

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Hotel Prince Diamond Varanasi',
        description: `Booking for ${quoteData.roomName}`,
        order_id: orderData.order.id,
        handler: async function (response: RazorpayResponse) {
          const verificationResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: JSON.stringify(successData)
            }),
          });
          const verificationData = await verificationResponse.json();
          if (verificationData.success) {
             facebookEvents.purchase(finalPriceSummary.finalTotal, 'INR')
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

  // --- FIX APPLIED HERE ---
  // Provide fallback values for potentially undefined numbers
  const extraAdultsCount = quoteData.priceBreakdown.extraAdults ?? 0;
  const extraChildrenCount = quoteData.priceBreakdown.chargeableChildrenForStay ?? 0;
  const chargeableMeals = quoteData.priceBreakdown.numChargeableForMeals ?? 0;
  // --- END OF FIX ---

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Complete Your Booking</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Selected Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <div className="space-y-2">
                  <Label htmlFor="checkin">Check-in Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkInDate ? format(checkInDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar 
                        mode="single" 
                        selected={checkInDate} 
                        onSelect={handleCheckInChange} 
                        disabled={(date) => date < resetTimeToMidnight(new Date())} 
                        initialFocus
                      />
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
                      <Calendar 
                        mode="single" 
                        selected={checkOutDate} 
                        onSelect={handleCheckOutChange} 
                        disabled={(date) => date <= resetTimeToMidnight(checkInDate)} 
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div> */}
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800 text-center">
                  <strong>{totalNights} night{totalNights !== 1 ? 's' : ''}</strong> selected • 
                  Check-in: {format(checkInDate, 'EEE, MMM d')} • 
                  Check-out: {format(checkOutDate, 'EEE, MMM d')}
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Guest Details</h3>
                <Button 
                  variant="outline" 
                  onClick={addGuest}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Guest
                </Button>
              </div>
              <div className="space-y-6">
                {guests.map((guest, index) => (
                  <div key={guest.id} className="border border-gray-200 rounded-lg p-4 relative">
                    {/* Remove button for additional guests (not primary) */}
                    {index > 0 && (
                      <button
                        onClick={() => removeGuest(guest.id)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    
                    <h4 className="font-semibold text-gray-900 mb-4">
                      {index === 0 ? 'Primary Guest' : `Guest ${index + 1}`}
                      {index === 0 && <span className="text-sm text-red-500 ml-2">* Required</span>}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${guest.id}`}>
                          Title {index === 0 && <span className="text-red-500">*</span>}
                        </Label>
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
                          <Label htmlFor={`firstName-${guest.id}`}>
                            First Name {index === 0 && <span className="text-red-500">*</span>}
                          </Label>
                          <Input 
                            id={`firstName-${guest.id}`} 
                            type="text" 
                            value={guest.firstName} 
                            onChange={(e) => updateGuest(guest.id, 'firstName', e.target.value)} 
                            placeholder="First Name" 
                            required={index === 0}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`lastName-${guest.id}`}>
                            Last Name {index === 0 && <span className="text-red-500">*</span>}
                          </Label>
                          <Input 
                            id={`lastName-${guest.id}`} 
                            type="text" 
                            value={guest.lastName} 
                            onChange={(e) => updateGuest(guest.id, 'lastName', e.target.value)} 
                            placeholder="Last Name" 
                            required={index === 0}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Contact info only for primary guest */}
                    {index === 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            <Mail className="w-4 h-4 inline mr-2" /> 
                            Email Address <span className="text-red-500">*</span>
                          </Label>
                          <Input 
                            id="email" 
                            type="email" 
                            value={primaryGuest.email} 
                            onChange={(e) => setPrimaryGuest({...primaryGuest, email: e.target.value})} 
                            placeholder="email@example.com" 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            <Phone className="w-4 h-4 inline mr-2" /> 
                            Mobile Number <span className="text-red-500">*</span>
                          </Label>
                          <Input 
                            id="phone" 
                            type="tel" 
                            value={primaryGuest.phone} 
                            onChange={(e) => setPrimaryGuest({...primaryGuest, phone: e.target.value})} 
                            placeholder="+91 " 
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Helper text */}
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> Only primary guest information is required. Additional guests are optional.
                </p>
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

              {/* --- UPDATED PRICE SUMMARY --- */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">Price Summary</h3>
              <div className="space-y-3">
                
                {/* Room Charges */}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    Room Charges ({quoteData.numberOfRooms} Room{quoteData.numberOfRooms > 1 ? 's' : ''} x {totalNights} Night{totalNights > 1 ? 's' : ''})
                  </span>
                  <span className="text-sm font-semibold">{fmt.format(finalPriceSummary.basePriceTotal)}</span>
                </div>

                {/* Extra Adults */}
                {finalPriceSummary.extraAdultsCostTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Extra Adult ({extraAdultsCount} x {totalNights} Night{totalNights > 1 ? 's' : ''})
                    </span>
                    <span className="text-sm font-semibold">{fmt.format(finalPriceSummary.extraAdultsCostTotal)}</span>
                  </div>
                )}
                
                {/* Extra Children */}
                {finalPriceSummary.extraChildrenStayCostTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Extra Child ({extraChildrenCount} x {totalNights} Night{totalNights > 1 ? 's' : ''})
                    </span>
                    <span className="text-sm font-semibold">{fmt.format(finalPriceSummary.extraChildrenStayCostTotal)}</span>
                  </div>
                )}
                
                {/* Breakfast */}
                {finalPriceSummary.breakfastCostTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Breakfast ({chargeableMeals} Guest{chargeableMeals > 1 ? 's' : ''} x {totalNights} Night{totalNights > 1 ? 's' : ''})
                    </span>
                    <span className="text-sm font-semibold">{fmt.format(finalPriceSummary.breakfastCostTotal)}</span>
                  </div>
                )}
                
                {/* Dinner */}
                {finalPriceSummary.dinnerCostTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Dinner ({chargeableMeals} Guest{chargeableMeals > 1 ? 's' : ''} x {totalNights} Night{totalNights > 1 ? 's' : ''})
                    </span>
                    <span className="text-sm font-semibold">{fmt.format(finalPriceSummary.dinnerCostTotal)}</span>
                  </div>
                )}

                {/* --- Subtotal --- */}
                <div className="border-t border-dashed pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="text-gray-900">{fmt.format(finalPriceSummary.subTotal)}</span>
                  </div>
                </div>

                {/* Taxes */}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Taxes & Fees (5%)</span>
                  <span className="text-sm font-semibold">{fmt.format(finalPriceSummary.taxes)}</span>
                </div>
                
                {/* --- Total --- */}
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
                disabled={!isPrimaryGuestValid() || isProcessing || timeLeft <= 0}
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