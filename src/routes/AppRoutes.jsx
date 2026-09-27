import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import DoctorDetails from "../pages/public/DoctorDetails";

import PatientLogin from "../pages/auth/patient/PatientLogin";
import PatientRegister from "../pages/auth/patient/PatientRegister";
import PatientVerifyOtp from "../pages/auth/patient/PatientVerifyOtp";
import PatientForgotPassword from "../pages/auth/patient/PatientForgotPassword";
import PatientResetPassword from "../pages/auth/patient/PatientResetPassword";
import DoctorSlots from "../pages/public/DoctorSlots";
import PatientDashboard from "../pages/patient/PatientDashboard";
import BookAppointment from "../pages/patient/BookAppointment";
import DoctorLogin from "../pages/doctor/DoctorLogin";

function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}

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


      {/* ================= PATIENT AUTH ================= */}

      <Route
        path="/patient/login"
        element={<PatientLogin />}
      />

      <Route
        path="/patient/register"
        element={<PatientRegister />}
      />

      <Route
        path="/patient/verify-registration"
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

{/* ================= DOCTOR LOGIN ================= */}

       <Route 
       path="/doctor/login" 
       element={<DoctorLogin />} 
       />

      {/* ================= TEMP PATIENT DASHBOARD ================= */}

        <Route
        path="/patient/dashboard"
        element={<PatientDashboard />}
        />

        <Route
  path="/patient/book-appointment"
  element={<BookAppointment />}
/>

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-slate-800">
                404
              </h1>

              <p className="mt-3 text-slate-500">
                Page not found
              </p>
            </div>
          </div>
        }
      />

    </Routes>
  );
}

export default AppRoutes;