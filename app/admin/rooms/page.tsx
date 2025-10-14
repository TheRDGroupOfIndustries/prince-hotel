"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { Card } from "@/components/base/card"
import { Button } from "@/components/base/button"
import { BookingsSection } from "@/components/admin/booking"

type Plan = {
  title: string
  group: "room-only" | "breakfast"
  price: number
  originalPrice?: number
  listPrice?: number
  currency?: string
  refundable?: boolean
  inclusions?: string[]
  freeCancellationText?: string
  offerText?: string
  taxesAndFees?: string
  isSuperPackage?: boolean
  superPackageHeadline?: string
}

type RoomForm = {
  _id?: string
  name: string
  slug: string
  sizeSqft?: number
  sizeSqm?: number
  view?: string
  bedType?: string
  bathrooms?: number
  photos: string[]
  amenityBullets: string[]
  plans: Plan[]
}

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((j) => j.data)

function AdminNav({ current, onChange }: { current: string; onChange: (k: string) => void }) {
  const items = [
    { key: "rooms", label: "Rooms" },
    { key: "bookings", label: "Bookings" },
    { key: "settings", label: "Settings" },
  ]
  return (
    <nav className="flex gap-2">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onChange(it.key)}
          className={`px-3 py-2 rounded-md text-sm font-medium border ${
            current === it.key
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-foreground border-border hover:bg-muted"
          }`}
        >
          {it.label}
        </button>
      ))}
    </nav>
  )
}

export default function AdminRoomsPage() {
  const [section, setSection] = useState("rooms")
  const { data, error, isLoading, mutate } = useSWR<RoomForm[]>("/api/rooms", fetcher, {
    revalidateOnFocus: false,
  })
   useEffect(() => {
    console.log("✅ SWR Data:", data)
    console.log("⚠️ SWR Error:", error)
    console.log("⏳ SWR Loading:", isLoading)
  }, [data, error, isLoading])

  const emptyForm: RoomForm = useMemo(
    () => ({
      name: "",
      slug: "",
      amenityBullets: [],
      photos: [],
      plans: [
        {
          title: "Room With Free Cancellation",
          group: "room-only",
          price: 2000,
          currency: "INR",
          refundable: true,
          taxesAndFees: "+ taxes & fees per night",
          freeCancellationText: "Free Cancellation till 24 hrs before check in",
          isSuperPackage: false,
          superPackageHeadline: "",
        },
      ],
    }),
    [],
  )

  const [form, setForm] = useState<RoomForm>(emptyForm)
  const isEditing = !!form._id

  // raw comma-separated inputs
  const [photosStr, setPhotosStr] = useState<string>("")
  const [amenitiesStr, setAmenitiesStr] = useState<string>("")
  const [planInclStr, setPlanInclStr] = useState<string[]>([])

  const [uploading, setUploading] = useState(false)

  function update<K extends keyof RoomForm>(key: K, value: RoomForm[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }
  function updatePlan(index: number, patch: Partial<Plan>) {
    setForm((f) => {
      const plans = [...f.plans]
      plans[index] = { ...plans[index], ...patch }
      return { ...f, plans }
    })
  }
  function addPlan() {
    setForm((f) => ({
      ...f,
      plans: [
        ...f.plans,
        {
          title: "Room With Free Cancellation | Breakfast only",
          group: "breakfast",
          price: 2200,
          currency: "INR",
          refundable: true,
          freeCancellationText: "Free Cancellation till 24 hrs before check in",
          isSuperPackage: false,
          superPackageHeadline: "",
        },
      ],
    }))
    setPlanInclStr((arr) => [...arr, ""])
  }
  function removePlan(i: number) {
    setForm((f) => ({ ...f, plans: f.plans.filter((_, idx) => idx !== i) }))
    setPlanInclStr((arr) => arr.filter((_, idx) => idx !== i))
  }

  async function save() {
    // Merge uploaded photos (form.photos) with manually entered URLs (photosStr)
    const manualPhotos = photosStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    
    const allPhotos = [...form.photos, ...manualPhotos]

    const payload = {
      ...form,
      photos: allPhotos,
      amenityBullets: amenitiesStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      plans: form.plans.map((p, i) => ({
        ...p,
        inclusions: (planInclStr[i] || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      })),
    }
    const res = await fetch(isEditing ? `/api/rooms/${form._id || form.slug}` : "/api/rooms", {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const j = await res.json().catch(() => ({}))
    if (res.ok) {
      setForm(emptyForm)
      setPhotosStr("")
      setAmenitiesStr("")
      setPlanInclStr([])
      await mutate()
      alert("Saved!")
    } else {
      alert("Failed: " + (j.error || res.statusText))
    }
  }

  function startEdit(item: any) {
    setForm({
      _id: item._id,
      name: item.name || "",
      slug: item.slug || "",
      sizeSqft: item.sizeSqft,
      sizeSqm: item.sizeSqm,
      view: item.view,
      bedType: item.bedType,
      bathrooms: item.bathrooms,
      photos: item.photos || [],
      amenityBullets: item.amenityBullets || [],
      plans: (item.plans || []).map((p: any) => ({
        title: p.title ?? p.name ?? "",
        group: p.group,
        price: p.price,
        originalPrice: p.originalPrice,
        listPrice: p.listPrice,
        currency: p.currency ?? "INR",
        refundable: p.refundable,
        inclusions: p.inclusions ?? p.perks ?? [],
        freeCancellationText: p.freeCancellationText ?? p.cancellationPolicy,
        offerText: p.offerText,
        taxesAndFees: p.taxesAndFees,
        isSuperPackage: p.isSuperPackage,
        superPackageHeadline: p.superPackageHeadline,
      })),
    })
    setPhotosStr("")
    setAmenitiesStr((item.amenityBullets || []).join(", "))
    setPlanInclStr((item.plans || []).map((p: any) => (p.inclusions ?? p.perks ?? []).join(", ")))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function onUploadPhotos(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append("file", file)
        const res = await fetch("/api/uploads/image", { method: "POST", body: fd })
        const j = await res.json()
        if (!res.ok) throw new Error(j?.error || "Upload failed")
        urls.push(j.url)
      }
      update("photos", [...form.photos, ...urls])
    } catch (e: any) {
      alert(e.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  function removePhoto(index: number) {
    setForm((f) => ({
      ...f,
      photos: f.photos.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30">
      <header className="border-b bg-card">
        <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">Admin Dashboard</h1>
          <AdminNav current={section} onChange={setSection} />
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-2">
          <Card className="p-4">
            <div className="text-sm font-medium mb-2">Manage</div>
            <ul className="space-y-1 text-sm">
              <li>
                <button
                  className={`hover:underline ${section === "rooms" ? "text-primary font-semibold" : ""}`}
                  onClick={() => setSection("rooms")}
                >
                  Rooms
                </button>
              </li>
              <li>
                <button
                  className={`hover:underline ${section === "bookings" ? "text-primary font-semibold" : ""}`}
                  onClick={() => setSection("bookings")}
                >
                  Bookings
                </button>
              </li>
              <li>
                <button
                  className={`hover:underline ${section === "settings" ? "text-primary font-semibold" : ""}`}
                  onClick={() => setSection("settings")}
                >
                  Settings
                </button>
              </li>
            </ul>
          </Card>

         
        </aside>

        {/* Content */}
        <section className="space-y-6">
          {section === "rooms" && (
            <>
              <Card className="p-4 md:p-6 space-y-5">
                <h2 className="text-xl font-semibold">Create / Edit Room</h2>

                {/* Room Details */}
                <div>
                  <h3 className="text-base font-medium mb-3 text-foreground">Room Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Name</span>
                      <input
                        className="border rounded-md px-3 py-2 bg-background"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Slug (unique)</span>
                      <input
                        className="border rounded-md px-3 py-2 bg-background"
                        value={form.slug}
                        onChange={(e) => update("slug", e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">View</span>
                      <input
                        className="border rounded-md px-3 py-2 bg-background"
                        value={form.view || ""}
                        onChange={(e) => update("view", e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Bed Type</span>
                      <input
                        className="border rounded-md px-3 py-2 bg-background"
                        value={form.bedType || ""}
                        onChange={(e) => update("bedType", e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Bathrooms</span>
                      <input
                        type="number"
                        className="border rounded-md px-3 py-2 bg-background"
                        value={form.bathrooms || 0}
                        onChange={(e) => update("bathrooms", Number(e.target.value))}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Size (sq.ft)</span>
                      <input
                        type="number"
                        className="border rounded-md px-3 py-2 bg-background"
                        value={form.sizeSqft || 0}
                        onChange={(e) => update("sizeSqft", Number(e.target.value))}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Size (sq.m)</span>
                      <input
                        type="number"
                        className="border rounded-md px-3 py-2 bg-background"
                        value={form.sizeSqm || 0}
                        onChange={(e) => update("sizeSqm", Number(e.target.value))}
                      />
                    </label>
                  </div>
                </div>

                {/* Media & Amenities */}
                <div className="pt-4 border-t">
                  <h3 className="text-base font-medium mb-3 text-foreground">Media & Amenities</h3>
                  <div className="grid gap-4">
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Upload Photos (Cloudinary)</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="border rounded-md px-3 py-2 bg-background"
                        onChange={(e) => onUploadPhotos(e.target.files)}
                        disabled={uploading}
                      />
                      <span className="text-xs text-muted-foreground">
                        {uploading ? "Uploading..." : "You can select multiple images"}
                      </span>
                    </label>
                    {form.photos?.length ? (
                      <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {form.photos.map((src, idx) => (
                          <div key={src} className="relative group">
                            <img
                              src={src || "/placeholder.svg"}
                              alt="uploaded"
                              className="h-20 w-full object-cover rounded-md border"
                            />
                            <button
                              onClick={() => removePhoto(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove photo"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">
                        Photos (URLs, comma separated) — optional fallback
                      </span>
                      <input
                        className="border rounded-md px-3 py-2 bg-background"
                        value={photosStr}
                        onChange={(e) => setPhotosStr(e.target.value)}
                        placeholder="https://... , https://..."
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Amenity Bullets (comma separated)</span>
                      <input
                        className="border rounded-md px-3 py-2 bg-background"
                        value={amenitiesStr}
                        onChange={(e) => setAmenitiesStr(e.target.value)}
                      />
                    </label>
                  </div>
                </div>

                {/* Rate Plans */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-medium text-foreground">Rate Plans</h3>
                    <Button onClick={addPlan} variant="accent">
                      Add Plan
                    </Button>
                  </div>
                  <div className="mt-4 space-y-4">
                    {form.plans.map((p, i) => (
                      <Card key={i} className="p-4 border">
                        <div className="grid md:grid-cols-3 gap-3">
                          <label className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground">Title</span>
                            <input
                              className="border rounded-md px-3 py-2 bg-background"
                              value={p.title}
                              onChange={(e) => updatePlan(i, { title: e.target.value })}
                            />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground">Group</span>
                            <select
                              className="border rounded-md px-3 py-2 bg-background"
                              value={p.group}
                              onChange={(e) => updatePlan(i, { group: e.target.value as any })}
                            >
                              <option value="room-only">room-only</option>
                              <option value="breakfast">breakfast</option>
                            </select>
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground">Currency</span>
                            <input
                              className="border rounded-md px-3 py-2 bg-background"
                              value={p.currency || "INR"}
                              onChange={(e) => updatePlan(i, { currency: e.target.value })}
                            />
                          </label>

                          <label className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground">Price</span>
                            <input
                              type="number"
                              className="border rounded-md px-3 py-2 bg-background"
                              value={p.price}
                              onChange={(e) => updatePlan(i, { price: Number(e.target.value) })}
                            />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground">Original/List Price (struck)</span>
                            <input
                              type="number"
                              className="border rounded-md px-3 py-2 bg-background"
                              value={p.originalPrice ?? p.listPrice ?? 0}
                              onChange={(e) =>
                                updatePlan(i, {
                                  originalPrice: Number(e.target.value),
                                  listPrice: Number(e.target.value),
                                })
                              }
                            />
                          </label>
                          <label className="flex items-center gap-2 pt-6">
                            <input
                              type="checkbox"
                              checked={!!p.refundable}
                              onChange={(e) => updatePlan(i, { refundable: e.target.checked })}
                            />
                            <span className="text-sm">Refundable</span>
                          </label>

                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!p.isSuperPackage}
                              onChange={(e) => updatePlan(i, { isSuperPackage: e.target.checked })}
                            />
                            <span className="text-sm">Mark as Super Package</span>
                          </label>
                          <label className="flex flex-col gap-1 md:col-span-3">
                            <span className="text-sm text-muted-foreground">Super Package Headline (banner text)</span>
                            <input
                              className="border rounded-md px-3 py-2 bg-background"
                              value={p.superPackageHeadline || ""}
                              onChange={(e) => updatePlan(i, { superPackageHeadline: e.target.value })}
                              placeholder="Enjoy benefits worth ₹1260 at just ₹504"
                            />
                          </label>

                          <label className="flex flex-col gap-1 md:col-span-3">
                            <span className="text-sm text-muted-foreground">Inclusions (comma separated)</span>
                            <input
                              className="border rounded-md px-3 py-2 bg-background"
                              value={planInclStr[i] || ""}
                              onChange={(e) =>
                                setPlanInclStr((arr) => {
                                  const next = [...arr]
                                  next[i] = e.target.value
                                  return next
                                })
                              }
                            />
                          </label>
                          <label className="flex flex-col gap-1 md:col-span-3">
                            <span className="text-sm text-muted-foreground">Free Cancellation Text</span>
                            <input
                              className="border rounded-md px-3 py-2 bg-background"
                              value={p.freeCancellationText || ""}
                              onChange={(e) => updatePlan(i, { freeCancellationText: e.target.value })}
                            />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground">Offer Text</span>
                            <input
                              className="border rounded-md px-3 py-2 bg-background"
                              value={p.offerText || ""}
                              onChange={(e) => updatePlan(i, { offerText: e.target.value })}
                            />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-sm text-muted-foreground">Taxes & Fees Line</span>
                            <input
                              className="border rounded-md px-3 py-2 bg-background"
                              value={p.taxesAndFees || ""}
                              onChange={(e) => updatePlan(i, { taxesAndFees: e.target.value })}
                            />
                          </label>
                        </div>
                        <div className="mt-3 text-right">
                          <Button variant="outline" onClick={() => removePlan(i)}>
                            Remove
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button onClick={save}>{isEditing ? "Update Room" : "Create Room"}</Button>
                  {isEditing ? (
                    <Button variant="ghost" onClick={() => setForm(emptyForm)}>
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </Card>

              {/* Existing list */}
              <Card className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">
                    Existing Rooms{" "}
                    <span className="text-sm font-normal text-muted-foreground">{data?.length ?? 0} total</span>
                  </h2>
                </div>

                {isLoading && <div className="text-sm text-muted-foreground py-3">Loading rooms…</div>}

                {error && (
                  <div className="text-sm text-red-600 py-3">
                    Could not load rooms. Ensure MONGODB_URI is set in Vars and the API is reachable.
                  </div>
                )}

                {!isLoading && !error && (!data || data.length === 0) && (
                  <div className="text-sm text-muted-foreground py-3">No rooms added yet.</div>
                )}

                {!isLoading && !error && data && data.length > 0 && (
                  <div className="divide-y">
                    {data.map((r: any) => (
                      <div key={r._id} className="py-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{r.name}</div>
                          <div className="text-sm text-muted-foreground">
                            slug: {r.slug} · {r.plans?.length ?? 0} plan(s)
                          </div>
                        </div>
                        <Button variant="outline" onClick={() => startEdit(r)}>
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}

          {section === "bookings" && <BookingsSection/>}
          {section === "settings" && (
            <Card className="p-6">
              <div className="text-sm text-muted-foreground">Settings placeholder (brand, taxes, etc.).</div>
            </Card>
          )}
        </section>
      </main>
    </div>
  )
}