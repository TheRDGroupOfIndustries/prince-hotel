// "use client";

// import React from "react";
// import Image from "next/image";
// import { Check } from "lucide-react";
// import { useRouter } from "next/navigation";

// export type RoomCardProps = {
//   imageAlt: string;
//   imageSrc: string;
//   badgeText: string;
//   badgeVariant: string; // Tailwind color class like "bg-blue-600"
//   title: string;
//   description: string;
//   price: string;
//   amenities: string[];
//   buttonText: string;
// };

// export const RoomCard: React.FC<RoomCardProps> = ({
//   imageAlt,
//   imageSrc,
//   badgeText,
//   badgeVariant,
//   title,
//   description,
//   price,
//   amenities,
//   buttonText,
// }) => {

//   const router= useRouter();
//   return (
//     <div className="bg-white overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
//       {/* Image Section */}
//       <div className="relative h-64">
//         <Image
//           width={400}
//           height={300}
//           alt={imageAlt}
//           src={imageSrc}
//           className="h-full w-full object-cover"
//         />
//         <span
//           className={`absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-semibold text-white ${badgeVariant}`}
//         >
//           {badgeText}
//         </span>
//       </div>

//       {/* Content Section */}
//       <div className="p-6">
//         <h4 className="mb-2 text-xl font-bold text-gray-900">{title}</h4>
//         <p className="mb-4 text-gray-600">{description}</p>

//         <div className="mb-4 flex items-center justify-between">
//           <span className="text-2xl font-bold text-gray-900">{price}</span>
//           <span className="text-sm text-gray-500">per night</span>
//         </div>

//         <ul className="mb-6 list-none space-y-2 text-sm text-gray-600">
//           {amenities.map((amenity, index) => (
//             <li key={index} className="flex items-center gap-2">
//               <span className="text-green-500"><Check size={14}/></span>
//               {amenity}
//             </li>
//           ))}
//         </ul>

//         <button onClick={() => router.push('/rooms')} className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition-colors">
//           {buttonText}
//         </button>
//       </div>
//     </div>
//   );
// };


"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

export type RoomCardProps = {
  imageAlt: string;
  imageSrc: string;
  badgeText: string;
  badgeVariant: string;
  title: string;
  description: string;
  price: string;
  amenities: string[];
  buttonText: string;
  roomId: string; // 👈 Add this
};

export const RoomCard: React.FC<RoomCardProps> = ({
  imageAlt,
  imageSrc,
  badgeText,
  badgeVariant,
  title,
  description,
  price,
  amenities,
  buttonText,
  roomId,
}) => {
  const router = useRouter();

  const handleBookNow = () => {
    // 👇 Redirect to /rooms page and include the room ID
    router.push(`/rooms?scrollTo=${roomId}`);
  };

  return (
    <div className="bg-white overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative h-64">
        <Image
          width={400}
          height={300}
          alt={imageAlt}
          src={imageSrc}
          className="h-full w-full object-cover"
        />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-sm font-semibold text-white ${badgeVariant}`}
        >
          {badgeText}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h4 className="mb-2 text-xl font-bold text-gray-900">{title}</h4>
        <p className="mb-4 text-gray-600">{description}</p>

        <div className="mb-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">{price}</span>
          <span className="text-sm text-gray-500">per night</span>
        </div>

        <ul className="mb-6 list-none space-y-2 text-sm text-gray-600">
          {amenities.map((amenity, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-green-500">
                <Check size={14} />
              </span>
              {amenity}
            </li>
          ))}
        </ul>

        <button
          onClick={handleBookNow}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};
