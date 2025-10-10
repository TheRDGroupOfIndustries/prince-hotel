"use client"
import { Button } from "@/components/base/button"
import { Card } from "@/components/base/card"
import type { RatePlan } from "@/types/hotel"

interface Props {
  plan: RatePlan
  roomName: string
}

export function RoomPlanCard({ plan, roomName }: Props) {
  const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: plan.currency })

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-medium">{plan.name}</h4>
          <div className="mt-1 flex flex-wrap gap-2">
            {plan.perks?.map((p) => (
              <span key={p} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                {p}
              </span>
            ))}
            {plan.refundable ? (
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                Free Cancellation
              </span>
            ) : (
              <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs text-destructive-foreground">
                Non‑refundable
              </span>
            )}
          </div>
          {plan.cancellationPolicy && <p className="mt-2 text-xs text-muted-foreground">{plan.cancellationPolicy}</p>}
        </div>
        <div className="min-w-[140px] text-right">
          <div className="text-lg font-semibold">{fmt.format(plan.price)}</div>
          <div className="text-xs text-muted-foreground">per night</div>
          <Button
            className="mt-2 w-full"
            variant="accent"
            onClick={() => alert(`Booking initiated: ${roomName} • ${plan.name} at ${fmt.format(plan.price)} (demo)`)}
          >
            {plan.ctaLabel ?? "BOOK NOW"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
