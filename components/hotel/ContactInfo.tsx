"use client";

import React from "react";
import { ContactItem } from "./ContactItem";
import { MapPin, Phone, Mail, Clock } from "lucide-react"; 

export const ContactInfo: React.FC = () => {
  return (
    <div>
      <ContactItem
        icon={<MapPin />}
        title="Address"
        content="Kakarmata, Varanasi, Uttar Pradesh, India"
      />

      <ContactItem
        icon={<Phone />}
        title="Phone"
        content="+91 98765 43210"
        showMarginTop
      />

      <ContactItem
        icon={<Mail />}
        title="Email"
        content="info@princediamondhotel.com"
        showMarginTop
      />

      <ContactItem
        icon={<Clock />}
        title="Check-in / Check-out"
        content="Check-in: 12:00 PM | Check-out: 11:00 AM"
        showMarginTop
      />
    </div>
  );
};
