/*
 * @copyRight by md sarwar hoshen.
 */
import React from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
//
import { useAuthContext } from "../context/AuthContext";
//all pages
import {Home, Doctors, Nurses, Pharmacies , Departments , Profile , Organizations} from '../views/admin'
import {Login, SignUp, Verification , ForgotPassword} from '../views/auth'
import {PasswordChange} from '../views/common'
import {PatientHome, PatientAppointments, PatientPrescriptions, PatientProfile, CheckoutSuccess} from '../views/patient'
import { DoctorHome, DoctorAppointments, DoctorPrescriptions,AppointmentTimetable,DoctorProfile,Holidays } from '../views/doctor'
import { NurseHome,NurseAppointments,NurseProfile, NurseAppointmentsTimetable } from '../views/nurse'
import { PharmacyProfile,PharmacyPrescriptions,FindPrescriptions} from '../views/pharmacy'
import Layout from "../views/layout/Layout"
//
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user_type, isLoading } = useAuthContext();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isAuthenticated) {
    return children || <Outlet />;
  } else {
    return <Navigate to="/signin" replace />;
  }
};
//
const AppRoutes = () => {
  const { user_type } = useAuthContext();
  //
  const userRoutes = {
    Admin: [
      { path: "/home", element: <Home/> },
      { path: "/doctors", element: <Doctors />},
      { path: "/nurses", element: <Nurses/> },
      { path: "/pharmacies", element: <Pharmacies /> },
      { path: "/organizations", element: <Organizations /> },
      { path: "/departments", element: <Departments /> },
      { path: "/profile", element: <Profile /> },
    ],
    Doctor: [
      { path: "/home", element: <DoctorHome /> },
      { path: "/appointments", element: <DoctorAppointments /> },
      { path: "/prescriptions", element: <DoctorPrescriptions /> },
      { path: "/timetable", element: <AppointmentTimetable /> },
      { path: "/holidays", element: <Holidays /> },
      { path: "/profile", element: <DoctorProfile /> },
    ],
    Patient: [
      { path: "/home", element: <PatientHome /> },
      { path: "/appointments", element: <PatientAppointments /> },
      { path: "/prescriptions", element: <PatientPrescriptions /> },
      { path: "/profile", element: <PatientProfile /> },
    ],
    Nurse: [
      { path: "/home", element: <NurseHome /> },
      { path: "/appointments", element: <NurseAppointments /> },
      { path: "/timetable", element: <NurseAppointmentsTimetable /> },
      { path: "/profile", element: <NurseProfile /> },

    ],
    Pharmacy: [
      { path: "/home", element: <PharmacyPrescriptions /> },
      { path: "/find-prescription", element: <FindPrescriptions /> },
      { path: "/profile", element: <PharmacyProfile /> },
    ],
  };
  //select route by user type
  const selectedRoutes = userRoutes[user_type] || [];
  //
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="/chnage-password" element={<ForgotPassword />} />
      <Route path="/checkout-success" element={<CheckoutSuccess />} />
      <Route element={<ProtectedRoute />}>
        {selectedRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={<Layout>{route.element}</Layout>} />
        ))}
        <Route path="/password-change" element={<PasswordChange />} />
      </Route>
    </Routes>
  );
};
//
export default AppRoutes;
