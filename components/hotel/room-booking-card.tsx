"use client"

import { useState, useMemo, useEffect, useRef} from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/base/button"
import { Card } from "@/components/base/card"
import {
  MinusCircle, PlusCircle, Trash2, User, Utensils, IndianRupee,
  Eye, BedDouble, Ruler, Bath, ChevronLeft, ChevronRight, Loader2, AlertCircle, Hotel, ChevronUp, ChevronDown
} from "lucide-react"
import { facebookEvents } from '@/lib/facebookPixel'

// --- Define Pricing Constants ---
const PRICE_EXTRA_ADULT = 300
const PRICE_BREAKFAST_CP = 150 // For Continental Plan
const PRICE_BREAKFAST_AP = 150 // For American Plan
const PRICE_DINNER_AP = 400 // For American Plan
const MAX_GUESTS_PER_ROOM = 4 // Max adults per room (default)
const MAX_GUESTS_DELUXE = 3 // Max adults per Deluxe room

// --- Define Room Type (with dynamic pricing) ---
interface DynamicPricing {
  _id: string
  startDate: string
  endDate: string
  price: number
  inventory: number
  enabled: boolean
}
interface PriceBreakdown {
  numberOfRooms: number
  basePrice: number
  totalBasePrice: number
  extraAdults: number
  extraAdultsCost: number
  chargeableChildrenForStay: number
  extraChildrenStayCost: number
  breakfastCost: number
  dinnerCost: number
  numChargeableForMeals: number
  totalPrice: number
  effectiveInventory: number
  isDynamicPricing: boolean
  requiredRooms: number
  isManualRoomSelection: boolean
}

interface Room {
  _id: string
  name: string
  photos: string[]
  amenityBullets: string[]
  basePrice: number // The base price for 2 adults
  inventory: number // Available rooms
  view?: string
  bedType?: string
  sizeSqft?: number
  bathrooms?: number
  dynamicPricing?: DynamicPricing[]
}

interface Props {
  room: Room
  checkInDate?: Date | null
  checkOutDate?: Date | null
}

// Helper function to check if room is Deluxe
function isDeluxeRoom(roomName: string): boolean {
  return roomName.trim().toLowerCase().includes("deluxe");
}

// Helper function to get max guests per room based on room type
function getMaxGuestsPerRoom(roomName: string): number {
  return isDeluxeRoom(roomName) ? MAX_GUESTS_DELUXE : MAX_GUESTS_PER_ROOM
}

// A simple image slider component for rooms with multiple photos
function RoomImageSlider({ images, roomName }: { images: string[]; roomName: string }) {
  const [index, setIndex] = useState(0)

  const nextImage = () => setIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setIndex((prev) => (prev - 1 + images.length) % images.length)

  if (!images || images.length === 0) return null

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg group">
      <Image
        key={images[index]}
        src={images[index]}
        alt={`${roomName} photo ${index + 1}`}
        fill
        className="object-cover transition-all duration-500"
      />
      {images.length > 1 && (
        <>
          <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition ${i === index ? "bg-white" : "bg-white/50"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Helper function to get dynamic pricing for specific dates
function getDynamicPricingForDates(room: Room, checkInDate?: Date, checkOutDate?: Date): { price: number; inventory: number; isDynamic: boolean } {
  // If no specific dates provided, use base price
  if (!checkInDate || !checkOutDate) {
    return {
      price: room.basePrice,
      inventory: room.inventory,
      isDynamic: false
    }
  }

  // Check if any dynamic pricing rule applies to these dates
  const activeRule = room.dynamicPricing?.find((rule) => {
    if (!rule.enabled) return false
    
    const ruleStart = new Date(rule.startDate)
    const ruleEnd = new Date(rule.endDate)
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    
    // Set time to midnight for date comparison
    ruleStart.setHours(0, 0, 0, 0)
    ruleEnd.setHours(23, 59, 59, 999)
    checkIn.setHours(0, 0, 0, 0)
    checkOut.setHours(23, 59, 59, 999)
    
    // Check if the ENTIRE stay period falls within the dynamic pricing rule
    // This ensures dynamic pricing only applies when all selected dates are within the rule's range
    return checkIn >= ruleStart && checkOut <= ruleEnd
  })

  if (activeRule) {
    return {
      price: activeRule.price,
      inventory: activeRule.inventory,
      isDynamic: true
    }
  }

  // Return default/base values
  return {
    price: room.basePrice,
    inventory: room.inventory,
    isDynamic: false
  }
}

// Mobile Sticky Booking Card Component
function MobileStickyBookingCard({ 
  room, 
  priceBreakdown, 
  hasSufficientInventory, 
  isLoading, 
  onBookNow,
  isExpanded,
  onToggleExpand 
}: {
  room: Room
  priceBreakdown: PriceBreakdown
  hasSufficientInventory: boolean
  isLoading: boolean
  onBookNow: () => void
  isExpanded: boolean
  onToggleExpand: () => void
}) {
  const fmt = new Intl.NumberFormat("en-IN")
  const isDeluxe = isDeluxeRoom(room.name)

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      {/* Expand/Collapse Handle */}
      <div className="flex justify-center py-1 bg-gray-50 border-b cursor-pointer" onClick={onToggleExpand}>
        <button className="text-gray-500 hover:text-gray-700 transition-colors">
          {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
        </button>
      </div>

      {/* Content - Always show basic info and book button */}
      <div className="p-4">
        {/* Basic Room Info - Always Visible */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">{room.name}</h3>
            <p className="text-sm text-gray-600">
              {priceBreakdown.numberOfRooms} {priceBreakdown.numberOfRooms === 1 ? 'Room' : 'Rooms'} • {2 + priceBreakdown.extraAdults} Adults
              {priceBreakdown.chargeableChildrenForStay > 0 && ` • ${priceBreakdown.chargeableChildrenForStay} Children`}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 flex items-center justify-end">
              <IndianRupee size={16} className="mr-1" />
              {fmt.format(priceBreakdown.totalPrice)}
            </p>
            <p className="text-xs text-gray-500">per night + taxes</p>
          </div>
        </div>

        {/* Expanded Price Breakdown - Only shown when expanded */}
        {isExpanded && (
          <div className="border-t pt-3 mb-3">
            <h4 className="font-medium text-gray-800 text-sm mb-2">Price Breakdown</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Room ({priceBreakdown.numberOfRooms} × ₹{fmt.format(priceBreakdown.basePrice)})</span>
                <span>₹{fmt.format(priceBreakdown.totalBasePrice)}</span>
              </div>
              
              {priceBreakdown.extraAdultsCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Extra Adults ({priceBreakdown.extraAdults})</span>
                  <span>+ ₹{fmt.format(priceBreakdown.extraAdultsCost)}</span>
                </div>
              )}
              
              {priceBreakdown.extraChildrenStayCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Extra Children ({priceBreakdown.chargeableChildrenForStay})</span>
                  <span>+ ₹{fmt.format(priceBreakdown.extraChildrenStayCost)}</span>
                </div>
              )}
              
              {priceBreakdown.breakfastCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Breakfast ({priceBreakdown.numChargeableForMeals} persons)</span>
                  <span>+ ₹{fmt.format(priceBreakdown.breakfastCost)}</span>
                </div>
              )}

              <div className="border-t pt-1 mt-1">
                <div className="flex justify-between font-semibold">
                  <span>Total per night</span>
                  <span>₹{fmt.format(priceBreakdown.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Inventory Warning */}
            {!hasSufficientInventory && priceBreakdown.effectiveInventory > 0 && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-800 text-xs rounded text-center">
                Only {priceBreakdown.effectiveInventory} {priceBreakdown.effectiveInventory === 1 ? 'room' : 'rooms'} available
              </div>
            )}

            {priceBreakdown.effectiveInventory <= 0 && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-800 text-xs rounded text-center">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Sold out
              </div>
            )}
          </div>
        )}

        {/* Book Now Button - Always Visible */}
        <Button 
          onClick={onBookNow} 
          variant="accent" 
          className="w-full" 
          disabled={isLoading || !hasSufficientInventory || priceBreakdown.effectiveInventory <= 0}
        
        >
          {priceBreakdown.effectiveInventory <= 0 ? (
            'Sold Out'
          ) : isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
          ) : (
            `Book Now - ₹${fmt.format(priceBreakdown.totalPrice)}`
          )}
        </Button>
      </div>
    </div>
  )
}

export function RoomBookingCard({ room, checkInDate, checkOutDate }: Props) {
  const router = useRouter()
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState<{ age: number }[]>([])
  const [mealPlan, setMealPlan] = useState<"EP" | "CP" | "AP">("EP")
  const [numberOfRooms, setNumberOfRooms] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isMobileStickyExpanded, setIsMobileStickyExpanded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Track room view when component mounts
  useEffect(() => {
    facebookEvents.viewContent(room.name, room._id, room.basePrice)
  }, [room.name, room._id, room.basePrice])

  // Get dynamic pricing for the selected dates
  const dynamicPricing = useMemo(() => 
    getDynamicPricingForDates(room, checkInDate || undefined, checkOutDate || undefined),
    [room, checkInDate, checkOutDate]
  )

  // Get max guests based on room type
  const maxGuestsPerRoom = useMemo(() => getMaxGuestsPerRoom(room.name), [room.name])
  const isDeluxe = useMemo(() => isDeluxeRoom(room.name), [room.name])

  // Calculate required rooms based on adults and room type
  const requiredRooms = Math.ceil(adults / maxGuestsPerRoom)
  
  // Use either manual selection or calculated required rooms
  const finalNumberOfRooms = Math.max(numberOfRooms, requiredRooms)

  const priceBreakdown = useMemo(() => {
    const effectiveBasePrice = dynamicPricing.price
    const effectiveInventory = dynamicPricing.inventory
    
    const totalBasePrice = finalNumberOfRooms * effectiveBasePrice
    
    // Extra adult calculation for Deluxe (3 adults per room) vs others (4 per room)
    let extraAdults = 0
    if (adults > 2) {
      if (isDeluxe) {
        // For Deluxe: Every room after the first adds capacity for 3 adults
        // Room 1: 2 base + 1 extra = 3 adults
        // Room 2: 3 more adults, etc.
        const adultsAfterBase = adults - 2
        const fullRooms = Math.floor(adultsAfterBase / 3)
        const remainder = adultsAfterBase % 3
        // First extra adult in first room, then 1 extra per additional room + remainder
        extraAdults = Math.min(1, adultsAfterBase) + fullRooms + Math.min(remainder, 1)
      } else {
        // Original logic for non-Deluxe rooms
        const adultsAfterBase = adults - 2
        const fullGroups = Math.floor(adultsAfterBase / 4)
        const remainder = adultsAfterBase % 4
        extraAdults = fullGroups * 2 + Math.min(remainder, 2)
      }
    }

    const extraAdultsCost = extraAdults * PRICE_EXTRA_ADULT
    const chargeableChildrenForStay = children.filter(c => c.age >= 10).length
    const extraChildrenStayCost = chargeableChildrenForStay * PRICE_EXTRA_ADULT
    
    let breakfastCost = 0
    let dinnerCost = 0
    const chargeableChildrenForMeals = children.filter(c => c.age >= 10 && c.age <= 17).length
    const numChargeableForMeals = adults + chargeableChildrenForMeals

    if (mealPlan === "CP") {
      breakfastCost = numChargeableForMeals * PRICE_BREAKFAST_CP
    } else if (mealPlan === "AP") {
      breakfastCost = numChargeableForMeals * PRICE_BREAKFAST_AP
      dinnerCost = numChargeableForMeals * PRICE_DINNER_AP
    }

    const totalPrice = totalBasePrice + extraAdultsCost + extraChildrenStayCost + breakfastCost + dinnerCost

    return {
      numberOfRooms: finalNumberOfRooms,
      basePrice: effectiveBasePrice,
      totalBasePrice,
      extraAdults,
      extraAdultsCost,
      chargeableChildrenForStay,
      extraChildrenStayCost,
      breakfastCost,
      dinnerCost,
      numChargeableForMeals,
      totalPrice,
      effectiveInventory,
      isDynamicPricing: dynamicPricing.isDynamic,
      requiredRooms,
      isManualRoomSelection: numberOfRooms > requiredRooms
    }
  }, [adults, children, mealPlan, dynamicPricing, finalNumberOfRooms, numberOfRooms, requiredRooms, isDeluxe])

  const hasSufficientInventory = priceBreakdown.numberOfRooms <= priceBreakdown.effectiveInventory;

  const handleAddChild = () => setChildren([...children, { age: 5 }])
  const handleRemoveChild = (index: number) => setChildren(children.filter((_, i) => i !== index))
  const handleChildAgeChange = (index: number, age: number) => {
    const newChildren = [...children]
    newChildren[index].age = isNaN(age) ? 0 : age
    setChildren(newChildren)
  }

  const handleAddRoom = () => {
    if (numberOfRooms < priceBreakdown.effectiveInventory) {
      setNumberOfRooms(prev => prev + 1)
    }
  }

  const handleRemoveRoom = () => {
    if (numberOfRooms > requiredRooms) {
      setNumberOfRooms(prev => prev - 1)
    }
  }

  const handleBookNow = async () => {
    // Track booking initiation
    facebookEvents.initiateCheckout(priceBreakdown.totalPrice)
    
    if (!hasSufficientInventory || priceBreakdown.effectiveInventory <= 0) {
      alert("This room is not available for your selection.")
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch('/api/booking/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room._id,
          roomName: room.name,
          adults,
          children,
          mealPlan,
          numberOfRooms: priceBreakdown.numberOfRooms,
          checkInDate: checkInDate?.toISOString(),
          checkOutDate: checkOutDate?.toISOString(),
          basePrice: priceBreakdown.basePrice,
          isDynamicPricing: priceBreakdown.isDynamicPricing,
          isDeluxeRoom: isDeluxe
        }),
      })

      const result = await response.json()

      if (result.success && result.quoteId) {
        router.push(`/booking?quoteId=${result.quoteId}`)
      } else {
        alert(result.error || 'Could not initiate booking. Please try again.')
        setIsLoading(false)
      }
    } catch {
      alert('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  const fmt = new Intl.NumberFormat("en-IN")
  const currentBreakfastPrice = mealPlan === 'AP' ? PRICE_BREAKFAST_AP : PRICE_BREAKFAST_CP

  // Show mobile sticky card only when this specific room card is in view
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      {
        threshold: 0.5, // When 50% of the card is visible
        rootMargin: '-50px 0px -100px 0px' // Adjust margins to trigger appropriately
      }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Mobile Sticky Booking Card - Only show when this room card is in view */}
      {isInView && (
        <MobileStickyBookingCard
          room={room}
          priceBreakdown={priceBreakdown}
          hasSufficientInventory={hasSufficientInventory}
          isLoading={isLoading}
          onBookNow={handleBookNow}
          isExpanded={isMobileStickyExpanded}
          onToggleExpand={() => setIsMobileStickyExpanded(!isMobileStickyExpanded)}
        />
      )}

      {/* Main Room Card */}
      <div ref={cardRef}>
        <Card className="p-0 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-0 mb-20 lg:mb-0">
          <div className="p-5 border-b lg:border-b-0 lg:border-r border-gray-200 bg-card">
            <RoomImageSlider images={room.photos} roomName={room.name} />
            <h3 className="mt-4 font-semibold text-xl text-foreground">{room.name}</h3>

            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {room.view && <div className="flex items-center gap-2"><Eye size={16} /> {room.view}</div>}
              {room.bedType && <div className="flex items-center gap-2"><BedDouble size={16} /> {room.bedType}</div>}
              {room.sizeSqft && <div className="flex items-center gap-2"><Ruler size={16} /> {room.sizeSqft} sq.ft</div>}
              {room.bathrooms && <div className="flex items-center gap-2"><Bath size={16} /> {room.bathrooms} Bathroom</div>}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              {room.amenityBullets?.map((a) => <div key={a} className="flex items-start gap-2"><span className="mt-1">•</span>{a}</div>)}
            </div>
          </div>

          <div className="lg:col-span-2 p-5 flex flex-col justify-between">
            <div className="space-y-5">
                {/* Room Selection */}
                <div className="mt-4 p-3 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Hotel size={16} /> Number of Rooms
                    </label>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleRemoveRoom} 
                        className="text-red-500 disabled:text-gray-300" 
                        disabled={numberOfRooms <= requiredRooms}
                      >
                        <MinusCircle size={20} />
                      </button>
                      <span className="font-bold w-4 text-center">{numberOfRooms}</span>
                      <button 
                        onClick={handleAddRoom} 
                        className="text-green-500 disabled:text-gray-300"
                        disabled={numberOfRooms >= priceBreakdown.effectiveInventory}
                      >
                        <PlusCircle size={20} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Room selection info */}
                  {requiredRooms > 1 && (
                    <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                      <strong>Note:</strong> For {adults} adults in {isDeluxe ? 'Deluxe rooms' : 'this room type'}, minimum {requiredRooms} {requiredRooms === 1 ? 'room' : 'rooms'} required.
                      {numberOfRooms > requiredRooms && (
                        <span className="block mt-1 text-green-600">
  You&apos;ve selected extra room{numberOfRooms - requiredRooms > 1 ? 's' : ''} for more comfort.
</span>

                      )}
                    </div>
                  )}
                  
                  {numberOfRooms === requiredRooms && requiredRooms > 1 && (
                    <div className="text-xs text-gray-600 mt-1">
                      Maximum {maxGuestsPerRoom} adults per {isDeluxe ? 'Deluxe ' : ''}room
                    </div>
                  )}
                </div>
              <div>
                <h4 className="font-medium text-gray-800 flex items-center gap-2"><User size={18} /> Select Guests</h4>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <label htmlFor="adults" className="text-sm font-medium">Adults</label>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setAdults(Math.max(1, adults - 1))} className="text-red-500 disabled:text-gray-300" disabled={adults <= 1}><MinusCircle size={20} /></button>
                      <span className="font-bold w-4 text-center">{adults}</span>
                      <button onClick={() => setAdults(adults + 1)} className="text-green-500"><PlusCircle size={20} /></button>
                    </div>
                  </div>
                  <div className="p-3 border rounded-md space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">
                        Children <span className="text-xs text-gray-500">(0–17 yrs)</span>
                      </label>
                      <Button variant="outline" onClick={handleAddChild}>Add</Button>
                    </div>
                    {children.map((child, index) => (
                      <div key={index} className="flex items-center justify-between gap-2">
                        <span className="text-sm">Child {index + 1} Age</span>
                        <select
                          value={child.age}
                          onChange={(e) => handleChildAgeChange(index, parseInt(e.target.value))}
                          className="w-20 border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">--</option>
                          {Array.from({ length: 17 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                        <button onClick={() => handleRemoveChild(index)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>

              
              </div>

              <div>
                <h4 className="font-medium text-gray-800 flex items-center gap-2"><Utensils size={18} /> Select Meal Plan</h4>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button onClick={() => setMealPlan("EP")} className={`p-3 border rounded-md text-left transition-colors ${mealPlan === 'EP' ? 'border-primary bg-primary/10' : 'hover:bg-gray-50'}`}>
                        <p className="font-semibold">EP Plan (Room Only)</p>
                        <p className="text-sm text-gray-600 mt-1">Stay only. No meals included.</p>
                    </button>
                    <button onClick={() => setMealPlan("CP")} className={`p-3 border rounded-md text-left transition-colors ${mealPlan === 'CP' ? 'border-primary bg-primary/10' : 'hover:bg-gray-50'}`}>
                        <p className="font-semibold">CP Plan (With Breakfast)</p>
                        <p className="text-sm text-gray-600 mt-1">Adds breakfast at <strong>₹{fmt.format(PRICE_BREAKFAST_CP)} per person</strong>.</p>
                    </button>
                </div>
              </div>
            </div>

            {/* Desktop Price Breakdown & Book Button */}
            <div className="mt-6 pt-5 border-t hidden lg:block">
              <h4 className="font-medium text-gray-800">Price Breakdown</h4>
              
              {/* Base Price Display */}
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-gray-600">
                      Room Price ({priceBreakdown.numberOfRooms} × ₹{fmt.format(priceBreakdown.basePrice)})
                    </span>
                    {priceBreakdown.isManualRoomSelection && (
                      <div className="text-xs text-green-600 mt-1">
                        Extra room{priceBreakdown.numberOfRooms - priceBreakdown.requiredRooms > 1 ? 's' : ''} selected for comfort
                      </div>
                    )}
                  </div>
                  <span className="font-medium">₹{fmt.format(priceBreakdown.totalBasePrice)}</span>
                </div>
                
                {priceBreakdown.extraAdultsCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Extra Adult ({priceBreakdown.extraAdults} x ₹{PRICE_EXTRA_ADULT})</span>
                    <span>+ ₹{fmt.format(priceBreakdown.extraAdultsCost)}</span>
                  </div>
                )}
                {priceBreakdown.extraChildrenStayCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Extra Child (10+ yrs) ({priceBreakdown.chargeableChildrenForStay} x ₹{PRICE_EXTRA_ADULT})</span>
                    <span>+ ₹{fmt.format(priceBreakdown.extraChildrenStayCost)}</span>
                  </div>
                )}
                {priceBreakdown.breakfastCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Breakfast ({priceBreakdown.numChargeableForMeals} x ₹{currentBreakfastPrice})</span>
                    <span>+ ₹{fmt.format(priceBreakdown.breakfastCost)}</span>
                  </div>
                )}
                {mealPlan === 'AP' && priceBreakdown.dinnerCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dinner ({priceBreakdown.numChargeableForMeals} x ₹{PRICE_DINNER_AP})</span>
                    <span>+ ₹{fmt.format(priceBreakdown.dinnerCost)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t flex items-center justify-between">
                <p className="text-lg font-bold text-gray-900">Total Per Night</p>
                <p className="text-lg font-bold text-gray-900 flex items-center">
                  <IndianRupee size={18} />
                  {fmt.format(priceBreakdown.totalPrice)}
                </p>
              </div>
              <p className="text-right text-xs text-gray-500">+ taxes & fees</p>

              {/* Inventory Warnings */}
              {!hasSufficientInventory && priceBreakdown.effectiveInventory > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-md text-center">
                  Only <strong>{priceBreakdown.effectiveInventory} {priceBreakdown.effectiveInventory === 1 ? 'room' : 'rooms'}</strong> available for selected dates. Please reduce the number of rooms.
                </div>
              )}

              {priceBreakdown.effectiveInventory <= 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-md text-center">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Sold out for selected dates
                </div>
              )}

              {priceBreakdown.isDynamicPricing && priceBreakdown.effectiveInventory > 0 && priceBreakdown.effectiveInventory < 5 && (
                <div className="mt-2 p-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-md text-center">
                  Only {priceBreakdown.effectiveInventory} {priceBreakdown.effectiveInventory === 1 ? 'room' : 'rooms'} left at this special rate!
                </div>
              )}

              <Button 
                onClick={handleBookNow} 
                variant="accent" 
                className="w-full mt-4" 
                disabled={isLoading || !hasSufficientInventory || priceBreakdown.effectiveInventory <= 0}
              >
                {priceBreakdown.effectiveInventory <= 0 ? (
                  'Sold Out'
                ) : isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  `Book Now`
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}