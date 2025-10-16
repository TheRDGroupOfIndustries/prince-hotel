import mongoose, { Schema, type Types, type Model } from "mongoose"

export type RatePlanGroup = "room-only" | "breakfast"

export interface IRatePlan {
  _id?: Types.ObjectId
  title: string
  group: RatePlanGroup
  inclusions?: string[]
  badges?: string[]
  listPrice?: number
  price: number
  currency?: string
  taxesAndFees?: string
  offerText?: string
  refundable?: boolean
  breakfastIncluded?: boolean
  freeCancellationText?: string
  originalPrice?: number
  isSuperPackage?: boolean
  superPackageHeadline?: string
}

export interface IDynamicPricing {
  _id?: Types.ObjectId | string
  startDate: Date
  endDate: Date
  price: number
  inventory: number
  enabled: boolean
}

export interface IRoom {
  _id?: Types.ObjectId
  name: string
  slug: string
  photos: string[]
  sizeSqft?: number
  sizeSqm?: number
  view?: string
  bedType?: string
  bathrooms?: number
  basePrice: number
  inventory: number
  amenityBullets?: string[]
  plans?: IRatePlan[]
  dynamicPricing?: IDynamicPricing[]
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
    originalPrice: { type: Number },
    isSuperPackage: { type: Boolean, default: false },
    superPackageHeadline: { type: String },
  },
  { _id: true },
)

const DynamicPricingSchema = new Schema<IDynamicPricing>(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price: { type: Number, required: true },
    inventory: { type: Number, required: true },
    enabled: { type: Boolean, default: true },
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
    basePrice: { type: Number, required: true },
    inventory: { type: Number, required: true },
    bedType: { type: String },
    bathrooms: { type: Number },
    amenityBullets: [{ type: String }],
    plans: { type: [RatePlanSchema], default: [], required: false },
    dynamicPricing: { type: [DynamicPricingSchema], default: [], required: false },
  },
  { timestamps: true },
)

export const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>("Room", RoomSchema)