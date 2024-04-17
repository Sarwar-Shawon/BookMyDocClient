/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { Get, Put } from "../../api";
import { apiUrl,config } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import PrescriptionPreview from "../common/PrescriptionPreview";
import { formatDateToString } from "../../utils";
import moment from "moment";
import Modal from "../../components/Modal";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  FaCalendarAlt,
  FaHospitalUser,
} from "react-icons/fa";
//
const DoctorPrescriptions = ({ doctorId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [showPresView, setShowPresView] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [selType, setSelType] = useState("Accepted");
  const [hasMore, setHasMore] = useState(true);
  const [selPC, setSelPC] = useState({});

  //
  useEffect(() => {
    fetchPrescriptions();
  }, []);
  //
  const fetchPrescriptions = async () => {
    try {
      const skip = prescriptions.length;
      const resp = await Get(
        `${apiUrl()}/doctor/get-prescriptions?skip=${skip}&limit=${
          config.FETCH_LIMIT
        }`
      );
      console.log("resp", resp)
      if (resp.success) {
        setPrescriptions(resp?.data);
      }
    } catch (err) {
      // setError(err?.message);
    } finally {
      setLoading(false);
    }
  };
  //
  if (isLoading) {
    return <LoadingView />;
  }
  //
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <div
              className="d-flex justify-content-between align-items-center mb-3"
              style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px" }}
            >
              <TabButton
                title="Prescriptions"
                val="Accepted"
                selType={selType}
                setSelType={setSelType}
              />
              <TabButton
                val="Prescriptions Request"
                title="History"
                selType={selType}
                setSelType={setSelType}
              />
            </div>
          </div>
        </div>
        <>
          {/* {selType === "Pending" && <AppointmentView selType={selType} />} */}
          {/* {selType === "Accepted" && <AppointmentView selType={selType} />}
        {selType === "History" && <HistoryView selType={selType} />} */}
        </>
        <InfiniteScroll
              dataLength={prescriptions.length}
              next={fetchPrescriptions}
              hasMore={hasMore}
              loader={
                <div className="d-flex justify-content-center align-items-center">
                  <div className="spinner"></div>
                </div>
              }
              style={{ display: "flex", flexWrap: "wrap" }}
            >
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
                    ? `${apiUrl()}/uploads/${pr?.pt.img}`
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
                  setSelPC( pr)
                  setShowPresView(true)
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
        </InfiniteScroll>
      </div>
      {showPresView && (
        <PrescriptionPreview
          onCloseModal={() => {
            setShowPresView(false);
          }}
          selPC={selPC}
          title={"Prescription View"}
        />
      )}
    </>
  );
};
//
// const Prescription =
//
const TabButton = ({ title, selType, setSelType,val }) => (
  <div className="button-container">
    <button
      className={`tab-button ${selType === val ? "active" : ""}`}
      onClick={() => setSelType(val)}
    >
      {title}
    </button>
  </div>
);
//
export default DoctorPrescriptions;
