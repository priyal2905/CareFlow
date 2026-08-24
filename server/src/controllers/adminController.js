const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers =
      await User.countDocuments();

    const totalDoctors =
      await User.countDocuments({
        role: "doctor",
      });

    const totalPatients =
      await User.countDocuments({
        role: "patient",
      });

    const totalAppointments =
      await Appointment.countDocuments();

    const pendingAppointments =
      await Appointment.countDocuments({
        status: "PENDING",
      });

    const completedAppointments =
      await Appointment.countDocuments({
        status: "COMPLETED",
      });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        totalPatients,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
      },
    });
  } catch (error) {
    console.error(
      "Admin dashboard error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load dashboard statistics.",
    });
  }
};

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate(
        "userId",
        "name email role"
      )
      .sort({
        createdAt: -1,
      });

    const formattedDoctors =
      doctors.map((doctor) => ({
        _id: doctor._id,
        name:
          doctor.userId?.name ||
          "Doctor",
        email:
          doctor.userId?.email ||
          "",
        specialization:
          doctor.specialization ||
          "",
        qualification:
          doctor.qualification ||
          "",
        experience:
          doctor.experience || 0,
        consultationFee:
          doctor.consultationFee || 0,
        slotDuration:
          doctor.slotDuration || 30,
      }));

    res.status(200).json({
      success: true,
      data: formattedDoctors,
    });
  } catch (error) {
    console.error(
      "Get doctors error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load doctors.",
    });
  }
};

const getPatients = async (req, res) => {
  try {
    const patients =
      await User.find({
        role: "patient",
      })
        .select(
          "name email phone createdAt"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      data: patients,
    });
  } catch (error) {
    console.error(
      "Get patients error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load patients.",
    });
  }
};

const getAppointments =
  async (req, res) => {
    try {
      const appointments =
        await Appointment.find()
          .populate(
            "patientId",
            "name email"
          )
          .populate(
            "doctorId",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.error(
        "Get appointments error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Unable to load appointments.",
      });
    }
  };

module.exports = {
  getDashboardStats,
  getDoctors,
  getPatients,
  getAppointments,
};