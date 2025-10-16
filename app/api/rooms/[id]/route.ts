import { NextResponse, type NextRequest } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Room, type IRoom } from "@/models/room"
import { Types } from "mongoose"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const isObjectId = Types.ObjectId.isValid(id)
  const room = isObjectId ? await Room.findById(id).lean() : await Room.findOne({ slug: id }).lean()
  if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 })
  return NextResponse.json({ data: room })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  let payload: Partial<IRoom>
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { id } = await params;
  const query = Types.ObjectId.isValid(id) ? { _id: id } : { slug: id }

  try {
    // Clean up dynamic pricing data before updating
    if (payload.dynamicPricing && Array.isArray(payload.dynamicPricing)) {
      payload.dynamicPricing = payload.dynamicPricing.map(dp => {
        const cleanedDp: {
          startDate: Date;
          endDate: Date;
          price: number;
          inventory: number;
          enabled: boolean;
          _id?: Types.ObjectId;
        } = {
          startDate: new Date(dp.startDate),
          endDate: new Date(dp.endDate),
          price: dp.price,
          inventory: dp.inventory,
          enabled: dp.enabled !== false,
        }
        
        // Only include _id if it's a valid MongoDB ObjectId
        if (dp._id && Types.ObjectId.isValid(dp._id as string)) {
          cleanedDp._id = new Types.ObjectId(dp._id as string)
        }
        
        return cleanedDp
      })
    }

    // Use findOneAndUpdate with $set to properly update nested arrays
    const updateData: Record<string, unknown> = {}
    
    // Set all top-level fields
    Object.keys(payload).forEach(key => {
      if (key !== 'dynamicPricing' && key !== 'plans') {
        updateData[key] = (payload as Record<string, unknown>)[key]
      }
    })
    
    // Set nested arrays separately
    if (payload.dynamicPricing) {
      updateData.dynamicPricing = payload.dynamicPricing
    }
    if (payload.plans) {
      updateData.plans = payload.plans
    }

    const updated = await Room.findOneAndUpdate(
      query, 
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).lean()

    if (!updated) return NextResponse.json({ error: "Room not found" }, { status: 404 })
    return NextResponse.json({ data: updated })
  } catch (err: unknown) {
    let msg = "Failed to update room";

    if (err instanceof Error) {
      msg = err.message;
    }

    // Handle MongoDB duplicate key error
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: number }).code === 11000
    ) {
      msg = "Duplicate slug. Provide a unique slug.";
    }

    console.error("Update error:", err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params;
  const query = Types.ObjectId.isValid(id) ? { _id: id } : { slug: id }

  const removed = await Room.findOneAndDelete(query).lean()
  if (!removed) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 })
  }
  return NextResponse.json({ data: removed })
}