const mongoose = require("mongoose");

const doctorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    consultationFee: {
      type: Number,
      required: true,
      min: 0,
      default: 500,
    },

    slotDuration: {
      type: Number,
      required: true,
      min: 10,
      default: 30,
    },

    workingHours: {
      monday: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        enabled: { type: Boolean, default: true },
      },

      tuesday: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        enabled: { type: Boolean, default: true },
      },

      wednesday: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        enabled: { type: Boolean, default: true },
      },

      thursday: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        enabled: { type: Boolean, default: true },
      },

      friday: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "17:00" },
        enabled: { type: Boolean, default: true },
      },

      saturday: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "13:00" },
        enabled: { type: Boolean, default: false },
      },

      sunday: {
        start: { type: String, default: "09:00" },
        end: { type: String, default: "13:00" },
        enabled: { type: Boolean, default: false },
      },
    },

    leaveDays: [
      {
        type: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DoctorProfile",
  doctorProfileSchema
);