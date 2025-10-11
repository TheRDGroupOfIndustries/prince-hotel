"use client";

import { Gallery } from "./gallery";
import { Card } from "@/components/base/card";
import { Button } from "@/components/base/button";
import type { RatePlan, RoomType } from "@/types/hotel";
import { Star, Check, MapPin, Dot, Award, ShieldCheck } from "lucide-react";

// Star rating renderer
const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < fullStars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

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
  featured: {
    room: RoomType;
    plan: RatePlan;
    taxesAndFees: number;
  };
}

export function HeroBooking({ images, hotel, featured }: Props) {
  const fmt = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: hotel.currency,
    minimumFractionDigits: 0,
  });

  const otherPlansCount = Math.max(
    (featured.room?.ratePlans?.length ?? 0) - 1,
    0
  );

  return (
    <div className="bg-slate-50 p-4 rounded-lg">
      {/* Hotel Name and Rating */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {hotel.name}
          </h1>
          <div className="scale-90 sm:scale-100">
            <StarRating rating={hotel.rating} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Gallery, About, Booking (on small), Amenities */}
        <div className="lg:col-span-2 space-y-4">
          <Gallery images={images} />

          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-blue-600" /> Great Choice!
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-green-600" /> Best Price
              Guarantee
            </li>
          </ul>

          <hr className="my-4" />

          {/* About Property */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              About Property
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {hotel.aboutText ??
                "Experience a wonderful stay at our hotel, designed to provide comfort and convenience for all our guests. With modern amenities and a welcoming atmosphere, we aim to make your visit memorable. Our location offers easy access to the city's main attractions, making it an ideal choice for both leisure and business travelers."}
            </p>
          </div>

          {/* Book Now section (visible only on small screens) */}
          <div className="block lg:hidden">
            <Card className="p-4 border shadow-sm mt-4">
              <h3 className="text-xl font-bold text-gray-900">
                {featured.room.name}
              </h3>
              <p className="text-base text-gray-800 mt-1">
                Fits {featured.room.occupancy.adults}{" "}
                {featured.room.occupancy.adults > 1 ? "Adults" : "Adult"}
              </p>

              <ul className="mt-1 space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <Dot className="h-6 w-6 text-gray-400 flex-shrink-0" />
                  <span>No meals included</span>
                </li>
                {featured.plan.refundable && (
                  <li className="flex items-center gap-2 text-teal-700 font-semibold">
                    <Check className="h-5 w-5 flex-shrink-0" />
                    <span>Free Cancellation till 24 hrs before check in</span>
                  </li>
                )}
              </ul>

              <div className="mt-3">
                <p className="text-sm mb-1">
                  {featured.plan.listPrice && (
                    <span className="line-through text-gray-500 mr-2">
                      {fmt.format(featured.plan.listPrice)}
                    </span>
                  )}
                  <span>Per Night:</span>
                </p>
                <div className="flex items-center gap-2">
                  <div className="text-3xl font-extrabold text-gray-900">
                    {fmt.format(featured.plan.price)}
                  </div>
                  <span className="text-base text-gray-700 self-end mb-1">
                    + {fmt.format(featured.taxesAndFees)} taxes & fees
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-5">
                <Button className="flex-1 bg-blue-500 text-white font-bold text-base hover:bg-blue-400 py-3 rounded-md">
                  BOOK THIS NOW
                </Button>
                {otherPlansCount > 0 && (
                  <a
                    href="#available-rooms"
                    className="text-sm font-semibold text-blue-600 hover:underline whitespace-nowrap"
                  >
                    {otherPlansCount} More Options
                  </a>
                )}
              </div>
            </Card>
          </div>

          {/* Amenities */}
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

        {/* Right Column: Booking & Info Cards (hidden on small screens) */}
        <aside className="hidden lg:block lg:col-span-1 space-y-4">
          <Card className="p-4 border shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">
              {featured.room.name}
            </h3>
            <p className="text-base text-gray-800 mt-1">
              Fits {featured.room.occupancy.adults}{" "}
              {featured.room.occupancy.adults > 1 ? "Adults" : "Adult"}
            </p>

            <ul className="mt-1 space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <Dot className="h-6 w-6 text-gray-400 flex-shrink-0" />
                <span>No meals included</span>
              </li>
              {featured.plan.refundable && (
                <li className="flex items-center gap-2 text-teal-700 font-semibold">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span>Free Cancellation till 24 hrs before check in</span>
                </li>
              )}
            </ul>

            <div className="mt-3">
              <p className="text-sm mb-1">
                {featured.plan.listPrice && (
                  <span className="line-through text-gray-500 mr-2">
                    {fmt.format(featured.plan.listPrice)}
                  </span>
                )}
                <span>Per Night:</span>
              </p>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-extrabold text-gray-900">
                  {fmt.format(featured.plan.price)}
                </div>
                <span className="text-base text-gray-700 self-end mb-1">
                  + {fmt.format(featured.taxesAndFees)} taxes & fees
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-5">
              <Button className="flex-1 bg-blue-500 text-white font-bold text-base hover:bg-blue-400 py-3 rounded-md">
                BOOK THIS NOW
              </Button>
              {otherPlansCount > 0 && (
                <a
                  href="#available-rooms"
                  className="text-sm font-semibold text-blue-600 hover:underline whitespace-nowrap"
                >
                  {otherPlansCount} More Options
                </a>
              )}
            </div>
          </Card>

          <Card className="p-3 border shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-blue-600 text-white font-bold text-lg rounded-md px-3 py-1">
                  {hotel.rating.toFixed(1)}
                </span>
                <div>
                  <p className="font-bold text-gray-800">{hotel.ratingLabel}</p>
                  <p className="text-xs text-gray-500">
                    ({hotel.reviewCount} RATINGS)
                  </p>
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
                    <p className="font-semibold text-gray-800">
                      {hotel.nearestLandmark.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {hotel.nearestLandmark.blurb}
                    </p>
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
