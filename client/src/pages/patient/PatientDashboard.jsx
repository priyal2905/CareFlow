import {
  Link,
} from "react-router-dom";

import Navbar from "../../components/Navbar";

import { useAuth } from "../../context/AuthContext";

const PatientDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <div
          style={{
            padding: "45px 0 25px",
          }}
        >
          <p
            style={{
              color: "#697386",
              marginBottom: "8px",
            }}
          >
            Welcome back
          </p>

          <h1
            style={{
              fontSize: "36px",
              marginBottom: "10px",
            }}
          >
            Hello, {user?.name?.split(" ")[0]} 👋
          </h1>

          <p
            style={{
              color: "#697386",
              fontSize: "16px",
            }}
          >
            Manage your healthcare journey
            from one place.
          </p>
        </div>

        {/* QUICK ACTIONS */}

        <section
          className="grid grid-3"
          style={{
            marginTop: "20px",
          }}
        >
          <Link
            to="/patient/doctors"
            className="card"
            style={{
              padding: "25px",
              display: "block",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                marginBottom: "15px",
              }}
            >
              🩺
            </div>

            <h3
              style={{
                marginBottom: "8px",
              }}
            >
              Find a Doctor
            </h3>

            <p
              style={{
                color: "#697386",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              Search doctors by
              specialization and
              find available
              appointments.
            </p>
          </Link>

          <Link
            to="/patient/appointments"
            className="card"
            style={{
              padding: "25px",
              display: "block",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                marginBottom: "15px",
              }}
            >
              📅
            </div>

            <h3
              style={{
                marginBottom: "8px",
              }}
            >
              My Appointments
            </h3>

            <p
              style={{
                color: "#697386",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              View upcoming
              appointments,
              reschedule or
              cancel when needed.
            </p>
          </Link>

          <Link
            to="/patient/medical-history"
            className="card"
            style={{
              padding: "25px",
              display: "block",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                marginBottom: "15px",
              }}
            >
              📋
            </div>

            <h3
              style={{
                marginBottom: "8px",
              }}
            >
              Medical History
            </h3>

            <p
              style={{
                color: "#697386",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              Access your
              prescriptions,
              diagnoses and
              previous records.
            </p>
          </Link>
        </section>

        {/* UPCOMING APPOINTMENT */}

        <section
          style={{
            marginTop: "35px",
          }}
        >
          <div
            className="card"
            style={{
              padding: "30px",
              background:
                "linear-gradient(135deg, #176b87, #238b67)",
              color: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p
                  style={{
                    opacity: 0.8,
                    marginBottom: "8px",
                  }}
                >
                  Next appointment
                </p>

                <h2
                  style={{
                    fontSize: "26px",
                    marginBottom: "8px",
                  }}
                >
                  Your upcoming
                  consultations
                </h2>

                <p
                  style={{
                    opacity: 0.8,
                  }}
                >
                  Your next appointment
                  will appear here.
                </p>
              </div>

              <Link
                to="/patient/doctors"
                className="btn"
                style={{
                  background: "white",
                  color: "#176b87",
                  padding:
                    "13px 20px",
                }}
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </section>

        {/* HEALTHCARE TIP */}

        <section
          style={{
            margin:
              "35px 0 60px",
          }}
        >
          <div
            className="card"
            style={{
              padding: "25px",
            }}
          >
            <p
              style={{
                color: "#176b87",
                fontWeight: 700,
                fontSize: "13px",
                marginBottom: "8px",
              }}
            >
              CAREFLOW HEALTH TIP
            </p>

            <h3
              style={{
                marginBottom: "8px",
              }}
            >
              Stay proactive about
              your health.
            </h3>

            <p
              style={{
                color: "#697386",
                lineHeight: 1.6,
              }}
            >
              Keep your appointments
              and medical records
              organized so you and your
              healthcare team can make
              better-informed decisions.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;