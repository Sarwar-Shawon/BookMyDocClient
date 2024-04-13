/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaHospitalUser,
  FaClipboard,
  FaClinicMedical,
  FaCity,
  FaRegUser,
  FaRegUserCircle,
} from "react-icons/fa";
import { apiUrl, config } from "../../config/appConfig";
import { formatDateToString } from "../../utils";
import Modal from "../../components/Modal";

//appointment details view
const AppointmentDetails = ({ apt, onCloseModal }) => {
  return (
    <Modal
      title={"Appointment Details"}
      body={
        <div>
          <div className="col-md-12">
            <div className="mb-3">
              <label className="form-label">Doctor Name:</label>

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
          <div className="col-12"></div>
        </div>
      }
      onCloseModal={onCloseModal}
      big={true}
    />
  );
};
//
export default AppointmentDetails;
