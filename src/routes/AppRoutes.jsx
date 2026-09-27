import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import DoctorDetails from "../pages/public/DoctorDetails";

import PatientLogin from "../pages/auth/patient/PatientLogin";
import PatientRegister from "../pages/auth/patient/PatientRegister";
import PatientVerifyOtp from "../pages/auth/patient/PatientVerifyOtp";
import PatientForgotPassword from "../pages/auth/patient/PatientForgotPassword";
import PatientResetPassword from "../pages/auth/patient/PatientResetPassword";
import DoctorSlots from "../pages/public/DoctorSlots";

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

      {/* ================= TEMP PATIENT DASHBOARD ================= */}

      <Route
        path="/patient/dashboard"
        element={
          <div className="flex min-h-screen items-center justify-center">
            <h1 className="text-3xl font-bold text-blue-600">
              Patient Dashboard
            </h1>
          </div>
        }
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