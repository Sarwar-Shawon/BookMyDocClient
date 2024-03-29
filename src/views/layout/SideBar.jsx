/*
 * @copyRight by md sarwar hoshen.
 */
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const AppRoutes = {
  Admin: [
    { name: "Home", path: "/home" },
    { name: "Organizations", path: "/organizations" },
    { name: "Departments", path: "/departments" },
    { name: "Doctors", path: "/doctors" },
    { name: "Nurses", path: "/nurses" },
    { name: "Pharmacies", path: "/pharmacies" },
    { name: "Profile", path: "/profile" },
  ],
  Doctor: [
    { name: "Home", path: "/home" },
    { name: "Appointments", path: "/appointments" },
    { name: "Prescriptions", path: "/prescriptions" },
    { name: "Timetable", path: "/timetable" },
    { name: "Profile", path: "/profile" },
  ],
  Patient: [
    { name: "Home", path: "/home" },
    { name: "Appointments", path: "/appointments" },
    { name: "Prescriptions", path: "/prescriptions" },
    { name: "Profile", path: "/profile" },
  ],
  Nurse: [
    { name: "Home", path: "/home" },
    { name: "Appointments", path: "/appointments" },
    { name: "Prescriptions", path: "/prescriptions" },
    { name: "Profile", path: "/profile" },
  ],
  Pharmacy: [{ name: "Home", path: "/home" }],
};

const SideBar = ({isVisible}) => {
  const { user_type } = useAuthContext();

  return (
    <div className={`sidebar ${isVisible ? '' : 'hidden'}`}>
      {AppRoutes[user_type].map((list,index) => {
        return (
          <NavLink
            to={list.path}
            // className={({ isActive }) =>
            //   isActive ? "nav-link active" : "nav-link"
            // }
            activeclassname="active"
            className="sidebar-tab"
            key={index}
          >
            {list.name}
          </NavLink>
        );
      })}
    </div>
  );
};
export default SideBar;
