import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";

import api from "../../services/api";

const MyAppointments = () => {
  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [actionLoading, setActionLoading] =
    useState(null);

  // ============================================================
  // FETCH APPOINTMENTS
  // ============================================================

  const fetchAppointments = async () => {
    try {
      setError("");

      const response =
        await api.get(
          "/appointments/my"
        );

      setAppointments(
        response.data.data || []
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ============================================================
  // CANCEL APPOINTMENT
  // ============================================================

  const cancelAppointment = async (
    appointmentId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this appointment?"
      );

    if (!confirmed) {
      return;
    }

    setActionLoading(
      appointmentId
    );

    setError("");

    try {
      await api.patch(
        `/appointments/${appointmentId}/cancel`
      );

      await fetchAppointments();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to cancel appointment."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // STATUS STYLE
  // ============================================================

  const getStatusStyle = (
    status
  ) => {
    const styles = {
      CONFIRMED: {
        background: "#eaf8f1",
        color: "#238b67",
      },

      PENDING: {
        background: "#fff7e8",
        color: "#d28b25",
      },

      COMPLETED: {
        background: "#e9f5f6",
        color: "#176b87",
      },

      CANCELLED: {
        background: "#fff0ef",
        color: "#d9534f",
      },

      NO_SHOW: {
        background: "#f3f4f6",
        color: "#697386",
      },
    };

    return (
      styles[status] ||
      styles.PENDING
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="page">
      <Navbar />

      <main className="container">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div
          style={{
            padding: "45px 0 30px",
          }}
        >
          <h1
            style={{
              fontSize: "36px",
            }}
          >
            My Appointments
          </h1>

          <p
            style={{
              color: "#697386",
              marginTop: "8px",
            }}
          >
            Keep track of your upcoming
            and previous consultations.
          </p>
        </div>

        {/* ======================================================
            LOADING
        ====================================================== */}

        {loading && (
          <Loading
            text="Loading appointments..."
          />
        )}

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div
            className="card"
            style={{
              padding: "18px",
              marginBottom: "20px",
              color: "#d9534f",
              background: "#fff0ef",
            }}
          >
            {error}
          </div>
        )}

        {/* ======================================================
            EMPTY STATE
        ====================================================== */}

        {!loading &&
          appointments.length === 0 && (
            <div
              className="card"
              style={{
                padding: "60px 30px",
                textAlign: "center",
                marginBottom: "60px",
              }}
            >
              <div
                style={{
                  fontSize: "45px",
                  marginBottom: "15px",
                }}
              >
                📅
              </div>

              <h2>
                No appointments yet
              </h2>

              <p
                style={{
                  color: "#697386",
                  margin:
                    "10px 0 25px",
                }}
              >
                Find a doctor and book
                your first consultation.
              </p>

              <Link
                to="/patient/doctors"
                className="btn btn-primary"
              >
                Find a Doctor
              </Link>
            </div>
          )}

        {/* ======================================================
            APPOINTMENTS
        ====================================================== */}

        {!loading &&
          appointments.length > 0 && (
            <div
              style={{
                display: "grid",
                gap: "16px",
                paddingBottom: "60px",
              }}
            >
              {appointments.map(
                (appointment) => {
                  const doctor =
                    appointment.doctorId ||
                    appointment.doctor;

                  const status =
                    appointment.status ||
                    "PENDING";

                  const statusStyle =
                    getStatusStyle(
                      status
                    );

                  const appointmentId =
                    appointment._id ||
                    appointment.id;

                  return (
                    <div
                      className="card"
                      key={
                        appointmentId
                      }
                      style={{
                        padding: "25px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "flex-start",
                          gap: "20px",
                          flexWrap:
                            "wrap",
                        }}
                      >
                        {/* DOCTOR */}

                        <div>
                          <p
                            style={{
                              color:
                                "#697386",
                              fontSize:
                                "13px",
                              marginBottom:
                                "5px",
                            }}
                          >
                            Doctor
                          </p>

                          <h3>
                            {" "}
                            {doctor?.name ||
                              "Doctor"}
                          </h3>

                          <p
                            style={{
                              color:
                                "#176b87",
                              marginTop:
                                "5px",
                              fontWeight:
                                600,
                            }}
                          >
                            {doctor?.specialization ||
                              appointment.specialization ||
                              "Healthcare Specialist"}
                          </p>
                        </div>

                        {/* STATUS */}

                        <span
                          style={{
                            ...statusStyle,
                            padding:
                              "7px 12px",
                            borderRadius:
                              "20px",
                            fontSize:
                              "12px",
                            fontWeight:
                              700,
                          }}
                        >
                          {status}
                        </span>
                      </div>

                      {/* APPOINTMENT INFO */}

                      <div
                        className="grid grid-3"
                        style={{
                          marginTop:
                            "22px",
                          paddingTop:
                            "20px",
                          borderTop:
                            "1px solid #e7ebf0",
                        }}
                      >
                        {/* DATE */}

                        <div>
                          <small
                            style={{
                              color:
                                "#697386",
                            }}
                          >
                            Date
                          </small>

                          <strong
                            style={{
                              display:
                                "block",
                              marginTop:
                                "5px",
                            }}
                          >
                            {appointment.date
                              ? new Date(
                                  appointment.date
                                ).toLocaleDateString()
                              : "—"}
                          </strong>
                        </div>

                        {/* TIME */}

                        <div>
                          <small
                            style={{
                              color:
                                "#697386",
                            }}
                          >
                            Time
                          </small>

                          <strong
                            style={{
                              display:
                                "block",
                              marginTop:
                                "5px",
                            }}
                          >
                            {appointment.startTime ||
                              "—"}

                            {appointment.endTime &&
                              ` - ${appointment.endTime}`}
                          </strong>
                        </div>

                        {/* BOOKING REFERENCE */}

                        <div>
                          <small
                            style={{
                              color:
                                "#697386",
                            }}
                          >
                            Booking Reference
                          </small>

                          <strong
                            style={{
                              display:
                                "block",
                              marginTop:
                                "5px",
                              fontSize:
                                "13px",
                            }}
                          >
                            {appointment.bookingReference ||
                              appointment._id ||
                              "—"}
                          </strong>
                        </div>
                      </div>

                      {/* ACTIONS */}

                      {[
                        "PENDING",
                        "CONFIRMED",
                      ].includes(
                        status
                      ) && (
                        <div
                          style={{
                            display:
                              "flex",
                            gap: "10px",
                            marginTop:
                              "20px",
                            flexWrap:
                              "wrap",
                          }}
                        >
                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              cancelAppointment(
                                appointmentId
                              )
                            }
                            disabled={
                              actionLoading ===
                              appointmentId
                            }
                          >
                            {actionLoading ===
                            appointmentId
                              ? "Cancelling..."
                              : "Cancel Appointment"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
      </main>
    </div>
  );
};

export default MyAppointments;