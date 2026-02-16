"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useDateContext } from "@/app/context/dateContext";

export const Hero: React.FC = () => {
  const router = useRouter();
  const { checkInDate, checkOutDate, setCheckInDate, setCheckOutDate } = useDateContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Navigate to the rooms page and scroll to section
    router.push("/rooms#available-rooms");
    // router.push("/");
  };

  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/princehotel5.jpg')",
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
                value={checkInDate ? checkInDate.toISOString().split("T")[0] : ""}
                onChange={(e) => setCheckInDate(e.target.value ? new Date(e.target.value) : null)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                value={checkOutDate ? checkOutDate.toISOString().split("T")[0] : ""}
                onChange={(e) => setCheckOutDate(e.target.value ? new Date(e.target.value) : null)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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