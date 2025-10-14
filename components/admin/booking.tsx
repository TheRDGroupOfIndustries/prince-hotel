"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card } from "@/components/base/card"

// --- Types ---
type Guest = {
  title: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

type Booking = {
  _id: string
  bookingId: string
  roomName: string
  plan: string
  checkIn: string
  checkOut: string
  nights: number
  guests: Guest[]
  totalAmount: number
  currency: string
  paymentStatus: "completed" | "pending" | "failed"
  bookingStatus: "confirmed" | "cancelled" | "pending"
  createdAt: string
}

type BookingsApiResponse = {
  bookings: Booking[]
  pagination: {
    totalCount: number
  }
}

// --- Helper Functions ---
const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .then((j) => j.data)

function StatusBadge({ status }: { status: string }) {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full capitalize"
  const statusStyles: { [key: string]: string } = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    confirmed: "bg-blue-100 text-blue-800",
    cancelled: "bg-gray-100 text-gray-800",
  }
  const style = statusStyles[status.toLowerCase()] || "bg-gray-100 text-gray-800"
  return <span className={`${baseClasses} ${style}`}>{status}</span>
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount)

const formatDateTime = (dateString: string) =>
  new Date(dateString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

// --- Components ---
function BookingCard({ booking }: { booking: Booking }) {
  const [isOpen, setIsOpen] = useState(false)
  const guest = booking.guests[0]

  return (
    <Card className="p-4 transition-all duration-300">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <div>
          <p className="font-semibold text-primary">{booking.roomName}</p>
          <p className="text-xs text-muted-foreground font-mono">ID: {booking.bookingId}</p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <StatusBadge status={booking.paymentStatus} />
          <StatusBadge status={booking.bookingStatus} />
        </div>
      </div>

      {/* Card Body */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3 pt-3 border-t">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Guest</p>
          <p className="font-medium">
            {guest?.firstName} {guest?.lastName}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Check-in</p>
          <p className="font-medium">{formatDate(booking.checkIn)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Check-out</p>
          <p className="font-medium">{formatDate(booking.checkOut)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Total Amount</p>
          <p className="font-medium">{formatCurrency(booking.totalAmount, booking.currency)}</p>
        </div>
      </div>

      {/* Collapsible section for additional details */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-96 mt-4 pt-4 border-t" : "max-h-0"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Rate Plan</p>
            <p className="font-medium">{booking.plan}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Nights</p>
            <p className="font-medium">{booking.nights}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Guest Email</p>
            <p className="font-medium break-all">{guest?.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Guest Phone</p>
            <p className="font-medium">{guest?.phone}</p>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <p className="text-xs text-muted-foreground">Booking Placed On</p>
            <p className="font-medium">{formatDateTime(booking.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Footer with the toggle button */}
      <div className="mt-4 pt-3 border-t text-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-semibold text-primary hover:underline focus:outline-none"
        >
          {isOpen ? "Hide Details" : "View Details"}
        </button>
      </div>
    </Card>
  )
}

export function BookingsSection() {
  const { data, error, isLoading } = useSWR<BookingsApiResponse>("/api/bookings", fetcher, {
    revalidateOnFocus: false,
  })

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-sm text-muted-foreground">Loading bookings...</div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-sm text-red-600">
          Could not load bookings. Please check the API and try again.
        </div>
      </Card>
    )
  }

  if (!data || data.bookings.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-sm text-muted-foreground">No bookings found.</div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 md:p-6">
        <h2 className="text-xl font-semibold">
          All Bookings
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {data.pagination.totalCount} total
          </span>
        </h2>
      </Card>

      <div className="space-y-4">
        {data.bookings.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>
    </div>
  )
}