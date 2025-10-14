import { NextResponse, type NextRequest } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Room, type IRoom } from "@/models/room"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")
  const group = searchParams.get("group")

  await dbConnect()

  // Use a proper filter type instead of any
  const filter: Record<string, unknown> = {}

  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { slug: { $regex: q, $options: "i" } },
      { view: { $regex: q, $options: "i" } },
      { bedType: { $regex: q, $options: "i" } },
    ]
  }

  if (group === "room-only" || group === "breakfast") {
    filter["plans.group"] = group
  }

  const rooms = await Room.find(filter).sort({ createdAt: -1 }).lean()
  return NextResponse.json({ data: rooms })
}

export async function POST(req: NextRequest) {
  await dbConnect()

  let payload: IRoom
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // Minimal validation
  if (!payload?.name || !payload?.slug) {
    return NextResponse.json({ error: "name and slug are required" }, { status: 400 })
  }
  if (!Array.isArray(payload.photos) || payload.photos.length === 0) {
    return NextResponse.json({ error: "At least one photo is required" }, { status: 400 })
  }

  try {
    const created = await Room.create(payload)
    return NextResponse.json({ data: created }, { status: 201 })
  } catch (err) {
    // Use unknown type for error and narrow it
    const error = err as { code?: number; message?: string }
    const msg =
      error?.code === 11000
        ? "Duplicate slug. Provide a unique slug."
        : error?.message || "Failed to create room"
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
