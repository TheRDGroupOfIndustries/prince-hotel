// components/hotel/rooms-from-api.tsx
"use client"

import useSWR from "swr"
import Image from "next/image"
import { Card } from "@/components/base/card"
import { RoomPlanCard } from "@/components/hotel/room-plan-card"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
type ApiPlan = {
  title?: string
  name?: string
  group: "room-only" | "breakfast"
  price: number
  originalPrice?: number
  listPrice?: number
  currency?: string
  refundable?: boolean
  inclusions?: string[]
  perks?: string[]
  freeCancellationText?: string
  cancellationPolicy?: string
  offerText?: string
  taxesAndFees?: string
  isSuperPackage?: boolean
  superPackageHeadline?: string
}

type ApiRoom = {
  _id: string
  name: string
  slug?: string
  sizeSqft?: number
  sizeSqm?: number
  view?: string
  bedType?: string
  bathrooms?: number
  amenityBullets: string[]
  photos: string[]
  plans: ApiPlan[]
}

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((j) => j.data)

function normalizePlan(p: ApiPlan) {
  return {
    name: p.name ?? p.title ?? "",
    group: p.group,
    price: p.price,
    originalPrice: p.originalPrice ?? p.listPrice,
    currency: p.currency ?? "INR",
    refundable: !!p.refundable,
    perks: p.perks ?? p.inclusions ?? [],
    cancellationPolicy: p.cancellationPolicy ?? p.freeCancellationText,
    offerText: p.offerText,
    taxesAndFees: p.taxesAndFees,
  }
}

export default function RoomsFromApi() {
  const router = useRouter()
  const { data, error, isLoading } = useSWR<ApiRoom[]>("/api/rooms", fetcher)

  const handleBookNow = (plan: any, roomName: string, roomPhoto?: string, roomAmenities?: string[]) => {
    const bookingData = {
      roomName,
      plan: plan.name,
      price: plan.price,
      originalPrice: plan.originalPrice,
      currency: plan.currency,
      perks: plan.perks,
      cancellationPolicy: plan.cancellationPolicy,
      roomPhoto: roomPhoto || "https://r2imghtlak.mmtcdn.com/r2-mmt-htl-image/htl-imgs/202407231708234688-d10e7d2d-5aa2-4d12-bc5a-542842fe52c2.jpg",
      roomAmenities: roomAmenities || []
    }
    
    const queryString = `?data=${encodeURIComponent(JSON.stringify(bookingData))}`
    router.push(`/booking${queryString}`)
  }

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading rooms…</div>
  if (error) return <div className="text-sm text-red-600">Failed to load rooms.</div>
  if (!data?.length) return <div className="text-sm text-muted-foreground">No rooms added yet.</div>

  return (
    <div className="space-y-6">
      {data.map((room) => {
        const roomOnly = room.plans.filter((p) => p.group === "room-only")
        const breakfast = room.plans.filter((p) => p.group === "breakfast")
        const superPlans = room.plans.filter((p) => p.isSuperPackage)

        return (
          <Card key={room._id} className="p-0 overflow-hidden">
            {superPlans.length > 0 && (
              <div className="border-b border-[#e3d2a2] bg-[#fff8e6]">
                <div className="flex items-center gap-2 px-4 py-2">
                  <span className="inline-flex items-center rounded-full border border-[#d1a94f] bg-[#fdf3d6] px-2 py-0.5 text-[11px] font-medium text-[#6b4e12]">
                    Super Package
                  </span>
                  <span className="text-sm text-[#6b4e12]">
                    {superPlans[0].superPackageHeadline || "Exclusive bundled benefits"}
                  </span>
                </div>
                <div className="px-4 pb-4">
                  <RoomPlanCard
                    plan={normalizePlan(superPlans[0]) as any}
                    roomName={room.name}
                    isSuperBadge
                    superHeadline={undefined}
                    onBookNow={(plan) => handleBookNow(plan, room.name, room.photos[0], room.amenityBullets)}
                    roomPhoto={room.photos[0]}
                    roomAmenities={room.amenityBullets}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              <div className="p-5 border-b lg:border-b-0 lg:border-r border-gray-200 bg-card">
                {room.photos?.length ? (
  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg group">
    {/* track current image index */}
    <RoomImageSlider images={room.photos} roomName={room.name} />
  </div>
) : (
  <div className="h-40 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground">
    No photo
  </div>
)}
                <h3 className="mt-4 font-semibold text-xl text-foreground">{room.name}</h3>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  {room.sizeSqft ? <div>• {room.sizeSqft} sq.ft</div> : null}
                  {room.view ? <div>• {room.view}</div> : null}
                  {room.bedType ? <div>• {room.bedType}</div> : null}
                  {room.bathrooms ? (
                    <div>
                      • {room.bathrooms} Bathroom{room.bathrooms > 1 ? "s" : ""}
                    </div>
                  ) : null}
                </div>
                <ul className="mt-3 space-y-1 text-sm text-foreground/80">
                  {room.amenityBullets?.map((a) => (
                    <li key={a}>• {a}</li>
                  ))}
                </ul>
                <div className="mt-3 text-sm text-primary underline cursor-pointer">More Details</div>
              </div>

              <div className="lg:col-span-2">
                {roomOnly.length > 0 && (
                  <div className="p-4 sm:p-5">
                    <h4 className="sr-only">Room Only</h4>
                    {roomOnly.map((plan, idx) => (
                      <div key={(plan.title || plan.name) + idx} className={idx > 0 ? "border-t border-gray-200" : ""}>
                        <RoomPlanCard
                          plan={normalizePlan(plan) as any}
                          roomName={room.name}
                          isSuperBadge={!!plan.isSuperPackage}
                          superHeadline={plan.isSuperPackage ? plan.superPackageHeadline : undefined}
                          onBookNow={(plan) => handleBookNow(plan, room.name, room.photos[0], room.amenityBullets)}
                          roomPhoto={room.photos[0]}
                          roomAmenities={room.amenityBullets}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {roomOnly.length > 0 && breakfast.length > 0 ? <div className="border-t border-gray-300" /> : null}
                {breakfast.length > 0 && (
                  <div className="p-4 sm:p-5">
                    <h4 className="sr-only">Room with Breakfast</h4>
                    {breakfast.map((plan, idx) => (
                      <div key={(plan.title || plan.name) + idx} className={idx > 0 ? "border-t border-gray-200" : ""}>
                        <RoomPlanCard
                          plan={normalizePlan(plan) as any}
                          roomName={room.name}
                          isSuperBadge={!!plan.isSuperPackage}
                          superHeadline={plan.isSuperPackage ? plan.superPackageHeadline : undefined}
                          onBookNow={(plan) => handleBookNow(plan, room.name, room.photos[0], room.amenityBullets)}
                          roomPhoto={room.photos[0]}
                          roomAmenities={room.amenityBullets}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
function RoomImageSlider({ images, roomName }: { images: string[]; roomName: string }) {
  const [index, setIndex] = useState(0)

  const nextImage = () => setIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setIndex((prev) => (prev - 1 + images.length) % images.length)

  return (
    <div className="relative w-full h-full">
      <Image
        key={images[index]}
        src={images[index]}
        alt={`${roomName} photo ${index + 1}`}
        fill
        className="object-cover transition-all duration-500"
      />

      {/* Controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition ${
                  i === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
