interface Props {
  lat: number
  lng: number
  title: string
}

export function LocationMap({ lat, lng, title }: Props) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02}%2C${lat - 0.02}%2C${lng + 0.02}%2C${lat + 0.02}&layer=mapnik&marker=${lat}%2C${lng}`
  return (
    <section aria-label="Location">
      <h2 className="text-lg font-semibold">Location</h2>
      <div className="mt-3 overflow-hidden rounded-lg border">
        <iframe title={`${title} map`} src={src} className="h-64 w-full" loading="lazy" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Approximate location shown for {title} in Varanasi.</p>
    </section>
  )
}
