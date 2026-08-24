import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import PatientDashboard from "./pages/patient/PatientDashboard";
import Doctors from "./pages/patient/Doctors";
import DoctorDetails from "./pages/patient/DoctorDetails";
import MyAppointments from "./pages/patient/MyAppointments";
import MedicalHistory from "./pages/patient/MedicalHistory";

import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import Consultation from "./pages/doctor/Consultation";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminAppointments from "./pages/admin/AdminAppointments";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* PUBLIC */}

          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* PATIENT */}

          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["patient"]}
              >
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/doctors"
            element={
              <ProtectedRoute
                allowedRoles={["patient"]}
              >
                <Doctors />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/doctors/:id"
            element={
              <ProtectedRoute
                allowedRoles={["patient"]}
              >
                <DoctorDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute
                allowedRoles={["patient"]}
              >
                <MyAppointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/medical-history"
            element={
              <ProtectedRoute
                allowedRoles={["patient"]}
              >
                <MedicalHistory />
              </ProtectedRoute>
            }
          />

          {/* DOCTOR */}

          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["doctor"]}
              >
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute
                allowedRoles={["doctor"]}
              >
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/patients"
            element={
              <ProtectedRoute
                allowedRoles={["doctor"]}
              >
                <DoctorPatients />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/consultation/:appointmentId"
            element={
              <ProtectedRoute
                allowedRoles={["doctor"]}
              >
                <Consultation />
              </ProtectedRoute>
            }
          />

          {/* ADMIN */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <AdminDoctors />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <AdminPatients />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute
                allowedRoles={["admin"]}
              >
                <AdminAppointments />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;