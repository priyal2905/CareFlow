const express = require("express");

const {
  authenticateUser,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Any logged-in user can access
router.get("/profile", authenticateUser, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You are authenticated",
    user: req.user,
  });
});

// Only patients can access
router.get(
  "/patient-only",
  authenticateUser,
  authorizeRoles("patient"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the patient-only route",
      user: req.user,
    });
  }
);

// Only doctors can access
router.get(
  "/doctor-only",
  authenticateUser,
  authorizeRoles("doctor"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the doctor-only route",
      user: req.user,
    });
  }
);

// Only admins can access
router.get(
  "/admin-only",
  authenticateUser,
  authorizeRoles("admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to the admin-only route",
      user: req.user,
    });
  }
);

module.exports = router;