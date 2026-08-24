import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";

import api from "../../services/api";

const DoctorAppointments = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAppointments = async () => {
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
          "Unable to load appointments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

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

  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <Loading text="Loading appointments..." />
      </div>
    );
  }

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

  const today = dashboard?.today || [];
  const upcoming = dashboard?.upcoming || [];
  const completed = dashboard?.completed || [];
  const cancelled = dashboard?.cancelled || [];
  const noShows = dashboard?.noShows || [];

  const renderAppointment = (appointment) => {
    const patient = appointment.patientId;
    const statusStyle = getStatusStyle(
      appointment.status
    );

    return (
      <div
        className="card"
        key={appointment._id}
        style={{
          padding: "22px",
          marginBottom: "14px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
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

            <h3 style={{ marginTop: "5px" }}>
              {patient?.name || "Patient"}
            </h3>

            <p
              style={{
                color: "#697386",
                marginTop: "5px",
                fontSize: "14px",
              }}
            >
              {patient?.email || "—"}
            </p>
          </div>

          <span
            style={{
              ...statusStyle,
              padding: "7px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 700,
              height: "fit-content",
            }}
          >
            {appointment.status}
          </span>
        </div>

        <div
          className="grid grid-3"
          style={{
            marginTop: "20px",
            paddingTop: "18px",
            borderTop: "1px solid #e7ebf0",
          }}
        >
          <div>
            <small style={{ color: "#697386" }}>
              Date
            </small>

            <strong
              style={{
                display: "block",
                marginTop: "5px",
              }}
            >
              {formatDate(appointment.date)}
            </strong>
          </div>

          <div>
            <small style={{ color: "#697386" }}>
              Time
            </small>

            <strong
              style={{
                display: "block",
                marginTop: "5px",
              }}
            >
              {appointment.startTime} -{" "}
              {appointment.endTime}
            </strong>
          </div>

          <div>
            <small style={{ color: "#697386" }}>
              Reason
            </small>

            <strong
              style={{
                display: "block",
                marginTop: "5px",
              }}
            >
              {appointment.reason ||
                "General consultation"}
            </strong>
          </div>
        </div>

        {appointment.status === "CONFIRMED" && (
          <div style={{ marginTop: "20px" }}>
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
  };

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <section
          style={{
            padding: "45px 0 30px",
          }}
        >
          <Link
            to="/doctor/dashboard"
            style={{
              color: "#176b87",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            ← Back to Dashboard
          </Link>

          <h1
            style={{
              fontSize: "36px",
              marginTop: "20px",
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
            Manage your patient appointments and
            consultations.
          </p>
        </section>

        <section
          className="card"
          style={{
            padding: "20px",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "25px",
              flexWrap: "wrap",
            }}
          >
            <strong>
              Today: {today.length}
            </strong>

            <strong>
              Upcoming: {upcoming.length}
            </strong>

            <strong>
              Completed: {completed.length}
            </strong>

            <strong>
              Cancelled: {cancelled.length}
            </strong>

            <strong>
              No Shows: {noShows.length}
            </strong>
          </div>
        </section>

        <section style={{ paddingBottom: "60px" }}>
          <h2
            style={{
              fontSize: "26px",
              marginBottom: "18px",
            }}
          >
            Today's Appointments
          </h2>

          {today.length === 0 ? (
            <div
              className="card"
              style={{
                padding: "35px",
                marginBottom: "35px",
                color: "#697386",
              }}
            >
              No appointments scheduled for today.
            </div>
          ) : (
            <div style={{ marginBottom: "35px" }}>
              {today.map(renderAppointment)}
            </div>
          )}

          <h2
            style={{
              fontSize: "26px",
              marginBottom: "18px",
            }}
          >
            Upcoming Appointments
          </h2>

          {upcoming.length === 0 ? (
            <div
              className="card"
              style={{
                padding: "35px",
                marginBottom: "35px",
                color: "#697386",
              }}
            >
              No upcoming appointments.
            </div>
          ) : (
            <div style={{ marginBottom: "35px" }}>
              {upcoming.map(renderAppointment)}
            </div>
          )}

          <h2
            style={{
              fontSize: "26px",
              marginBottom: "18px",
            }}
          >
            Completed Appointments
          </h2>

          {completed.length === 0 ? (
            <div
              className="card"
              style={{
                padding: "35px",
                marginBottom: "35px",
                color: "#697386",
              }}
            >
              No completed appointments.
            </div>
          ) : (
            <div style={{ marginBottom: "35px" }}>
              {completed.map(renderAppointment)}
            </div>
          )}

          <h2
            style={{
              fontSize: "26px",
              marginBottom: "18px",
            }}
          >
            Cancelled Appointments
          </h2>

          {cancelled.length === 0 ? (
            <div
              className="card"
              style={{
                padding: "35px",
                marginBottom: "35px",
                color: "#697386",
              }}
            >
              No cancelled appointments.
            </div>
          ) : (
            <div style={{ marginBottom: "35px" }}>
              {cancelled.map(renderAppointment)}
            </div>
          )}

          <h2
            style={{
              fontSize: "26px",
              marginBottom: "18px",
            }}
          >
            No-Show Appointments
          </h2>

          {noShows.length === 0 ? (
            <div
              className="card"
              style={{
                padding: "35px",
                marginBottom: "35px",
                color: "#697386",
              }}
            >
              No no-show appointments.
            </div>
          ) : (
            <div style={{ marginBottom: "35px" }}>
              {noShows.map(renderAppointment)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DoctorAppointments;