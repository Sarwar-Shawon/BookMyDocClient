/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { Get, Put, Post } from "../../services";
import { config } from "../../config/appConfig";
import apiEndpoints from "../../config/apiEndpoints";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import PrescriptionUpdate from "./PrescriptionUpdate";
import { formatDateToString } from "../../utils";
import moment from "moment";
import Modal from "../../components/Modal";
import AppCalendar from "../../components/Calendar";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaCalendarAlt, FaHospitalUser, FaClipboardList, FaBookmark , FaMoneyCheck } from "react-icons/fa";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
const Interval = ["7 days", "1 month", "1 year"];
const _status  = ["New", "Ready", "Dispensed"];

//
const PharmacyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [showPresUpd, setShowPresUpd] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isBtnLoading, seBtntLoading] = useState(false);
  const [showResp, setShowResp] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [selPC, setSelPC] = useState({});
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [range, setRange] = useState("7 days");
  const [prStatus, setPrStatus] = useState("");

  useEffect(() => {
    if (formData.start_date && formData.end_date) {
      setPrescriptions([]);
      fetchPrescriptions({ pSkip: true });
    }
  }, [formData.start_date, formData.end_date]);
  //
  useEffect(() => {
      setPrescriptions([]);
      fetchPrescriptions({ pSkip: true });
  }, [range, prStatus]);
  //
  const fetchPrescriptions = async ({ pSkip }) => {
    try {
      const skip = pSkip ? 0 : prescriptions.length;
      const resp = await Get(
        `${apiEndpoints.pharmacy.getPrescriptions}?skip=${skip}&limit=${
          config.FETCH_LIMIT
        }&startDay=${formData.start_date}&endDay=${formData.end_date}&interval=${range}&prStatus=${prStatus}`
      );
      // console.log("resp", resp);
      if (resp.success) {
        setPrescriptions((prevPres) => [...prevPres, ...resp.data]);
        setHasMore(resp.data.length > 0 ? true : false);
      }
    } catch (err) {
      // setError(err?.message);
    } finally {
      setLoading(false);
    }
  };
  //
  const handleDateChange = (date) => {
    if (selectedField === "start_date") {
      setFormData({
        ...formData,
        start_date: date,
      });
    } else {
      setFormData({
        ...formData,
        end_date: date,
      });
    }
    setShowCalendar(false);
  };
  //
  const updatePrescription = async ({status, payStatus , paidBy}) => {
    try {
      //
      seBtntLoading(true);
      const params = {
        pr_id: selPC?._id,
        status: status,
        payStatus: payStatus,
        paidBy: paidBy
      };
      //console.log("params", params);
      //
      const resp = await Put(
        apiEndpoints.pharmacy.updatePrescription,
        params,
        "application/json"
      );
      // console.log("resp:::", resp);
      const respObj = {};
      if (resp?.success) {
        setShowPresUpd(false);
        respObj.success = true;
        respObj.msg = resp?.message;
        const updatedPres = prescriptions.map((pres) =>
          pres._id == resp?.data._id ? { ...pres, ...resp?.data } : pres
        );
        // console.log("updatedPres",updatedPres)
        setPrescriptions(updatedPres);

      } else {
        respObj.success = false;
        respObj.msg = resp?.error;
      }
      setShowResp(respObj);
    } catch (err) {
    } finally {
      seBtntLoading(false);
    }
  };
  //
  const refundPrescription = async () => {
    try {
      //
      if(selPC?._id){

      }
      seBtntLoading(true);
      const params = {
        pres_id: selPC?._id,
        payment_intent: selPC?.transObj?.payment_intent,
        amount: selPC?.transObj?.amount,
      };
      //console.log("params", params);
      //
      const resp = await Post(
        apiEndpoints.stripe.makeRefund,
        params,
        "application/json"
      );
      // console.log("resp:::", resp);
      const respObj = {};
      if (resp?.success) {
        setShowPresUpd(false);
        respObj.success = true;
        respObj.msg = resp?.message;
        const updatedPres = prescriptions.map((pres) =>
          pres._id == resp?.data._id ? { ...pres, ...resp?.data } : pres
        );
        setPrescriptions(updatedPres);
      } else {
        respObj.success = false;
        respObj.msg = resp?.error;
      }
      setShowResp(respObj);
    } catch (err) {
    } finally {
      seBtntLoading(false);
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
        <div className="doctor-list d-flex flex-wrap">
          <div className="col-md-12">
            <div className="row">
              <div className="col">
                <div className="d-flex justify-content-center align-items-center mb-3">
                  <div
                    className="button-container"
                    style={{ marginRight: "10px" }}
                  >
                    <label>Select Start Date</label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        formatDateToString(formData.start_date) || "dd-mm-yyyy"
                      }
                      onFocus={() => {
                        setShowCalendar(true);
                        setSelectedField("start_date");
                      }}
                      readOnly
                    />
                  </div>
                  <div className="button-container">
                    <label>Select End Date</label>
                    <input
                      type="text"
                      className="form-control"
                      value={
                        formatDateToString(formData.end_date) || "dd-mm-yyyy"
                      }
                      onFocus={() => {
                        setShowCalendar(true);
                        setSelectedField("end_date");
                      }}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
            {showCalendar && (
              <AppCalendar
                onCloseModal={() => setShowCalendar(false)}
                value={
                  selectedField === "start_date"
                    ? formData.start_date
                    : formData.end_date
                }
                minDate={
                  selectedField === "start_date" ? null : formData.start_date
                }
                onChange={(val) => handleDateChange(new Date(val))}
              />
            )}
          </div>
          <div className="row col-md-12">
            <div className="col">
              <div className="d-flex justify-content-between align-items-center">
                {Interval.map((item, index) => (
                  <div className="button-container" key={item}>
                    <button
                      className={`tab-button ${range === item ? "active" : ""}`}
                      onClick={() => setRange(item)}
                    >
                      {item}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="row col-md-12" style={{marginTop:10}}>
              <div className="col">
                <div className="d-flex justify-content align-items-center">
                  <div className="mb-3">
                    <label className="form-label">Prescriptions Status:</label>
                    <select
                      className="form-select"
                      name="selDept"
                      value={prStatus}
                      onChange={(e) => setPrStatus(e.target.value)}

                    >
                      <option value="">All</option>
                      {_status.map(
                        (item) =>
                            <option value={item} key={item}>
                              {item}
                            </option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div style={{ marginTop: 15 }}>
          <InfiniteScroll
            dataLength={prescriptions.length}
            next={fetchPrescriptions}
            hasMore={hasMore}
            loader={
              <div className="d-flex justify-content-center align-items-center spinner-container">
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
                  style={{
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    // backgroundColor:
                    //   pr.status == "Dispensed"
                    //     ? "#98D8AA"
                    //     : pr.presType == "Repeated"
                    //     ? "#FFF9C9"
                    //     : pr.repeatReq
                    //     ? "#FFF9C9"
                    //     : "#fff",
                  }}
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
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <FaBookmark style={{ marginRight: "5px" }} />
                      <p className="card-text" style={{ fontWeight: "bold", color: pr.status == "Dispensed"
                      ? "#43766C"
                      : pr.presType == "Repeated"
                      ? "#FFF9C9"
                      : pr.repeatReq
                      ? "#FFF9C9" : "#000" }}>
                      {pr?.status}
                    </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <FaMoneyCheck style={{ marginRight: "5px" }} />
                      <p className="card-text" style={{ fontWeight: "bold" }}>
                        {pr?.payStatus}
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
                      setShowPresUpd(true);
                    }}
                  >
                    View Prescription
                  </button>
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
                      setShowPresUpd(true);
                    }}
                  >
                    Update Prescription
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
      </div>
      {showPresUpd && (
        <PrescriptionUpdate
          onCloseModal={() => {
            setShowPresUpd(false);
          }}
          prescription={selPC}
          medicineList={selPC?.medications}
          title={"Prescription View"}
          updatePrescription={updatePrescription}
          refundPrescription={refundPrescription}
          showBtnLoader={isBtnLoading}
        />
      )}
      {showResp?.msg && (
        <Modal
          title={"Response"}
          body={
            <div>
              <ErrorAlert msg={!showResp?.success ? showResp?.msg : ""} />
              <SuccessAlert msg={showResp?.success ? showResp?.msg : ""} />
            </div>
          }
          btm_btn_2_txt={"Ok"}
          btn2Click={() => {
            setShowResp({});
          }}
          showFooter={true}
          onCloseModal={() => setShowResp({})}
        />
      )}
    </>
  );
};
//
export default PharmacyPrescriptions;
