
"use client";

import React from "react";
import { LocationList } from "./LocationList";

export const LocationContent: React.FC = () => {
  return (
    <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-x-12">
      {/* Left Side – List of Nearby Locations */}
      <LocationList />

      {/* Right Side – Embedded Google Map */}
      <div className="overflow-hidden rounded-lg shadow-lg">
        <iframe
          src="https://www.google.com/maps?q=25.3176,82.9739&hl=en&z=15&output=embed"
          title="Hotel Prince Diamond Location"
          className="h-96 w-full border-0"
          loading="lazy"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};
