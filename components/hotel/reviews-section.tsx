import type { ReviewBreakdown } from "@/types/hotel"
import { Card } from "@/components/base/card"

interface Props {
  data: ReviewBreakdown
  hotelName: string
}

export function ReviewsSection({ data, hotelName }: Props) {
  return (
    <section aria-label="User ratings and reviews" className="space-y-3">
      <h2 className="text-lg font-semibold">User Ratings &amp; Reviews</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-3xl font-semibold">{data.overall.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground">out of 5</div>
          <div className="mt-2 text-sm">{data.total} verified reviews</div>
        </Card>
        <Card className="p-4 md:col-span-2">
          <ul className="space-y-2">
            {data.aspects.map((a) => (
              <li key={a.label}>
                <div className="flex items-center justify-between text-sm">
                  <span>{a.label}</span>
                  <span className="text-muted-foreground">{a.score.toFixed(1)}</span>
                </div>
                <div className="mt-1 h-2 w-full rounded bg-secondary">
                  <div className="h-2 rounded bg-primary" style={{ width: `${(a.score / 5) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card className="p-4 text-sm text-muted-foreground">
        Recent review • {hotelName}: “Comfortable stay and courteous staff.” — Sample
      </Card>
    </section>
  )
}
