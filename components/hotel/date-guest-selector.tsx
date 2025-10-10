"use client"
import { useState } from "react"
import { Button } from "@/components/base/button"
import { Card } from "@/components/base/card"

export interface DateGuestSelection {
  checkIn: string // ISO yyyy-mm-dd
  checkOut: string // ISO yyyy-mm-dd
  rooms: number
  adults: number
  children: number
}

interface Props {
  onApply(selection: DateGuestSelection): void
}

const todayISO = () => new Date().toISOString().slice(0, 10)

export function DateGuestSelector({ onApply }: Props) {
  const [form, setForm] = useState<DateGuestSelection>({
    checkIn: todayISO(),
    checkOut: todayISO(),
    rooms: 1,
    adults: 2,
    children: 0,
  })

  function nights() {
    const inD = new Date(form.checkIn)
    const outD = new Date(form.checkOut)
    const diff = Math.ceil((+outD - +inD) / (1000 * 60 * 60 * 24))
    return Number.isFinite(diff) && diff > 0 ? diff : 0
  }

  function apply() {
    if (nights() <= 0) {
      alert("Select valid dates. Check-out must be after check-in.")
      return
    }
    onApply(form)
    alert("Dates & guests updated.")
  }

  return (
    <Card className="p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          apply()
        }}
        className="grid grid-cols-1 gap-3 md:grid-cols-5"
        aria-label="Change Dates and Guests"
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Check‑in</span>
          <input
            type="date"
            value={form.checkIn}
            onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
            className="h-10 rounded-md border bg-background px-3"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Check‑out</span>
          <input
            type="date"
            value={form.checkOut}
            onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
            className="h-10 rounded-md border bg-background px-3"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Rooms</span>
          <input
            type="number"
            min={1}
            value={form.rooms}
            onChange={(e) => setForm({ ...form, rooms: Number(e.target.value) })}
            className="h-10 rounded-md border bg-background px-3"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Adults</span>
          <input
            type="number"
            min={1}
            value={form.adults}
            onChange={(e) => setForm({ ...form, adults: Number(e.target.value) })}
            className="h-10 rounded-md border bg-background px-3"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">Children</span>
          <input
            type="number"
            min={0}
            value={form.children}
            onChange={(e) => setForm({ ...form, children: Number(e.target.value) })}
            className="h-10 rounded-md border bg-background px-3"
          />
        </label>
        <div className="md:col-span-5 flex justify-end">
          <Button type="submit">Update Search</Button>
        </div>
        <p className="md:col-span-5 text-xs text-muted-foreground">Nights: {nights()}</p>
      </form>
    </Card>
  )
}
