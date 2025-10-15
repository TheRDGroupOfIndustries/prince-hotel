"use client";

import { useEffect, useState } from "react";
import { Gallery } from "./gallery";
import { Card } from "@/components/base/card";
import { Button } from "@/components/base/button";
import type { RoomType } from "@/types/hotel";
import { Star,StarHalf, Check, Dot, Award, ShieldCheck, MapPin } from "lucide-react";
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

function FeaturedRoomCard({
  room,
  onBookNow,
  priceFormatter,
}: {
  room: RoomType;
  onBookNow: () => void;
  priceFormatter: Intl.NumberFormat;
}) {
  return (
    <Card className="p-4 border shadow-sm">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
          <p className="text-sm text-gray-700">Ideal for 2 Adults</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xl font-bold text-gray-900">
            {priceFormatter.format(room.basePrice)}
            <span className="text-xs font-normal text-gray-500">/night</span>
          </p>
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
      </ul>
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
  featuredRoom: RoomType | null;
}

export function HeroBooking({ images, hotel, featuredRoom }: Props) {
  const fmt = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: hotel.currency,
    minimumFractionDigits: 0,
  });

  const [showFeatured, setShowFeatured] = useState(false);

  const scrollToFeaturedRoom = () => {
    if (!featuredRoom) return;
    const el = document.getElementById(`room-${featuredRoom._id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // ✅ Only show FeaturedRoomCard after hydration
  useEffect(() => {
    if (featuredRoom) setShowFeatured(true);
  }, [featuredRoom]);

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

          {showFeatured && (
            <div className="block lg:hidden mt-4">
              <FeaturedRoomCard
                room={featuredRoom!}
                onBookNow={scrollToFeaturedRoom}
                priceFormatter={fmt}
              />
            </div>
          )}

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
          {showFeatured && (
            <FeaturedRoomCard
              room={featuredRoom!}
              onBookNow={scrollToFeaturedRoom}
              priceFormatter={fmt}
            />
          )}
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
