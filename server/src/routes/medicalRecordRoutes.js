const express = require("express");

const {
  createMedicalRecord,
  getMyMedicalRecords,
  getMedicalRecordById,
  getPatientMedicalRecords,
  updateMedicalRecord,
} = require("../controllers/medicalRecordController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================================
// CREATE MEDICAL RECORD
// ============================================================

router.post(
  "/",
  authenticateUser,
  authorizeRoles("doctor"),
  createMedicalRecord
);

// ============================================================
// PATIENT MEDICAL HISTORY
// ============================================================

router.get(
  "/my",
  authenticateUser,
  authorizeRoles("patient"),
  getMyMedicalRecords
);

// ============================================================
// DOCTOR VIEW PATIENT HISTORY
// ============================================================

router.get(
  "/patient/:patientId",
  authenticateUser,
  authorizeRoles("doctor"),
  getPatientMedicalRecords
);

// ============================================================
// SINGLE RECORD
// ============================================================

router.get(
  "/:id",
  authenticateUser,
  authorizeRoles(
    "patient",
    "doctor",
    "admin"
  ),
  getMedicalRecordById
);

// ============================================================
// UPDATE RECORD
// ============================================================

router.patch(
  "/:id",
  authenticateUser,
  authorizeRoles("doctor"),
  updateMedicalRecord
);

module.exports = router;