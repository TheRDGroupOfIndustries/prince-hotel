"use client";

import React from "react";
import { FooterColumn } from "./FooterColumn";
import { Facebook, Instagram, Twitter } from "lucide-react";

export const FooterContent: React.FC = () => {
  return (
    <div className="grid gap-8 md:grid-cols-4">
      {/* About Column */}
      <FooterColumn
        variant="about"
        title="Hotel Prince Diamond"
        logoSrc="/logo-white.png"
        description="Experience luxury and comfort in the heart of Varanasi, near the sacred Kashi Vishwanath Temple."
        socialLinks={[
          { href: "#", icon: <Facebook size={18} /> },
          { href: "#", icon: <Instagram size={18} /> },
          { href: "#", icon: <Twitter size={18} /> },
        ]}
      />

      {/* Quick Links */}
      <FooterColumn
        variant="links"
        title="Quick Links"
        links={[
          { href: "#home", text: "Home" },
          { href: "#rooms", text: "Rooms" },
          { href: "#amenities", text: "Amenities" },
          { href: "#contact", text: "Contact" },
        ]}
      />

      {/* Services */}
      <FooterColumn
        variant="services"
        title="Services"
        items={["Room Service", "Laundry", "Airport Transfer", "Tour Assistance"]}
      />

      {/* Contact Info */}
      <FooterColumn
        variant="contact"
        title="Contact Info"
        contactInfo={[
          "Kakarmata, Varanasi",
          "Uttar Pradesh, India",
          "+91 98765 43210",
          "info@princediamondhotel.com",
        ]}
      />
    </div>
  );
};
