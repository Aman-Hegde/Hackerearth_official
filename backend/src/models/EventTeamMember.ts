import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IEventTeamMember extends Document {
  eventId: Types.ObjectId;
  teamId: Types.ObjectId;
  participantType: "member" | "guest";
  studentId?: Types.ObjectId;
  eventRegistrationId?: Types.ObjectId;
  guestRegistrationId?: Types.ObjectId;
  isLeader: boolean;
  accessTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventTeamMemberSchema = new Schema<IEventTeamMember>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    teamId: { type: Schema.Types.ObjectId, ref: "EventTeam", required: true, index: true },
    participantType: {
      type: String,
      enum: ["member", "guest"],
      required: true,
    },
    studentId: { type: Schema.Types.ObjectId, ref: "User" },
    eventRegistrationId: {
      type: Schema.Types.ObjectId,
      ref: "EventRegistration",
    },
    guestRegistrationId: {
      type: Schema.Types.ObjectId,
      ref: "GuestEventRegistration",
    },
    isLeader: { type: Boolean, default: false },
    accessTokenHash: { type: String, select: false },
  },
  { timestamps: true }
);

eventTeamMemberSchema.pre("validate", function validateParticipantReference() {
  const hasStudent = Boolean(this.studentId);
  const hasGuest = Boolean(this.guestRegistrationId);
  if (hasStudent === hasGuest) {
    this.invalidate(
      "participantType",
      "Exactly one student or guest registration is required"
    );
  }
  if (
    (this.participantType === "member" && !hasStudent) ||
    (this.participantType === "guest" && !hasGuest)
  ) {
    this.invalidate("participantType", "Participant type does not match its registration");
  }
});

eventTeamMemberSchema.index(
  { eventId: 1, studentId: 1 },
  { unique: true, partialFilterExpression: { studentId: { $type: "objectId" } } }
);
eventTeamMemberSchema.index(
  { eventId: 1, guestRegistrationId: 1 },
  {
    unique: true,
    partialFilterExpression: { guestRegistrationId: { $type: "objectId" } },
  }
);
eventTeamMemberSchema.index({ teamId: 1, createdAt: 1 });

const EventTeamMember: Model<IEventTeamMember> =
  (mongoose.models.EventTeamMember as Model<IEventTeamMember> | undefined) ||
  mongoose.model<IEventTeamMember>("EventTeamMember", eventTeamMemberSchema);

export default EventTeamMember;
