import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import api from "../../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/auth/register",
        formData
      );

      setSuccess(
        "Registration successful. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <div
          style={{
            maxWidth: "500px",
            margin: "50px auto",
          }}
        >
          <div
            className="card"
            style={{
              padding: "35px",
            }}
          >
            <div style={{ marginBottom: "25px" }}>
              <p
                style={{
                  color: "#176b87",
                  fontWeight: 700,
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                CAREFLOW
              </p>

              <h1
                style={{
                  fontSize: "32px",
                  marginBottom: "8px",
                }}
              >
                Create Account
              </h1>

              <p
                style={{
                  color: "#697386",
                }}
              >
                Register to start using CareFlow.
              </p>
            </div>

            {error && (
              <div
                style={{
                  padding: "12px 15px",
                  marginBottom: "20px",
                  borderRadius: "10px",
                  background: "#fff0ef",
                  color: "#d9534f",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  padding: "12px 15px",
                  marginBottom: "20px",
                  borderRadius: "10px",
                  background: "#eaf8f1",
                  color: "#238b67",
                  fontSize: "14px",
                }}
              >
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "18px" }}>
                <label className="label">
                  Full Name
                </label>

                <input
                  className="input"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label className="label">
                  Email
                </label>

                <input
                  className="input"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label className="label">
                  Password
                </label>

                <input
                  className="input"
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div style={{ marginBottom: "22px" }}>
                <label className="label">
                  Register As
                </label>

                <select
                  className="input"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="patient">
                    Patient
                  </option>

                  <option value="doctor">
                    Doctor
                  </option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "13px",
                }}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </button>
            </form>

            <p
              style={{
                textAlign: "center",
                marginTop: "22px",
                color: "#697386",
                fontSize: "14px",
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  color: "#176b87",
                  fontWeight: 700,
                }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;