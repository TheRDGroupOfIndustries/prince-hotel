import { HOTEL_PRINCE_DIAMOND } from "@/data/hotel-prince-diamond"
import { HotelHeader } from "@/components/hotel/hotel-header"
import { HeroBooking } from "@/components/hotel/hero-booking"
import { ReviewsSection } from "@/components/hotel/reviews-section"
import { PropertyRules } from "@/components/hotel/property-rules"
import { LocationMap } from "@/components/hotel/location-map"

import { Card } from "@/components/base/card"
import RoomsFromApi from "@/components/hotel/rooms-from-api"

export default function Page() {
  const hotel = HOTEL_PRINCE_DIAMOND

  const featuredRoom = hotel.roomTypes[0]
  const featuredPlan = featuredRoom.ratePlans[0]

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
      
      />

      <section id="available-rooms" className="space-y-6">
        <h2 className="text-lg font-semibold">Available Rooms &amp; Plans</h2>
        <RoomsFromApi />
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
