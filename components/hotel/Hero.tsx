

// "use client";

// import React from "react";

// export const Hero: React.FC = () => {
//   return (
//     <section id='home' className="relative flex h-screen items-center justify-center overflow-hidden">
//       {/* Background Image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//         style={{
//           backgroundImage:
//             "url('/hero_image.jpg')",
//         }}
//       >
//         <div className="absolute inset-0 bg-black/40"></div>
//       </div>

//       {/* Hero Content */}
//       <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
//         <h2 className="mb-6 text-5xl font-bold leading-[60px] md:text-6xl">
//           Experience Luxury in the Heart of Varanasi
//         </h2>
//         <p className="mb-8 text-xl leading-7 text-gray-200 md:text-2xl md:leading-8">
//           Modern comfort meets traditional hospitality near Kashi Vishwanath
//           Temple
//         </p>

//         {/* Booking Form */}
//         <div className="mx-auto max-w-5xl rounded-2xl bg-white/100 p-6 shadow-lg backdrop-blur-sm md:p-8">
//           <form className="flex flex-col gap-4 md:flex-row md:items-center">
//             <input
//               type="date"
//               name="check_in"
//               defaultValue="2025-01-15"
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
//             />
//             <input
//               type="date"
//               name="check_out"
//               defaultValue="2025-01-16"
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
//             />
//             <select
//               name="guests"
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
//               defaultValue="1"
//             >
//               <option value="1">1 Guest</option>
//               <option value="2">2 Guests</option>
//               <option value="3">3 Guests</option>
//               <option value="4">4 Guests</option>
//             </select>
//             <select
//               name="rooms"
//               className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
//               defaultValue="1"
//             >
//               <option value="1">1 Room</option>
//               <option value="2">2 Rooms</option>
//               <option value="3">3 Rooms</option>
//             </select>
//             <button
//               type="submit"
//               className="h-12 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 whitespace-nowrap"
//             >
//               Check Availability
//             </button>
//           </form>
//         </div>
//       </div>
//     </section>
//   );
// };


"use client";

import React from "react";

export const Hero: React.FC = () => {
  return (
    <section
      id="home"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero_image.jpg')",
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
          Modern comfort meets traditional hospitality near Kashi Vishwanath Temple
        </p>

        {/* Booking Form */}
        <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-6 shadow-lg backdrop-blur-sm md:p-8">
          <form className="flex flex-col gap-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            <input
              type="date"
              name="check_in"
              defaultValue="2025-01-15"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <input
              type="date"
              name="check_out"
              defaultValue="2025-01-16"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <select
              name="guests"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              defaultValue="1"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
            </select>
            <select
              name="rooms"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              defaultValue="1"
            >
              <option value="1">1 Room</option>
              <option value="2">2 Rooms</option>
              <option value="3">3 Rooms</option>
            </select>
            <button
              type="submit"
              className="h-12 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 whitespace-nowrap"
            >
              Check Availability
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
