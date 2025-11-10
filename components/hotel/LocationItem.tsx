"use client";
import React from "react";

export type LocationItemProps = {
  title: string;
  description: string;
 icon: React.ReactElement<{ size?: number | string }>;

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
          {React.cloneElement(icon, { size: 24 })}
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
