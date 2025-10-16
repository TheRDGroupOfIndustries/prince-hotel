import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Quote from '@/models/quote';
import { Room } from '@/models/room';

// Pricing constants (should ideally be in a shared config file)
const PRICE_EXTRA_ADULT = 300;
const PRICE_BREAKFAST_CP = 150;
const PRICE_BREAKFAST_AP = 150;
const PRICE_DINNER_AP = 400;

export async function POST(request: Request) {
  await dbConnect();

  try {
    // 1. Destructure ALL fields including the dynamic price
    const { 
      roomId, 
      adults, 
      children, 
      mealPlan, 
      numberOfRooms, 
      basePrice, // ← This is the dynamic/base price from frontend
      isDynamicPricing, // ← Optional: for tracking
      checkInDate, // ← Optional: for reference
      checkOutDate // ← Optional: for reference
    } = await request.json();

    // 2. Validate that essential data was sent from the client
    if (!roomId || !adults || !mealPlan || !numberOfRooms || !basePrice) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required booking information.' 
      }, { status: 400 });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return NextResponse.json({ 
        success: false, 
        error: 'Room not found' 
      }, { status: 404 });
    }

    // 3. Add a server-side inventory check (using dynamic inventory if available)
    // You might want to enhance this to check dynamic pricing inventory too
    if (room.inventory < numberOfRooms) {
      return NextResponse.json({ 
        success: false, 
        error: `Not enough rooms available. Only ${room.inventory} left.` 
      }, { status: 409 });
    }
    
    // 4. USE THE basePrice FROM FRONTEND (which includes dynamic pricing)
    // Instead of room.basePrice
    const totalBasePrice = numberOfRooms * basePrice;

    let extraAdults = 0;
    if (adults > 2) {
      const adultsAfterBase = adults - 2;
      const fullGroups = Math.floor(adultsAfterBase / 4);
      const remainder = adultsAfterBase % 4;
      extraAdults = fullGroups * 2 + Math.min(remainder, 2);
    }
    const extraAdultsCost = extraAdults * PRICE_EXTRA_ADULT;
    
    const chargeableChildrenForStay = children.filter((c: { age: number }) => c.age >= 10).length;
    const extraChildrenStayCost = chargeableChildrenForStay * PRICE_EXTRA_ADULT;
    
    let breakfastCost = 0;
    let dinnerCost = 0;
    const chargeableChildrenForMeals = children.filter((c: { age: number }) => c.age >= 10 && c.age <= 17).length;
    const numChargeableForMeals = adults + chargeableChildrenForMeals;

    if (mealPlan === "CP") {
      breakfastCost = numChargeableForMeals * PRICE_BREAKFAST_CP;
    } else if (mealPlan === "AP") {
      breakfastCost = numChargeableForMeals * PRICE_BREAKFAST_AP;
      dinnerCost = numChargeableForMeals * PRICE_DINNER_AP;
    }

    const totalPrice = totalBasePrice + extraAdultsCost + extraChildrenStayCost + breakfastCost + dinnerCost;

    const priceBreakdown = { 
      basePrice: totalBasePrice, 
      perRoomBasePrice: basePrice, // ← Store the per-room price used
      originalBasePrice: room.basePrice, // ← Store original for reference
      isDynamicPricing: isDynamicPricing || false, // ← Track if dynamic pricing was used
      extraAdults, 
      extraAdultsCost, 
      chargeableChildrenForStay, 
      extraChildrenStayCost, 
      breakfastCost, 
      dinnerCost,
      numChargeableForMeals, 
      totalPrice 
    };

    // Create and save the new quote with the validated numberOfRooms
    const newQuote = new Quote({
      roomId,
      roomName: room.name,
      numberOfRooms,
      selections: { adults, children, mealPlan },
      priceBreakdown,
      // Optional: store date info for reference
      ...(checkInDate && { checkInDate: new Date(checkInDate) }),
      ...(checkOutDate && { checkOutDate: new Date(checkOutDate) }),
    });
    await newQuote.save();

    return NextResponse.json({ success: true, quoteId: newQuote._id });
  } catch (error) {
    console.error('Error initiating booking:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Server error occurred while creating booking quote.' 
    }, { status: 500 });
  }
}