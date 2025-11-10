"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

type DateContextType = {
  checkInDate: Date | null
  checkOutDate: Date | null
  setCheckInDate: (date: Date | null) => void
  setCheckOutDate: (date: Date | null) => void
  clearDates: () => void
  hasValidDates: boolean
  nights: number
}

const DateContext = createContext<DateContextType | undefined>(undefined)

export function DateProvider({ children }: { children: ReactNode }) {
  // Set default dates (today for check-in, tomorrow for check-out)
  const getDefaultCheckIn = () => {
    const today = new Date()
    today.setHours(14, 0, 0, 0) // Set to 2:00 PM for check-in time
    return today
  }

  const getDefaultCheckOut = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(11, 0, 0, 0) // Set to 11:00 AM for check-out time
    return tomorrow
  }

  const [checkInDate, setCheckInDate] = useState<Date | null>(getDefaultCheckIn())
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(getDefaultCheckOut())

  // Calculate number of nights
  const nights = checkInDate && checkOutDate 
    ? Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))
    : 1

  // Check if dates are valid (check-out must be after check-in)
  const hasValidDates = Boolean(checkInDate && checkOutDate && checkOutDate > checkInDate)

  // Clear both dates
  const clearDates = () => {
    setCheckInDate(null)
    setCheckOutDate(null)
  }

  // Validate dates when they change
  useEffect(() => {
    if (checkInDate && checkOutDate && checkOutDate <= checkInDate) {
      // If check-out is same as or before check-in, auto-adjust to next day
      const nextDay = new Date(checkInDate)
      nextDay.setDate(nextDay.getDate() + 1)
      setCheckOutDate(nextDay)
    }
  }, [checkInDate, checkOutDate])

  // Set default dates on initial load if not set
  useEffect(() => {
    if (!checkInDate) {
      setCheckInDate(getDefaultCheckIn())
    }
    if (!checkOutDate) {
      setCheckOutDate(getDefaultCheckOut())
    }
  }, [checkInDate,checkOutDate])

  const value: DateContextType = {
    checkInDate,
    checkOutDate,
    setCheckInDate,
    setCheckOutDate,
    clearDates,
    hasValidDates,
    nights
  }

  return (
    <DateContext.Provider value={value}>
      {children}
    </DateContext.Provider>
  )
}

export function useDateContext() {
  const context = useContext(DateContext)
  if (!context) throw new Error("useDateContext must be used within DateProvider")
  return context
}