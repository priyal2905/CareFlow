const express = require("express");

const {
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  rescheduleAppointment,
  getDoctorAppointments,
  completeAppointment,
  markNoShow,
} = require("../controllers/appointmentController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================================
// PATIENT
// ============================================================

// Get available appointment slots
router.get(
  "/slots/:doctorId",
  authenticateUser,
  authorizeRoles("patient"),
  getAvailableSlots
);

// Book appointment
router.post(
  "/",
  authenticateUser,
  authorizeRoles("patient"),
  bookAppointment
);

// Get logged-in patient's appointments
router.get(
  "/my",
  authenticateUser,
  authorizeRoles("patient"),
  getMyAppointments
);

// ============================================================
// APPOINTMENT DETAILS
// ============================================================

// Get appointment by ID
router.get(
  "/:id",
  authenticateUser,
  getAppointmentById
);

// Cancel appointment
router.patch(
  "/:id/cancel",
  authenticateUser,
  cancelAppointment
);

// Reschedule appointment
router.patch(
  "/:id/reschedule",
  authenticateUser,
  authorizeRoles("patient"),
  rescheduleAppointment
);

// ============================================================
// DOCTOR
// ============================================================

// Doctor dashboard appointments
router.get(
  "/doctor",
  authenticateUser,
  authorizeRoles("doctor"),
  getDoctorAppointments
);

// Complete appointment
router.patch(
  "/:id/complete",
  authenticateUser,
  authorizeRoles("doctor"),
  completeAppointment
);

// Mark appointment as no-show
router.patch(
  "/:id/no-show",
  authenticateUser,
  authorizeRoles("doctor"),
  markNoShow
);

module.exports = router;