"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useDateContext } from "@/app/context/dateContext";

export const Hero: React.FC = () => {
  const router = useRouter();
  const { setCheckInDate, setCheckOutDate } = useDateContext();

  // Local state for temporary input values
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Update global context before redirecting
    if (checkIn) setCheckInDate(new Date(checkIn));
    if (checkOut) setCheckOutDate(new Date(checkOut));

    // ✅ Navigate to the rooms page and scroll to section
    router.push("/rooms#available-rooms");
  };

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/princehotel3.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-white">
        {/* Title */}
        <h2 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Experience Luxury in the Heart of Varanasi
        </h2>

        {/* Subtitle */}
        <p className="mb-8 text-base leading-6 text-gray-200 sm:text-lg md:text-xl lg:text-2xl">
          Modern comfort meets traditional hospitality near Kashi Vishwanath
          Temple
        </p>

        {/* Booking Form */}
        <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg backdrop-blur-sm md:p-6">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
          >
            {/* Check-in */}
            <div className="flex flex-col text-start">
              <label
                htmlFor="check_in"
                className="mb-1 text-sm font-medium text-gray-900"
              >
                Check-in Date
              </label>
              <input
                id="check_in"
                type="date"
                name="check_in"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Check-out */}
            <div className="flex flex-col text-start">
              <label
                htmlFor="check_out"
                className="mb-1 text-sm font-medium text-gray-900"
              >
                Check-out Date
              </label>
              <input
                id="check_out"
                type="date"
                name="check_out"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Button */}
            <div className="flex flex-col justify-end">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 h-12 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <Search className="w-6 h-6" />
                <span className="whitespace-nowrap">Check Availability</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

{
  /* Guests */
}
{
  /* <select
              name="guests"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              defaultValue="1"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
            </select> */
}

{
  /* Rooms */
}
{
  /* <select
              name="rooms"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              defaultValue="1"
            >
              <option value="1">1 Room</option>
              <option value="2">2 Rooms</option>
              <option value="3">3 Rooms</option>
            </select> */
}
