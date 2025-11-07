// "use client";

// import React from "react";
// import { AmenityCard } from "./AmenityCard";
// import { SectionHeader } from "./SectionHeader";

// export const AmenitiesSection: React.FC = () => {
//   return (
//     <section className="bg-gray-50 py-16">
//       <div className="max-w-screen-xl mx-auto px-4 md:px-8">
//         {/* Section Header */}
//         <SectionHeader
//           title="Hotel Amenities"
//           description="Enjoy world-class facilities and services designed to make your stay comfortable and memorable."
//         />

//         {/* Amenities Grid */}
//         <div className="grid gap-8 md:grid-cols-4">
//           <AmenityCard
//             title="Free Wi-Fi"
//             description="High-speed internet access throughout the hotel"
//           />
//           <AmenityCard
//             title="Air Conditioning"
//             description="Climate-controlled rooms for your comfort"
//           />
//           <AmenityCard
//             title="24/7 Front Desk"
//             description="Round-the-clock assistance and support"
//           />
//           <AmenityCard
//             title="CCTV Security"
//             description="Complete security surveillance system"
//           />
//           <AmenityCard
//             title="Elevator Access"
//             description="Easy access to all floors"
//           />
//           <AmenityCard
//             title="Power Backup"
//             description="Uninterrupted power supply"
//           />
//           <AmenityCard
//             title="Housekeeping"
//             description="Daily cleaning and maintenance service"
//           />
//           <AmenityCard
//             title="Breakfast"
//             description="Daily breakfast available (select plans)"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };


"use client";

import React from "react";
import { AmenityCard } from "./AmenityCard";
import { SectionHeader } from "./SectionHeader";
import {
  Wifi,
  Thermometer,
  HeartHandshake,
  ShieldCheck,
  BriefcaseConveyorBelt,
  Zap,
  BedDouble,
  Utensils,
} from "lucide-react";

export const AmenitiesSection: React.FC = () => {
  return (
    <section id='amenities' className="bg-gray-50 py-16">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <SectionHeader
          title="Hotel Amenities"
          description="Enjoy world-class facilities and services designed to make your stay comfortable and memorable."
        />

        {/* Amenities Grid */}
        <div className="grid gap-8 md:grid-cols-4">
          <AmenityCard
            icon={<Wifi />}
            title="Free Wi-Fi"
            description="High-speed internet access throughout the hotel"
          />
          <AmenityCard
            icon={<Thermometer />}
            title="Air Conditioning"
            description="Climate-controlled rooms for your comfort"
          />
          <AmenityCard
            icon={<HeartHandshake />}
            title="24/7 Front Desk"
            description="Round-the-clock assistance and support"
          />
          <AmenityCard
            icon={<ShieldCheck />}
            title="CCTV Security"
            description="Complete security surveillance system"
          />
          <AmenityCard
            icon={<BriefcaseConveyorBelt />}
            title="Elevator Access"
            description="Easy access to all floors"
          />
          <AmenityCard
            icon={<Zap />}
            title="Power Backup"
            description="Uninterrupted power supply"
          />
          <AmenityCard
            icon={<BedDouble />}
            title="Housekeeping"
            description="Daily cleaning and maintenance service"
          />
          <AmenityCard
            icon={<Utensils />}
            title="Breakfast"
            description="Daily breakfast available (select plans)"
          />
        </div>
      </div>
    </section>
  );
};
