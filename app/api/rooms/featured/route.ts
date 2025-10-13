import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import { Room } from "@/models/room"

export async function GET() {
  await dbConnect()

  try {
    // Fetch all rooms with their plans
    const rooms = await Room.find({}).lean().sort({ createdAt: -1 })

    if (!rooms.length) {
      return NextResponse.json(
        { error: "No rooms found" },
        { status: 404 }
      )
    }

    // 1️⃣ Try to find a room with a super package
    let featuredRoom = rooms.find((room: any) =>
      room.plans?.some((plan: any) => plan.isSuperPackage)
    )

    // 2️⃣ If none, pick the first "breakfast" plan
    if (!featuredRoom) {
      featuredRoom = rooms.find((room: any) =>
        room.plans?.some((plan: any) => plan.group === "breakfast")
      )
    }

    // 3️⃣ Fallback to first room
    if (!featuredRoom) {
      featuredRoom = rooms[0]
    }

    // Select the plan to feature
    const featuredPlan =
      featuredRoom.plans?.find((plan: any) => plan.isSuperPackage) ||
      featuredRoom.plans?.find((plan: any) => plan.group === "breakfast") ||
      featuredRoom.plans?.[0]

    return NextResponse.json({
      data: {
        room: featuredRoom,
        plan: featuredPlan,
      },
    })
  } catch (error: any) {
    console.error("Error fetching featured room:", error)
    return NextResponse.json(
      { error: "Failed to fetch featured room" },
      { status: 500 }
    )
  }
}
