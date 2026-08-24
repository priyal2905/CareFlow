import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}) => {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  // ==========================================================
  // AUTH LOADING
  // ==========================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "#176b87",
        }}
      >
        Loading...
      </div>
    );
  }

  // ==========================================================
  // NOT AUTHENTICATED
  // ==========================================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ==========================================================
  // ROLE CHECK
  // ==========================================================

  if (
    allowedRoles.length > 0 &&
    (!user ||
      !allowedRoles.includes(user.role))
  ) {
    if (
      user?.role === "admin" ||
      user?.role === "ADMIN"
    ) {
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    }

    if (
      user?.role === "doctor" ||
      user?.role === "DOCTOR"
    ) {
      return (
        <Navigate
          to="/doctor/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/patient/dashboard"
        replace
      />
    );
  }

  // ==========================================================
  // AUTHENTICATED + AUTHORIZED
  // ==========================================================

  return children;
};

export default ProtectedRoute;