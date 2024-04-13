/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { Get, Put } from "../../api";
import { apiUrl } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import PrescriptionCreateView from "./PrescriptionCreate";
import { formatDateToString } from "../../utils";
import moment from "moment";
import Modal from "../../components/Modal";

//
const DoctorPrescriptions = ({ doctorId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [showNewPView, setShowNewPView] = useState(false);
  const [isLoading, setLoading] = useState(true);
  //
  useEffect(() => {
    fetchPrescriptions();
  }, []);
  //
  const fetchPrescriptions = async () => {
    try {
      const resp = await Get(`${apiUrl()}/doctor/get-holidays`);
      console.log("resp:::", JSON.stringify(resp));
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
        <div className="col-md-12">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >
            <button
              style={{
                width: "200px",
                backgroundColor: "#0B2447",
                borderColor: "#0B2447",
                transition: "background-color 0.3s, border-color 0.3s",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                marginRight: "5px",
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
                setShowNewPView(true);
              }}
            >
              Create a Prescription
            </button>
          </div>
        </div>
        {prescriptions.length > 0 ? (
          <></>
        ) : (
          <div className="container-fluid d-flex justify-content-center align-items-center">
            <img src={noData} className="no-data-img" alt="No data found" />
          </div>
        )}
      </div>
      {showNewPView && (
          <PrescriptionCreateView
          onCloseModal={() => {
            setShowNewPView(false);
          }}
          title={"New Prescriptions"}
        />
      )}
      
    </>
  );
};
//
export default DoctorPrescriptions;
