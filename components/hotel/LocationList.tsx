
"use client";

import React from "react";
import { LocationItem } from "./LocationItem";
import { Train, Plane, MapPin, Handbag } from "lucide-react"; 
export const LocationList = () => {
  return (
    <div className="box-border caret-transparent">
      <div className="box-border caret-transparent space-y-6">
        <LocationItem
          icon={<MapPin />}
          title="Kashi Vishwanath Temple"
          description="4.4 km drive to one of India's most sacred temples"
        />
        <LocationItem
          icon={<Train />}
          title="Varanasi Railway Station"
          description="Easy access to major transportation hub"
        />
        <LocationItem
          icon={<Plane />}
          title="Lal Bahadur Shastri Airport"
          description="Convenient airport connectivity"
        />
        <LocationItem
          icon={<Handbag />}
          title="Local Markets"
          description="Close to traditional bazaars and shopping areas"
        />
      </div>
    </div>
  );
};
