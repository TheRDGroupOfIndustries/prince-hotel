"use client";

import Image from "next/image";
import React from "react";

export const WelcomeSection: React.FC = () => {
  return (
    <section  id='welcome'
    className="bg-gray-50 py-16">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:gap-x-12 items-center">
          {/* Text Content */}
          <div>
            <h3 className="mb-6 text-3xl font-bold leading-9 text-gray-900">
              Welcome to Hotel Prince Diamond
            </h3>
            <p className="mb-6 text-lg leading-relaxed text-gray-600">
              Prince Diamond Hotel — the best hotel in Varanasi for families.
              Book your stay for modern comforts, attentive service, and quick
              access to Kashi Vishwanath Temple. Experience the perfect blend of
              traditional hospitality and contemporary luxury in the spiritual
              heart of India.
            </p>

            {/* Ratings Section */}
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">4.6</div>
                <div className="text-sm text-gray-600">Guest Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600">128</div>
                <div className="text-sm text-gray-600">Reviews</div>
              </div>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Image
              width={400}
              height={300}
              alt="Hotel lobby"
              src="/princehotel3.jpg"
              className="h-48 w-full rounded-lg object-cover"
            />
            <Image
              width={400}
              height={300}
              alt="Hotel room"
              src="/princehotel2.jpg"
              className="h-48 w-full rounded-lg object-cover"
            />
            <Image
              width={400}
              height={300}
              alt="Hotel amenities"
              src="/sd2.jpg"
              className="h-48 w-full rounded-lg object-cover"
            />
            <Image
              width={400}
              height={300}
              alt="Hotel exterior"
              src="/sd6.jpg"
              className="h-48 w-full rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
