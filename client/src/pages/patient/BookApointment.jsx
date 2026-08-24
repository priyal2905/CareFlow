import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";

import api from "../../services/api";

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);

  const [selectedSlot, setSelectedSlot] =
    useState("");

  const [loadingDoctor, setLoadingDoctor] =
    useState(true);

  const [loadingSlots, setLoadingSlots] =
    useState(false);

  const [booking, setBooking] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

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
            "Unable to load doctor."
        );
      } finally {
        setLoadingDoctor(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;

    setDate(selectedDate);
    setSelectedSlot("");
    setSlots([]);
    setMessage("");
    setError("");

    if (!selectedDate) {
      return;
    }

    try {
      setLoadingSlots(true);

      const response = await api.get(
        `/appointments/available-slots`,
        {
          params: {
            doctorId: id,
            date: selectedDate,
          },
        }
      );

      setSlots(
        response.data.data || []
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load available slots."
      );
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBooking = async () => {
    if (!date || !selectedSlot) {
      setError(
        "Please select a date and time slot."
      );

      return;
    }

    try {
      setBooking(true);
      setError("");
      setMessage("");

      await api.post(
        "/appointments",
        {
          doctorId: id,
          date,
          startTime: selectedSlot,
        }
      );

      setMessage(
        "Appointment booked successfully!"
      );

      setTimeout(() => {
        navigate(
          "/patient/appointments"
        );
      }, 1200);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to book appointment."
      );
    } finally {
      setBooking(false);
    }
  };

  if (loadingDoctor) {
    return (
      <>
        <Navbar />
        <Loading text="Loading doctor..." />
      </>
    );
  }

  if (!doctor) {
    return (
      <>
        <Navbar />

        <main className="container">
          <div
            className="card"
            style={{
              marginTop: "40px",
              padding: "40px",
              textAlign: "center",
            }}
          >
            Doctor not found.
          </div>
        </main>
      </>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <div
          style={{
            padding: "40px 0 30px",
          }}
        >
          <button
            className="btn btn-secondary"
            onClick={() =>
              navigate(
                `/patient/doctors/${id}`
              )
            }
          >
            ← Back
          </button>

          <div
            style={{
              marginTop: "25px",
            }}
          >
            <p
              style={{
                color: "#176b87",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              APPOINTMENT
            </p>

            <h1
              style={{
                fontSize: "34px",
                marginTop: "5px",
              }}
            >
              Book an Appointment
            </h1>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#fff0ef",
              color: "#d9534f",
              padding: "15px 18px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              background: "#eaf8f1",
              color: "#238b67",
              padding: "15px 18px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>
        )}

        <div
          className="grid grid-2"
          style={{
            alignItems: "start",
            paddingBottom: "60px",
          }}
        >
          {/* DOCTOR */}

          <div
            className="card"
            style={{
              padding: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >
              <div
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "#eef8f7",
                  color: "#176b87",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                  fontWeight: 800,
                }}
              >
                {doctor.name
                  ?.charAt(0)
                  ?.toUpperCase() || "D"}
              </div>

              <div>
                <h2>
                  {doctor.name ||
                    "Doctor"}
                </h2>

                <p
                  style={{
                    color: "#176b87",
                    fontWeight: 600,
                    marginTop: "5px",
                  }}
                >
                  {doctor.specialization ||
                    "Specialist"}
                </p>
              </div>
            </div>

            <div
              style={{
                marginTop: "30px",
                display: "grid",
                gap: "15px",
              }}
            >
              <InfoRow
                label="Qualification"
                value={
                  doctor.qualification ||
                  "—"
                }
              />

              <InfoRow
                label="Experience"
                value={`${doctor.experience || 0} years`}
              />

              <InfoRow
                label="Consultation Fee"
                value={`₹${doctor.consultationFee || 0}`}
              />

              <InfoRow
                label="Slot Duration"
                value={`${doctor.slotDuration || 30} minutes`}
              />
            </div>
          </div>

          {/* BOOKING */}

          <div
            className="card"
            style={{
              padding: "30px",
            }}
          >
            <h2>
              Choose Date & Time
            </h2>

            <div
              style={{
                marginTop: "25px",
              }}
            >
              <label className="label">
                Appointment Date
              </label>

              <input
                className="input"
                type="date"
                value={date}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={handleDateChange}
              />
            </div>

            {date && (
              <div
                style={{
                  marginTop: "25px",
                }}
              >
                <label className="label">
                  Available Time Slots
                </label>

                {loadingSlots ? (
                  <Loading text="Finding available slots..." />
                ) : slots.length === 0 ? (
                  <div
                    style={{
                      padding: "25px",
                      background: "#f7f9fb",
                      borderRadius: "10px",
                      marginTop: "10px",
                      color: "#697386",
                    }}
                  >
                    No slots available for
                    this date.
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, 1fr)",
                      gap: "10px",
                      marginTop: "12px",
                    }}
                  >
                    {slots.map(
                      (slot) => {
                        const time =
                          typeof slot ===
                          "string"
                            ? slot
                            : slot.startTime;

                        return (
                          <button
                            key={time}
                            type="button"
                            className={
                              selectedSlot ===
                              time
                                ? "btn btn-primary"
                                : "btn btn-secondary"
                            }
                            onClick={() =>
                              setSelectedSlot(
                                time
                              )
                            }
                          >
                            {time}
                          </button>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{
                width: "100%",
                marginTop: "30px",
              }}
              disabled={
                booking ||
                !date ||
                !selectedSlot
              }
              onClick={handleBooking}
            >
              {booking
                ? "Booking..."
                : "Confirm Appointment"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        gap: "15px",
        paddingBottom: "12px",
        borderBottom:
          "1px solid #edf0f3",
      }}
    >
      <span
        style={{
          color: "#697386",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          textAlign: "right",
        }}
      >
        {value}
      </strong>
    </div>
  );
};

export default BookAppointment;