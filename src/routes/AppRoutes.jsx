import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

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
import PatientLayout from "../components/patient/PatientLayout";

import Dashboard from "../pages/patient/Dashboard";
import Appointments from "../pages/patient/Appointments";
import BookAppointment from "../pages/patient/BookAppointment";

import Reports from "../pages/patient/Reports";
import LabTests from "../pages/patient/LabTests";
import LabOrders from "../pages/patient/LabOrders";
import Imaging from "../pages/patient/Imaging";
import Doctors from "../pages/patient/Doctors";
import Profile from "../pages/patient/Profile";
import ChangePassword from "../pages/patient/ChangePassword";

// =========================
// DOCTOR AUTH
// =========================
import DoctorLogin from "../pages/doctor/DoctorLogin";

// =========================
// DOCTOR
// =========================
import PatientLabReports from "../components/doctor/PatientLabReports";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import DoctorPatients from "../pages/doctor/DoctorPatients";
import PatientHistory from "../pages/doctor/PatientHistory";
import DoctorProfile from "../pages/doctor/DoctorProfile";
import MedicalReport from "../pages/doctor/MedicalReport";
import DoctorChangePassword from "../pages/doctor/DoctorChangePassword";
import DoctorSharePatient from "../pages/doctor/DoctorSharePatient";
import SharedPatients from "../pages/doctor/SharedPatients";
import SharedPatientDetails from "../pages/doctor/SharedPatientDetails";
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
// ADMIN
// =========================
import AdminLogin from "../pages/admin/AdminLogin";
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminCreateUser from "../pages/admin/AdminCreateUser";
import AdminSchedules from "../pages/admin/AdminSchedules";
import AdminProfile from "../pages/admin/AdminProfile";
import AdminChangePassword from "../pages/admin/AdminChangePassword";

// =========================
// LAB TECHNICIAN
// =========================
import LabTechnicianLogin from "../pages/labTechnician/Login";
import LabTechnicianLayout from "../components/labTechnician/LabTechnicianLayout";
import LabTechnicianDashboard from "../pages/labTechnician/Dashboard";
import LabTechnicianOrders from "../pages/labTechnician/LabOrders";
import MyWork from "../pages/labTechnician/MyWork";
import OrderDetails from "../pages/labTechnician/OrderDetails";
import Results from "../pages/labTechnician/Results";
import UploadImaging from "../pages/labTechnician/Imaging";
import LabTechnicianProfile from "../pages/labTechnician/Profile";
import LabTechnicianChangePassword from "../pages/labTechnician/ChangePassword";
import PatientsList from "../pages/labTechnician/Patients";

function AppRoutes() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC
      ===================================================== */}

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


      {/* =====================================================
          PATIENT AUTH
      ===================================================== */}

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


      {/* =====================================================
          PATIENT
      ===================================================== */}

      <Route
        path="/patient"
        element={<PatientLayout />}
      >

        {/* /patient -> /patient/dashboard */}
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<Dashboard />}
        />

        <Route
          path="appointments"
          element={<Appointments />}
        />

        <Route
          path="book-appointment"
          element={<BookAppointment />}
        />

        <Route
          path="reports"
          element={<Reports />}
        />

        <Route
          path="lab-tests"
          element={<LabTests />}
        />

        <Route
          path="lab-orders"
          element={<LabOrders />}
        />

        <Route
          path="imaging"
          element={<Imaging />}
        />

        <Route
          path="doctors"
          element={<Doctors />}
        />

        <Route
          path="profile"
          element={<Profile />}
        />

        <Route
          path="change-password"
          element={<ChangePassword />}
        />

      </Route>


      {/* =====================================================
          DOCTOR AUTH
      ===================================================== */}

      <Route
        path="/doctor/login"
        element={<DoctorLogin />}
      />


      {/* =====================================================
          DOCTOR
      ===================================================== */}

      <Route
        path="/doctor/dashboard"
        element={<DoctorDashboard />}
      />

      <Route
        path="/doctor/appointments"
        element={<DoctorAppointments />}
      />

      <Route
        path="/doctor/appointments/:appointmentId/report"
        element={<MedicalReport />}
      />

      <Route
        path="/doctor/patients"
        element={<DoctorPatients />}
      />

      <Route
        path="/doctor/patients/:patientId/history"
        element={<PatientHistory />}
      />

      <Route
        path="/doctor/patients/:patientId/share"
        element={<DoctorSharePatient />}
      />

      <Route
        path="/doctor/profile"
        element={<DoctorProfile />}
      />

      <Route
        path="/doctor/change-password"
        element={<DoctorChangePassword />}
      />

      <Route
  path="/doctor/patients/:patientId/lab-reports"
  element={<PatientLabReports />}
/>
<Route
  path="/doctor/shared-patients"
  element={<SharedPatients />}
/>
<Route
  path="/doctor/shared-patients/:patientId"
  element={<SharedPatientDetails />}
/>


      {/* =====================================================
          RECEPTIONIST
      ===================================================== */}

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


      {/* =====================================================
          ADMIN
      ===================================================== */}

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


      {/* =====================================================
          LAB TECHNICIAN LOGIN
      ===================================================== */}

      <Route
        path="/lab-technician/login"
        element={<LabTechnicianLogin />}
      />


      {/* =====================================================
          LAB TECHNICIAN
      ===================================================== */}

      <Route
        path="/lab-technician"
        element={<LabTechnicianLayout />}
      >

        {/* /lab-technician -> /lab-technician/dashboard */}
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<LabTechnicianDashboard />}
        />

        <Route
          path="orders"
          element={<LabTechnicianOrders />}
        />

         <Route
    path="my-work"
    element={<MyWork />}
  />

  <Route
    path="orders/:orderId"
    element={<OrderDetails />}
  />

  <Route
    path="results"
    element={<Results />}
  />

  <Route
  path="imaging"
  element={<UploadImaging />}
/>

<Route
  path="profile"
  element={<LabTechnicianProfile />}
/>

<Route
  path="change-password"
  element={<LabTechnicianChangePassword />}
/>

<Route
  path="patients"
  element={<PatientsList />}
/>

      </Route>


      {/* =====================================================
          FALLBACK
          MUST BE LAST
      ===================================================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />


  


    </Routes>
  );
}

export default AppRoutes;