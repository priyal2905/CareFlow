import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";

import api from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get(
          "/admin/dashboard"
        );

        setStats(
          response.data.data || stats
        );
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading text="Loading admin dashboard..." />
      </>
    );
  }

  return (
    <div className="page">
      <Navbar />

      <main className="container">
        <div
          style={{
            padding: "45px 0 30px",
          }}
        >
          <p
            style={{
              color: "#176b87",
              fontWeight: 700,
              fontSize: "13px",
              letterSpacing: "0.5px",
            }}
          >
            ADMIN PORTAL
          </p>

          <h1
            style={{
              fontSize: "36px",
              marginTop: "6px",
            }}
          >
            CareFlow Overview
          </h1>

          <p
            style={{
              color: "#697386",
              marginTop: "8px",
            }}
          >
            Monitor users, doctors and
            appointment activity.
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "15px 18px",
              background: "#fff0ef",
              color: "#d9534f",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <div
          className="grid grid-3"
          style={{
            marginBottom: "25px",
          }}
        >
          <StatCard
            icon="👥"
            title="Total Users"
            value={stats.totalUsers}
          />

          <StatCard
            icon="🩺"
            title="Doctors"
            value={stats.totalDoctors}
          />

          <StatCard
            icon="🧑‍🤝‍🧑"
            title="Patients"
            value={stats.totalPatients}
          />

          <StatCard
            icon="📅"
            title="Appointments"
            value={stats.totalAppointments}
          />

          <StatCard
            icon="⏳"
            title="Pending"
            value={stats.pendingAppointments}
          />

          <StatCard
            icon="✅"
            title="Completed"
            value={stats.completedAppointments}
          />
        </div>

        <div
          className="grid grid-3"
          style={{
            paddingBottom: "60px",
          }}
        >
          <DashboardLink
            icon="🩺"
            title="Manage Doctors"
            description="View and manage doctor accounts."
            href="/admin/doctors"
          />

          <DashboardLink
            icon="👥"
            title="Manage Patients"
            description="View registered patients."
            href="/admin/patients"
          />

          <DashboardLink
            icon="📅"
            title="Appointments"
            description="Monitor all appointments."
            href="/admin/appointments"
          />
        </div>
      </main>
    </div>
  );
};

const StatCard = ({
  icon,
  title,
  value,
}) => {
  return (
    <div
      className="card"
      style={{
        padding: "25px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              color: "#697386",
              fontSize: "14px",
            }}
          >
            {title}
          </p>

          <h2
            style={{
              fontSize: "30px",
              marginTop: "7px",
            }}
          >
            {value}
          </h2>
        </div>

        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "14px",
            background: "#eef8f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "23px",
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const DashboardLink = ({
  icon,
  title,
  description,
  href,
}) => {
  return (
    <a
      href={href}
      className="card"
      style={{
        padding: "25px",
        textDecoration: "none",
        color: "inherit",
        transition: "0.2s",
      }}
    >
      <div
        style={{
          fontSize: "30px",
          marginBottom: "15px",
        }}
      >
        {icon}
      </div>

      <h3>{title}</h3>

      <p
        style={{
          color: "#697386",
          marginTop: "7px",
          fontSize: "14px",
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>

      <p
        style={{
          color: "#176b87",
          marginTop: "15px",
          fontWeight: 700,
          fontSize: "14px",
        }}
      >
        Open →
      </p>
    </a>
  );
};

export default AdminDashboard;