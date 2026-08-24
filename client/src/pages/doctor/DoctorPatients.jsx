import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";

import api from "../../services/api";

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/appointments/doctor"
        );

        const appointments =
          response.data.data?.today || [];

        const upcoming =
          response.data.data?.upcoming || [];

        const completed =
          response.data.data?.completed || [];

        const allAppointments = [
          ...appointments,
          ...upcoming,
          ...completed,
        ];

        const patientMap = new Map();

        allAppointments.forEach((appointment) => {
          const patient = appointment.patientId;

          if (!patient?._id) return;

          if (!patientMap.has(patient._id)) {
            patientMap.set(patient._id, {
              ...patient,
              appointments: 0,
            });
          }

          patientMap.get(
            patient._id
          ).appointments += 1;
        });

        setPatients(
          Array.from(patientMap.values())
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load patients."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <Loading text="Loading patients..." />
      </div>
    );
  }

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
            My Patients
          </h1>

          <p
            style={{
              color: "#697386",
              marginTop: "8px",
            }}
          >
            Patients who have appointments with you.
          </p>
        </section>

        {error && (
          <div
            className="card"
            style={{
              padding: "20px",
              marginBottom: "20px",
              color: "#d9534f",
              background: "#fff0ef",
            }}
          >
            {error}
          </div>
        )}

        {patients.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "50px",
              textAlign: "center",
              marginBottom: "60px",
            }}
          >
            <div style={{ fontSize: "40px" }}>
              👤
            </div>

            <h2 style={{ marginTop: "12px" }}>
              No patients yet
            </h2>

            <p
              style={{
                color: "#697386",
                marginTop: "8px",
              }}
            >
              Your patients will appear here after
              appointments are booked.
            </p>
          </div>
        ) : (
          <section
            className="grid grid-3"
            style={{
              paddingBottom: "60px",
            }}
          >
            {patients.map((patient) => (
              <div
                className="card"
                key={patient._id}
                style={{
                  padding: "25px",
                }}
              >
                <div
                  style={{
                    width: "65px",
                    height: "65px",
                    borderRadius: "50%",
                    background: "#e9f5f6",
                    color: "#176b87",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "25px",
                    fontWeight: 800,
                    marginBottom: "18px",
                  }}
                >
                  {patient.name
                    ?.charAt(0)
                    ?.toUpperCase() || "P"}
                </div>

                <h3>
                  {patient.name || "Patient"}
                </h3>

                <p
                  style={{
                    color: "#697386",
                    marginTop: "6px",
                  }}
                >
                  {patient.email || "—"}
                </p>

                <div
                  style={{
                    marginTop: "18px",
                    paddingTop: "15px",
                    borderTop:
                      "1px solid #e7ebf0",
                  }}
                >
                  <small
                    style={{
                      color: "#697386",
                    }}
                  >
                    Appointments
                  </small>

                  <strong
                    style={{
                      display: "block",
                      marginTop: "4px",
                      fontSize: "20px",
                    }}
                  >
                    {patient.appointments}
                  </strong>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default DoctorPatients;