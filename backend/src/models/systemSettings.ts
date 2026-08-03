import mongoose, { Document, Model, Schema, Types } from "mongoose";

const GLOBAL_SETTINGS_KEY = "global";

export interface ISystemSettings extends Document {
  key: string;
  studentRegistrationOpen: boolean;
  registrationMessage: string;
  registrationOpensAt?: Date;
  registrationClosesAt?: Date;
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const systemSettingsSchema = new Schema<ISystemSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: GLOBAL_SETTINGS_KEY,
      trim: true,
    },
    studentRegistrationOpen: {
      type: Boolean,
      default: true,
    },
    registrationMessage: {
      type: String,
      default: "Student registration is currently open.",
      trim: true,
      maxlength: 500,
    },
    registrationOpensAt: {
      type: Date,
    },
    registrationClosesAt: {
      type: Date,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const SystemSettings: Model<ISystemSettings> =
  (mongoose.models.SystemSettings as Model<ISystemSettings> | undefined) ||
  mongoose.model<ISystemSettings>("SystemSettings", systemSettingsSchema);

export const getSystemSettings = async (): Promise<ISystemSettings> => {
  const existingSettings = await SystemSettings.findOne({
    key: GLOBAL_SETTINGS_KEY,
  }).exec();

  if (existingSettings) {
    return existingSettings;
  }

  try {
    return await SystemSettings.create({ key: GLOBAL_SETTINGS_KEY });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      const racedSettings = await SystemSettings.findOne({
        key: GLOBAL_SETTINGS_KEY,
      }).exec();

      if (racedSettings) {
        return racedSettings;
      }
    }

    throw error;
  }
};

export default SystemSettings;
