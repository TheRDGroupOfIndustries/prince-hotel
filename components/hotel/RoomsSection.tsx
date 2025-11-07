// import { RoomCard } from "./RoomCard";
// import { SectionHeader } from "./SectionHeader";
// export const RoomsSection = () => {
//   return (
//     <section className="bg-white box-border caret-transparent py-16">
//       <div className="box-border caret-transparent max-w-screen-xl mx-auto px-4 md:px-8">
//         <SectionHeader
//           title="Our Rooms & Suites"
//           description="Choose from our carefully designed rooms, each offering modern amenities and comfort for an unforgettable stay."
//         />

//         <div className="box-border caret-transparent gap-x-8 grid grid-cols-[repeat(1,minmax(0px,1fr))] gap-y-8 md:grid-cols-[repeat(3,minmax(0px,1fr))]">
//           <RoomCard
//             imageAlt="Deluxe Room"
//             imageSrc="https://c.animaapp.com/mhn0oz8k1duepy/assets/tyfasx8omrgkaacmz4gk.png"
//             badgeText="Popular"
//             badgeVariant="bg-blue-600"
//             title="Deluxe Room"
//             description="City view • 92 sq.ft • 1 King Bed"
//             price="₹3,000"
//             amenities={["Air Conditioning", "Free Wi-Fi", "Private Bathroom"]}
//             buttonText="Book Now"
//           />
//           <RoomCard
//             imageAlt="Super Deluxe Room"
//             imageSrc="https://c.animaapp.com/mhn0oz8k1duepy/assets/lrqhdxp4ldvmhozzyreg.jpg"
//             badgeText="Limited"
//             badgeVariant="bg-orange-500"
//             title="Super Deluxe Room"
//             description="City view • 180 sq.ft • 1 Double Bed"
//             price="₹3,500"
//             amenities={["Air Conditioning", "Work Desk", "Minibar"]}
//             buttonText="Book Now"
//           />
//           <RoomCard
//             imageAlt="Premium Room"
//             imageSrc="https://c.animaapp.com/mhn0oz8k1duepy/assets/idkikfqffoopnani0ccr.jpg"
//             badgeText="Premium"
//             badgeVariant="bg-purple-600"
//             title="Premium Room"
//             description="City view • 200 sq.ft • 1 King Bed"
//             price="₹4,000"
//             amenities={[
//               "Premium Amenities",
//               "Work Desk & Chair",
//               "Spacious Layout",
//             ]}
//             buttonText="Book Now"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };


"use client";

import React from "react";
import { RoomCard } from "./RoomCard";
import { SectionHeader } from "./SectionHeader";

export const RoomsSection: React.FC = () => {
  return (
    <section id='rooms' className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <SectionHeader
          title="Our Rooms & Suites"
          description="Choose from our carefully designed rooms, each offering modern amenities and comfort for an unforgettable stay."
        />

        {/* Rooms Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          <RoomCard
            imageAlt="Deluxe Room"
            imageSrc="/d2.jpg"
            badgeText="Popular"
            badgeVariant="bg-blue-600"
            title="Deluxe Room"
            description="City view • 92 sq.ft • 1 King Bed"
            price="₹3,000"
            amenities={["Air Conditioning", "Free Wi-Fi", "Private Bathroom"]}
            buttonText="Book Now"
          />
          <RoomCard
            imageAlt="Super Deluxe Room"
            imageSrc="/superdeluxe.jpg"
            badgeText="Limited"
            badgeVariant="bg-orange-500"
            title="Super Deluxe Room"
            description="City view • 180 sq.ft • 1 Double Bed"
            price="₹3,500"
            amenities={["Air Conditioning", "Work Desk", "Minibar"]}
            buttonText="Book Now"
          />
          <RoomCard
            imageAlt="Premium Room"
            imageSrc="/sd6.jpg"
            badgeText="Premium"
            badgeVariant="bg-purple-600"
            title="Premium Room"
            description="City view • 200 sq.ft • 1 King Bed"
            price="₹4,000"
            amenities={[
              "Premium Amenities",
              "Work Desk & Chair",
              "Spacious Layout",
            ]}
            buttonText="Book Now"
          />
        </div>
      </div>
    </section>
  );
};
