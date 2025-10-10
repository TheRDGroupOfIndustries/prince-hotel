"use client"

import { Gallery } from "./gallery"
import { Card } from "@/components/base/card"
import { Button } from "@/components/base/button"
import type { RatePlan, RoomType } from "@/types/hotel"

interface Props {
  images: string[]
  hotel: {
    name: string
    addressLine?: string
    rating: number
    ratingLabel: string
    reviewCount: number
    startingPrice: number
    currency: "INR"
    aboutText?: string
    amenitiesHighlights: string[]
    nearestLandmark?: { name: string; blurb: string }
  }
  featured: {
    room: RoomType
    plan: RatePlan
  }
}

export function HeroBooking({ images, hotel, featured }: Props) {
  const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: hotel.currency })
  const otherPlansCount = Math.max((featured.room?.ratePlans?.length ?? 0) - 1, 0)

  return (
    <Card className="p-4 md:p-5">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <Gallery images={images} />
        </div>

        <aside className="md:col-span-1 space-y-3">
          {/* Right booking card cloned from screenshot */}
          <Card className="space-y-3 p-4">
            <div>
              <h3 className="text-base font-semibold">{featured.room.name}</h3>
              <p className="text-xs text-muted-foreground">
                Fits {featured.room.occupancy.adults} {featured.room.occupancy.adults > 1 ? "Adults" : "Adult"}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {featured.plan.perks?.slice(0, 2).map((p) => (
                  <span key={p} className="rounded-md bg-secondary px-2 py-0.5 text-secondary-foreground">
                    {p}
                  </span>
                ))}
                {featured.plan.refundable ? (
                  <span className="rounded-md bg-secondary px-2 py-0.5 text-secondary-foreground">
                    Free Cancellation
                  </span>
                ) : (
                  <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-destructive-foreground">
                    Non-Refundable
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-end justify-between gap-3">
              <div />
              <div className="text-right">
                {featured.plan.listPrice && (
                  <div className="text-xs text-muted-foreground line-through">
                    {fmt.format(featured.plan.listPrice)}
                  </div>
                )}
                <div className="text-2xl font-bold">{fmt.format(featured.plan.price)}</div>
                <div className="text-[11px] text-muted-foreground">Per Night • Taxes & fees extra</div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">BOOK THIS NOW</Button>
              {otherPlansCount > 0 && (
                <a href="#available-rooms" className="text-xs text-accent underline">
                  {otherPlansCount} More Options
                </a>
              )}
            </div>
          </Card>

          {/* Mini reviews card */}
          <Card className="flex items-center justify-between p-3">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                {hotel.rating.toFixed(1)}
              </span>
              <div className="text-sm">
                <span className="font-medium">{hotel.ratingLabel}</span>{" "}
                <span className="text-muted-foreground">({hotel.reviewCount} ratings)</span>
              </div>
            </div>
            <a href="#reviews" className="text-xs text-accent underline">
              All Reviews
            </a>
          </Card>

          {/* Mini location card */}
          {hotel.nearestLandmark && (
            <Card className="flex items-center justify-between p-3">
              <div>
                <div className="text-sm font-medium">{hotel.nearestLandmark.name}</div>
                <div className="text-xs text-muted-foreground">{hotel.nearestLandmark.blurb}</div>
              </div>
              <a href="#map" className="text-xs text-accent underline">
                See on Map
              </a>
            </Card>
          )}
        </aside>
      </section>

      {/* Promo badges row under gallery (optional, subtle) */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-secondary px-3 py-1 text-xs">Great Choice!</span>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs">As seen on Google</span>
      </div>

      {/* About and Amenities inside the same card */}
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-2">
          <h4 className="text-sm font-semibold">About Property</h4>
          <p className="text-sm text-muted-foreground">
            {hotel.aboutText ??
              "Experience warm hospitality at Prince Diamond with comfortable rooms, modern amenities, and easy access to city landmarks."}{" "}
            <a href="#" className="text-accent underline">
              Read more
            </a>
          </p>
        </div>
        <div className="md:col-span-1 space-y-2">
          <h4 className="text-sm font-semibold">Amenities</h4>
          <ul className="grid grid-cols-2 gap-2 text-xs">
            {hotel.amenitiesHighlights.slice(0, 8).map((a) => (
              <li key={a} className="rounded-md bg-secondary px-2 py-1 text-secondary-foreground">
                {a}
              </li>
            ))}
          </ul>
          {hotel.amenitiesHighlights.length > 8 && (
            <a href="#amenities" className="mt-2 inline-block text-xs text-accent underline">
              + More Amenities
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}
