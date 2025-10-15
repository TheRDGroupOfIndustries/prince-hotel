"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryProps {
  images: string[];
}

export function Gallery({ images }: GalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <section aria-label="Photo gallery" className="w-full">
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {/* Main image */}
        <div className="col-span-4 row-span-2 md:col-span-2">
          <Image
            src={images[active] || images[0] || "/placeholder.svg"}
            alt="Hotel photo"
            width={800}
            height={600}
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        </div>

        {/* Desktop thumbnails */}
        {images.slice(0, 5).map((src, idx) => {
          const isActive = idx === active;
          const base =
            "hidden overflow-hidden rounded-lg border bg-[var(--card)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] md:block";
          const ring = isActive ? "ring-2 ring-[var(--primary)]" : "";
          return (
            <button
              key={src + idx}
              onClick={() => setActive(idx)}
              className={`${base} ${ring}`}
              aria-label={`Show image ${idx + 1}`}
            >
              <Image
                src={src || "/placeholder.svg"}
                alt={`Thumbnail ${idx + 1}`}
                width={160}
                height={120}
                className="aspect-video object-cover"
              />
            </button>
          );
        })}
      </div>

      {/* Mobile thumbnails (horizontal scroll) */}
      <div className="mt-2 flex gap-2 overflow-x-auto md:hidden scrollbar-hide">
        {images.map((src, idx) => {
          const isActive = idx === active;
          return (
            <button
              key={src + idx}
              onClick={() => setActive(idx)}
              className={`flex-shrink-0 rounded-md overflow-hidden border transition-all duration-200 ${
                isActive ? "ring-2 ring-[var(--primary)] scale-95" : ""
              }`}
            >
              <Image
                src={src || "/placeholder.svg"}
                alt={`Thumbnail ${idx + 1}`}
                width={96}
                height={64}
                className="w-24 h-16 object-cover rounded-md"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
