const express = require("express");

const {
  addLeaveDay,
  removeLeaveDay,
} = require("../controllers/availabilityController");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Add leave
router.post(
  "/:id/leave",
  authenticateUser,
  authorizeRoles("doctor", "admin"),
  addLeaveDay
);

// Remove leave
router.delete(
  "/:id/leave/:date",
  authenticateUser,
  authorizeRoles("doctor", "admin"),
  removeLeaveDay
);

module.exports = router;