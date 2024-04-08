/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
//
import { useAuthContext } from "../context/AuthContext";
//all pages
import NotFoundPage from "../views/notfound/NotFoundPage";
import {Home, Doctors, Nurses, Pharmacies , Departments , Profile , Organizations} from '../views/admin'
import {Login, SignUp, Verification} from '../views/auth'
import {PasswordChange} from '../views/common'
import {PatientHome, PatientAppointments, PatientPrescriptions, PatientProfile} from '../views/patient'
import { DoctorHome, DoctorAppointments, DoctorPrescriptions,AppointmentTimetable,DoctorProfile, } from '../views/doctor'
import { NurseHome,NurseAppointments,NurseProfile, NurseAppointmentsTimetable } from '../views/nurse'
import Layout from "../views/layout/Layout"
//
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user_type, isLoading } = useAuthContext();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated || user_type == "Admin") {
    return children || <Outlet />;
  } else {
    return <Navigate to="/signin" replace />;
  }
};
//
const AppRoutes = () => {
  const { user_type, isAuthenticated } = useAuthContext();
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
      { path: "/home", element: <div>Pharmacy Home</div> },
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
      <Route path="/chnage-password" element={<Verification />} />
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
