import { HOTEL_PRINCE_DIAMOND } from "@/data/hotel-prince-diamond"
import { HotelHeader } from "@/components/hotel/hotel-header"
import { HeroBooking } from "@/components/hotel/hero-booking"
import { ReviewsSection } from "@/components/hotel/reviews-section"
import { PropertyRules } from "@/components/hotel/property-rules"
import { LocationMap } from "@/components/hotel/location-map"
import { Card } from "@/components/base/card"
import RoomsFromApi from "@/components/hotel/rooms-from-api"
import type { RoomType } from "@/types/hotel";

// Add this export to force dynamic rendering
export const dynamic = 'force-dynamic'

// Helper function to fetch rooms. In a real app, this might be in a separate lib/api file.
async function getRooms(): Promise<RoomType[]> {
  try {
    // Using { cache: 'no-store' } ensures inventory is always fresh
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/rooms`, { 
      cache: 'no-store',
      next: { revalidate: 0 } // Add this to prevent static generation issues
    });
    if (!res.ok) {
      console.error("Failed to fetch rooms:", res.statusText);
      return [];
    }
    const data = await res.json();
    return data.data || []; // Assuming your API returns { data: [...] }
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return [];
  }
}

export default async function Page() {
  const hotel = HOTEL_PRINCE_DIAMOND;

  // --- Dynamic Room Fetching and Selection Logic ---
  const allRooms = await getRooms();
  
  const deluxeRoom = allRooms.find(r => r.name === 'Deluxe Room');
  const superDeluxeRoom = allRooms.find(r => r.name === 'Super Deluxe Room');
  
  let featuredRoom: RoomType | null = null;
  if (deluxeRoom && deluxeRoom.inventory > 0) {
    featuredRoom = deluxeRoom;
  } else if (superDeluxeRoom && superDeluxeRoom.inventory > 0) {
    featuredRoom = superDeluxeRoom;
  } else {
    // Fallback to the first available room if the preferred ones are sold out
    featuredRoom = allRooms.find(r => r.inventory > 0) || null;
  }
  // --- End of Logic ---

  return (
    <main className="container mx-auto max-w-6xl space-y-2 px-3 py-3">
      <HotelHeader
        name={hotel.name}
        city={hotel.city}
        country={hotel.country}
        rating={hotel.rating}
        ratingLabel={hotel.ratingLabel}
        reviewCount={hotel.reviewCount}
        startingPrice={hotel.startingPrice}
        currency={hotel.currency}
        logo={hotel.logo}
      />

      <HeroBooking 
        images={hotel.heroPhotos}
        hotel={{
          name: hotel.name,
          addressLine: hotel.addressLine,
          rating: hotel.rating,
          ratingLabel: hotel.ratingLabel,
          reviewCount: hotel.reviewCount,
          startingPrice: hotel.startingPrice,
          currency: hotel.currency,
          aboutText: hotel.aboutText,
          amenitiesHighlights: hotel.amenitiesHighlights,
          nearestLandmark: hotel.nearestLandmark,
        }}
        // ✨ Pass the dynamically selected featuredRoom as a prop
        featuredRoom={featuredRoom}
      />

      <section id="available-rooms" className="space-y-6">
        <h2 className="text-lg font-semibold">Available Rooms &amp; Plans</h2>
        {/* Pass the fetched rooms to avoid a second API call on the client */}
        <RoomsFromApi initialRooms={allRooms} />
      </section>

      {hotel.coordinates && <LocationMap lat={hotel.coordinates.lat} lng={hotel.coordinates.lng} title={hotel.name} />}

      <PropertyRules
        checkInFrom={hotel.rules.checkInFrom}
        checkOutUntil={hotel.rules.checkOutUntil}
        notes={hotel.rules.importantNotes}
      />

      <ReviewsSection data={hotel.reviews} hotelName={hotel.name} />

      <Card className="p-4 text-sm text-muted-foreground">
        Note: This page is a stand‑alone booking view for {hotel.name}. Pricing and availability may change based on
        selected dates and occupancy.
      </Card>
    </main>
  )
}