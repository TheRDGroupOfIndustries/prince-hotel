"use client";

import Image from "next/image";

interface HotelHeaderProps {
  name: string;
  city: string;
  country: string;
  rating: number;
  ratingLabel: string;
  reviewCount: number;
  startingPrice: number;
  currency: "INR";
  logo?: string;
}

export function HotelHeader(props: HotelHeaderProps) {
  const { name, logo } = props;
  
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex flex-col items-center md:flex-row md:items-center md:gap-3 text-center md:text-left">
        {logo && (
          <Image
            src={logo || "/placeholder.svg"}
            alt={`${name} logo`}
            width={100}
            height={48}
            className="h-12 w-auto mb-2 md:mb-0 object-contain"
          />
        )}
       
      </div>
    </header>
  );
}
