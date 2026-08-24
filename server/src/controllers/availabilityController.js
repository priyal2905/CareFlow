const User = require("../models/User");
const DoctorProfile = require("../models/DoctorProfile");

// ============================================================
// ADD LEAVE DAY
// Doctor can add own leave.
// Admin can add leave for any doctor.
// ============================================================

const addLeaveDay = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Leave date is required",
      });
    }

    if (
      req.user.role !== "admin" &&
      req.user.userId !== id
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only manage your own leave",
      });
    }

    const doctor = await User.findOne({
      _id: id,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const doctorProfile = await DoctorProfile.findOne({
      userId: id,
    });

    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const leaveDate = new Date(date);

    if (Number.isNaN(leaveDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave date",
      });
    }

    leaveDate.setHours(0, 0, 0, 0);

    const alreadyExists = doctorProfile.leaveDays.some(
      (existingDate) => {
        const existing = new Date(existingDate);
        existing.setHours(0, 0, 0, 0);

        return existing.getTime() === leaveDate.getTime();
      }
    );

    if (alreadyExists) {
      return res.status(409).json({
        success: false,
        message: "Doctor is already marked unavailable on this date",
      });
    }

    doctorProfile.leaveDays.push(leaveDate);

    await doctorProfile.save();

    return res.status(201).json({
      success: true,
      message: "Leave day added successfully",
      data: {
        leaveDays: doctorProfile.leaveDays,
      },
    });
  } catch (error) {
    console.error("Add leave error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while adding leave",
    });
  }
};

// ============================================================
// REMOVE LEAVE DAY
// ============================================================

const removeLeaveDay = async (req, res) => {
  try {
    const { id, date } = req.params;

    if (
      req.user.role !== "admin" &&
      req.user.userId !== id
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only manage your own leave",
      });
    }

    const doctorProfile = await DoctorProfile.findOne({
      userId: id,
    });

    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const targetDate = new Date(date);

    if (Number.isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave date",
      });
    }

    targetDate.setHours(0, 0, 0, 0);

    const originalLength = doctorProfile.leaveDays.length;

    doctorProfile.leaveDays =
      doctorProfile.leaveDays.filter((existingDate) => {
        const existing = new Date(existingDate);
        existing.setHours(0, 0, 0, 0);

        return existing.getTime() !== targetDate.getTime();
      });

    if (
      doctorProfile.leaveDays.length ===
      originalLength
    ) {
      return res.status(404).json({
        success: false,
        message: "Leave date not found",
      });
    }

    await doctorProfile.save();

    return res.status(200).json({
      success: true,
      message: "Leave day removed successfully",
      data: {
        leaveDays: doctorProfile.leaveDays,
      },
    });
  } catch (error) {
    console.error("Remove leave error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while removing leave",
    });
  }
};

module.exports = {
  addLeaveDay,
  removeLeaveDay,
};