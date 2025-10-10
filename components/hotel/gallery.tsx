"use client"
import { useState } from "react"

interface GalleryProps {
  images: string[]
}

export function Gallery({ images }: GalleryProps) {
  const [active, setActive] = useState(0)
  return (
    <section aria-label="Photo gallery" className="w-full">
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        <div className="col-span-4 row-span-2 md:col-span-2">
          <img
            src={images[active] ?? images[0]}
            alt="Hotel photo"
            className="aspect-[4/3] w-full rounded-lg object-cover"
          />
        </div>
        {images.slice(0, 5).map((src, idx) => {
          const isActive = idx === active
          const base =
            "hidden overflow-hidden rounded-lg border bg-[var(--card)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] md:block"
          const ring = isActive ? "ring-2 ring-[var(--primary)]" : ""
          return (
            <button
              key={src + idx}
              onClick={() => setActive(idx)}
              className={`${base} ${ring}`}
              aria-label={`Show image ${idx + 1}`}
            >
              <img src={src || "/placeholder.svg"} alt={`Thumbnail ${idx + 1}`} className="aspect-video object-cover" />
            </button>
          )
        })}
      </div>
    </section>
  )
}
