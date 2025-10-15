import mongoose, { Schema, Document, Model } from 'mongoose';

// Define the structure of the data you'll store
export interface IQuote extends Document {
  roomId: mongoose.Schema.Types.ObjectId;
  roomName: string;
    numberOfRooms: number;
  selections: {
    adults: number;
    children: { age: number }[];
    mealPlan: 'EP' | 'CP'|'AP';
  };
  priceBreakdown: object; // Storing the full breakdown object
  createdAt: Date;
}

const QuoteSchema: Schema = new Schema({
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  roomName: { type: String, required: true },
   numberOfRooms: { type: Number, required: true },
  selections: {
    adults: { type: Number, required: true },
    children: [{ age: Number }],
    mealPlan: { type: String, required: true },
  },
  priceBreakdown: { type: Object, required: true },
  // This is the TTL index. Documents will be deleted 15 minutes after their creation time.
  createdAt: { type: Date, default: Date.now, expires: '15m' },
});

// Prevent model recompilation in Next.js hot-reloading environments
const Quote: Model<IQuote> = mongoose.models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);

export default Quote;