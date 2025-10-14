"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/base/button"
import { Card } from "@/components/base/card"
import { 
  MinusCircle, PlusCircle, Trash2, User, Utensils, IndianRupee, 
  Eye, BedDouble, Ruler, Bath, ChevronLeft, ChevronRight, Loader2 
} from "lucide-react"

// --- Define Pricing Constants ---
const PRICE_EXTRA_ADULT = 300
const PRICE_BREAKFAST = 300

// --- Define Room Type ---
interface Room {
  _id: string
  name: string
  photos: string[]
  amenityBullets: string[]
  basePrice: number // The base price for 2 adults
  view?: string
  bedType?: string
  sizeSqft?: number
  bathrooms?: number
}

interface Props {
  room: Room
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


export function RoomBookingCard({ room }: Props) {
  const router = useRouter()
  
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState<{ age: number }[]>([])
  const [mealPlan, setMealPlan] = useState<"EP" | "CP">("EP")
  const [isLoading, setIsLoading] = useState(false)

  const priceBreakdown = useMemo(() => {
    const basePrice = room.basePrice;
    
    const extraAdults = adults - 2;
    const extraAdultsCost = extraAdults > 0 ? extraAdults * PRICE_EXTRA_ADULT : 0;
    
    const chargeableChildrenForStay = children.filter(c => c.age >= 10).length;
    const extraChildrenStayCost = chargeableChildrenForStay * PRICE_EXTRA_ADULT;
    
    let breakfastCost = 0;
    let numChargeableBreakfasts = 0;
    if (mealPlan === "CP") {
      const chargeableChildrenForBreakfast = children.filter(c => c.age >= 10 && c.age <= 17).length;
      numChargeableBreakfasts = adults + chargeableChildrenForBreakfast;
      breakfastCost = numChargeableBreakfasts * PRICE_BREAKFAST;
    }

    const totalPrice = basePrice + extraAdultsCost + extraChildrenStayCost + breakfastCost;

    return {
      basePrice,
      extraAdults,
      extraAdultsCost,
      chargeableChildrenForStay,
      extraChildrenStayCost,
      breakfastCost,
      numChargeableBreakfasts,
      totalPrice,
    }
  }, [room.basePrice, adults, children, mealPlan])

  const handleAddChild = () => setChildren([...children, { age: 5 }]);
  const handleRemoveChild = (index: number) => setChildren(children.filter((_, i) => i !== index));
  const handleChildAgeChange = (index: number, age: number) => {
    const newChildren = [...children];
    newChildren[index].age = isNaN(age) ? 0 : age;
    setChildren(newChildren);
  };

  const handleBookNow = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/booking/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: room._id,
          adults,
          children,
          mealPlan,
        }),
      });

      const result = await response.json();

      if (result.success && result.quoteId) {
        router.push(`/booking?quoteId=${result.quoteId}`);
      } else {
        alert(result.error || 'Could not initiate booking. Please try again.');
        setIsLoading(false);
      }
    } catch {
      alert('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const fmt = new Intl.NumberFormat("en-IN")

  return (
    <Card className="p-0 overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-0">
      <div className="p-5 border-b lg:border-b-0 lg:border-r border-gray-200 bg-card">
        <RoomImageSlider images={room.photos} roomName={room.name} />
        <h3 className="mt-4 font-semibold text-xl text-foreground">{room.name}</h3>
        
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {room.view && <div className="flex items-center gap-2"><Eye size={16}/> {room.view}</div>}
            {room.bedType && <div className="flex items-center gap-2"><BedDouble size={16}/> {room.bedType}</div>}
            {room.sizeSqft && <div className="flex items-center gap-2"><Ruler size={16}/> {room.sizeSqft} sq.ft</div>}
            {room.bathrooms && <div className="flex items-center gap-2"><Bath size={16}/> {room.bathrooms} Bathroom</div>}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
          {room.amenityBullets?.map((a) => <div key={a} className="flex items-start gap-2"><span className="mt-1">•</span>{a}</div>)}
        </div>
      </div>

      <div className="lg:col-span-2 p-5 flex flex-col justify-between">
        <div className="space-y-5">
            <div>
                <h4 className="font-medium text-gray-800 flex items-center gap-2"><User size={18}/> Select Guests</h4>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                        <label htmlFor="adults" className="text-sm font-medium">Adults</label>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setAdults(Math.max(1, adults - 1))} className="text-primary disabled:text-gray-300" disabled={adults <= 1}><MinusCircle size={20}/></button>
                            <span className="font-bold w-4 text-center">{adults}</span>
                            <button onClick={() => setAdults(adults + 1)} className="text-primary"><PlusCircle size={20}/></button>
                        </div>
                    </div>
                  <div className="p-3 border rounded-md space-y-2">
  <div className="flex items-center justify-between">
    <label className="text-sm font-medium">
      Children <span className="text-xs text-gray-500">(0–17 yrs)</span>
    </label>
    <Button variant="outline"  onClick={handleAddChild}>
      Add
    </Button>
  </div>

  {children.map((child, index) => (
    <div key={index} className="flex items-center justify-between gap-2">
      <span className="text-sm">Child {index + 1} Age</span>

      {/* Dropdown for selecting age */}
      <select
        value={child.age}
        onChange={(e) => handleChildAgeChange(index, parseInt(e.target.value))}
        className="w-20 border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">--</option>
        {Array.from({ length: 18 }, (_, i) => (
          <option key={i} value={i}>
            {i}
          </option>
        ))}
      </select>

      <button
        onClick={() => handleRemoveChild(index)}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 size={16} />
      </button>
    </div>
  ))}
</div>

                </div>
            </div>

            <div>
                <h4 className="font-medium text-gray-800 flex items-center gap-2"><Utensils size={18}/> Select Meal Plan</h4>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button onClick={() => setMealPlan("EP")} className={`p-3 border rounded-md text-left transition-colors ${mealPlan === 'EP' ? 'border-primary bg-primary/10' : 'hover:bg-gray-50'}`}>
                        <p className="font-semibold">EP Plan (Room Only)</p>
                        <p className="text-sm text-gray-600 mt-1">This plan includes your stay only. No meals are provided.</p>
                    </button>
                    <button onClick={() => setMealPlan("CP")} className={`p-3 border rounded-md text-left transition-colors ${mealPlan === 'CP' ? 'border-primary bg-primary/10' : 'hover:bg-gray-50'}`}>
                        <p className="font-semibold">CP Plan (With Breakfast)</p>
                        <p className="text-sm text-gray-600 mt-1">
                            Adds breakfast at <strong>₹{fmt.format(PRICE_BREAKFAST)} per person</strong> (free for kids up to 9 years).
                        </p>
                    </button>
                </div>
            </div>
        </div>
        
        <div className="mt-6 pt-5 border-t">
          <h4 className="font-medium text-gray-800">Price Breakdown</h4>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Price (for 2 Adults)</span>
              <span>₹{fmt.format(priceBreakdown.basePrice)}</span>
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
            
            {mealPlan === 'CP' && priceBreakdown.breakfastCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Breakfast ({priceBreakdown.numChargeableBreakfasts} x ₹{PRICE_BREAKFAST})</span>
                <span>+ ₹{fmt.format(priceBreakdown.breakfastCost)}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">Total Per Night</p>
            <p className="text-lg font-bold text-gray-900 flex items-center">
              <IndianRupee size={18}/>{fmt.format(priceBreakdown.totalPrice)}
            </p>
          </div>
          <p className="text-right text-xs text-gray-500">+ taxes & fees</p>

          <Button onClick={handleBookNow} variant="accent" className="w-full mt-4" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'SELECT ROOM'
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}