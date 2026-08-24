const bcrypt = require("bcryptjs");
const User = require("../models/User");
const DoctorProfile = require("../models/DoctorProfile");

// ============================================================
// CREATE DOCTOR
// Admin only
// ============================================================

const createDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      qualification,
      experience,
      consultationFee,
      slotDuration,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !specialization ||
      !qualification ||
      experience === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Required doctor information is missing",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctorUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
    });

    try {
      const doctorProfile = await DoctorProfile.create({
        userId: doctorUser._id,
        specialization,
        qualification,
        experience,
        consultationFee: consultationFee || 500,
        slotDuration: slotDuration || 30,
      });

      return res.status(201).json({
        success: true,
        message: "Doctor created successfully",
        data: {
          user: {
            id: doctorUser._id,
            name: doctorUser.name,
            email: doctorUser.email,
            role: doctorUser.role,
          },
          doctorProfile,
        },
      });
    } catch (profileError) {
      await User.findByIdAndDelete(doctorUser._id);
      throw profileError;
    }
  } catch (error) {
    console.error("Create doctor error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while creating doctor",
    });
  }
};

// ============================================================
// GET ALL DOCTORS
// Public
// ============================================================

const getDoctors = async (req, res) => {
  try {
    const { specialization, search } = req.query;

    const userQuery = {
      role: "doctor",
    };

    if (search) {
      userQuery.name = {
        $regex: search,
        $options: "i",
      };
    }

    const doctors = await User.find(userQuery)
      .select("-password")
      .sort({ name: 1 });

    const doctorIds = doctors.map((doctor) => doctor._id);

    const profileQuery = {
      userId: {
        $in: doctorIds,
      },
    };

    if (specialization) {
      profileQuery.specialization = {
        $regex: specialization,
        $options: "i",
      };
    }

    const profiles = await DoctorProfile.find(profileQuery);

    const profileMap = new Map();

    profiles.forEach((profile) => {
      profileMap.set(profile.userId.toString(), profile);
    });

    const result = doctors
      .filter((doctor) =>
        profileMap.has(doctor._id.toString())
      )
      .map((doctor) => ({
        user: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          role: doctor.role,
        },
        profile: profileMap.get(
          doctor._id.toString()
        ),
      }));

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Get doctors error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching doctors",
    });
  }
};

// ============================================================
// GET SINGLE DOCTOR
// Public
// ============================================================

const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await User.findOne({
      _id: id,
      role: "doctor",
    }).select("-password");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const doctorProfile = await DoctorProfile.findOne({
      userId: doctor._id,
    });

    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          role: doctor.role,
        },
        profile: doctorProfile,
      },
    });
  } catch (error) {
    console.error("Get doctor error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching doctor",
    });
  }
};

// ============================================================
// UPDATE WORKING HOURS
//
// Doctor can update own schedule.
// Admin can update any doctor's schedule.
// ============================================================

const updateWorkingHours = async (req, res) => {
  try {
    const { id } = req.params;
    const { workingHours } = req.body;

    if (!workingHours || typeof workingHours !== "object") {
      return res.status(400).json({
        success: false,
        message: "Working hours are required",
      });
    }

    // Only admin or the doctor themselves can update schedule
    if (
      req.user.role !== "admin" &&
      req.user.userId !== id
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only update your own working hours",
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

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    for (const day of days) {
      if (workingHours[day]) {
        const { start, end, enabled } = workingHours[day];

        if (enabled === false) {
          doctorProfile.workingHours[day].enabled = false;
          continue;
        }

        if (!start || !end) {
          return res.status(400).json({
            success: false,
            message: `Start and end time required for ${day}`,
          });
        }

        if (start >= end) {
          return res.status(400).json({
            success: false,
            message: `Invalid working hours for ${day}`,
          });
        }

        doctorProfile.workingHours[day] = {
          start,
          end,
          enabled: true,
        };
      }
    }

    await doctorProfile.save();

    return res.status(200).json({
      success: true,
      message: "Working hours updated successfully",
      data: doctorProfile.workingHours,
    });
  } catch (error) {
    console.error(
      "Update working hours error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating working hours",
    });
  }
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateWorkingHours,
};