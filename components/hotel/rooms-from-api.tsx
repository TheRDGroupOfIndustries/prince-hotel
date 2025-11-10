"use client"

import useSWR from "swr"
import { RoomBookingCard } from "@/components/hotel/room-booking-card"
import { Card } from "@/components/base/card"
import { useDateContext } from "@/app/context/dateContext"

// Room type from API (updated with dynamic pricing)
export type ApiRoom = {
  _id: string;
  name: string;
  photos: string[];
  amenityBullets: string[];
  basePrice: number;
  inventory: number;
  view?: string;
  bedType?: string;
  sizeSqft?: number;
  bathrooms?: number;
  dynamicPricing?: {
    _id: string;
    startDate: string;
    endDate: string;
    price: number;
    inventory: number;
    enabled: boolean;
  }[];
}

// Fetcher
const fetcher = (url: string): Promise<ApiRoom[]> =>
  fetch(url)
    .then((r) => r.json())
    .then((j) => j.data);

export default function RoomsFromApi({ initialRooms }: { initialRooms?: ApiRoom[] }) {
  // Get dates from global context
  const { checkInDate, checkOutDate } = useDateContext()

  // Create a cache key that includes dates to trigger re-fetch when dates change
  const cacheKey = checkInDate && checkOutDate 
    ? `/api/rooms?checkIn=${checkInDate.toISOString()}&checkOut=${checkOutDate.toISOString()}`
    : '/api/rooms';

  const { data: rooms, error, isLoading } = useSWR<ApiRoom[]>(cacheKey, fetcher, {
    fallbackData: initialRooms,
    revalidateOnFocus: false, // Optional: prevent re-fetch on window focus
  })

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">Loading available rooms…</div>
      </Card>
    )
  }
  
  if (error) {
    return (
      <Card className="p-4">
        <div className="text-sm text-red-600">Failed to load rooms. Please refresh the page.</div>
      </Card>
    )
  }
  
  if (!rooms || rooms.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">No rooms are available for the selected dates.</div>
      </Card>
    )
  }

  // Optional: explicitly sort by _id to ensure first document shows first
  const sortedRooms = rooms.slice().sort((a, b) => a._id.localeCompare(b._id))

  return (
    <div className="space-y-2 md:space-y-6">
      {/* Rooms List - uses dates from global context */}
      {sortedRooms.map((room) => (
        <div key={room._id} id={`room-${room._id}`}>
          <RoomBookingCard 
            room={room} 
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
          />
        </div>
      ))}
    </div>
  )
}