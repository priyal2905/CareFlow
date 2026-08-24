const mongoose = require("mongoose");

const workingDaySchema = new mongoose.Schema(
  {
    start: {
      type: String,
      default: "10:00",
    },
    end: {
      type: String,
      default: "18:00",
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
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
    },

    slotDuration: {
      type: Number,
      default: 30,
      min: 15,
    },

    workingHours: {
      monday: {
        type: workingDaySchema,
        default: () => ({}),
      },

      tuesday: {
        type: workingDaySchema,
        default: () => ({}),
      },

      wednesday: {
        type: workingDaySchema,
        default: () => ({}),
      },

      thursday: {
        type: workingDaySchema,
        default: () => ({}),
      },

      friday: {
        type: workingDaySchema,
        default: () => ({}),
      },

      saturday: {
        type: workingDaySchema,
        default: () => ({
          start: "09:00",
          end: "13:00",
          enabled: false,
        }),
      },

      sunday: {
        type: workingDaySchema,
        default: () => ({
          start: "09:00",
          end: "13:00",
          enabled: false,
        }),
      },
    },

    leaveDays: [
      {
        type: Date,
      },
    ],

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Doctor",
  doctorSchema
);