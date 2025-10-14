interface Props {
  lat: number
  lng: number
  title: string
}

export function LocationMap({ lat, lng, title }: Props) {
  // Build the embed URL manually (no API key needed)
  const src = `https://www.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`

  return (
    <section aria-label="Location">
      <h2 className="text-lg font-semibold">Location</h2>
      <div className="mt-3 overflow-hidden rounded-lg border">
        <iframe
          title={`${title} map`}
          src={src}
          className="h-64 w-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Approximate location shown for {title}.
      </p>
    </section>
  )
}
