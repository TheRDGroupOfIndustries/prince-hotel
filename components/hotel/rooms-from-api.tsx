"use client"

import useSWR from "swr"
import { RoomBookingCard } from "@/components/hotel/room-booking-card"
import { Card } from "@/components/base/card";

// Room type from API
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
}

// Fetcher
const fetcher = (url: string): Promise<ApiRoom[]> =>
  fetch(url)
    .then((r) => r.json())
    .then((j) => j.data);

export default function RoomsFromApi({ initialRooms }: { initialRooms?: ApiRoom[] }) {
  const { data: rooms, error, isLoading } = useSWR<ApiRoom[]>("/api/rooms", fetcher, {
    fallbackData: initialRooms,
  });

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">Loading available rooms…</div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-4">
        <div className="text-sm text-red-600">Failed to load rooms. Please refresh the page.</div>
      </Card>
    );
  }
  
  if (!rooms || rooms.length === 0) {
    return (
      <Card className="p-4">
        <div className="text-sm text-muted-foreground">No rooms are available at the moment.</div>
      </Card>
    );
  }

  // Optional: explicitly sort by _id to ensure first document shows first
  const sortedRooms = rooms.slice().sort((a, b) => a._id.localeCompare(b._id));

  return (
    <div className="space-y-6">
      {sortedRooms.map((room) => (
        <div key={room._id} id={`room-${room._id}`}>
          <RoomBookingCard room={room} />
        </div>
      ))}
    </div>
  );
}
