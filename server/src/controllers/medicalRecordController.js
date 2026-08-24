const MedicalRecord = require("../models/MedicalRecord");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

// ============================================================
// CREATE MEDICAL RECORD
// POST /api/medical-records
// DOCTOR ONLY
// ============================================================

const createMedicalRecord = async (req, res) => {
  try {
    const {
      appointmentId,
      diagnosis,
      symptoms,
      consultationNotes,
      prescription,
      followUpDate,
      followUpNotes,
      bloodPressure,
      heartRate,
      temperature,
      weight,
    } = req.body;

    if (!appointmentId || !diagnosis) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment ID and diagnosis are required",
      });
    }

    const appointment =
      await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Make sure this doctor owns the appointment
    if (
      appointment.doctorId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to create a record for this appointment",
      });
    }

    // Medical record should only be created after consultation
    if (appointment.status !== "COMPLETED") {
      return res.status(400).json({
        success: false,
        message:
          "Medical record can only be created for a completed appointment",
      });
    }

    // Prevent duplicate medical record
    const existingRecord =
      await MedicalRecord.findOne({
        appointmentId,
      });

    if (existingRecord) {
      return res.status(409).json({
        success: false,
        message:
          "Medical record already exists for this appointment",
      });
    }

    const medicalRecord =
      await MedicalRecord.create({
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        appointmentId,
        diagnosis,
        symptoms,
        consultationNotes,
        prescription,
        followUpDate,
        followUpNotes,
        bloodPressure,
        heartRate,
        temperature,
        weight,
      });

    const populatedRecord =
      await MedicalRecord.findById(
        medicalRecord._id
      )
        .populate(
          "patientId",
          "name email"
        )
        .populate(
          "doctorId",
          "name email"
        )
        .populate(
          "appointmentId"
        );

    return res.status(201).json({
      success: true,
      message:
        "Medical record created successfully",
      data: populatedRecord,
    });
  } catch (error) {
    console.error(
      "Create medical record error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating medical record",
    });
  }
};

// ============================================================
// GET PATIENT MEDICAL HISTORY
// GET /api/medical-records/my
// PATIENT ONLY
// ============================================================

const getMyMedicalRecords = async (req, res) => {
  try {
    const records =
      await MedicalRecord.find({
        patientId: req.user.userId,
      })
        .populate(
          "doctorId",
          "name email"
        )
        .populate(
          "appointmentId",
          "date startTime endTime status bookingReference"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error(
      "Get medical history error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching medical history",
    });
  }
};

// ============================================================
// GET SINGLE MEDICAL RECORD
// GET /api/medical-records/:id
// PATIENT / DOCTOR / ADMIN
// ============================================================

const getMedicalRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const record =
      await MedicalRecord.findById(id)
        .populate(
          "patientId",
          "name email"
        )
        .populate(
          "doctorId",
          "name email"
        )
        .populate(
          "appointmentId"
        );

    if (!record) {
      return res.status(404).json({
        success: false,
        message:
          "Medical record not found",
      });
    }

    const userId = req.user.userId;

    const isPatient =
      record.patientId._id.toString() ===
      userId;

    const isDoctor =
      record.doctorId._id.toString() ===
      userId;

    const isAdmin =
      req.user.role === "admin";

    if (
      !isPatient &&
      !isDoctor &&
      !isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this medical record",
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error(
      "Get medical record error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching medical record",
    });
  }
};

// ============================================================
// GET PATIENT RECORDS BY DOCTOR
// GET /api/medical-records/patient/:patientId
// DOCTOR ONLY
// ============================================================

const getPatientMedicalRecords = async (
  req,
  res
) => {
  try {
    const { patientId } = req.params;

    const patient = await User.findOne({
      _id: patientId,
      role: "patient",
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    // Verify doctor has actually consulted this patient
    const previousAppointment =
      await Appointment.findOne({
        doctorId: req.user.userId,
        patientId,
      });

    if (!previousAppointment) {
      return res.status(403).json({
        success: false,
        message:
          "You have no appointment history with this patient",
      });
    }

    const records =
      await MedicalRecord.find({
        patientId,
      })
        .populate(
          "doctorId",
          "name email"
        )
        .populate(
          "appointmentId",
          "date startTime endTime status bookingReference"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
      },
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error(
      "Get patient records error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching patient records",
    });
  }
};

// ============================================================
// UPDATE MEDICAL RECORD
// PATCH /api/medical-records/:id
// DOCTOR ONLY
// ============================================================

const updateMedicalRecord = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const record =
      await MedicalRecord.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message:
          "Medical record not found",
      });
    }

    if (
      record.doctorId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only the consulting doctor can update this record",
      });
    }

    const allowedFields = [
      "diagnosis",
      "symptoms",
      "consultationNotes",
      "prescription",
      "followUpDate",
      "followUpNotes",
      "bloodPressure",
      "heartRate",
      "temperature",
      "weight",
    ];

    allowedFields.forEach((field) => {
      if (
        req.body[field] !== undefined
      ) {
        record[field] =
          req.body[field];
      }
    });

    await record.save();

    const updatedRecord =
      await MedicalRecord.findById(id)
        .populate(
          "patientId",
          "name email"
        )
        .populate(
          "doctorId",
          "name email"
        )
        .populate(
          "appointmentId"
        );

    return res.status(200).json({
      success: true,
      message:
        "Medical record updated successfully",
      data: updatedRecord,
    });
  } catch (error) {
    console.error(
      "Update medical record error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating medical record",
    });
  }
};

module.exports = {
  createMedicalRecord,
  getMyMedicalRecords,
  getMedicalRecordById,
  getPatientMedicalRecords,
  updateMedicalRecord,
};