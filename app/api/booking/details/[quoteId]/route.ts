// app/api/booking/details/[quoteId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Quote from "@/models/quote";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ quoteId: string }> } // Change to Promise
) {
  const { quoteId } = await context.params; // Await the params

  if (!quoteId || !mongoose.Types.ObjectId.isValid(quoteId)) {
    return NextResponse.json({ success: false, error: "Invalid Quote ID" }, { status: 400 });
  }

  await dbConnect();

  try {
    const quote = await Quote.findById(quoteId);

    if (!quote) {
      return NextResponse.json(
        { success: false, error: "Booking session expired or not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, details: quote });
  } catch (error) {
    console.error("Error fetching quote details:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}