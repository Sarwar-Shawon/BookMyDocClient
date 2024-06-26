/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaHospitalUser,
  FaClipboard,
  FaInfo
} from "react-icons/fa";
import apiEndpoints from "../../config/apiEndpoints";
import { formatDateToString } from "../../utils";

//appointment card view
const AppointmentCard = ({
  apt,
  setShowDetails,
  setShowCancelView,
  setShowUpdateView,
  setShowAcceptView,
  setShowCreatePresView,
  aptType,
  setShowPatientRecordView,
}) => {
console.log("apt",apt)
  return (
    <div
      key={apt._id}
      className="doctor-card card mb-3 mx-2"
      style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
    >
      {apt?.pt.img && (
        <img
          src={
            typeof apt?.pt.img == "string"
              ? `${apiEndpoints.upload.url}/${apt?.pt.img}`
              : URL.createObjectURL(apt?.pt.img)
          }
          className="card-img-top"
          alt={apt?.pt.f_name}
        />
      )}

      <div className="card-body">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <FaInfo style={{ marginRight: "5px" }} />
          <p className="card-text" style={{ fontSize: 12, fontWeight: "bold" }}>
            {apt?._id}
          </p>
        </div>
        <h5 className="card-title">
          {[apt?.pt.f_name, apt?.pt.l_name].join(" ")}
        </h5>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <FaCalendarAlt style={{ marginRight: "5px" }} />
          <p className="card-text" style={{ fontWeight: "bold" }}>
            {formatDateToString(apt?.apt_date)}
          </p>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <FaClock style={{ marginRight: "5px" }} />
          <p className="card-text" style={{ fontWeight: "bold" }}>
            {apt?.timeslot}
          </p>
        </div>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <FaHospitalUser style={{ marginRight: "5px" }} />
          <p className="card-text" style={{ fontWeight: "bold" }}>
            {apt?.pt?.nhs}
          </p>
        </div>
        {/* <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          <FaClipboard
            style={{
              marginRight: "5px",
              color: apt.status == "Pending" ? "#F7C04A" : "#11009E",
            }}
          />
          <p className="card-text" style={{ fontWeight: "bold" }}>
            {apt.status}
          </p>
        </div> */}
      </div>
      {/* Accept Button */}
      <button
        style={{
          width: "200px",
          marginBottom: "10px",
          backgroundColor: "#279EFF",
          borderColor: "#279EFF",
          transition: "background-color 0.3s, border-color 0.3s",
        }}
        className="btn btn-primary"
        onMouseOver={(e) => {
          e.target.style.backgroundColor = "#75C2F6";
          e.target.style.borderColor = "#75C2F6";
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = "#279EFF";
          e.target.style.borderColor = "#279EFF";
        }}
        onClick={() => setShowDetails()}
      >
        See Details
      </button>
      {/* Accept Button */}
      {/* {aptType == "Pending" && (
        <button
          style={{
            width: "200px",
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
            setShowAcceptView();
          }}
        >
          Accept
        </button>
      )} */}
      {/* Update Button */}
      {setShowCreatePresView && (
        <button
          style={{
            width: "200px",
            marginBottom: "10px",
            backgroundColor: "#0E46A3",
            borderColor: "#0E46A3",
            transition: "background-color 0.3s, border-color 0.3s",
          }}
          className="btn btn-primary"
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#1a4a8a";
            e.target.style.borderColor = "#1a4a8a";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#0E46A3";
            e.target.style.borderColor = "#0E46A3";
          }}
          onClick={() => {
            setShowCreatePresView();
          }}
        >
          Create Prescription
        </button>
      )}
      {/* Update Button */}
      {aptType == "Accepted" && (
        <button
          style={{
            width: "200px",
            marginBottom: "10px",
            backgroundColor: "#0D9276",
            borderColor: "#0D9276",
            transition: "background-color 0.3s, border-color 0.3s",
          }}
          className="btn btn-primary"
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#2D9596";
            e.target.style.borderColor = "#2D9596";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#0D9276";
            e.target.style.borderColor = "#0D9276";
          }}
          onClick={() => {
            setShowUpdateView();
          }}
        >
          Update Time
        </button>
      )}
      {setShowPatientRecordView && (
        <button
          style={{
            width: "200px",
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
            setShowPatientRecordView();
          }}
        >
          Update Patients Record
        </button>
      )}

      {/* Cancel Button */}
      {aptType != "History" && (
        <button
          style={{
            width: "200px",
            marginBottom: "10px",
            backgroundColor: "#F05454",
            borderColor: "#F05454",
            transition: "background-color 0.3s, border-color 0.3s",
          }}
          className="btn btn-primary"
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#C84B31";
            e.target.style.borderColor = "#C84B31";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#F05454";
            e.target.style.borderColor = "#F05454";
          }}
          onClick={() => {
            setShowCancelView();
          }}
        >
          Cancel
        </button>
      )}
    </div>
  );
};
//
export default AppointmentCard;
