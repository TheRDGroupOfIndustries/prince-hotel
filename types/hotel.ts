export type Currency = "INR"

export interface RatePlan {
  id: string
  name: "Room Only" | "Room with Breakfast"
  refundable: boolean
  perks?: string[]
  cancellationPolicy?: string
  price: number // per night inclusive of taxes (display)
  currency: Currency
  ctaLabel?: string,
  originalPrice?: number
  listPrice?: number // optional crossed MRP shown in hero/right rail
}
export interface DynamicPricing {
  _id: string;
  startDate: string;
  endDate: string;
  price: number;
  inventory: number;
  enabled: boolean;
}
export interface RoomType {
  id: string;
  _id: string;
  name: string;
  shortDescription?: string;
  bedInfo?: string;
  sizeSqft?: number;
  amenityBullets: string[];
  amenities: string[];
  
  basePrice: number; // starting price for this room type (used in listing)
  inventory: number; // number of rooms available
  photos: string[]; // image urls (can be placeholder)
  ratePlans: RatePlan[];
  occupancy: {
    adults: number;
    children?: number;
  };
  view?: string;
  bedType?: string;
  bathrooms?: number;
  
  // Dynamic Pricing Support
  dynamicPricing?: DynamicPricing[];
}

export interface ReviewBreakdown {
  overall: number // 0-5
  total: number
  aspects: { label: string; score: number }[]
}

export interface SimilarProperty {
  id: string
  name: string
  price: number
  currency: Currency
  photo: string
  rating?: number
  city: string
}

export interface HotelMeta {
  id: string
  name: string
  city: string
  country: string
  rating: number
  ratingLabel: string
  reviewCount: number
  startingPrice: number
  currency: Currency
  addressLine?: string
  heroPhotos: string[]
  coordinates?: { lat: number; lng: number }
  amenitiesHighlights: string[]
  rules: {
    checkInFrom: string
    checkOutUntil: string
    importantNotes?: string[]
  }
  aboutText?: string // short "About Property" copy
  nearestLandmark?: { name: string; blurb: string } // used in hero mini location card
  roomTypes: RoomType[]
  reviews: ReviewBreakdown
  similar: SimilarProperty[]
  logo?: string // hotel logo path
}
