const crypto = require("crypto");

const Appointment = require("../models/Appointment");
const User = require("../models/User");
const DoctorProfile = require("../models/DoctorProfile");

// ============================================================
// HELPERS
// ============================================================

const normalizeDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);

  return date;
};

const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    mins
  ).padStart(2, "0")}`;
};

const generateBookingReference = () => {
  const randomPart = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `CF-${Date.now()}-${randomPart}`;
};

// ============================================================
// GET AVAILABLE SLOTS
// GET /api/appointments/slots/:doctorId?date=YYYY-MM-DD
// ============================================================

const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date is required",
      });
    }

    const selectedDate = normalizeDate(date);

    if (!selectedDate) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    const doctor = await User.findOne({
      _id: doctorId,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const doctorProfile = await DoctorProfile.findOne({
      userId: doctorId,
    });

    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const dayName = dayNames[selectedDate.getDay()];

    const schedule =
      doctorProfile.workingHours?.[dayName];

    if (!schedule || schedule.enabled === false) {
      return res.status(200).json({
        success: true,
        date,
        doctorId,
        message: "Doctor is not available on this day",
        slots: [],
      });
    }

    const isLeaveDay =
      doctorProfile.leaveDays?.some((leaveDate) => {
        const normalizedLeaveDate = new Date(leaveDate);

        normalizedLeaveDate.setHours(0, 0, 0, 0);

        return (
          normalizedLeaveDate.getTime() ===
          selectedDate.getTime()
        );
      });

    if (isLeaveDay) {
      return res.status(200).json({
        success: true,
        date,
        doctorId,
        message: "Doctor is on leave",
        slots: [],
      });
    }

    const appointments = await Appointment.find({
      doctorId,
      date: selectedDate,
      status: {
        $in: ["PENDING", "CONFIRMED"],
      },
    });

    const startMinutes = timeToMinutes(schedule.start);
    const endMinutes = timeToMinutes(schedule.end);

    const slotDuration =
      doctorProfile.slotDuration || 30;

    const slots = [];

    for (
      let current = startMinutes;
      current + slotDuration <= endMinutes;
      current += slotDuration
    ) {
      const startTime = minutesToTime(current);

      const endTime = minutesToTime(
        current + slotDuration
      );

      const booked = appointments.some(
        (appointment) =>
          appointment.startTime === startTime
      );

      slots.push({
        startTime,
        endTime,
        available: !booked,
      });
    }

    return res.status(200).json({
      success: true,
      date,
      doctorId,
      doctorName: doctor.name,
      slotDuration,
      workingHours: {
        start: schedule.start,
        end: schedule.end,
      },
      slots,
    });
  } catch (error) {
    console.error(
      "Get available slots error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while generating available slots",
    });
  }
};

// ============================================================
// BOOK APPOINTMENT
// POST /api/appointments
// ============================================================

const bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      date,
      startTime,
      reason,
      notes,
    } = req.body;

    if (!doctorId || !date || !startTime) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor, date and start time are required",
      });
    }

    if (req.user.role !== "patient") {
      return res.status(403).json({
        success: false,
        message:
          "Only patients can book appointments",
      });
    }

    const doctor = await User.findOne({
      _id: doctorId,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const doctorProfile =
      await DoctorProfile.findOne({
        userId: doctorId,
      });

    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    const selectedDate = normalizeDate(date);

    if (!selectedDate) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid date format. Use YYYY-MM-DD",
      });
    }

    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const dayName = dayNames[selectedDate.getDay()];

    const schedule =
      doctorProfile.workingHours?.[dayName];

    if (!schedule || schedule.enabled === false) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor does not work on this day",
      });
    }

    const isLeaveDay =
      doctorProfile.leaveDays?.some((leaveDate) => {
        const normalizedLeaveDate =
          new Date(leaveDate);

        normalizedLeaveDate.setHours(0, 0, 0, 0);

        return (
          normalizedLeaveDate.getTime() ===
          selectedDate.getTime()
        );
      });

    if (isLeaveDay) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor is on leave on this date",
      });
    }

    const slotDuration =
      doctorProfile.slotDuration || 30;

    const startMinutes =
      timeToMinutes(startTime);

    const scheduleStart =
      timeToMinutes(schedule.start);

    const scheduleEnd =
      timeToMinutes(schedule.end);

    const endMinutes =
      startMinutes + slotDuration;

    if (
      startMinutes < scheduleStart ||
      endMinutes > scheduleEnd
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Selected time is outside doctor's working hours",
      });
    }

    const endTime =
      minutesToTime(endMinutes);

    const existingAppointment =
      await Appointment.findOne({
        doctorId,
        date: selectedDate,
        startTime,
        status: {
          $in: ["PENDING", "CONFIRMED"],
        },
      });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message:
          "This appointment slot is already booked",
      });
    }

    const appointment =
      await Appointment.create({
        patientId: req.user.userId,
        doctorId,
        date: selectedDate,
        startTime,
        endTime,
        status: "CONFIRMED",
        reason,
        notes,
        bookingReference:
          generateBookingReference(),
      });

    const populatedAppointment =
      await Appointment.findById(
        appointment._id
      )
        .populate(
          "doctorId",
          "name email"
        )
        .populate(
          "patientId",
          "name email"
        );

    return res.status(201).json({
      success: true,
      message:
        "Appointment booked successfully",
      data: populatedAppointment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This appointment slot was just booked by another patient",
      });
    }

    console.error(
      "Book appointment error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while booking appointment",
    });
  }
};

// ============================================================
// GET MY APPOINTMENTS
// GET /api/appointments/my
// ============================================================

const getMyAppointments = async (req, res) => {
  try {
    const appointments =
      await Appointment.find({
        patientId: req.user.userId,
      })
        .populate(
          "doctorId",
          "name email"
        )
        .sort({
          date: 1,
          startTime: 1,
        });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error(
      "Get patient appointments error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching appointments",
    });
  }
};

// ============================================================
// GET APPOINTMENT DETAILS
// GET /api/appointments/:id
// ============================================================

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment =
      await Appointment.findById(id)
        .populate(
          "patientId",
          "name email"
        )
        .populate(
          "doctorId",
          "name email"
        );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const userId = req.user.userId;

    const isPatient =
      appointment.patientId._id.toString() ===
      userId;

    const isDoctor =
      appointment.doctorId._id.toString() ===
      userId;

    const isAdmin =
      req.user.role === "admin";

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view this appointment",
      });
    }

    return res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error(
      "Get appointment error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching appointment",
    });
  }
};

// ============================================================
// CANCEL APPOINTMENT
// PATCH /api/appointments/:id/cancel
// ============================================================

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const appointment =
      await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const userId = req.user.userId;

    const isPatient =
      appointment.patientId.toString() ===
      userId;

    const isDoctor =
      appointment.doctorId.toString() ===
      userId;

    const isAdmin =
      req.user.role === "admin";

    if (!isPatient && !isDoctor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to cancel this appointment",
      });
    }

    if (
      appointment.status === "CANCELLED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment is already cancelled",
      });
    }

    if (
      appointment.status === "COMPLETED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Completed appointments cannot be cancelled",
      });
    }

    appointment.status = "CANCELLED";
    appointment.cancelledAt = new Date();
    appointment.cancellationReason =
      cancellationReason ||
      "No reason provided";

    await appointment.save();

    return res.status(200).json({
      success: true,
      message:
        "Appointment cancelled successfully",
      data: appointment,
    });
  } catch (error) {
    console.error(
      "Cancel appointment error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while cancelling appointment",
    });
  }
};

// ============================================================
// RESCHEDULE APPOINTMENT
// PATCH /api/appointments/:id/reschedule
// ============================================================

const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      date,
      startTime,
    } = req.body;

    if (!date || !startTime) {
      return res.status(400).json({
        success: false,
        message:
          "New date and start time are required",
      });
    }

    const appointment =
      await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found",
      });
    }

    if (
      appointment.patientId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only the patient can reschedule this appointment",
      });
    }

    if (
      appointment.status !== "CONFIRMED" &&
      appointment.status !== "PENDING"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only active appointments can be rescheduled",
      });
    }

    const doctorProfile =
      await DoctorProfile.findOne({
        userId: appointment.doctorId,
      });

    if (!doctorProfile) {
      return res.status(404).json({
        success: false,
        message:
          "Doctor profile not found",
      });
    }

    const selectedDate =
      normalizeDate(date);

    if (!selectedDate) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid date format. Use YYYY-MM-DD",
      });
    }

    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];

    const dayName =
      dayNames[selectedDate.getDay()];

    const schedule =
      doctorProfile.workingHours?.[dayName];

    if (
      !schedule ||
      schedule.enabled === false
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor does not work on this day",
      });
    }

    const isLeaveDay =
      doctorProfile.leaveDays?.some(
        (leaveDate) => {
          const normalizedLeaveDate =
            new Date(leaveDate);

          normalizedLeaveDate.setHours(
            0,
            0,
            0,
            0
          );

          return (
            normalizedLeaveDate.getTime() ===
            selectedDate.getTime()
          );
        }
      );

    if (isLeaveDay) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor is on leave on the selected date",
      });
    }

    const slotDuration =
      doctorProfile.slotDuration || 30;

    const startMinutes =
      timeToMinutes(startTime);

    const endMinutes =
      startMinutes + slotDuration;

    if (
      startMinutes <
        timeToMinutes(schedule.start) ||
      endMinutes >
        timeToMinutes(schedule.end)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Selected time is outside doctor's working hours",
      });
    }

    const endTime =
      minutesToTime(endMinutes);

    const conflictingAppointment =
      await Appointment.findOne({
        _id: {
          $ne: appointment._id,
        },
        doctorId: appointment.doctorId,
        date: selectedDate,
        startTime,
        status: {
          $in: [
            "PENDING",
            "CONFIRMED",
          ],
        },
      });

    if (conflictingAppointment) {
      return res.status(409).json({
        success: false,
        message:
          "The selected slot is already booked",
      });
    }

    appointment.date = selectedDate;
    appointment.startTime = startTime;
    appointment.endTime = endTime;

    await appointment.save();

    const updatedAppointment =
      await Appointment.findById(
        appointment._id
      )
        .populate(
          "doctorId",
          "name email"
        )
        .populate(
          "patientId",
          "name email"
        );

    return res.status(200).json({
      success: true,
      message:
        "Appointment rescheduled successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "The selected slot is already booked",
      });
    }

    console.error(
      "Reschedule appointment error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while rescheduling appointment",
    });
  }
};

// ============================================================
// DOCTOR DASHBOARD
//
// GET /api/appointments/doctor
//
// Doctor only
// ============================================================

const getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.user.userId;

    if (req.user.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message:
          "Only doctors can access the doctor dashboard",
      });
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    // --------------------------------------------------------
    // TODAY
    // --------------------------------------------------------

    const todayAppointments =
      await Appointment.find({
        doctorId,
        date: today,
      })
        .populate(
          "patientId",
          "name email"
        )
        .sort({
          startTime: 1,
        });

    // --------------------------------------------------------
    // UPCOMING
    // --------------------------------------------------------

    const upcomingAppointments =
      await Appointment.find({
        doctorId,
        date: {
          $gt: today,
        },
        status: {
          $in: [
            "PENDING",
            "CONFIRMED",
          ],
        },
      })
        .populate(
          "patientId",
          "name email"
        )
        .sort({
          date: 1,
          startTime: 1,
        });

    // --------------------------------------------------------
    // COMPLETED
    // --------------------------------------------------------

    const completedAppointments =
      await Appointment.find({
        doctorId,
        status: "COMPLETED",
      })
        .populate(
          "patientId",
          "name email"
        )
        .sort({
          date: -1,
        })
        .limit(20);

    // --------------------------------------------------------
    // CANCELLED
    // --------------------------------------------------------

    const cancelledAppointments =
      await Appointment.find({
        doctorId,
        status: "CANCELLED",
      })
        .populate(
          "patientId",
          "name email"
        )
        .sort({
          date: -1,
        })
        .limit(20);

    // --------------------------------------------------------
    // NO SHOW
    // --------------------------------------------------------

    const noShowAppointments =
      await Appointment.find({
        doctorId,
        status: "NO_SHOW",
      })
        .populate(
          "patientId",
          "name email"
        )
        .sort({
          date: -1,
        })
        .limit(20);

    // --------------------------------------------------------
    // STATISTICS
    // --------------------------------------------------------

    const totalAppointments =
      await Appointment.countDocuments({
        doctorId,
      });

    const totalCompleted =
      await Appointment.countDocuments({
        doctorId,
        status: "COMPLETED",
      });

    const totalCancelled =
      await Appointment.countDocuments({
        doctorId,
        status: "CANCELLED",
      });

    const totalNoShows =
      await Appointment.countDocuments({
        doctorId,
        status: "NO_SHOW",
      });

    const totalActive =
      await Appointment.countDocuments({
        doctorId,
        status: {
          $in: [
            "PENDING",
            "CONFIRMED",
          ],
        },
      });

    return res.status(200).json({
      success: true,

      data: {
        today: todayAppointments,

        upcoming: upcomingAppointments,

        completed: completedAppointments,

        cancelled: cancelledAppointments,

        noShows: noShowAppointments,

        statistics: {
          totalAppointments,
          totalCompleted,
          totalCancelled,
          totalNoShows,
          totalActive,
          todayCount:
            todayAppointments.length,
          upcomingCount:
            upcomingAppointments.length,
        },
      },
    });
  } catch (error) {
    console.error(
      "Doctor appointments error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching doctor appointments",
    });
  }
};

// ============================================================
// COMPLETE APPOINTMENT
//
// PATCH /api/appointments/:id/complete
//
// Doctor only
// ============================================================

const completeAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      consultationNotes,
      diagnosis,
      prescription,
    } = req.body;

    const appointment =
      await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found",
      });
    }

    if (
      appointment.doctorId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only the assigned doctor can complete this appointment",
      });
    }

    if (
      appointment.status !== "CONFIRMED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only confirmed appointments can be completed",
      });
    }

    appointment.status = "COMPLETED";

    appointment.consultationNotes =
      consultationNotes || "";

    appointment.diagnosis =
      diagnosis || "";

    appointment.prescription =
      prescription || "";

    appointment.completedAt =
      new Date();

    await appointment.save();

    return res.status(200).json({
      success: true,
      message:
        "Appointment completed successfully",
      data: appointment,
    });
  } catch (error) {
    console.error(
      "Complete appointment error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while completing appointment",
    });
  }
};

// ============================================================
// MARK NO-SHOW
//
// PATCH /api/appointments/:id/no-show
//
// Doctor only
// ============================================================

const markNoShow = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment =
      await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found",
      });
    }

    if (
      appointment.doctorId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only the assigned doctor can mark no-show",
      });
    }

    if (
      appointment.status !== "CONFIRMED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only confirmed appointments can be marked as no-show",
      });
    }

    appointment.status = "NO_SHOW";

    appointment.noShowAt =
      new Date();

    await appointment.save();

    return res.status(200).json({
      success: true,
      message:
        "Appointment marked as no-show",
      data: appointment,
    });
  } catch (error) {
    console.error(
      "No-show error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while marking no-show",
    });
  }
};

module.exports = {
  getAvailableSlots,
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  cancelAppointment,
  rescheduleAppointment,
  getDoctorAppointments,
  completeAppointment,
  markNoShow,
};