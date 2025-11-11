// // "use client";

// // import React from "react";
// // import { RoomCard } from "./RoomCard";
// // import { SectionHeader } from "./SectionHeader";

// // export const RoomsSection: React.FC = () => {
// //   return (
// //     <section id='rooms' className="bg-white py-16">
// //       <div className="max-w-screen-xl mx-auto px-4 md:px-8">
// //         {/* Section Header */}
// //         <SectionHeader
// //           title="Our Rooms & Suites"
// //           description="Choose from our carefully designed rooms, each offering modern amenities and comfort for an unforgettable stay."
// //         />

// //         {/* Rooms Grid */}
// //         <div className="grid gap-8 md:grid-cols-3">
// //           <RoomCard
// //             imageAlt="Deluxe Room"
// //             imageSrc="/d2.jpg"
// //             badgeText="Popular"
// //             badgeVariant="bg-blue-600"
// //             title="Deluxe Room"
// //             description="City view • 92 sq.ft • 1 King Bed"
// //             price="₹3,000"
// //             amenities={["Air Conditioning", "Free Wi-Fi", "Private Bathroom"]}
// //             buttonText="Book Now"
// //           />
// //           <RoomCard
// //             imageAlt="Super Deluxe Room"
// //             imageSrc="/superdeluxe.jpg"
// //             badgeText="Limited"
// //             badgeVariant="bg-orange-500"
// //             title="Super Deluxe Room"
// //             description="City view • 180 sq.ft • 1 Double Bed"
// //             price="₹3,500"
// //             amenities={["Air Conditioning", "Work Desk", "Minibar"]}
// //             buttonText="Book Now"
// //           />
// //           <RoomCard
// //             imageAlt="Premium Room"
// //             imageSrc="/sd6.jpg"
// //             badgeText="Premium"
// //             badgeVariant="bg-purple-600"
// //             title="Premium Room"
// //             description="City view • 200 sq.ft • 1 King Bed"
// //             price="₹4,000"
// //             amenities={[
// //               "Premium Amenities",
// //               "Work Desk & Chair",
// //               "Spacious Layout",
// //             ]}
// //             buttonText="Book Now"
// //           />
// //         </div>
// //       </div>
// //     </section>
// //   );
// // // };


// "use client";

// import useSWR from "swr";
// import { Card } from "@/components/base/card";
// import { useDateContext } from "@/app/context/dateContext";
// import { RoomCard } from "@/components/hotel/RoomCard";

// export type ApiRoom = {
//   _id: string;
//   name: string;
//   photos?: string[];
//   amenityBullets?: string[];
//   basePrice: number;
//   view?: string;
//   bedType?: string;
//   sizeSqft?: number;
//   dynamicPricing?: {
//     startDate: string;
//     endDate: string;
//     price: number;
//     enabled: boolean;
//   }[];
// };

// const fetcher = async (url: string): Promise<ApiRoom[]> => {
//   const response = await fetch(url);
//   const result = await response.json();

//   // Return only minimal fields required for RoomCard
//   return (
//     result.data?.map((room: ApiRoom) => ({
//       _id: room._id,
//       name: room.name,
//       photos: room.photos?.slice(0, 1) || [],
//       basePrice: room.basePrice,
//       view: room.view,
//       bedType: room.bedType,
//       sizeSqft: room.sizeSqft,
//       amenityBullets: room.amenityBullets?.slice(0, 5) || [],
//       dynamicPricing: room.dynamicPricing?.filter((p) => p.enabled) || [],
//     })) || []
//   );
// };

// export default function RoomsSection({ initialRooms }: { initialRooms?: ApiRoom[] }) {
//   const { checkInDate, checkOutDate } = useDateContext();

//   const cacheKey =
//     checkInDate && checkOutDate
//       ? `/api/rooms?checkIn=${checkInDate.toISOString()}&checkOut=${checkOutDate.toISOString()}`
//       : "/api/rooms";

//   const { data: rooms, error, isLoading } = useSWR<ApiRoom[]>(cacheKey, fetcher, {
//     fallbackData: initialRooms,
//     revalidateOnFocus: false,
//   });

//   if (isLoading) {
//     return (
//       <Card className="p-4 text-center">
//         <div className="text-sm text-muted-foreground">Loading available rooms…</div>
//       </Card>
//     );
//   }

//   if (error) {
//     return (
//       <Card className="p-4 text-center">
//         <div className="text-sm text-red-600">Failed to load rooms. Please refresh the page.</div>
//       </Card>
//     );
//   }

//   if (!rooms || rooms.length === 0) {
//     return (
//       <Card className="p-4 text-center">
//         <div className="text-sm text-muted-foreground">
//           No rooms are available for the selected dates.
//         </div>
//       </Card>
//     );
//   }

//   const today = new Date();

//   // ✅ Calculate final price for each room (dynamic or base)
//   const roomsWithFinalPrice = rooms.map((room) => {
//     const dynamicPrice =
//       room.dynamicPricing?.find(
//         (d) =>
//           new Date(d.startDate) <= today &&
//           new Date(d.endDate) >= today &&
//           d.enabled
//       )?.price || room.basePrice;

//     return { ...room, finalPrice: dynamicPrice };
//   });

//   // ✅ Sort rooms by final price (low → high)
//   const sortedRooms = roomsWithFinalPrice.sort((a, b) => a.finalPrice - b.finalPrice);

//   return (
//     <section id="rooms" className="bg-white py-16">
//       <div className="max-w-screen-xl mx-auto px-4 md:px-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Our Rooms & Suites</h2>
//         <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
//           Choose from our carefully designed rooms, each offering modern amenities and comfort for
//           an unforgettable stay.
//         </p>

//         {/* Rooms Grid */}
//         <div className="grid gap-8 md:grid-cols-3">
//           {sortedRooms.map((room) => {
//             const formattedPrice = `₹${room.finalPrice.toLocaleString("en-IN")}`;

//             return (
//               <div key={room._id}>
//                 <RoomCard
//                  roomId={room._id} 
//                   imageAlt={room.name}
//                   imageSrc={room.photos?.[0] || "/default-room.jpg"}
//                   badgeText={room.finalPrice > room.basePrice ? "Premium" : "Popular"}
//                   badgeVariant={room.finalPrice > room.basePrice ? "bg-purple-600" : "bg-blue-600"}
//                   title={room.name}
//                   description={`${room.view || "City view"} • ${
//                     room.sizeSqft || 100
//                   } sq.ft • ${room.bedType || "1 Double Bed"}`}
//                   price={formattedPrice}
//                   amenities={room.amenityBullets || []}
//                   buttonText="Book Now"
//                 />
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import useSWR from "swr";
import { Card } from "@/components/base/card";
import { useDateContext } from "@/app/context/dateContext";
import { RoomCard } from "@/components/hotel/RoomCard";

export type ApiRoom = {
  _id: string;
  name: string;
  photos?: string[];
  amenityBullets?: string[];
  basePrice: number;
  view?: string;
  bedType?: string;
  sizeSqft?: number;
  dynamicPricing?: {
    startDate: string;
    endDate: string;
    price: number;
    enabled: boolean;
  }[];
};

const fetcher = async (url: string): Promise<ApiRoom[]> => {
  const response = await fetch(url);
  const result = await response.json();

  // Return only minimal fields required for RoomCard
  return (
    result.data?.map((room: ApiRoom) => ({
      _id: room._id,
      name: room.name,
      photos: room.photos?.slice(0, 1) || [],
      basePrice: room.basePrice,
      view: room.view,
      bedType: room.bedType,
      sizeSqft: room.sizeSqft,
      amenityBullets: room.amenityBullets?.slice(0, 5) || [],
      dynamicPricing: room.dynamicPricing?.filter((p) => p.enabled) || [],
    })) || []
  );
};

export default function RoomsSection({ initialRooms }: { initialRooms?: ApiRoom[] }) {
  const { checkInDate, checkOutDate } = useDateContext();

  const cacheKey =
    checkInDate && checkOutDate
      ? `/api/rooms?checkIn=${checkInDate.toISOString()}&checkOut=${checkOutDate.toISOString()}`
      : "/api/rooms";

  const { data: rooms, error, isLoading } = useSWR<ApiRoom[]>(cacheKey, fetcher, {
    fallbackData: initialRooms,
    revalidateOnFocus: false,
  });

  if (isLoading) {
    return (
      <Card className="p-4 text-center">
        <div className="text-sm text-muted-foreground">Loading available rooms…</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 text-center">
        <div className="text-sm text-red-600">Failed to load rooms. Please refresh the page.</div>
      </Card>
    );
  }

  if (!rooms || rooms.length === 0) {
    return (
      <Card className="p-4 text-center">
        <div className="text-sm text-muted-foreground">
          No rooms are available for the selected dates.
        </div>
      </Card>
    );
  }

  const today = new Date();

  // ✅ Calculate final price for each room (dynamic or base)
  const roomsWithFinalPrice = rooms.map((room) => {
    const dynamicPrice =
      room.dynamicPricing?.find(
        (d) =>
          new Date(d.startDate) <= today &&
          new Date(d.endDate) >= today &&
          d.enabled
      )?.price || room.basePrice;

    return { ...room, finalPrice: dynamicPrice };
  });

  // ✅ Sort rooms by price (low → high)
  const sortedRooms = roomsWithFinalPrice.sort((a, b) => a.finalPrice - b.finalPrice);

  // ✅ Define price tiers dynamically
  const totalRooms = sortedRooms.length;
  const tierSize = Math.ceil(totalRooms / 3);

  return (
    <section id="rooms" className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Our Rooms & Suites</h2>
        <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Choose from our carefully designed rooms, each offering modern amenities and comfort for
          an unforgettable stay.
        </p>

        {/* Rooms Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {sortedRooms.map((room, index) => {
            const formattedPrice = `₹${room.finalPrice.toLocaleString("en-IN")}`;

            // ✅ Determine badge by price rank
            let badgeText = "Popular";
            let badgeVariant = "bg-blue-600";

            if (index >= tierSize && index < tierSize * 2) {
              badgeText = "Limited";
              badgeVariant = "bg-orange-500";
            } else if (index >= tierSize * 2) {
              badgeText = "Premium";
              badgeVariant = "bg-purple-600";
            }

            return (
              <div key={room._id} id={`room-${room._id}`}>
                <RoomCard
                  roomId={room._id}
                  imageAlt={room.name}
                  imageSrc={room.photos?.[0] || "/default-room.jpg"}
                  badgeText={badgeText}
                  badgeVariant={badgeVariant}
                  title={room.name}
                  description={`${room.view || "City view"} • ${
                    room.sizeSqft || 100
                  } sq.ft • ${room.bedType || "1 Double Bed"}`}
                  price={formattedPrice}
                  amenities={room.amenityBullets || []}
                  buttonText="Book Now"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
