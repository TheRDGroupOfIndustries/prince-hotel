import { Card } from "@/components/base/card"
import type { RoomType } from "@/types/hotel"
import { RoomPlanCard } from "./room-plan-card"

interface Props {
  room: RoomType
}

export function RoomTypeSection({ room }: Props) {
  const details: string[] = [room.bedInfo || "", room.sizeSqft ? `${room.sizeSqft} sq.ft` : ""].filter(Boolean)

  return (
    <section className="rounded-lg border bg-card">
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <img
            src={room.photos[0] || "/placeholder.svg"}
            alt={`${room.name} image`}
            className="aspect-video w-full rounded-md object-cover"
          />
          <div className="mt-2 text-sm">
            <h3 className="font-medium">{room.name}</h3>
            {details.length > 0 && <p className="text-muted-foreground">{details.join(" • ")}</p>}
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            {room.amenities.slice(0, 10).map((a) => (
              <li key={a} className="rounded-md bg-secondary px-2 py-1 text-secondary-foreground">
                {a}
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="mt-3 inline-block text-xs text-accent underline"
            aria-label={`More details about ${room.name}`}
          >
            More Details
          </a>
        </div>
        <div className="flex flex-col gap-3 md:col-span-2">
          {room.ratePlans.map((plan) => (
            <RoomPlanCard key={plan.id} plan={plan} roomName={room.name} />
          ))}
        </div>
      </div>
      <Card className="m-4 p-3 text-xs text-muted-foreground">
        Taxes and fees may vary by dates and occupancy. Final price shown at checkout.
      </Card>
    </section>
  )
}
