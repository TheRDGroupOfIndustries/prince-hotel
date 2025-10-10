interface Props {
  checkInFrom: string
  checkOutUntil: string
  notes?: string[]
}

export function PropertyRules({ checkInFrom, checkOutUntil, notes = [] }: Props) {
  return (
    <section aria-label="Property rules">
      <h2 className="text-lg font-semibold">Property Rules</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-md border bg-card p-3">
          <div className="text-sm">Check‑in</div>
          <div className="text-muted-foreground text-sm">{checkInFrom}</div>
        </div>
        <div className="rounded-md border bg-card p-3">
          <div className="text-sm">Check‑out</div>
          <div className="text-muted-foreground text-sm">{checkOutUntil}</div>
        </div>
        <div className="rounded-md border bg-card p-3">
          <div className="text-sm">Payment & ID</div>
          <div className="text-muted-foreground text-sm">Govt. ID required at check‑in</div>
        </div>
      </div>
      {notes.length > 0 && (
        <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
