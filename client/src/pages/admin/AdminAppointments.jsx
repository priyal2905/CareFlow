import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";

import api from "../../services/api";

const AdminAppointments = () => {
  const [appointments, setAppointments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchAppointments =
      async () => {
        try {
          const response =
            await api.get(
              "/admin/appointments"
            );

          setAppointments(
            response.data.data || []
          );
        } catch (error) {
          setError(
            error.response?.data
              ?.message ||
              "Unable to load appointments."
          );
        } finally {
          setLoading(false);
        }
      };

    fetchAppointments();
  }, []);

  const getStatusStyle = (
    status
  ) => {
    if (status === "COMPLETED") {
      return {
        background: "#eaf8f1",
        color: "#238b67",
      };
    }

    if (status === "CANCELLED") {
      return {
        background: "#fff0ef",
        color: "#d9534f",
      };
    }

    if (status === "CONFIRMED") {
      return {
        background: "#e9f5f6",
        color: "#176b87",
      };
    }

    return {
      background: "#fff7e8",
      color: "#d28b25",
    };
  };

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <div
          style={{
            padding: "40px 0 25px",
          }}
        >
          <p
            style={{
              color: "#176b87",
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            ADMIN
          </p>

          <h1
            style={{
              fontSize: "34px",
              marginTop: "5px",
            }}
          >
            All Appointments
          </h1>
        </div>

        {error && (
          <div
            style={{
              padding: "15px",
              background: "#fff0ef",
              color: "#d9534f",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <Loading text="Loading appointments..." />
        ) : appointments.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "50px",
              textAlign: "center",
            }}
          >
            No appointments found.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "15px",
              paddingBottom: "60px",
            }}
          >
            {appointments.map(
              (appointment) => {
                const patient =
                  appointment.patientId ||
                  appointment.patient;

                const doctor =
                  appointment.doctorId ||
                  appointment.doctor;

                return (
                  <div
                    className="card"
                    key={
                      appointment._id ||
                      appointment.id
                    }
                    style={{
                      padding: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        gap: "20px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <h3>
                          {patient?.name ||
                            "Patient"}
                        </h3>

                        <p
                          style={{
                            color:
                              "#697386",
                            marginTop:
                              "5px",
                          }}
                        >
                          Doctor:{" "}
                          {doctor?.name ||
                            "Doctor"}
                        </p>

                        <p
                          style={{
                            color:
                              "#697386",
                            marginTop:
                              "5px",
                          }}
                        >
                          {appointment.date
                            ? new Date(
                                appointment.date
                              ).toLocaleDateString()
                            : "—"}{" "}
                          ·{" "}
                          {appointment.startTime ||
                            "—"}
                        </p>
                      </div>

                      <span
                        style={{
                          ...getStatusStyle(
                            appointment.status
                          ),
                          height:
                            "fit-content",
                          padding:
                            "7px 13px",
                          borderRadius:
                            "20px",
                          fontSize:
                            "12px",
                          fontWeight: 700,
                        }}
                      >
                        {appointment.status ||
                          "PENDING"}
                      </span>
                    </div>
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

export default AdminAppointments;