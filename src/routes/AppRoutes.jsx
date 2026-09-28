import { Routes, Route } from "react-router-dom";

// Public
import Home from "../pages/public/Home";
import DoctorDetails from "../pages/public/DoctorDetails";
import DoctorSlots from "../pages/public/DoctorSlots";

// Patient Auth
import PatientLogin from "../pages/auth/patient/PatientLogin";
import PatientRegister from "../pages/auth/patient/PatientRegister";
import PatientVerifyOtp from "../pages/auth/patient/PatientVerifyOtp";
import PatientForgotPassword from "../pages/auth/patient/PatientForgotPassword";
import PatientResetPassword from "../pages/auth/patient/PatientResetPassword";

// Patient
import PatientDashboard from "../pages/patient/PatientDashboard";
import BookAppointment from "../pages/patient/BookAppointment";

// Doctor Auth
import DoctorLogin from "../pages/doctor/DoctorLogin";

// Doctor
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import DoctorPatients from "../pages/doctor/DoctorPatients";
import PatientHistory from "../pages/doctor/PatientHistory";
import DoctorProfile from "../pages/doctor/DoctorProfile";
import MedicalReport from "../pages/doctor/MedicalReport";

function AppRoutes() {
  return (
    <Routes>
      {/* =========================
          PUBLIC
      ========================== */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/doctors/:doctorId"
        element={<DoctorDetails />}
      />

      <Route
        path="/doctors/:doctorId/slots"
        element={<DoctorSlots />}
      />

      {/* =========================
          PATIENT AUTH
      ========================== */}

      <Route
        path="/patient/login"
        element={<PatientLogin />}
      />

      <Route
        path="/patient/register"
        element={<PatientRegister />}
      />

      <Route
        path="/patient/verify-otp"
        element={<PatientVerifyOtp />}
      />

      <Route
        path="/patient/forgot-password"
        element={<PatientForgotPassword />}
      />

      <Route
        path="/patient/reset-password"
        element={<PatientResetPassword />}
      />

      {/* =========================
          PATIENT
      ========================== */}

      <Route
        path="/patient/dashboard"
        element={<PatientDashboard />}
      />

      <Route
        path="/patient/book-appointment"
        element={<BookAppointment />}
      />

      {/* =========================
          DOCTOR AUTH
      ========================== */}

      <Route
        path="/doctor/login"
        element={<DoctorLogin />}
      />

      {/* =========================
          DOCTOR DASHBOARD
      ========================== */}

      <Route
        path="/doctor/dashboard"
        element={<DoctorDashboard />}
      />

      {/* =========================
          DOCTOR APPOINTMENTS
      ========================== */}

      <Route
        path="/doctor/appointments"
        element={<DoctorAppointments />}
      />

      {/* =========================
          DOCTOR REPORT
      ========================== */}

      <Route
        path="/doctor/appointments/:appointmentId/report"
        element={<MedicalReport />}
      />

      {/* =========================
          DOCTOR PATIENTS
      ========================== */}

      <Route
        path="/doctor/patients"
        element={<DoctorPatients />}
      />

      {/* =========================
          PATIENT HISTORY
      ========================== */}

      <Route
        path="/doctor/patients/:patientId/history"
        element={<PatientHistory />}
      />

      {/* =========================
          DOCTOR PROFILE
      ========================== */}

      <Route
        path="/doctor/profile"
        element={<DoctorProfile />}
      />
    </Routes>
  );
}

export default AppRoutes;