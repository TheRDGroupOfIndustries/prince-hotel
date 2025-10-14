"use client"

import useSWR from "swr"
import { RoomBookingCard } from "@/components/hotel/room-booking-card"

// Update ApiRoom to include all the new fields
type ApiPlan = {
  group: "room-only" | "breakfast"
  price: number
}

type ApiRoom = {
  _id: string
  name: string
  amenityBullets: string[]
  photos: string[]
  plans: ApiPlan[]
  view?: string
  bedType?: string
  sizeSqft?: number
  bathrooms?: number
}

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((j) => j.data)

export default function RoomsFromApi() {
  const { data, error, isLoading } = useSWR<ApiRoom[]>("/api/rooms", fetcher)

  if (isLoading) return <div className="text-sm text-muted-foreground p-4">Loading rooms…</div>
  if (error) return <div className="text-sm text-red-600 p-4">Failed to load rooms.</div>
  if (!data?.length) return <div className="text-sm text-muted-foreground p-4">No rooms added yet.</div>

  return (
    <div className="space-y-6">
      {data.map((room) => {
        const roomOnlyPlan = room.plans.find(p => p.group === 'room-only');
        if (!roomOnlyPlan) return null;

        // Pass all the necessary data, including the new details
        const roomData = {
          _id: room._id,
          name: room.name,
          photos: room.photos,
          amenityBullets: room.amenityBullets,
          basePrice: roomOnlyPlan.price,
          view: room.view,
          bedType: room.bedType,
          sizeSqft: room.sizeSqft,
          bathrooms: room.bathrooms,
        }
        
        return <RoomBookingCard key={room._id} room={roomData} />
      })}
    </div>
  )
}