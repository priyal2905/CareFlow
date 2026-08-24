import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";

import api from "../../services/api";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedSlot, setSelectedSlot] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [slotsLoading, setSlotsLoading] =
    useState(false);

  const [booking, setBooking] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ============================================================
  // LOAD DOCTOR
  // ============================================================

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await api.get(
          `/doctors/${id}`
        );

        setDoctor(response.data.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load doctor profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  // ============================================================
  // LOAD AVAILABLE SLOTS
  // ============================================================

  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      setSelectedSlot(null);
      return;
    }

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setSelectedSlot(null);
      setError("");
      setSuccess("");

      try {
        const response = await api.get(
          `/appointments/slots/${id}`,
          {
            params: {
              date: selectedDate,
            },
          }
        );

        setSlots(
          response.data.slots || []
        );
      } catch (error) {
        setSlots([]);

        setError(
          error.response?.data?.message ||
            "Unable to load available slots."
        );
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [selectedDate, id]);

  // ============================================================
  // BOOK APPOINTMENT
  // ============================================================

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot) {
      setError(
        "Please select a date and appointment slot."
      );

      return;
    }

    setBooking(true);
    setError("");
    setSuccess("");

    try {
      await api.post(
        "/appointments",
        {
          doctorId: id,
          date: selectedDate,
          startTime:
            selectedSlot.startTime,
        }
      );

      setSuccess(
        "Appointment booked successfully!"
      );

      setTimeout(() => {
        navigate(
          "/patient/appointments"
        );
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to book appointment."
      );
    } finally {
      setBooking(false);
    }
  };

  // ============================================================
  // TODAY
  // ============================================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <>
        <Navbar />

        <Loading text="Loading doctor profile..." />
      </>
    );
  }

  // ============================================================
  // DOCTOR NOT FOUND
  // ============================================================

  if (!doctor) {
    return (
      <>
        <Navbar />

        <main className="container">
          <div
            className="card"
            style={{
              marginTop: "50px",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h2>
              Doctor not found
            </h2>

            <p
              style={{
                color: "#697386",
                margin:
                  "10px 0 20px",
              }}
            >
              {error ||
                "This doctor profile could not be found."}
            </p>

            <Link
              to="/patient/doctors"
              className="btn btn-primary"
            >
              Back to Doctors
            </Link>
          </div>
        </main>
      </>
    );
  }

  // ============================================================
  // DOCTOR DATA
  // ============================================================

  const user =
    doctor.user || doctor;

  const profile =
    doctor.profile || doctor;

  return (
    <div className="page">
      <Navbar />

      <main className="container">

        {/* ======================================================
            BREADCRUMB
        ====================================================== */}

        <div
          style={{
            padding: "30px 0 15px",
          }}
        >
          <Link
            to="/patient/doctors"
            style={{
              color: "#176b87",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            ← Back to doctors
          </Link>
        </div>

        {/* ======================================================
            DOCTOR PROFILE
        ====================================================== */}

        <section
          className="card"
          style={{
            padding: "35px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "25px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "#e9f5f6",
                color: "#176b87",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "35px",
                fontWeight: 800,
              }}
            >
              {user.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div>
              <p
                style={{
                  color: "#176b87",
                  fontWeight: 700,
                  fontSize: "14px",
                  marginBottom: "6px",
                }}
              >
                {profile.specialization ||
                  "Healthcare Specialist"}
              </p>

              <h1
                style={{
                  fontSize: "36px",
                  marginBottom: "8px",
                }}
              >
                {user.name}
              </h1>

              <p
                style={{
                  color: "#697386",
                }}
              >
                {profile.qualification ||
                  "Medical Professional"}
              </p>
            </div>
          </div>

          {/* ====================================================
              DOCTOR INFORMATION
          ==================================================== */}

          <div
            className="grid grid-3"
            style={{
              marginTop: "30px",
            }}
          >
            <div
              style={{
                padding: "18px",
                background: "#f7f9fc",
                borderRadius: "12px",
              }}
            >
              <small
                style={{
                  color: "#697386",
                }}
              >
                Experience
              </small>

              <strong
                style={{
                  display: "block",
                  marginTop: "5px",
                  fontSize: "18px",
                }}
              >
                {profile.experience || 0} years
              </strong>
            </div>

            <div
              style={{
                padding: "18px",
                background: "#f7f9fc",
                borderRadius: "12px",
              }}
            >
              <small
                style={{
                  color: "#697386",
                }}
              >
                Consultation Fee
              </small>

              <strong
                style={{
                  display: "block",
                  marginTop: "5px",
                  fontSize: "18px",
                }}
              >
                ₹
                {profile.consultationFee ||
                  0}
              </strong>
            </div>

            <div
              style={{
                padding: "18px",
                background: "#f7f9fc",
                borderRadius: "12px",
              }}
            >
              <small
                style={{
                  color: "#697386",
                }}
              >
                Appointment Duration
              </small>

              <strong
                style={{
                  display: "block",
                  marginTop: "5px",
                  fontSize: "18px",
                }}
              >
                {profile.slotDuration ||
                  30}{" "}
                minutes
              </strong>
            </div>
          </div>
        </section>

        {/* ======================================================
            BOOKING AREA
        ====================================================== */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "0.8fr 1.2fr",
            gap: "25px",
            paddingBottom: "60px",
          }}
        >

          {/* ====================================================
              DATE SELECTION
          ==================================================== */}

          <div
            className="card"
            style={{
              padding: "30px",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                marginBottom: "8px",
              }}
            >
              Choose a date
            </h2>

            <p
              style={{
                color: "#697386",
                fontSize: "14px",
                marginBottom: "25px",
              }}
            >
              Select a date to see available
              appointment times.
            </p>

            <label className="label">
              Appointment date
            </label>

            <input
              className="input"
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(
                  e.target.value
                );

                setSuccess("");
                setError("");
              }}
            />

            <div
              style={{
                marginTop: "25px",
                padding: "16px",
                borderRadius: "12px",
                background: "#eef8f7",
                fontSize: "13px",
                lineHeight: 1.6,
                color: "#176b87",
              }}
            >
              <strong>
                CareFlow scheduling
              </strong>

              <br />

              Available slots are generated
              from the doctor's working hours
              and existing appointments.
            </div>
          </div>

          {/* ====================================================
              AVAILABLE SLOTS
          ==================================================== */}

          <div
            className="card"
            style={{
              padding: "30px",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                marginBottom: "8px",
              }}
            >
              Available slots
            </h2>

            <p
              style={{
                color: "#697386",
                fontSize: "14px",
                marginBottom: "25px",
              }}
            >
              {selectedDate
                ? `Available times for ${selectedDate}`
                : "Choose a date first."}
            </p>

            {slotsLoading && (
              <Loading text="Checking availability..." />
            )}

            {/* NO SLOTS */}

            {!slotsLoading &&
              selectedDate &&
              slots.length === 0 && (
                <div
                  style={{
                    padding: "30px",
                    textAlign: "center",
                    background: "#f7f9fc",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "30px",
                      marginBottom: "10px",
                    }}
                  >
                    📅
                  </div>

                  <h3>
                    No slots available
                  </h3>

                  <p
                    style={{
                      color: "#697386",
                      marginTop: "7px",
                    }}
                  >
                    Please choose another date.
                  </p>
                </div>
              )}

            {/* AVAILABLE SLOTS */}

            {!slotsLoading &&
              slots.length > 0 && (
                <>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(120px, 1fr))",
                      gap: "10px",
                    }}
                  >
                    {slots.map(
                      (slot, index) => {
                        const isSelected =
                          selectedSlot?.startTime ===
                          slot.startTime;

                        const disabled =
                          slot.available ===
                          false;

                        return (
                          <button
                            key={`${slot.startTime}-${index}`}
                            type="button"
                            disabled={disabled}
                            onClick={() => {
                              setSelectedSlot(
                                slot
                              );

                              setError("");
                              setSuccess("");
                            }}
                            style={{
                              border: isSelected
                                ? "2px solid #176b87"
                                : "1px solid #e7ebf0",

                              borderRadius:
                                "10px",

                              padding:
                                "13px 8px",

                              background:
                                isSelected
                                  ? "#e9f5f6"
                                  : disabled
                                  ? "#f3f4f6"
                                  : "white",

                              color:
                                disabled
                                  ? "#9ca3af"
                                  : "#172033",

                              fontWeight: 600,

                              cursor:
                                disabled
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                          >
                            {slot.startTime}

                            {slot.endTime && (
                              <>
                                {" "}
                                -{" "}
                                {
                                  slot.endTime
                                }
                              </>
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* SELECTED SLOT */}

                  {selectedSlot && (
                    <div
                      style={{
                        marginTop: "25px",
                        padding: "20px",
                        background: "#f7f9fc",
                        borderRadius: "12px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#697386",
                        }}
                      >
                        Selected appointment
                      </p>

                      <strong
                        style={{
                          display: "block",
                          marginTop: "5px",
                          fontSize: "18px",
                        }}
                      >
                        {selectedDate}
                      </strong>

                      <p
                        style={{
                          marginTop: "5px",
                          color: "#176b87",
                          fontWeight: 700,
                        }}
                      >
                        {selectedSlot.startTime}
                        {" - "}
                        {selectedSlot.endTime}
                      </p>
                    </div>
                  )}

                  {/* BOOK BUTTON */}

                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={
                      !selectedSlot ||
                      booking
                    }
                    onClick={
                      handleBooking
                    }
                    style={{
                      width: "100%",
                      marginTop: "20px",
                      padding: "14px",
                    }}
                  >
                    {booking
                      ? "Booking..."
                      : "Confirm Appointment"}
                  </button>
                </>
              )}

            {/* NO DATE SELECTED */}

            {!selectedDate &&
              !slotsLoading && (
                <div
                  style={{
                    padding: "45px 20px",
                    textAlign: "center",
                    background: "#f7f9fc",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "34px",
                      marginBottom: "10px",
                    }}
                  >
                    🩺
                  </div>

                  <p
                    style={{
                      color: "#697386",
                    }}
                  >
                    Select a date to see
                    appointment availability.
                  </p>
                </div>
              )}
          </div>
        </section>

        {/* ======================================================
            MESSAGES
        ====================================================== */}

        {(error || success) && (
          <div
            style={{
              position: "fixed",
              right: "25px",
              bottom: "25px",
              maxWidth: "400px",
              padding: "16px 20px",
              borderRadius: "12px",
              background: success
                ? "#eaf8f1"
                : "#fff0ef",
              color: success
                ? "#238b67"
                : "#d9534f",
              boxShadow:
                "0 10px 30px rgba(0,0,0,.12)",
              fontWeight: 600,
              zIndex: 200,
            }}
          >
            {success || error}
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDetails;