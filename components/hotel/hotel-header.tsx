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
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex flex-col items-center md:flex-row md:items-center md:gap-3 text-center md:text-left">
        {logo && (
          <img
            src={logo || "/placeholder.svg"}
            alt={`${name} logo`}
            className="h-12 w-auto mb-2 md:mb-0"
          />
        )}
        <div>
          
        </div>
      </div>
    </header>
  )
}
