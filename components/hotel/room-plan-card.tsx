"use client";
import { Button } from "@/components/base/button";
import { Card } from "@/components/base/card";
import type { RatePlan } from "@/types/hotel";

interface Props {
  plan: RatePlan;
  roomName: string;
}

export function RoomPlanCard({ plan, roomName }: Props) {
  const fmt = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: plan.currency,
  });

  return (
    <Card className="flex flex-col gap-3 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Left Section — Plan details */}
        <div className="flex-1">
          <h4 className="font-medium text-sm sm:text-base">{plan.name}</h4>

          <div className="mt-2 flex flex-wrap gap-2">
            {plan.perks?.map((p) => (
              <span
                key={p}
                className="rounded-md bg-secondary px-2 py-0.5 text-[10px] sm:text-xs text-secondary-foreground"
              >
                {p}
              </span>
            ))}

            {plan.refundable ? (
              <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] sm:text-xs text-secondary-foreground">
                Free Cancellation
              </span>
            ) : (
              <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-[10px] sm:text-xs text-destructive-foreground">
                Non-refundable
              </span>
            )}
          </div>

          {plan.cancellationPolicy && (
            <p className="mt-2 text-[11px] sm:text-xs text-muted-foreground leading-snug">
              {plan.cancellationPolicy}
            </p>
          )}
        </div>

        {/* Right Section — Price + CTA */}
        <div className="min-w-[120px] sm:min-w-[140px] text-left sm:text-right">
          <div className="text-base sm:text-lg font-semibold">
            {fmt.format(plan.price)}
          </div>
          <div className="text-[11px] sm:text-xs text-muted-foreground">
            per night
          </div>
          <Button
            className="mt-2 w-full text-xs sm:text-sm"
            variant="accent"
            onClick={() =>
              alert(
                `Booking initiated: ${roomName} • ${plan.name} at ${fmt.format(
                  plan.price
                )} (demo)`
              )
            }
          >
            {plan.ctaLabel ?? "BOOK NOW"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
