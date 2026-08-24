const express = require("express");

const {
  getDashboardStats,
  getDoctors,
  getPatients,
  getAppointments,
} = require("../controllers/adminController");

const router = express.Router();

router.get(
  "/dashboard",
  getDashboardStats
);

router.get(
  "/doctors",
  getDoctors
);

router.get(
  "/patients",
  getPatients
);

router.get(
  "/appointments",
  getAppointments
);

module.exports = router;