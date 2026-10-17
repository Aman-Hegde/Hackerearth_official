import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IEventRegistration extends Document {
  eventId: Types.ObjectId;
  studentId: Types.ObjectId;
  contactNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventRegistrationSchema = new Schema<IEventRegistration>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    contactNumber: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Contact number must be a valid Indian mobile number"],
    },
  },
  {
    timestamps: true,
  }
);

eventRegistrationSchema.index(
  { eventId: 1, studentId: 1 },
  { unique: true }
);
eventRegistrationSchema.index({ studentId: 1, createdAt: -1 });

const EventRegistration: Model<IEventRegistration> =
  (mongoose.models.EventRegistration as Model<IEventRegistration> | undefined) ||
  mongoose.model<IEventRegistration>(
    "EventRegistration",
    eventRegistrationSchema
  );

export default EventRegistration;
