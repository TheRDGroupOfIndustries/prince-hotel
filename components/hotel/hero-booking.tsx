"use client";

import { useEffect, useState } from "react";
import { Gallery } from "./gallery";
import { Card } from "@/components/base/card";
import { Button } from "@/components/base/button";
import type { RoomType } from "@/types/hotel";
import { Star, StarHalf, Check, Award, ShieldCheck, MapPin, Calendar, Search } from "lucide-react";
import { Playfair_Display } from "next/font/google";
import { useDateContext } from "@/app/context/dateContext";
import { facebookEvents } from "@/lib/facebookPixel";
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400" />}
      {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <Star key={i + fullStars + 1} className="h-5 w-5 text-gray-300" />
      ))}
    </div>
  );
};

// ------------------------------
// Dynamic Pricing Helper with Date Context
// ------------------------------
function getDynamicPricingForDates(
  room: RoomType,
  checkIn: Date | null,
  checkOut: Date | null
): { price: number; inventory: number; isDynamic: boolean } {
  if (!checkIn || !checkOut) {
    // Fallback to today-based pricing if dates not selected
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeRule = room.dynamicPricing?.find((rule) => {
      if (!rule.enabled) return false;
      const start = new Date(rule.startDate);
      const end = new Date(rule.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return today >= start && today <= end;
    });

    if (activeRule) {
      return {
        price: activeRule.price,
        inventory: activeRule.inventory,
        isDynamic: true,
      };
    }

    return { price: room.basePrice, inventory: room.inventory, isDynamic: false };
  }

  // Calculate pricing based on selected dates
  const nights = Math.max(1, Math.ceil((+checkOut - +checkIn) / (1000 * 60 * 60 * 24)));
  let totalPrice = 0;
  let isDynamic = false;
  let minInventory = room.inventory;

  for (let i = 0; i < nights; i++) {
    const date = new Date(checkIn);
    date.setDate(checkIn.getDate() + i);

    const rule = room.dynamicPricing?.find((r) => {
      if (!r.enabled) return false;
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      return date >= start && date <= end;
    });

    if (rule) {
      totalPrice += rule.price;
      isDynamic = true;
      minInventory = Math.min(minInventory, rule.inventory);
    } else {
      totalPrice += room.basePrice;
      minInventory = Math.min(minInventory, room.inventory);
    }
  }

  return {
    price: Math.round(totalPrice / nights), // Average price per night
    inventory: minInventory,
    isDynamic,
  };
}

// ------------------------------
// Date Picker Card Component (Used for both Desktop and Mobile)
// ------------------------------
function DatePickerCard({ onSearchAvailability }: { onSearchAvailability: () => void }) {
  const { checkInDate, checkOutDate, setCheckInDate, setCheckOutDate } = useDateContext();

  return (
    <Card className="p-4 border shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Check Availability</h3>
      </div>
      
      <div className="space-y-3">
        {/* Date Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Check-in Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={checkInDate ? checkInDate.toISOString().split("T")[0] : ""}
              onChange={(e) => setCheckInDate(e.target.value ? new Date(e.target.value) : null)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Check-out Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={checkOutDate ? checkOutDate.toISOString().split("T")[0] : ""}
              onChange={(e) => setCheckOutDate(e.target.value ? new Date(e.target.value) : null)}
            />
          </div>
        </div>

        {/* Search Button */}
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5"
          onClick={onSearchAvailability}
        >
          <Search className="h-4 w-4 mr-2" />
          Search Availability
        </Button>
      </div>
    </Card>
  );
}

// ------------------------------
// Featured Room Card
// ------------------------------
// function FeaturedRoomCard({
//   room,
//   onBookNow,
//   priceFormatter,
// }: {
//   room: RoomType;
//   onBookNow: () => void;
//   priceFormatter: Intl.NumberFormat;
// }) {
//   const { checkInDate, checkOutDate } = useDateContext();
//   const dynamicPricing = getDynamicPricingForDates(room, checkInDate, checkOutDate);
//   const displayPrice = dynamicPricing.price;
//   const isDynamicPrice = dynamicPricing.isDynamic;

//   return (
//     <Card className="p-4 border shadow-sm">
//       <div className="flex justify-between items-start gap-4">
//         <div className="flex-1">
//           <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
//           <p className="text-sm text-gray-700">Ideal for 2 Adults</p>
//         </div>
//         <div className="text-right flex-shrink-0">
//           <div className="flex flex-col items-end">
//             <p className="text-xl font-bold text-gray-900">
//               {priceFormatter.format(displayPrice)}
//               <span className="text-xs font-normal text-gray-500">/night</span>
//             </p>
//           </div>
//           <Button className="mt-1 w-full" onClick={onBookNow}>
//             Book Now
//           </Button>
//         </div>
//       </div>
//     </Card>
//   );
// }

// ------------------------------
// Skeleton Component
// ------------------------------
// function FeaturedRoomCardSkeleton() {
//   return (
//     <Card className="p-4 border shadow-sm animate-pulse">
//       <div className="flex justify-between items-start gap-4">
//         <div className="flex-1">
//           <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
//           <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//         </div>
//         <div className="text-right flex-shrink-0">
//           <div className="h-6 bg-gray-300 rounded w-20 mb-2"></div>
//           <div className="h-9 bg-gray-300 rounded w-24"></div>
//         </div>
//       </div>
//     </Card>
//   );
// }

// ------------------------------
// Main Hero Booking Component
// ------------------------------
interface Props {
  images: string[];
  hotel: {
    name: string;
    addressLine?: string;
    rating: number;
    ratingLabel: string;
    reviewCount: number;
    startingPrice: number;
    currency: "INR";
    aboutText?: string;
    amenitiesHighlights: string[];
    nearestLandmark?: { name: string; blurb: string };
  };
}

export function HeroBooking({ images, hotel }: Props) {
  const fmt = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: hotel.currency,
    minimumFractionDigits: 0,
  });

  const { checkInDate, checkOutDate } = useDateContext();
  const [featuredRoom, setFeaturedRoom] = useState<RoomType | null>(null);
  const [showFeatured, setShowFeatured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch rooms and select featured room based on priority (Deluxe → Super Deluxe → Premium)
  useEffect(() => {
    facebookEvents.viewContent('Hotel Page', hotel.name, hotel.startingPrice)
    async function fetchRooms() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/rooms', { 
          cache: 'no-store'
        });
        
        if (!res.ok) {
          console.error("Failed to fetch rooms:", res.statusText);
          return;
        }
        
        const data = await res.json();
        const allRooms: RoomType[] = data.data || [];
        
        // Room selection logic with dynamic pricing consideration
        // Priority: Deluxe → Super Deluxe → Premium → Any available room
        const deluxeRoom = allRooms.find(r => 
          r.name.toLowerCase().includes('deluxe') && !r.name.toLowerCase().includes('super')
        );
        const superDeluxeRoom = allRooms.find(r => 
          r.name.toLowerCase().includes('super deluxe')
        );
        const premiumRoom = allRooms.find(r => 
          r.name.toLowerCase().includes('premium')
        );
        
        let selectedFeaturedRoom: RoomType | null = null;
        
        // Check availability considering dynamic pricing for selected dates
        const getAvailableInventory = (room: RoomType) => {
          const dynamicPricing = getDynamicPricingForDates(room, checkInDate, checkOutDate);
          return dynamicPricing.inventory > 0;
        };
        
        // Priority selection logic
        if (deluxeRoom && getAvailableInventory(deluxeRoom)) {
          selectedFeaturedRoom = deluxeRoom;
        } else if (superDeluxeRoom && getAvailableInventory(superDeluxeRoom)) {
          selectedFeaturedRoom = superDeluxeRoom;
        } else if (premiumRoom && getAvailableInventory(premiumRoom)) {
          selectedFeaturedRoom = premiumRoom;
        } else {
          // Fallback to any available room
          selectedFeaturedRoom = allRooms.find(r => getAvailableInventory(r)) || null;
        }
        
        setFeaturedRoom(selectedFeaturedRoom);
        
        // Only show featured room card after data is loaded
        if (selectedFeaturedRoom) {
          setShowFeatured(true);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRooms();
  }, [checkInDate, checkOutDate]); // Re-fetch when dates change

  const scrollToFeaturedRoom = () => {
    if (!featuredRoom) return;
    const el = document.getElementById(`room-${featuredRoom._id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

 const scrollToRoomsSection = () => {
  // Track when user searches for availability
  facebookEvents.search(`Hotel: ${hotel.name}`)
  
  const roomsSection = document.getElementById('available-rooms')
  if (roomsSection) {
    roomsSection.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      {/* Header with title and rating */}
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className={`text-md sm:text-3xl font-bold text-gray-800 ${playfair.className}`}>
              {hotel.name}
            </h1>
            <div className="flex-shrink-0 flex items-center space-x-1 scale-90 sm:scale-100">
              <StarRating rating={hotel.rating} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <Gallery images={images} />
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
            <li className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-blue-600" /> Great Choice!
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-green-600" /> Best Price Guarantee
            </li>
          </ul>
          <hr className="my-2" />
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">About Property</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {hotel.aboutText ?? "Experience a wonderful stay at our hotel..."}
            </p>
          </div>

          {/* Mobile Date Picker Card - Below About Property */}
          <div className="block lg:hidden">
            <DatePickerCard onSearchAvailability={scrollToRoomsSection} />
          </div>

          {/* Mobile Featured Room Card */}
          {/* <div className="block lg:hidden mt-4">
            {isLoading ? (
              <FeaturedRoomCardSkeleton />
            ) : showFeatured && featuredRoom ? (
              <FeaturedRoomCard
                room={featuredRoom}
                onBookNow={scrollToFeaturedRoom}
                priceFormatter={fmt}
              />
            ) : null}
          </div> */}

          <div className="pt-4">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Amenities</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm text-gray-700">
              {hotel.amenitiesHighlights.map((amenity) => (
                <li key={amenity} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>{amenity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="hidden lg:block lg:col-span-1 space-y-4">
          {/* Desktop Date Picker Card */}
          <DatePickerCard onSearchAvailability={scrollToRoomsSection} />
          
          {/* Desktop Featured Room Card
          {isLoading ? (
            <FeaturedRoomCardSkeleton />
          ) : showFeatured && featuredRoom ? (
            <FeaturedRoomCard
              room={featuredRoom}
              onBookNow={scrollToFeaturedRoom}
              priceFormatter={fmt}
            />
          ) : null} */}
          
          <Card className="p-3 border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white font-bold text-lg rounded-md px-3 py-1">
                  {hotel.rating.toFixed(1)}
                </span>
                <div>
                  <p className="font-bold text-gray-800">{hotel.ratingLabel}</p>
                  <p className="text-xs text-gray-500">({hotel.reviewCount} RATINGS)</p>
                </div>
              </div>
              <a
                href="#reviews"
                className="text-sm font-semibold text-blue-600 hover:underline whitespace-nowrap"
              >
                All Reviews
              </a>
            </div>
            {hotel.nearestLandmark && <div className="border-t my-3" />}
            {hotel.nearestLandmark && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-6 w-6 text-gray-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">{hotel.nearestLandmark.name}</p>
                    <p className="text-xs text-gray-500">{hotel.nearestLandmark.blurb}</p>
                  </div>
                </div>
                <a
                  href="#map"
                  className="text-sm font-semibold text-blue-600 hover:underline whitespace-nowrap"
                >
                  See on Map
                </a>
              </div>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}