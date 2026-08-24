import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      await register(
        form.name,
        form.email,
        form.password
      );

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "0.9fr 1.1fr",
      }}
    >
      {/* LEFT */}

      <div
        style={{
          background: "#eef8f7",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            margin: "auto",
          }}
        >
          <Link
            to="/"
            style={{
              fontFamily: "Manrope",
              fontSize: "28px",
              fontWeight: 800,
              color: "#176b87",
            }}
          >
            CareFlow
          </Link>

          <h1
            style={{
              fontSize: "45px",
              lineHeight: 1.1,
              marginTop: "60px",
              marginBottom: "20px",
            }}
          >
            Your health,
            <br />
            your flow.
          </h1>

          <p
            style={{
              color: "#697386",
              fontSize: "17px",
              lineHeight: 1.7,
            }}
          >
            Create your CareFlow account
            and take control of your
            healthcare appointments,
            doctors and medical history.
          </p>
        </div>
      </div>

      {/* RIGHT */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          background: "#f7f9fc",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "450px",
          }}
        >
          <div style={{ marginBottom: "30px" }}>
            <h2
              style={{
                fontSize: "34px",
                marginBottom: "8px",
              }}
            >
              Create your account
            </h2>

            <p
              style={{
                color: "#697386",
              }}
            >
              Join CareFlow today.
            </p>
          </div>

          {error && (
            <div
              style={{
                background: "#fff0ef",
                color: "#d9534f",
                padding: "12px 14px",
                borderRadius: "10px",
                marginBottom: "18px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: "#eaf8f1",
                color: "#238b67",
                padding: "12px 14px",
                borderRadius: "10px",
                marginBottom: "18px",
                fontSize: "14px",
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">
                Full name
              </label>

              <input
                className="input"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">
                Email address
              </label>

              <input
                className="input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">
                Password
              </label>

              <input
                className="input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">
                Confirm password
              </label>

              <input
                className="input"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
              />
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "5px",
              }}
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "24px",
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
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;