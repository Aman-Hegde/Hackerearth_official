import mongoose, { Schema, Types } from "mongoose";

// Separate collection preserves existing student registrations and their unique index.
export interface GuestParticipant {
  name: string;
  email: string;
  contactNumber: string;
  collegeName?: string;
}
interface GuestRegistration extends GuestParticipant {
  eventId: Types.ObjectId;
  createdAt: Date;
}
const schema = new Schema<GuestRegistration>({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, maxlength: 254 },
  contactNumber: { type: String, required: true, match: /^\d{10}$/ },
  collegeName: { type: String, trim: true, maxlength: 160 },
}, { timestamps: true });
schema.index({ eventId: 1, email: 1 }, { unique: true });
export default mongoose.model<GuestRegistration>("GuestEventRegistration", schema);
