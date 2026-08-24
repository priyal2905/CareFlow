const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },

    diagnosis: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },

    symptoms: {
      type: String,
      trim: true,
      maxlength: 3000,
    },

    consultationNotes: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    prescription: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    followUpDate: {
      type: Date,
    },

    followUpNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    bloodPressure: {
      type: String,
      trim: true,
    },

    heartRate: {
      type: String,
      trim: true,
    },

    temperature: {
      type: String,
      trim: true,
    },

    weight: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

medicalRecordSchema.index({
  patientId: 1,
  createdAt: -1,
});

medicalRecordSchema.index({
  doctorId: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "MedicalRecord",
  medicalRecordSchema
);