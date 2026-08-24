import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";

import api from "../../services/api";

const DoctorDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD DOCTOR DASHBOARD
  // ==========================================================

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/appointments/doctor"
        );

        setDashboard(response.data.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load doctor dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="page">
        <Navbar />

        <Loading text="Loading doctor dashboard..." />
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <div className="page">
        <Navbar />

        <main className="container">
          <div
            className="card"
            style={{
              marginTop: "40px",
              padding: "30px",
              color: "#d9534f",
              background: "#fff0ef",
            }}
          >
            {error}
          </div>
        </main>
      </div>
    );
  }

  const statistics = dashboard?.statistics || {};

  const todayAppointments =
    dashboard?.today || [];

  const upcomingAppointments =
    dashboard?.upcoming || [];

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================================
  // STATUS STYLE
  // ==========================================================

  const getStatusStyle = (status) => {
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
      styles[status] || {
        background: "#f3f4f6",
        color: "#697386",
      }
    );
  };

  // ==========================================================
  // DASHBOARD
  // ==========================================================

  return (
    <div className="page">
      <Navbar />

      <main className="container">

        {/* ==================================================
            HEADER
        ================================================== */}

        <section
          style={{
            padding: "45px 0 30px",
          }}
        >
          <p
            style={{
              color: "#176b87",
              fontWeight: 700,
              fontSize: "14px",
              marginBottom: "8px",
            }}
          >
            DOCTOR PORTAL
          </p>

          <h1
            style={{
              fontSize: "36px",
              marginBottom: "8px",
            }}
          >
            Doctor Dashboard
          </h1>

          <p
            style={{
              color: "#697386",
            }}
          >
            Manage your appointments and patient
            consultations from one place.
          </p>
        </section>

        {/* ==================================================
            STATISTICS
        ================================================== */}

        <section
          className="grid grid-3"
          style={{
            marginBottom: "30px",
          }}
        >
          {/* TOTAL */}

          <div
            className="card"
            style={{
              padding: "24px",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                marginBottom: "10px",
              }}
            >
              📋
            </div>

            <small
              style={{
                color: "#697386",
              }}
            >
              Total Appointments
            </small>

            <h2
              style={{
                marginTop: "6px",
                fontSize: "30px",
              }}
            >
              {statistics.totalAppointments || 0}
            </h2>
          </div>

          {/* ACTIVE */}

          <div
            className="card"
            style={{
              padding: "24px",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                marginBottom: "10px",
              }}
            >
              🕐
            </div>

            <small
              style={{
                color: "#697386",
              }}
            >
              Active Appointments
            </small>

            <h2
              style={{
                marginTop: "6px",
                fontSize: "30px",
              }}
            >
              {statistics.totalActive || 0}
            </h2>
          </div>

          {/* COMPLETED */}

          <div
            className="card"
            style={{
              padding: "24px",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                marginBottom: "10px",
              }}
            >
              ✓
            </div>

            <small
              style={{
                color: "#697386",
              }}
            >
              Completed
            </small>

            <h2
              style={{
                marginTop: "6px",
                fontSize: "30px",
              }}
            >
              {statistics.totalCompleted || 0}
            </h2>
          </div>

          {/* CANCELLED */}

          <div
            className="card"
            style={{
              padding: "24px",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                marginBottom: "10px",
              }}
            >
              ✕
            </div>

            <small
              style={{
                color: "#697386",
              }}
            >
              Cancelled
            </small>

            <h2
              style={{
                marginTop: "6px",
                fontSize: "30px",
              }}
            >
              {statistics.totalCancelled || 0}
            </h2>
          </div>

          {/* NO SHOW */}

          <div
            className="card"
            style={{
              padding: "24px",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                marginBottom: "10px",
              }}
            >
              👤
            </div>

            <small
              style={{
                color: "#697386",
              }}
            >
              No Shows
            </small>

            <h2
              style={{
                marginTop: "6px",
                fontSize: "30px",
              }}
            >
              {statistics.totalNoShows || 0}
            </h2>
          </div>

          {/* TODAY */}

          <div
            className="card"
            style={{
              padding: "24px",
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

            <small
              style={{
                color: "#697386",
              }}
            >
              Today's Appointments
            </small>

            <h2
              style={{
                marginTop: "6px",
                fontSize: "30px",
              }}
            >
              {statistics.todayCount || 0}
            </h2>
          </div>
        </section>

        {/* ==================================================
            QUICK ACTIONS
        ================================================== */}

        <section
          className="card"
          style={{
            padding: "25px",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              marginBottom: "18px",
            }}
          >
            Quick Actions
          </h2>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/doctor/appointments"
              className="btn btn-primary"
            >
              View Appointments
            </Link>

            <Link
              to="/doctor/patients"
              className="btn"
            >
              View Patients
            </Link>
          </div>
        </section>

        {/* ==================================================
            TODAY'S APPOINTMENTS
        ================================================== */}

        <section
          className="card"
          style={{
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "15px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "24px",
                }}
              >
                Today's Appointments
              </h2>

              <p
                style={{
                  color: "#697386",
                  marginTop: "5px",
                }}
              >
                Your appointments scheduled for today.
              </p>
            </div>

            <Link
              to="/doctor/appointments"
              style={{
                color: "#176b87",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              View all →
            </Link>
          </div>

          {todayAppointments.length === 0 ? (
            <div
              style={{
                padding: "35px",
                textAlign: "center",
                background: "#f7f9fc",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "35px",
                  marginBottom: "10px",
                }}
              >
                📅
              </div>

              <h3>
                No appointments today
              </h3>

              <p
                style={{
                  color: "#697386",
                  marginTop: "7px",
                }}
              >
                You don't have any appointments
                scheduled for today.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              {todayAppointments.map(
                (appointment) => {
                  const patient =
                    appointment.patientId;

                  const statusStyle =
                    getStatusStyle(
                      appointment.status
                    );

                  return (
                    <div
                      key={appointment._id}
                      style={{
                        padding: "20px",
                        border: "1px solid #e7ebf0",
                        borderRadius: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          gap: "15px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              color: "#697386",
                              fontSize: "13px",
                            }}
                          >
                            Patient
                          </p>

                          <h3
                            style={{
                              marginTop: "4px",
                            }}
                          >
                            {patient?.name ||
                              "Patient"}
                          </h3>

                          <p
                            style={{
                              color: "#697386",
                              fontSize: "14px",
                              marginTop: "5px",
                            }}
                          >
                            {patient?.email ||
                              "—"}
                          </p>
                        </div>

                        <span
                          style={{
                            ...statusStyle,
                            padding: "7px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(3, 1fr)",
                          gap: "15px",
                          marginTop: "18px",
                          paddingTop: "18px",
                          borderTop:
                            "1px solid #e7ebf0",
                        }}
                      >
                        <div>
                          <small
                            style={{
                              color: "#697386",
                            }}
                          >
                            Date
                          </small>

                          <strong
                            style={{
                              display: "block",
                              marginTop: "4px",
                            }}
                          >
                            {formatDate(
                              appointment.date
                            )}
                          </strong>
                        </div>

                        <div>
                          <small
                            style={{
                              color: "#697386",
                            }}
                          >
                            Time
                          </small>

                          <strong
                            style={{
                              display: "block",
                              marginTop: "4px",
                            }}
                          >
                            {appointment.startTime}
                            {" - "}
                            {appointment.endTime}
                          </strong>
                        </div>

                        <div>
                          <small
                            style={{
                              color: "#697386",
                            }}
                          >
                            Reason
                          </small>

                          <strong
                            style={{
                              display: "block",
                              marginTop: "4px",
                            }}
                          >
                            {appointment.reason ||
                              "General consultation"}
                          </strong>
                        </div>
                      </div>

                      {appointment.status ===
                        "CONFIRMED" && (
                        <div
                          style={{
                            marginTop: "18px",
                          }}
                        >
                          <Link
                            to={`/doctor/consultation/${appointment._id}`}
                            className="btn btn-primary"
                          >
                            Start Consultation
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          )}
        </section>

        {/* ==================================================
            UPCOMING
        ================================================== */}

        <section
          className="card"
          style={{
            padding: "30px",
            marginBottom: "60px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "24px",
                }}
              >
                Upcoming Appointments
              </h2>

              <p
                style={{
                  color: "#697386",
                  marginTop: "5px",
                }}
              >
                Your next scheduled consultations.
              </p>
            </div>

            <Link
              to="/doctor/appointments"
              style={{
                color: "#176b87",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              View all →
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                background: "#f7f9fc",
                borderRadius: "12px",
              }}
            >
              <p
                style={{
                  color: "#697386",
                }}
              >
                No upcoming appointments.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "10px",
              }}
            >
              {upcomingAppointments
                .slice(0, 5)
                .map((appointment) => {
                  const patient =
                    appointment.patientId;

                  return (
                    <div
                      key={appointment._id}
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                        gap: "15px",
                        padding: "16px",
                        border:
                          "1px solid #e7ebf0",
                        borderRadius: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <strong>
                          {patient?.name ||
                            "Patient"}
                        </strong>

                        <p
                          style={{
                            color: "#697386",
                            fontSize: "13px",
                            marginTop: "4px",
                          }}
                        >
                          {formatDate(
                            appointment.date
                          )}{" "}
                          •{" "}
                          {appointment.startTime}
                        </p>
                      </div>

                      <span
                        style={{
                          color: "#176b87",
                          fontWeight: 700,
                          fontSize: "13px",
                        }}
                      >
                        {appointment.reason ||
                          "Consultation"}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default DoctorDashboard;