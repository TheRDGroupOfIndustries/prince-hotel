"use client";

import { useEffect, useState } from "react";
import { Gallery } from "./gallery";
import { Card } from "@/components/base/card";
import { Button } from "@/components/base/button";
import type { RoomType } from "@/types/hotel";
import { Star, StarHalf, Check, Dot, Award, ShieldCheck, MapPin } from "lucide-react";
import { Playfair_Display } from "next/font/google";

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

// Helper function to get dynamic pricing for current date
function getDynamicPricingForToday(room: RoomType): { price: number; inventory: number; isDynamic: boolean } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if any dynamic pricing rule applies to today
  const activeRule = room.dynamicPricing?.find((rule) => {
    if (!rule.enabled) return false;
    
    const ruleStart = new Date(rule.startDate);
    const ruleEnd = new Date(rule.endDate);
    
    ruleStart.setHours(0, 0, 0, 0);
    ruleEnd.setHours(23, 59, 59, 999);
    
    return today >= ruleStart && today <= ruleEnd;
  });

  if (activeRule) {
    return {
      price: activeRule.price,
      inventory: activeRule.inventory,
      isDynamic: true
    };
  }

  // Return default/base values
  return {
    price: room.basePrice,
    inventory: room.inventory,
    isDynamic: false
  };
}

function FeaturedRoomCard({
  room,
  onBookNow,
  priceFormatter,
}: {
  room: RoomType;
  onBookNow: () => void;
  priceFormatter: Intl.NumberFormat;
}) {
  // Get dynamic pricing for today
  const dynamicPricing = getDynamicPricingForToday(room);
  const displayPrice = dynamicPricing.price;
  const isDynamicPrice = dynamicPricing.isDynamic;

  return (
    <Card className="p-4 border shadow-sm">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
          <p className="text-sm text-gray-700">Ideal for 2 Adults</p>
          
          {/* Dynamic Pricing Badge */}
          {/* {isDynamicPrice && (
            <div className="mt-1 inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
              Special Rate Today
            </div>
          )} */}
        </div>
        <div className="text-right flex-shrink-0">
          <div className="flex flex-col items-end">
            {/* {isDynamicPrice && room.basePrice !== displayPrice && (
              <span className="text-sm text-gray-500 line-through mb-1">
                {priceFormatter.format(room.basePrice)}
              </span>
            )} */}
            <p className="text-xl font-bold text-gray-900">
              {priceFormatter.format(displayPrice)}
              <span className="text-xs font-normal text-gray-500">/night</span>
            </p>
          </div>
          <Button className="mt-1 w-full" onClick={onBookNow}>
            Book Now
          </Button>
        </div>
      </div>
      <ul className="mt-3 border-t pt-3 space-y-1 text-sm text-gray-700">
        <li className="flex items-center gap-2">
          <Dot className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <span>Base price is for 2 Adults</span>
        </li>
        <li className="flex items-center gap-2">
          <Dot className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <span>Extra Adult charge: ₹300 per person</span>
        </li>
        <li className="flex items-center gap-2">
          <Dot className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <span>Children below 9 years stay free</span>
        </li>
        <li className="flex items-center gap-2">
          <Dot className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <span>Breakfast (optional): ₹150 per adult</span>
        </li>
        
        {/* Dynamic Pricing Info */}
        {/* {isDynamicPrice && (
          <li className="flex items-center gap-2">
            <Dot className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <span className="text-amber-700 font-medium">
              {displayPrice < room.basePrice ? 'Discounted rate for today!' : 'Special rate for today!'}
            </span>
          </li>
        )} */}
        
        {/* Inventory Info */}
        {dynamicPricing.inventory > 0 && dynamicPricing.inventory < 5 && (
          <li className="flex items-center gap-2">
            <Dot className="h-5 w-5 text-red-400 flex-shrink-0" />
            <span className="text-red-700 font-medium">
              Only {dynamicPricing.inventory} {dynamicPricing.inventory === 1 ? 'room' : 'rooms'} left!
            </span>
          </li>
        )}
      </ul>
    </Card>
  );
}

// Skeleton component for loading state
function FeaturedRoomCardSkeleton() {
  return (
    <Card className="p-4 border shadow-sm animate-pulse">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="h-6 bg-gray-300 rounded w-20 mb-2"></div>
          <div className="h-9 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
      <div className="mt-3 border-t pt-3 space-y-2">
        <div className="flex items-center gap-2">
          <Dot className="h-5 w-5 text-gray-300" />
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="flex items-center gap-2">
          <Dot className="h-5 w-5 text-gray-300" />
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="flex items-center gap-2">
          <Dot className="h-5 w-5 text-gray-300" />
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="flex items-center gap-2">
          <Dot className="h-5 w-5 text-gray-300" />
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </Card>
  );
}

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

  const [featuredRoom, setFeaturedRoom] = useState<RoomType | null>(null);
  const [showFeatured, setShowFeatured] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch rooms and select featured room
  useEffect(() => {
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
        const deluxeRoom = allRooms.find(r => r.name === 'Deluxe Room');
        const superDeluxeRoom = allRooms.find(r => r.name === 'Super Deluxe Room');
        
        let selectedFeaturedRoom: RoomType | null = null;
        
        // Check availability considering dynamic pricing
        const getAvailableInventory = (room: RoomType) => {
          const dynamicPricing = getDynamicPricingForToday(room);
          return dynamicPricing.inventory > 0;
        };
        
        if (deluxeRoom && getAvailableInventory(deluxeRoom)) {
          selectedFeaturedRoom = deluxeRoom;
        } else if (superDeluxeRoom && getAvailableInventory(superDeluxeRoom)) {
          selectedFeaturedRoom = superDeluxeRoom;
        } else {
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
  }, []);

  const scrollToFeaturedRoom = () => {
    if (!featuredRoom) return;
    const el = document.getElementById(`room-${featuredRoom._id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      <div className="mb-4">
        <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 flex-nowrap">
          <h1
            className={`text-md sm:text-3xl font-bold text-gray-800 whitespace-nowrap ${playfair.className}`}
          >
            {hotel.name}
          </h1>
          <div className="flex-shrink-0 flex items-center space-x-1 scale-90 sm:scale-100">
            <StarRating rating={hotel.rating} />
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

          {/* Mobile: Show skeleton while loading, actual card when loaded */}
          <div className="block lg:hidden mt-4">
            {isLoading ? (
              <FeaturedRoomCardSkeleton />
            ) : showFeatured && featuredRoom ? (
              <FeaturedRoomCard
                room={featuredRoom}
                onBookNow={scrollToFeaturedRoom}
                priceFormatter={fmt}
              />
            ) : null}
          </div>

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
          {/* Desktop: Show skeleton while loading, actual card when loaded */}
          {isLoading ? (
            <FeaturedRoomCardSkeleton />
          ) : showFeatured && featuredRoom ? (
            <FeaturedRoomCard
              room={featuredRoom}
              onBookNow={scrollToFeaturedRoom}
              priceFormatter={fmt}
            />
          ) : null}
          
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