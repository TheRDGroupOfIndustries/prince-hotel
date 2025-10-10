interface Props {
  items: string[]
}

export function Amenities({ items }: Props) {
  return (
    <section aria-label="Amenities">
      <h2 className="text-lg font-semibold">Amenities</h2>
      <ul className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
        {items.map((a) => (
          <li key={a} className="rounded-md border bg-card px-3 py-2 text-sm">
            {a}
          </li>
        ))}
      </ul>
    </section>
  )
}
