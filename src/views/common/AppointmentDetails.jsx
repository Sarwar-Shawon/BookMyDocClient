/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaHospitalUser,
  FaClinicMedical,
  FaCity,
  FaRegUser,
  FaRegUserCircle,
} from "react-icons/fa";
import { apiUrl, config } from "../../config/appConfig";
import { formatDateToString } from "../../utils";
import Modal from "../../components/Modal";

//appointment details view
const AppointmentDetails = ({ apt, onCloseModal , doctor , setShowCreatePresView}) => {
  return (
    <Modal
      title={"Appointment Details"}
      body={
        <div>
          <div className="col-md-12 apt-details">
            <div className="mb-3">
              <label className="form-label" style={{ color: '#2C4E80'  }}>Doctor Name:</label>

              <label
                className="form-control"
                style={{ display: "flex", alignItems: "center" }}
              >
                <FaRegUserCircle style={{ marginRight: "5px" }} />

                {[apt?.doc?.f_name, apt?.doc?.l_name].join(" ")}
              </label>
            </div>
            <div className="mb-3">
              <label className="form-label">Patient Name:</label>
              <label
                className="form-control"
                style={{ display: "flex", alignItems: "center" }}
              >
                <FaRegUser style={{ marginRight: "5px" }} />

                {[apt?.pt?.f_name, apt?.pt?.l_name].join(" ")}
              </label>
            </div>
            <div className="mb-3">
              <label className="form-label">Patient Nhs:</label>
              <label
                className="form-control"
                style={{ display: "flex", alignItems: "center" }}
              >
                <FaHospitalUser style={{ marginRight: "5px" }} />

                {apt?.pt?.nhs}
              </label>
            </div>
            <div className="mb-3">
              <label className="form-label">Appointment Date:</label>
              <label
                className="form-control"
                style={{ display: "flex", alignItems: "center" }}
              >
                <FaCalendarAlt style={{ marginRight: "5px" }} />
                {formatDateToString(apt?.apt_date)}
              </label>
            </div>
            <div className="mb-3">
              <label className="form-label">Appointment Time:</label>
              <label
                className="form-control"
                style={{ display: "flex", alignItems: "center" }}
              >
                <FaClock style={{ marginRight: "5px" }} />

                {apt?.timeslot}
              </label>
            </div>
            {/* <div className="mb-3">
              <label className="form-label">Appointment Status:</label>
              <label
                className="form-control"
                style={{ display: "flex", alignItems: "center" }}
              >
                <FaClipboard
                  style={{
                    marginRight: "5px",
                    color: apt?.status == "Pending" ? "#F7C04A" : "#11009E",
                  }}
                />
                {apt?.status}
              </label>
            </div> */}
            <div className="mb-3">
              <label className="form-label">Department:</label>
              <label
                className="form-control"
                style={{ display: "flex", alignItems: "center" }}
              >
                <FaCity style={{ marginRight: "5px" }} />

                {apt?.dept?.name}
              </label>
            </div>
            <div className="mb-3">
              <label className="form-label">Organization:</label>
              <label
                className="form-control"
                style={{ display: "flex", alignItems: "center" }}
              >
                <FaClinicMedical style={{ marginRight: "5px" }} />

                {apt?.org?.name}
              </label>
            </div>
          </div>
          <div className="col-12">
            {
              doctor && 
              <button
              style={{
                marginBottom: "10px",
                backgroundColor: "#0B2447",
                borderColor: "#0B2447",
                transition: "background-color 0.3s, border-color 0.3s",
              }}
              className="btn btn-primary"
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#1a4a8a";
                e.target.style.borderColor = "#1a4a8a";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#0B2447";
                e.target.style.borderColor = "#0B2447";
              }}
              onClick={() => {
                setShowCreatePresView();
              }}
            >
              Create Prescription
            </button>
            }
            
          </div>
        </div>
      }
      onCloseModal={onCloseModal}
      big={true}
    />
  );
};
//
export default AppointmentDetails;
