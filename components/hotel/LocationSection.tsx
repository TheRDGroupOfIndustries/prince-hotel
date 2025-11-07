// import { LocationContent } from "./LocationContent";
// import { SectionHeader } from "./SectionHeader"; 

// export const LocationSection = () => {
//   return (
//     <section className="bg-white box-border caret-transparent py-16">
//       <div className="box-border caret-transparent max-w-screen-xl mx-auto px-4 md:px-8">
//         <SectionHeader
//           title="Prime Location"
//           description="Strategically located in Kakarmata, just 4.4 km from the famous Kashi Vishwanath Temple."
//         />
//         <LocationContent />
//       </div>
//     </section>
//   );
// };


"use client";

import React from "react";
import { LocationContent } from "./LocationContent";
import { SectionHeader } from "./SectionHeader";

export const LocationSection: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <SectionHeader
          title="Prime Location"
          description="Strategically located in Kakarmata, just 4.4 km from the famous Kashi Vishwanath Temple."
        />

        {/* Location Content */}
        <LocationContent />
      </div>
    </section>
  );
};
