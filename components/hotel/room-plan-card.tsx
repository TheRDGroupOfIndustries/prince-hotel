"use client"
import { Button } from "@/components/base/button"
import type { RatePlan } from "@/types/hotel"
import { CheckCircle, Info } from "lucide-react"

interface Props {
  plan: RatePlan
  roomName: string
  isSuperBadge?: boolean
  superHeadline?: string
}

export function RoomPlanCard({ plan, roomName, isSuperBadge, superHeadline }: Props) {
  const fmt = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: plan.currency,
  })

  const filteredPerks = (plan.perks ?? []).filter((p) => !/refundable/i.test(p))

  return (
    <div className="p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300">
      {superHeadline ? (
        <div className="mb-3 rounded-md border border-[#e5c178] bg-[#fff8e6] text-[#6b4e12] px-3 py-2 text-sm">
          {superHeadline}
        </div>
      ) : null}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-6">
        {/* Left Section — Plan details */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isSuperBadge ? (
              <span className="inline-flex items-center rounded-full border border-[#d1a94f] bg-[#fdf3d6] px-2 py-0.5 text-[11px] font-medium text-[#6b4e12]">
                Super Package
              </span>
            ) : null}
            <h4 className="font-semibold text-base sm:text-lg mb-0 text-gray-900">{plan.name}</h4>
          </div>
          {/* Perks with icons */}
          <ul className="space-y-2 mt-3">
            {filteredPerks.map((perk) => (
              <li key={perk} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="text-green-600 w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{perk}</span>
              </li>
            ))}
            {plan.cancellationPolicy && (
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{plan.cancellationPolicy}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Right Section — Price + CTA */}
        <div className="min-w-[160px] text-left sm:text-right flex flex-col justify-between border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-4">
          <div>
            {plan.originalPrice && (
              <div className="text-sm text-gray-400 line-through">{fmt.format(plan.originalPrice)}</div>
            )}
            <div className="text-lg sm:text-xl font-bold text-gray-900">{fmt.format(plan.price)}</div>
            <div className="text-xs text-gray-500">+ taxes & fees per night</div>
          </div>

          <Button
            className="mt-3 sm:mt-4 w-full sm:w-auto text-sm"
            variant="accent"
            onClick={() => alert(`Booking initiated: ${roomName} • ${plan.name} at ${fmt.format(plan.price)}`)}
          >
            {plan.ctaLabel ?? "BOOK NOW"}
          </Button>
        </div>
      </div>
    </div>
  )
}
