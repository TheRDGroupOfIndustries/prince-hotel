interface HotelHeaderProps {
  name: string
  city: string
  country: string
  rating: number
  ratingLabel: string
  reviewCount: number
  startingPrice: number
  currency: "INR"
  logo?: string
}

export function HotelHeader(props: HotelHeaderProps) {
  const { name, city, country, rating, ratingLabel, reviewCount, startingPrice, currency, logo } = props
  const format = new Intl.NumberFormat("en-IN", { style: "currency", currency })

  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        {logo && <img src={logo || "/placeholder.svg"} alt={`${name} logo`} className="h-12 w-auto" />}
        <div>
          <h1 className="text-balance text-2xl font-semibold">{name}</h1>
          <p className="text-muted-foreground">
            {city}, {country}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-[var(--primary)] px-2 py-0.5 text-xs font-medium text-[var(--primary-foreground)]">
              {rating.toFixed(1)}
            </span>
            <span className="text-sm">{ratingLabel}</span>
            <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
          </div>
        </div>
      </div>
      <div className="mt-2 text-right md:mt-0">
        <p className="text-sm text-muted-foreground">Starting from</p>
        <p className="text-xl font-semibold">
          {format.format(startingPrice)} <span className="text-sm font-normal text-muted-foreground">per night</span>
        </p>
      </div>
    </header>
  )
}
