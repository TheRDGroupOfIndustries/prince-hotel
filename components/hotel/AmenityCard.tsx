// "use client";

// import React from "react";

// export type AmenityCardProps = {
//   title: string;
//   description: string;
// };

// export const AmenityCard: React.FC<AmenityCardProps> = ({ title, description }) => {
//   return (
//     <div className="text-center">
//       {/* Icon Placeholder */}
//       <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
//         <span className="text-2xl text-blue-600">★</span>
//         {/* You can replace this star with an actual icon if you want (e.g., from Lucide or Remix Icon) */}
//       </div>

//       {/* Title */}
//       <h4 className="mb-2 text-lg font-semibold text-gray-900">{title}</h4>

//       {/* Description */}
//       <p className="text-gray-600">{description}</p>
//     </div>
//   );
// };
"use client";

import React from "react";

export type AmenityCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode; // ✅ Add icon prop
};

export const AmenityCard: React.FC<AmenityCardProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <div className="text-center">
      {/* Icon */}
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
        <span className="text-3xl text-blue-600">{icon}</span>
      </div>

      {/* Title */}
      <h4 className="mb-2 text-lg font-semibold text-gray-900">{title}</h4>

      {/* Description */}
      <p className="text-gray-600">{description}</p>
    </div>
  );
};
