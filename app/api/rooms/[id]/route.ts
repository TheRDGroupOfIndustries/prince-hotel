import { NextResponse, type NextRequest } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Room, type IRoom } from "@/models/room"
import { Types } from "mongoose"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params; // Await the params
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

  const { id } = await params; // Await the params
  const query = Types.ObjectId.isValid(id) ? { _id: id } : { slug: id }

  try {
    const updated = await Room.findOneAndUpdate(query, payload, {
      new: true,
      runValidators: true,
    }).lean()
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

  return NextResponse.json({ error: msg }, { status: 400 });
}

}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { id } = await params; // Await the params
  const query = Types.ObjectId.isValid(id) ? { _id: id } : { slug: id }

  const removed = await Room.findOneAndDelete(query).lean()
  if (!removed) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 })
  }
  return NextResponse.json({ data: removed })
}