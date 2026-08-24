import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const {
    user,
    logout,
  } = useAuth();

  const navigate =
    useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        background: "#ffffff",
        borderBottom:
          "1px solid #e7ebf0",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          height: "70px",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: "20px",
        }}
      >

        <Link
          to="/dashboard"
          style={{
            fontFamily:
              "Manrope",
            fontWeight: 800,
            fontSize: "24px",
            color: "#176b87",
          }}
        >
          CareFlow
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >

          {user?.role ===
            "patient" && (
            <>
              <Link
                to="/patient/doctors"
                className="btn btn-secondary"
              >
                Find Doctors
              </Link>

              <Link
                to="/patient/appointments"
                className="btn btn-secondary"
              >
                Appointments
              </Link>

              <Link
                to="/patient/medical-history"
                className="btn btn-secondary"
              >
                Medical History
              </Link>
            </>
          )}

          {user?.role ===
            "doctor" && (
            <>
              <Link
                to="/doctor/dashboard"
                className="btn btn-secondary"
              >
                Dashboard
              </Link>

              <Link
                to="/doctor/appointments"
                className="btn btn-secondary"
              >
                Appointments
              </Link>
            </>
          )}

          {user?.role ===
            "admin" && (
            <>
              <Link
                to="/admin/dashboard"
                className="btn btn-secondary"
              >
                Dashboard
              </Link>

              <Link
                to="/admin/doctors"
                className="btn btn-secondary"
              >
                Doctors
              </Link>

              <Link
                to="/admin/patients"
                className="btn btn-secondary"
              >
                Patients
              </Link>
            </>
          )}

          {user && (
            <>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {user.name}
              </span>

              <button
                className="btn btn-danger"
                onClick={
                  handleLogout
                }
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;