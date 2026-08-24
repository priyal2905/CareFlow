import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";

import api from "../../services/api";

const Consultation = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] =
    useState(null);

  const [consultationNotes, setConsultationNotes] =
    useState("");

  const [diagnosis, setDiagnosis] =
    useState("");

  const [prescription, setPrescription] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await api.get(
          `/appointments/${appointmentId}`
        );

        setAppointment(
          response.data.data
        );

        setConsultationNotes(
          response.data.data.consultationNotes ||
            ""
        );

        setDiagnosis(
          response.data.data.diagnosis ||
            ""
        );

        setPrescription(
          response.data.data.prescription ||
            ""
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load appointment."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

  const handleComplete = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await api.patch(
        `/appointments/${appointmentId}/complete`,
        {
          consultationNotes,
          diagnosis,
          prescription,
        }
      );

      setSuccess(
        "Consultation completed successfully."
      );

      setTimeout(() => {
        navigate("/doctor/appointments");
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to complete consultation."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <Navbar />
        <Loading text="Loading consultation..." />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="page">
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
            <h2>Appointment not found</h2>

            <p
              style={{
                color: "#697386",
                marginTop: "10px",
              }}
            >
              {error}
            </p>

            <Link
              to="/doctor/appointments"
              className="btn btn-primary"
              style={{
                display: "inline-block",
                marginTop: "20px",
              }}
            >
              Back to Appointments
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const patient =
    appointment.patientId;

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <section
          style={{
            padding: "40px 0 25px",
          }}
        >
          <Link
            to="/doctor/appointments"
            style={{
              color: "#176b87",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            ← Back to Appointments
          </Link>

          <h1
            style={{
              fontSize: "36px",
              marginTop: "20px",
            }}
          >
            Consultation
          </h1>

          <p
            style={{
              color: "#697386",
              marginTop: "8px",
            }}
          >
            Record consultation details for the patient.
          </p>
        </section>

        <section
          className="card"
          style={{
            padding: "30px",
            marginBottom: "25px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              marginBottom: "20px",
            }}
          >
            Patient Information
          </h2>

          <div className="grid grid-3">
            <div>
              <small
                style={{
                  color: "#697386",
                }}
              >
                Patient
              </small>

              <strong
                style={{
                  display: "block",
                  marginTop: "5px",
                }}
              >
                {patient?.name || "Patient"}
              </strong>
            </div>

            <div>
              <small
                style={{
                  color: "#697386",
                }}
              >
                Email
              </small>

              <strong
                style={{
                  display: "block",
                  marginTop: "5px",
                }}
              >
                {patient?.email || "—"}
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
                  marginTop: "5px",
                }}
              >
                {appointment.reason ||
                  "General consultation"}
              </strong>
            </div>
          </div>
        </section>

        <form
          className="card"
          onSubmit={handleComplete}
          style={{
            padding: "30px",
            marginBottom: "60px",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              marginBottom: "25px",
            }}
          >
            Consultation Details
          </h2>

          <div style={{ marginBottom: "20px" }}>
            <label className="label">
              Consultation Notes
            </label>

            <textarea
              className="input"
              rows="6"
              value={consultationNotes}
              onChange={(event) =>
                setConsultationNotes(
                  event.target.value
                )
              }
              placeholder="Enter consultation notes..."
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label className="label">
              Diagnosis
            </label>

            <textarea
              className="input"
              rows="4"
              value={diagnosis}
              onChange={(event) =>
                setDiagnosis(
                  event.target.value
                )
              }
              placeholder="Enter diagnosis..."
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label className="label">
              Prescription
            </label>

            <textarea
              className="input"
              rows="5"
              value={prescription}
              onChange={(event) =>
                setPrescription(
                  event.target.value
                )
              }
              placeholder="Enter prescription..."
            />
          </div>

          {error && (
            <div
              style={{
                padding: "14px",
                marginBottom: "15px",
                borderRadius: "10px",
                background: "#fff0ef",
                color: "#d9534f",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                padding: "14px",
                marginBottom: "15px",
                borderRadius: "10px",
                background: "#eaf8f1",
                color: "#238b67",
              }}
            >
              {success}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              saving ||
              appointment.status !== "CONFIRMED"
            }
          >
            {saving
              ? "Completing..."
              : "Complete Consultation"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Consultation;