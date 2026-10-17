import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IEventTeam extends Document {
  eventId: Types.ObjectId;
  name: string;
  normalizedName: string;
  invitationCode: string;
  currentMemberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const eventTeamSchema = new Schema<IEventTeam>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    normalizedName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
      select: false,
    },
    invitationCode: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    currentMemberCount: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Team member count must be an integer",
      },
    },
  },
  { timestamps: true }
);

eventTeamSchema.index({ eventId: 1, normalizedName: 1 }, { unique: true });
eventTeamSchema.index({ eventId: 1, createdAt: 1 });

const EventTeam: Model<IEventTeam> =
  (mongoose.models.EventTeam as Model<IEventTeam> | undefined) ||
  mongoose.model<IEventTeam>("EventTeam", eventTeamSchema);

export default EventTeam;
