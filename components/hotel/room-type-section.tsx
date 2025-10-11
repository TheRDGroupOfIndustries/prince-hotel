"use client";
import Image from "next/image";
import { Card } from "@/components/base/card";
import type { RoomType } from "@/types/hotel";
import { RoomPlanCard } from "./room-plan-card";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  room: RoomType;
}

export function RoomTypeSection({ room }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const details: string[] = [
    room.bedInfo || "",
    room.sizeSqft ? `${room.sizeSqft} sq.ft` : "",
  ].filter(Boolean);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? room.photos.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === room.photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="rounded-lg border bg-card">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 lg:p-6">
        {/* Left Section (Image + Info) */}
        <div className="md:col-span-1 relative border-b md:border-b-0 md:border-r border-border p-4 lg:p-6">
          {/* Image Carousel */}
          <div className="relative h-64 w-full sm:h-72 md:h-80 lg:h-96">
            <Image
              src={room.photos[currentIndex] || "/placeholder.svg"}
              alt={`${room.name} image ${currentIndex + 1}`}
              fill
              className="rounded-md object-cover transition-opacity duration-500"
            />
          </div>

          {room.photos.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/3 -translate-y-1/2 rounded-full bg-black/30 p-1 sm:p-2 text-white"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/3 -translate-y-1/2 rounded-full bg-black/30 p-1 sm:p-2 text-white"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          <div className="mt-3 text-sm sm:mt-4">
            <h1 className="font-bold text-lg sm:text-xl">{room.name}</h1>
            {details.length > 0 && (
              <p className="text-muted-foreground text-xs sm:text-sm">
                {details.join(" • ")}
              </p>
            )}
          </div>

          <ul className="mt-3 grid grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
            {room.amenities.slice(0, 10).map((a) => (
              <li
                key={a}
                className="rounded-md bg-secondary px-2 py-1 text-secondary-foreground"
              >
                {a}
              </li>
            ))}
          </ul>

          <a
            href="#"
            className="mt-3 inline-block text-xs sm:text-sm text-accent underline"
            aria-label={`More details about ${room.name}`}
          >
            More Details
          </a>
        </div>

        {/* Right Section (Rate Plans) */}
        <div className="flex flex-col md:col-span-2 divide-y divide-border">
          {room.ratePlans.map((plan, index) => (
            <div key={plan.id} className={index === 0 ? "" : ""}>
              <RoomPlanCard plan={plan} roomName={room.name} />
            </div>
          ))}
        </div>
      </div>

      <Card className="m-4 p-3 text-xs sm:text-sm text-muted-foreground">
        Taxes and fees may vary by dates and occupancy. Final price shown at checkout.
      </Card>
    </section>
  );
}
