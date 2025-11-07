// export type LocationItemProps = {
//   title: string;
//   description: string;
//   className?: string;
// };

// export const LocationItem = (props: LocationItemProps) => {
//   return (
//     <div
//       className={
//         props.className ||
//         "items-start box-border caret-transparent gap-x-4 flex gap-y-4"
//       }
//     >
//       <div className="items-center bg-blue-100 box-border caret-transparent flex shrink-0 h-12 justify-center w-12 rounded-full">
//         <i className="text-blue-600 text-xl box-border caret-transparent block leading-7 font-remixicon before:accent-auto before:box-border before:caret-transparent before:text-blue-600 before:text-xl before:not-italic before:normal-nums before:font-normal before:tracking-[normal] before:leading-7 before:list-outside before:list-disc before:pointer-events-auto before:text-start before:indent-[0px] before:normal-case before:visible before:border-separate before:font-remixicon"></i>
//       </div>
//       <div className="box-border caret-transparent">
//         <h4 className="text-gray-900 text-lg font-semibold box-border caret-transparent leading-7 mb-2">
//           {props.title}
//         </h4>
//         <p className="text-gray-600 box-border caret-transparent">
//           {props.description}
//         </p>
//       </div>
//     </div>
//   );
// };

"use client";

import React from "react";

export type LocationItemProps = {
  title: string;
  description: string;
  icon: React.ReactNode; 
  className?: string;
};

export const LocationItem: React.FC<LocationItemProps> = ({
  title,
  description,
  icon,
  className,
}) => {
  return (
    <div
      className={
        className ||
        "items-start flex gap-x-4 gap-y-4 box-border caret-transparent"
      }
    >
      {/* Icon Container */}
      <div className="flex items-center justify-center h-12 w-12 shrink-0 rounded-full bg-blue-100">
        <span className="text-blue-600 text-2xl">
          {React.cloneElement(icon as React.ReactElement, { size: 24 })}
        </span>
      </div>

      {/* Text Content */}
      <div>
        <h4 className="text-gray-900 text-lg font-semibold mb-2">
          {title}
        </h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};
