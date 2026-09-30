import { Routes, Route } from "react-router-dom";

// =========================
// PUBLIC
// =========================
import Home from "../pages/public/Home";
import DoctorDetails from "../pages/public/DoctorDetails";
import DoctorSlots from "../pages/public/DoctorSlots";

// =========================
// PATIENT AUTH
// =========================
import PatientLogin from "../pages/auth/patient/PatientLogin";
import PatientRegister from "../pages/auth/patient/PatientRegister";
import PatientVerifyOtp from "../pages/auth/patient/PatientVerifyOtp";
import PatientForgotPassword from "../pages/auth/patient/PatientForgotPassword";
import PatientResetPassword from "../pages/auth/patient/PatientResetPassword";

// =========================
// PATIENT
// =========================
import PatientDashboard from "../pages/patient/PatientDashboard";
import BookAppointment from "../pages/patient/BookAppointment";

// =========================
// DOCTOR AUTH
// =========================
import DoctorLogin from "../pages/doctor/DoctorLogin";

// =========================
// DOCTOR
// =========================
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import DoctorPatients from "../pages/doctor/DoctorPatients";
import PatientHistory from "../pages/doctor/PatientHistory";
import DoctorProfile from "../pages/doctor/DoctorProfile";
import MedicalReport from "../pages/doctor/MedicalReport";
import DoctorChangePassword from "../pages/doctor/DoctorChangePassword";

// =========================
// RECEPTIONIST AUTH
// =========================
import ReceptionistLogin from "../pages/receptionist/ReceptionistLogin";

// =========================
// RECEPTIONIST
// =========================

import ReceptionistDashboard from "../pages/receptionist/ReceptionistDashboard";
import ReceptionistPatients from "../pages/receptionist/ReceptionistPatients";
import ReceptionistPatientDetails from "../pages/receptionist/ReceptionistPatientDetails";
import ReceptionistAddPatient from "../pages/receptionist/ReceptionistAddPatient";
import ReceptionistAppointments from "../pages/receptionist/ReceptionistAppointments";
import ReceptionistBookAppointment from "../pages/receptionist/ReceptionistBookAppointment";
import ReceptionistDoctorSlots from "../pages/receptionist/ReceptionistDoctorSlots";
import ReceptionistProfile from "../pages/receptionist/ReceptionistProfile";
import ReceptionistChangePassword from "../pages/receptionist/ReceptionistChangePassword";

// =========================
// ADMIN LOGIN
// =========================

import AdminLogin from "../pages/admin/AdminLogin";
import AdminLayout from "../components/admin/AdminLayout";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminCreateUser from "../pages/admin/AdminCreateUser";
import AdminSchedules from "../pages/admin/AdminSchedules";
import AdminProfile from "../pages/admin/AdminProfile";
import AdminChangePassword from "../pages/admin/AdminChangePassword";


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

      <Route
        path="/doctor/change-password"
        element={<DoctorChangePassword />}
      />


      {/* =========================
          RECEPTIONIST 
      ========================== */}

      <Route
        path="/receptionist/login"
        element={<ReceptionistLogin />}
      />

      <Route
        path="/receptionist/dashboard"
        element={<ReceptionistDashboard />}
      />

      <Route
        path="/receptionist/patients"
        element={<ReceptionistPatients />}
      />

      <Route
        path="/receptionist/patients/:patientId"
        element={<ReceptionistPatientDetails />}
      />

      <Route
        path="/receptionist/patients/add"
        element={<ReceptionistAddPatient />}
      />

      <Route
        path="/receptionist/appointments"
        element={<ReceptionistAppointments />}
      />

      <Route
        path="/receptionist/appointments/book"
        element={<ReceptionistBookAppointment />}
      />

      <Route
        path="/receptionist/doctor-slots"
        element={<ReceptionistDoctorSlots />}
      />

      <Route
        path="/receptionist/profile"
        element={<ReceptionistProfile />}
      />

      <Route
        path="/receptionist/change-password"
        element={<ReceptionistChangePassword />}
      />
      
      


   {/* =========================
    ADMIN
========================== */}

<Route
  path="/admin/login"
  element={<AdminLogin />}
/>

<Route
  path="/admin/dashboard"
  element={
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  }
/>

<Route
  path="/admin/users"
  element={
    <AdminLayout>
      <AdminUsers />
    </AdminLayout>
  }
/>

<Route
  path="/admin/users/create"
  element={
    <AdminLayout>
      <AdminCreateUser />
    </AdminLayout>
  }
/>

<Route
  path="/admin/schedules"
  element={
    <AdminLayout>
      <AdminSchedules />
    </AdminLayout>
  }
/>

<Route
  path="/admin/profile"
  element={
    <AdminLayout>
      <AdminProfile />
    </AdminLayout>
  }
/>

<Route
  path="/admin/change-password"
  element={
    <AdminLayout>
      <AdminChangePassword />
    </AdminLayout>
  }
/>
    </Routes>
  );
}

export default AppRoutes;