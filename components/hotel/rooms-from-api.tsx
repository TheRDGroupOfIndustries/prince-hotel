"use client"

import useSWR from "swr"
import Image from "next/image"
import { Card } from "@/components/base/card"
import { RoomPlanCard } from "@/components/hotel/room-plan-card"

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
  const { data, error, isLoading } = useSWR<ApiRoom[]>("/api/rooms", fetcher)

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
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              <div className="p-5 border-b lg:border-b-0 lg:border-r border-gray-200 bg-card">
                {room.photos?.[0] ? (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                    <Image
                      src={room.photos[0] || "/placeholder.svg?height=240&width=320&query=room-photo"}
                      alt={`${room.name} photo`}
                      fill
                      className="object-cover"
                    />
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
