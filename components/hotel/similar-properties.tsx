import type { SimilarProperty } from "@/types/hotel"
import { Card } from "@/components/base/card"
import { Button } from "@/components/base/button"

interface Props {
  items: SimilarProperty[]
}

export function SimilarProperties({ items }: Props) {
  return (
    <section aria-label="Similar properties" className="space-y-3">
      <h2 className="text-lg font-semibold">Similar Properties</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {items.map((p) => {
          const fmt = new Intl.NumberFormat("en-IN", { style: "currency", currency: p.currency })
          return (
            <Card key={p.id} className="overflow-hidden">
              <img
                src={p.photo || "/placeholder.svg"}
                alt={`${p.name} photo`}
                className="aspect-video w-full object-cover"
              />
              <div className="p-3">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.city}</div>
                <div className="mt-2 text-sm font-semibold">{fmt.format(p.price)}</div>
                <Button className="mt-2 w-full bg-transparent" variant="outline">
                  View
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
