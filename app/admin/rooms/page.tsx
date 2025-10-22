"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { Card } from "@/components/base/card"
import { Button } from "@/components/base/button"
import { BookingsSection } from "@/components/admin/booking"
import Image from "next/image"

type RatePlanGroup = "room-only" | "breakfast"

type Plan = {
  title: string
  group: RatePlanGroup
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

type DynamicPricing = {
  _id?: string
  startDate: string
  endDate: string
  price: number
  inventory: number
  enabled: boolean
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
  basePrice?: number
  inventory?: number
  photos: string[]
  amenityBullets: string[]
  plans: Plan[]
  dynamicPricing: DynamicPricing[]
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
      inventory: 0, // Initialize with 0
      basePrice: 0, // Initialize with 0
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
      dynamicPricing: [],
    }),
    [],
  )

  const [form, setForm] = useState<RoomForm>(emptyForm)
  const isEditing = !!form._id

  // raw comma-separated inputs
  const [photosStr, setPhotosStr] = useState<string>("")
  const [amenitiesStr, setAmenitiesStr] = useState<string>("")
  
  const [uploading, setUploading] = useState(false)

  // Dynamic pricing form
  const [dynamicPriceForm, setDynamicPriceForm] = useState<DynamicPricing>({
    startDate: "",
    endDate: "",
    price: 0,
    inventory: 0,
    enabled: true,
  })

  function update<K extends keyof RoomForm>(key: K, value: RoomForm[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function updateDynamicPriceForm<K extends keyof DynamicPricing>(key: K, value: DynamicPricing[K]) {
    setDynamicPriceForm((f) => ({ ...f, [key]: value }))
  }

  function addDynamicPrice() {
    if (!dynamicPriceForm.startDate || !dynamicPriceForm.endDate) {
      alert("Please select start and end dates")
      return
    }
    if (dynamicPriceForm.price <= 0) {
      alert("Please enter a valid price")
      return
    }
    if (dynamicPriceForm.inventory < 0) {
      alert("Please enter a valid inventory")
      return
    }

    // Check for date conflicts
    const startDate = new Date(dynamicPriceForm.startDate)
    const endDate = new Date(dynamicPriceForm.endDate)
    
    if (startDate >= endDate) {
      alert("End date must be after start date")
      return
    }

    const hasConflict = form.dynamicPricing.some((dp) => {
      if (!dp._id) return false // Skip the one we're potentially editing
      const existingStart = new Date(dp.startDate)
      const existingEnd = new Date(dp.endDate)
      return (
        (startDate <= existingEnd && endDate >= existingStart) &&
        dp._id !== dynamicPriceForm._id
      )
    })

    if (hasConflict) {
      alert("This date range conflicts with an existing dynamic pricing rule")
      return
    }

    if (dynamicPriceForm._id) {
      // Update existing
      setForm((f) => ({
        ...f,
        dynamicPricing: f.dynamicPricing.map((dp) =>
          dp._id === dynamicPriceForm._id ? { ...dynamicPriceForm } : dp
        ),
      }))
    } else {
      // Add new
      setForm((f) => ({
        ...f,
        dynamicPricing: [...f.dynamicPricing, { ...dynamicPriceForm, _id: Date.now().toString() }],
      }))
    }

    // Reset form
    setDynamicPriceForm({
      startDate: "",
      endDate: "",
      price: 0,
      inventory: 0,
      enabled: true,
    })
  }

  function editDynamicPrice(item: DynamicPricing) {
    setDynamicPriceForm({
      ...item,
      startDate: item.startDate.split('T')[0], // Format for date input
      endDate: item.endDate.split('T')[0],
    })
  }

  function removeDynamicPrice(id: string) {
    setForm((f) => ({
      ...f,
      dynamicPricing: f.dynamicPricing.filter((dp) => dp._id !== id),
    }))
  }

  async function save() {
    console.log("💾 Saving room data:", form)
    
    // Merge uploaded photos (form.photos) with manually entered URLs (photosStr)
    const manualPhotos = photosStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    
    const allPhotos = [...form.photos, ...manualPhotos]

    // Ensure inventory and basePrice are numbers, not strings or undefined
    const payload = {
      ...form,
      photos: allPhotos,
      amenityBullets: amenitiesStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      inventory: Number(form.inventory) || 0, // Force number conversion
      basePrice: Number(form.basePrice) || 0, // Force number conversion
      dynamicPricing: form.dynamicPricing.map((dp) => ({
        ...dp,
        startDate: new Date(dp.startDate),
        endDate: new Date(dp.endDate),
        price: Number(dp.price) || 0,
        inventory: Number(dp.inventory) || 0,
      })),
    }

    console.log("📤 Payload being sent:", payload)

    const res = await fetch(isEditing ? `/api/rooms/${form._id || form.slug}` : "/api/rooms", {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    
    const j = await res.json().catch(() => ({}))
    console.log("📥 API Response:", { status: res.status, data: j })
    
    if (res.ok) {
      setForm(emptyForm)
      setPhotosStr("")
      setAmenitiesStr("")
      setDynamicPriceForm({
        startDate: "",
        endDate: "",
        price: 0,
        inventory: 0,
        enabled: true,
      })
      await mutate()
      alert("Saved successfully!")
    } else {
      alert("Failed: " + (j.error || res.statusText))
    }
  }

  function startEdit(item: RoomForm) {
    console.log("✏️ Starting edit for room:", item)
    
    setForm({
      _id: item._id,
      name: item.name || "",
      slug: item.slug || "",
      sizeSqft: item.sizeSqft,
      sizeSqm: item.sizeSqm,
      view: item.view,
      bedType: item.bedType,
      basePrice: item.basePrice || 0, // Ensure number
      inventory: item.inventory || 0, // Ensure number
      bathrooms: item.bathrooms,
      photos: item.photos || [],
      amenityBullets: item.amenityBullets || [],
      plans: item.plans || [],
      dynamicPricing: (item.dynamicPricing || []).map((dp: DynamicPricing) => ({
        _id: dp._id,
        startDate: new Date(dp.startDate).toISOString().split('T')[0],
        endDate: new Date(dp.endDate).toISOString().split('T')[0],
        price: dp.price,
        inventory: dp.inventory,
        enabled: dp.enabled !== false,
      })),
    })
    setPhotosStr("")
    setAmenitiesStr((item.amenityBullets || []).join(", "))
    setDynamicPriceForm({
      startDate: "",
      endDate: "",
      price: 0,
      inventory: 0,
      enabled: true,
    })
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
    } catch {
      alert("Upload failed")
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
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Base Price</span>
                      <input
                        type="number"
                        className="border rounded-md px-3 py-2 bg-background"
                        value={form.basePrice || 0}
                        onChange={(e) => update("basePrice", Number(e.target.value))}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Default Inventory</span>
                      <input
                        type="number"
                        className="border rounded-md px-3 py-2 bg-background"
                        value={form.inventory || 0}
                        onChange={(e) => update("inventory", Number(e.target.value))}
                      />
                    </label>
                  </div>
                </div>

                {/* Dynamic Pricing */}
                <div className="pt-4 border-t">
                  <h3 className="text-base font-medium mb-3 text-foreground">Dynamic Pricing</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Start Date</span>
                      <input
                        type="date"
                        className="border rounded-md px-3 py-2 bg-background"
                        value={dynamicPriceForm.startDate}
                        onChange={(e) => updateDynamicPriceForm("startDate", e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">End Date</span>
                      <input
                        type="date"
                        className="border rounded-md px-3 py-2 bg-background"
                        value={dynamicPriceForm.endDate}
                        onChange={(e) => updateDynamicPriceForm("endDate", e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Price</span>
                      <input
                        type="number"
                        className="border rounded-md px-3 py-2 bg-background"
                        value={dynamicPriceForm.price}
                        onChange={(e) => updateDynamicPriceForm("price", Number(e.target.value))}
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">Inventory</span>
                      <input
                        type="number"
                        className="border rounded-md px-3 py-2 bg-background"
                        value={dynamicPriceForm.inventory}
                        onChange={(e) => updateDynamicPriceForm("inventory", Number(e.target.value))}
                      />
                    </label>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <Button onClick={addDynamicPrice}>
                      {dynamicPriceForm._id ? "Update Rule" : "Add Rule"}
                    </Button>
                    {dynamicPriceForm._id && (
                      <Button 
                        variant="outline" 
                        onClick={() => setDynamicPriceForm({
                          startDate: "",
                          endDate: "",
                          price: 0,
                          inventory: 0,
                          enabled: true,
                        })}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>

                  {form.dynamicPricing.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Active Pricing Rules</h4>
                      {form.dynamicPricing.map((rule) => (
                        <div key={rule._id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              {new Date(rule.startDate).toLocaleDateString()} - {new Date(rule.endDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Price: ₹{rule.price} • Inventory: {rule.inventory}
                              {!rule.enabled && " • Disabled"}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => editDynamicPrice(rule)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="accent"
                              onClick={() => removeDynamicPrice(rule._id!)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                            <Image
                              src={src || "/placeholder.svg"}
                              alt="uploaded"
                              width={80}
                              height={80}
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
                    {data.map((r: RoomForm) => (
                      <div key={r._id} className="py-3 flex items-center justify-between">
                        <div>
                          <div className="font-medium">{r.name}</div>
                          <div className="text-sm text-muted-foreground">
                            slug: {r.slug} • Base: ₹{r.basePrice} • 
                            Inventory: {r.inventory} • 
                            Dynamic Rules: {r.dynamicPricing?.length || 0}
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