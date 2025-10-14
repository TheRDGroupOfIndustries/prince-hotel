import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Quote from '@/models/quote';
import { Room } from '@/models/room';

const PRICE_EXTRA_ADULT = 300;
const PRICE_BREAKFAST = 300;

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { roomId, adults, children, mealPlan } = await request.json();

    const room = await Room.findById(roomId);
    if (!room) {
      return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
    }

    // ✨ MODIFIED LOGIC: Find the base price from the "room-only" plan
    const roomOnlyPlan = room.plans.find(plan => plan.group === 'room-only');

    // Add error handling in case a room is missing a "room-only" plan
    if (!roomOnlyPlan) {
        return NextResponse.json({ success: false, error: 'Room base price is not configured correctly.' }, { status: 500 });
    }

    const basePrice = roomOnlyPlan.price;
    // --- End of modification ---

    // Recalculate the total price securely on the server
    const extraAdults = adults - 2;
    const extraAdultsCost = extraAdults > 0 ? extraAdults * PRICE_EXTRA_ADULT : 0;
    const chargeableChildrenForStay = children.filter((c: { age: number }) => c.age >= 10).length;
    const extraChildrenStayCost = chargeableChildrenForStay * PRICE_EXTRA_ADULT;
    
    let breakfastCost = 0;
    let numChargeableBreakfasts = 0;
    if (mealPlan === "CP") {
      const chargeableChildrenForBreakfast = children.filter((c: { age: number }) => c.age >= 10 && c.age <= 17).length;
      numChargeableBreakfasts = adults + chargeableChildrenForBreakfast;
      breakfastCost = numChargeableBreakfasts * PRICE_BREAKFAST;
    }
    const totalPrice = basePrice + extraAdultsCost + extraChildrenStayCost + breakfastCost;

    const priceBreakdown = { basePrice, extraAdults, extraAdultsCost, chargeableChildrenForStay, extraChildrenStayCost, breakfastCost, numChargeableBreakfasts, totalPrice };

    // Create and save the new quote
    const newQuote = new Quote({
      roomId,
      roomName: room.name,
      selections: { adults, children, mealPlan },
      priceBreakdown,
    });
    await newQuote.save();

    // Return the unique quote ID to the client
    return NextResponse.json({ success: true, quoteId: newQuote._id });
  } catch (error) {
    console.error('Error initiating booking:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}