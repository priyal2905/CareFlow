import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import api from "../../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      const token =
        response.data?.token ||
        response.data?.data?.token;

      const user =
        response.data?.user ||
        response.data?.data?.user;

      if (!token) {
        setError("Login successful, but no authentication token was received.");
        return;
      }

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      if (user?.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user?.role === "DOCTOR") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/patient/dashboard");
      }
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Navbar />

      <main
        className="container"
        style={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div
          className="card"
          style={{
            width: "100%",
            maxWidth: "520px",
            padding: "45px",
          }}
        >
          <div
            style={{
              color: "#176b87",
              fontWeight: 800,
              fontSize: "18px",
              marginBottom: "18px",
            }}
          >
            CAREFLOW
          </div>

          <h1
            style={{
              fontSize: "38px",
              marginBottom: "8px",
            }}
          >
            Welcome Back
          </h1>

          <p
            style={{
              color: "#697386",
              fontSize: "18px",
              marginBottom: "30px",
            }}
          >
            Sign in to continue to your CareFlow
            account.
          </p>

          {error && (
            <div
              style={{
                padding: "15px 18px",
                marginBottom: "25px",
                borderRadius: "12px",
                background: "#fff0ef",
                color: "#d9534f",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label className="label">
                Email
              </label>

              <input
                className="input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div style={{ marginBottom: "25px" }}>
              <label className="label">
                Password
              </label>

              <input
                className="input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "16px",
              }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "25px",
              color: "#697386",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#176b87",
                fontWeight: 700,
              }}
            >
              Create Account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;