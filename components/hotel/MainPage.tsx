"use client";
import { HOTEL_PRINCE_DIAMOND } from "@/data/hotel-prince-diamond";
// import { HotelHeader } from "@/components/hotel/hotel-header"
import { HeroBooking } from "@/components/hotel/hero-booking";
import { ReviewsSection } from "@/components/hotel/reviews-section";
import { PropertyRules } from "@/components/hotel/property-rules";
import { LocationMap } from "@/components/hotel/location-map";
import { Card } from "@/components/base/card";
import RoomsFromApi from "@/components/hotel/rooms-from-api";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Loader2 } from "lucide-react";
function RoomContent() {
  const hotel = HOTEL_PRINCE_DIAMOND;
  const searchParams = useSearchParams();

  useEffect(() => {
    const scrollId = searchParams.get("scrollTo");
    if (scrollId) {
      const target = document.getElementById(`room-${scrollId}`);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 400); // wait a bit for room cards to render
      }
    }
  }, [searchParams]);

  return (
    <main className="container mx-auto max-w-6xl space-y-2 px-3 py-3">
      {/* <HotelHeader
        name={hotel.name}
        city={hotel.city}
        country={hotel.country}
        rating={hotel.rating}
        ratingLabel={hotel.ratingLabel}
        reviewCount={hotel.reviewCount}
        startingPrice={hotel.startingPrice}
        currency={hotel.currency}
        logo={hotel.logo}
      /> */}

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
        // Remove featuredRoom prop since it will be fetched inside the component
      />

      <section id="available-rooms" className="space-y-2 md:space-y-6">
        <h2 className="text-lg font-semibold">Available Rooms &amp; Plans</h2>
        {/* RoomsFromApi will handle its own data fetching */}
        <RoomsFromApi initialRooms={[]} />
      </section>

      {hotel.coordinates && (
        <LocationMap
          lat={hotel.coordinates.lat}
          lng={hotel.coordinates.lng}
          title={hotel.name}
        />
      )}

      <PropertyRules
        checkInFrom={hotel.rules.checkInFrom}
        checkOutUntil={hotel.rules.checkOutUntil}
        notes={hotel.rules.importantNotes}
      />

      <ReviewsSection data={hotel.reviews} hotelName={hotel.name} />

      <Card className="p-4 text-sm text-muted-foreground">
        Note: This page is a stand‑alone booking view for {hotel.name}. Pricing
        and availability may change based on selected dates and occupancy.
      </Card>
    </main>
  );
}

export default function RoomsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
            <div className="text-lg font-semibold text-gray-600 mt-4">
              Loading Rooms...
            </div>
          </div>
        </div>
      }
    >
      <RoomContent />
    </Suspense>
  );
}
