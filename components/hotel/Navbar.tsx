// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// export const Navbar: React.FC = () => {
//   const router = useRouter();
//   const handleScroll = (id: string) => {
//     const section = document.querySelector(id);
//     if (section) {
//       section.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-white shadow-md">
//       <div className="max-w-screen-xl mx-auto px-4 md:px-8">
//         <div className="flex h-16 items-center justify-between">
//           {/* Logo / Brand */}
//           <Image
//             src="/images/prince-logo.png"
//             alt={`logo`}
//             width={100}
//             height={48}
//             className="h-12 w-auto mb-2 md:mb-0 object-contain cursor-pointer"
//              onClick={() => handleScroll("/")}
//           />

//           {/* Navigation Links */}
//           <div className="hidden md:flex space-x-8">
//             <button
//               onClick={() => handleScroll("#home")}
//               className="text-gray-700 font-medium hover:text-blue-600"
//             >
//               Home
//             </button>
//             <button
//               onClick={() => router.push("/rooms")}
//               className="text-gray-700 font-medium hover:text-blue-600"
//             >
//               Rooms
//             </button>
//             <button
//               onClick={() => handleScroll("#amenities")}
//               className="text-gray-700 font-medium hover:text-blue-600"
//             >
//               Amenities
//             </button>
//             <button
//               onClick={() => handleScroll("#contact")}
//               className="text-gray-700 font-medium hover:text-blue-600"
//             >
//               Contact
//             </button>
//           </div>

//           {/* CTA Button */}
//           <button
//             onClick={() => router.push("/rooms")}
//             className="cursor-pointer bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
//           >
//             Book Now
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleScroll = (id: string) => {
    if (pathname !== "/") {
      // If not on homepage, navigate there first
      router.push(`/${id ? `?scrollTo=${id.replace("#", "")}` : ""}`);
    } else {
      // If already on homepage, scroll smoothly
      const section = document.querySelector(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href='/'>
          <Image
            src="/images/prince-logo.png"
            alt="logo"
            width={100}
            height={48}
            className="h-12 w-auto mb-2 md:mb-0 object-contain cursor-pointer"
            
          />
          </Link>
          

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
             <Link href='/'>
               <button
      
              className="text-gray-700 font-medium hover:text-blue-600"
            >
              Home
            </button>
             </Link>
          
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
            <Link href='/gallery'>
               <button
      
              className="text-gray-700 font-medium hover:text-blue-600"
            >
              Gallery
            </button>
             </Link>
            <Link href='/place-to-visit'>
               <button
      
              className="text-gray-700 font-medium hover:text-blue-600"
            >
              Place To Visit
            </button>
             </Link>
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
