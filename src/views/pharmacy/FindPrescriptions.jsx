/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { Get, Put } from "../../services";
import apiEndpoints from "../../config/apiEndpoints";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import PrescriptionPreview from "../common/PrescriptionPreview";
import { formatDateToString } from "../../utils";
import { FaCalendarAlt, FaHospitalUser, FaClipboardList } from "react-icons/fa";
//
const FindPrescriptions = ({ doctorId }) => {
  const [searchText, setSearchText] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [showPresView, setShowPresView] = useState(false);
  const [selPC, setSelPC] = useState({});

  //
  const fetchPrescriptions = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resp = await Get(
        `${apiEndpoints.pharmacy.findPrescriptions}?searchText=${searchText}`
      );
      console.log("resp", resp);
      if (resp.success) {
        setPrescriptions(resp.data);
      }
    } catch (err) {
      // setError(err?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container-fluid">
      <form onSubmit={fetchPrescriptions}>
        <div className="col">
          <div className="d-flex">
            <div className="button-container" style={{ marginRight: "10px" }}>
              <label>Enter Nhs Number:</label>
              <input
                type="text"
                className="form-control"
                value={searchText}
                placeholder="Enter Nhs number"
                onChange={(e) => setSearchText(e.target.value)}
                required
              />
            </div>
            <div className="button-container">
              <button
                type="submit"
                style={{
                  width: "200px",
                  marginTop: "24px",
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
              >
                Find Prescription
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex">
          {
            isLoading &&
            <LoadingView />
          }
          {prescriptions.length > 0 ? (
            prescriptions.map((pr, index) => (
              <div
                key={pr._id}
                className="doctor-card card mb-3 mx-2"
                style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
              >
                <img
                  src={
                    typeof pr?.pt.img == "string"
                      ? `${apiEndpoints.upload.url}/${pr?.pt.img}`
                      : URL.createObjectURL(pr?.pt.img)
                  }
                  className="card-img-top"
                  alt={pr?.pt.f_name}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {[pr?.pt.f_name, pr?.pt.l_name].join(" ")}
                  </h5>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <FaCalendarAlt style={{ marginRight: "5px" }} />
                    <p className="card-text" style={{ fontWeight: "bold" }}>
                      {formatDateToString(pr?.createdAt)}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <FaHospitalUser style={{ marginRight: "5px" }} />
                    <p className="card-text" style={{ fontWeight: "bold" }}>
                      {pr?.pt?.nhs}
                    </p>
                  </div>
                  {pr?.repeatReq && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <FaClipboardList style={{ marginRight: "5px" }} />
                      <p className="card-text" style={{ fontWeight: "bold" }}>
                        {"Requested for a repeat perscription"}
                      </p>
                    </div>
                  )}
                </div>
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
                      setSelPC(pr);
                      setShowPresView(true);
                  }}
                >
                  View Prescription
                </button>
              </div>
            ))
          ) : (
            <div className="container-fluid d-flex justify-content-center align-items-center">
              <img src={noData} className="no-data-img" alt="No data found" />
            </div>
          )}
        </div>
      </form>
      {showPresView && (
        <PrescriptionPreview
          onCloseModal={() => {
            setShowPresView(false);
          }}
          prescription={selPC}
          medicineList={selPC?.medications}
          title={"Prescription View"}
        />
      )}
    </div>
  );
};

//
export default FindPrescriptions;
