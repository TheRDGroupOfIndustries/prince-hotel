"use client";

import React from "react";
import { useRouter } from "next/navigation";
export const Navbar: React.FC = () => {
  const router = useRouter();
  const handleScroll = (id: string) => {
    const section = document.querySelector(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <h1
            className="text-2xl font-bold text-gray-900 font-pacifico cursor-pointer"
            onClick={() => handleScroll("#home")}
          >
            Hotel Prince Diamond
          </h1>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => handleScroll("#home")}
              className="text-gray-700 font-medium hover:text-blue-600"
            >
              Home
            </button>
            <button
              onClick={() => router.push("/rooms")}
              className="text-gray-700 font-medium hover:text-blue-600"
            >
              Rooms
            </button>
            <button
              onClick={() => handleScroll("#amenities")}
              className="text-gray-700 font-medium hover:text-blue-600"
            >
              Amenities
            </button>
            <button
              onClick={() => handleScroll("#contact")}
              className="text-gray-700 font-medium hover:text-blue-600"
            >
              Contact
            </button>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push("/rooms")}
            className="cursor-pointer bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
          >
            Book Now
          </button>
        </div>
      </div>
    </nav>
  );
};
