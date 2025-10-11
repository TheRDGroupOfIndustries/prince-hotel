import mongoose, { Schema, type Types, type Model } from "mongoose"

export type RatePlanGroup = "room-only" | "breakfast"

export interface IRatePlan {
  _id?: Types.ObjectId
  title: string // e.g., "Room With Free Cancellation"
  group: RatePlanGroup // "room-only" | "breakfast"
  inclusions?: string[] // bullet list under the plan
  badges?: string[] // e.g., ["Non-Refundable"]
  listPrice?: number // MRP crossed out
  price: number // current price
  currency?: string // default INR
  taxesAndFees?: string // e.g., "+ ₹246 Taxes & Fees per night"
  offerText?: string // small green banner text
  refundable?: boolean
  breakfastIncluded?: boolean
  freeCancellationText?: string // e.g., "Free Cancellation till 24 hrs before check in"
  originalPrice?: number // added for compatibility with admin and UI
  isSuperPackage?: boolean
  superPackageHeadline?: string
}

export interface IRoom {
  _id?: Types.ObjectId
  name: string // e.g., "Super Deluxe Room"
  slug: string // unique key for routing if needed
  photos: string[] // gallery
  // Feature summary for the left column
  sizeSqft?: number
  sizeSqm?: number
  view?: string // e.g., "City View"
  bedType?: string // e.g., "1 Double Bed"
  bathrooms?: number
  amenityBullets?: string[] // bullet list: AC, Mineral Water, etc.
  // Plans shown in the right column
  plans: IRatePlan[]
  createdAt?: Date
  updatedAt?: Date
}

const RatePlanSchema = new Schema<IRatePlan>(
  {
    title: { type: String, required: true },
    group: { type: String, enum: ["room-only", "breakfast"], required: true },
    inclusions: [{ type: String }],
    badges: [{ type: String }],
    listPrice: { type: Number },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    taxesAndFees: { type: String },
    offerText: { type: String },
    refundable: { type: Boolean },
    breakfastIncluded: { type: Boolean },
    freeCancellationText: { type: String },
    originalPrice: { type: Number }, // added for compatibility with admin and UI
    isSuperPackage: { type: Boolean, default: false },
    superPackageHeadline: { type: String },
  },
  { _id: true },
)

const RoomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    photos: [{ type: String, required: true }],
    sizeSqft: { type: Number },
    sizeSqm: { type: Number },
    view: { type: String },
    bedType: { type: String },
    bathrooms: { type: Number },
    amenityBullets: [{ type: String }],
    plans: { type: [RatePlanSchema], default: [] },
  },
  { timestamps: true },
)

export const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema)
