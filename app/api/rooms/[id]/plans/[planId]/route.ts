import { NextResponse, type NextRequest } from "next/server"
import dbConnect from "@/lib/mongodb";
import { Room } from "@/models/room"
import { Types } from "mongoose"

export async function DELETE(
  _req: NextRequest, 
  { params }: { params: Promise<{ id: string; planId: string }> } // Change here - params is now Promise
) {
  await dbConnect()
  const { id, planId } = await params // Change here - await the params
  
  const roomQuery = Types.ObjectId.isValid(id) ? { _id: id } : { slug: id }
  const pullId = Types.ObjectId.isValid(planId) ? new Types.ObjectId(planId) : planId

  const updated = await Room.findOneAndUpdate(
    roomQuery,
    { $pull: { ratePlans: { _id: pullId } } },
    { new: true },
  ).lean()

  if (!updated) {
    return NextResponse.json({ error: "Room or plan not found" }, { status: 404 })
  }
  return NextResponse.json({ data: updated })
}