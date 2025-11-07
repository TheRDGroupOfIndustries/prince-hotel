// import { RoomImage } from "@/sections/RoomsSection/components/RoomImage";
// import { RoomDetails } from "@/sections/RoomsSection/components/RoomDetails";
// import Image from "next/image";

// export type RoomCardProps = {
//   imageAlt: string;
//   imageSrc: string;
//   badgeText: string;
//   badgeVariant: string;
//   title: string;
//   description: string;
//   price: string;
//   amenities: string[];
//   buttonText: string;
// };

// export const RoomCard = (props: RoomCardProps) => {
//   return (
//     <div className="bg-white shadow-[rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0)_0px_0px_0px_0px,rgba(0,0,0,0.1)_0px_10px_15px_-3px,rgba(0,0,0,0.1)_0px_4px_6px_-4px] box-border caret-transparent overflow-hidden rounded-xl">
//       <div className="relative box-border caret-transparent h-64">
//         <Image
//           width={200}
//           height={200}
//           alt={props.imageAlt}
//           src={props.imageSrc}
//           className="box-border caret-transparent h-full max-w-full object-cover object-[50%_0%] w-full"
//         />
//         <div
//           className={`absolute text-white text-sm font-semibold box-border caret-transparent leading-5 px-3 py-1 rounded-full left-4 top-4 ${props.badgeVariant}`}
//         >
//           {props.badgeText}
//         </div>
//       </div>

//       <div className="box-border caret-transparent p-6">
//         <h4 className="text-gray-900 text-xl font-bold box-border caret-transparent leading-7 mb-2">
//           {props.title}
//         </h4>
//         <p className="text-gray-600 box-border caret-transparent mb-4">
//           {props.description}
//         </p>
//         <div className="items-center box-border caret-transparent flex justify-between mb-4">
//           <div className="text-gray-900 text-2xl font-bold box-border caret-transparent leading-8">
//             {props.price}
//           </div>
//           <div className="text-gray-500 text-sm box-border caret-transparent leading-5">
//             per night
//           </div>
//         </div>
//         <ul className="text-gray-600 text-sm box-border caret-transparent leading-5 list-none mb-6 pl-0">
//           {props.amenities.map((amenity, index) => (
//             <li
//               key={index}
//               className={`items-center box-border caret-transparent gap-x-2 flex gap-y-2${
//                 index > 0 ? " mt-1" : ""
//               }`}
//             >
//               <i className="text-green-500 box-border caret-transparent block font-remixicon before:accent-auto before:box-border before:caret-transparent before:text-green-500 before:text-sm before:not-italic before:normal-nums before:font-normal before:tracking-[normal] before:leading-5 before:list-outside before:list-none before:pointer-events-auto before:text-start before:indent-[0px] before:normal-case before:visible before:border-separate before:font-remixicon"></i>
//               {amenity}
//             </li>
//           ))}
//         </ul>
//         <button className="text-white font-semibold bg-blue-600 caret-transparent text-center text-nowrap w-full px-0 py-3 rounded-lg hover:bg-blue-700">
//           {props.buttonText}
//         </button>
//       </div>
//     </div>
//   );
// };

"use client";

import React from "react";
import Image from "next/image";
import { Check } from "lucide-react";

export type RoomCardProps = {
  imageAlt: string;
  imageSrc: string;
  badgeText: string;
  badgeVariant: string; // Tailwind color class like "bg-blue-600"
  title: string;
  description: string;
  price: string;
  amenities: string[];
  buttonText: string;
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
}) => {
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
              <span className="text-green-500"><Check size={14}/></span>
              {amenity}
            </li>
          ))}
        </ul>

        <button className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 transition-colors">
          {buttonText}
        </button>
      </div>
    </div>
  );
};
