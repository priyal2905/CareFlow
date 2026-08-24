const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // ==========================================================
    // PATIENT
    // ==========================================================

    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ==========================================================
    // DOCTOR
    // ==========================================================

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ==========================================================
    // APPOINTMENT DATE
    // ==========================================================

    date: {
      type: Date,
      required: true,
      index: true,
    },

    // ==========================================================
    // TIME
    // ==========================================================

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    // ==========================================================
    // STATUS
    // ==========================================================

    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "COMPLETED",
        "CANCELLED",
        "NO_SHOW",
      ],
      default: "PENDING",
      index: true,
    },

    // ==========================================================
    // APPOINTMENT INFORMATION
    // ==========================================================

    reason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    // ==========================================================
    // BOOKING REFERENCE
    // ==========================================================

    bookingReference: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    // ==========================================================
    // CANCELLATION
    // ==========================================================

    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    cancelledAt: {
      type: Date,
    },

    // ==========================================================
    // CONSULTATION
    // ==========================================================

    consultationNotes: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    diagnosis: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    prescription: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    completedAt: {
      type: Date,
    },

    // ==========================================================
    // NO-SHOW
    // ==========================================================

    noShowAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================================
// PREVENT DOUBLE BOOKING
//
// One doctor cannot have two active appointments at the
// same date and start time.
//
// CANCELLED appointments are excluded, so a cancelled slot
// becomes available again.
// ============================================================

appointmentSchema.index(
  {
    doctorId: 1,
    date: 1,
    startTime: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: {
        $in: [
          "PENDING",
          "CONFIRMED",
        ],
      },
    },
  }
);

// ============================================================
// COMMON QUERY INDEXES
// ============================================================

appointmentSchema.index({
  patientId: 1,
  date: 1,
});

appointmentSchema.index({
  doctorId: 1,
  date: 1,
});

appointmentSchema.index({
  status: 1,
  date: 1,
});

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);