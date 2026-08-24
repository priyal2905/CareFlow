const express = require("express");

const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateWorkingHours,
} = require("../controllers/doctorController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================================
// GET ALL DOCTORS
// Public
// GET /api/doctors
// ============================================================

router.get("/", getDoctors);

// ============================================================
// GET SINGLE DOCTOR
// Public
// GET /api/doctors/:id
// ============================================================

router.get("/:id", getDoctorById);

// ============================================================
// CREATE DOCTOR
// Admin only
// POST /api/doctors
// ============================================================

router.post(
  "/",
  authenticateUser,
  authorizeRoles("admin"),
  createDoctor
);

// ============================================================
// UPDATE WORKING HOURS
// Doctor can update own schedule.
// Admin can update any doctor.
// PUT /api/doctors/:id/working-hours
// ============================================================

router.put(
  "/:id/working-hours",
  authenticateUser,
  authorizeRoles("doctor", "admin"),
  updateWorkingHours
);

module.exports = router;