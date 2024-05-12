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
import apiEndpoints from "../../config/apiEndpoints";
import { formatDateToString } from "../../utils";
import Modal from "../../components/Modal";
import { Get } from "../../services";
//appointment details view
const AppointmentDetails = ({
  selApt,
  onCloseModal,
  doctor,
  setShowCreatePresView,
  setShowPatientRecordView,
}) => {
  const [apt, setApt] = useState({});
  const [isLoading, setLoading] = useState(true);
  //
  useEffect(() => {
    loadDetails();
  }, [selApt]);
  //
  const loadDetails = async () => {
    try {
      const resp = await Get(
        `${apiEndpoints.apt.getAppointmentsDetails}?apt_id=${selApt._id}`
      );
      if (resp.success) {
        setApt(resp.data);
      }
    } catch (err) {
      // console.error('err:', err);
    } finally {
      setLoading(false);
    }
  };
  console.log("apt",apt)
  //
  return (
    <Modal
      title={"Appointment Details"}
      body={
        <div className="d-flex container">
          <div className={  (apt?.pt?.medical_history && Object.entries(apt?.pt?.medical_history).length) ? "col-md-6" : "col-md-12"} style={{ marginRight: "10px" }}>
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center">
                <div className="loading-container">
                  <div className="spinner"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="col-md-12 apt-details">
                  <div className="mb-3">
                    <label className="form-label" style={{ color: "#2C4E80" }}>
                      Doctor Name:
                    </label>

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
                <div className="col-md-12">
                  {doctor && (
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
                </div>
              </>
            )}
          </div>
          {(apt?.pt?.medical_history && Object.entries(apt?.pt?.medical_history).length) && (
            <div
              className="col-md-6 pt-record"
              style={{ borderLeft: "2px solid #074173", paddingLeft: "10px" }}
            >
              <div>
                <h3 style={{ color: "#074173" }}>Previous Medical Records</h3>
                <div>
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-primary">
                        <tr>
                          <th className="align-middle">Date</th>
                          <th className="align-middle">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apt?.pt?.medical_history?.healthInfoList.map(
                          (item, index) => (
                            <tr key={"h" + index}>
                              <td className="align-middle">
                                {formatDateToString(item?.date)}
                              </td>
                              <td className="align-middle">
                                {Object.entries(item?.data).map(
                                  ([key, value]) => (
                                    <div key={"as" + key}>
                                      <span>
                                        {key}: {value}
                                      </span>
                                    </div>
                                  )
                                )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <h3 style={{ color: "#074173" }}>Allergies</h3>

              <div className="d-flex align-items-center mb-3">
                {apt?.pt?.medical_history?.allergies.map((item, index) => (
                  <div key={"r" + index}>
                    <h5>
                      {item?.val}
                      {index !==
                        apt.pt.medical_history.allergies.length - 1 && (
                        <span>, </span>
                      )}
                    </h5>
                  </div>
                ))}
              </div>
              <div>
                <h3 style={{ color: "#074173" }}>Diagnoses</h3>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="table-primary">
                      <tr>
                        <th className="align-middle">Date</th>
                        <th className="align-middle">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apt?.pt?.medical_history?.diagnoses.map((item, index) => (
                        <tr key={"vd" + index}>
                          <td className="align-middle">
                            {formatDateToString(item?.date)}
                          </td>
                          <td className="align-middle">
                            <label>{item.val}</label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 style={{ color: "#074173" }}>Notes</h3>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="table-primary">
                      <tr>
                        <th className="align-middle">Date</th>
                        <th className="align-middle">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apt?.pt.medical_history.notes.map((item, index) => (
                        <tr key={"vn" + index}>
                          <td className="align-middle">
                            {formatDateToString(item?.date)}
                          </td>
                          <td className="align-middle">
                            <label>{item.val}</label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-12"></div>
            </div>
          )}
        </div>
      }
      onCloseModal={onCloseModal}
      bigger={true}
    />
  );
};
//
export default AppointmentDetails;
