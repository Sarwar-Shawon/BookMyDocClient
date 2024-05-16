/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { Get, Put } from "../../services";
import {config } from "../../config/appConfig";
import apiEndpoints from "../../config/apiEndpoints";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import PrescriptionPreview from "../common/PrescriptionPreview";
import RepeatPrescription from "./RepeatPrescription";
import { formatDateToString } from "../../utils";
import moment from "moment";
import Modal from "../../components/Modal";
import AppCalendar from "../../components/Calendar";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaCalendarAlt, FaHospitalUser,FaClipboardList,FaInfo } from "react-icons/fa";
const Interval = ["7 days", "1 month", "1 year"];

//
const DoctorPrescriptions = ({ doctorId }) => {
  const [selType, setSelType] = useState("created");
  //
  return (
    <div className="container-fluid">
      <div className="row">
          <div className="col">
            <div
              className="d-flex justify-content-between align-items-center mb-3"
              style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px" }}
            >
              <TabButton
                title="Prescriptions"
                val="created"
                selType={selType}
                setSelType={setSelType}
              />
              <TabButton
                title="Prescriptions Request"
                val="requested"
                selType={selType}
                setSelType={setSelType}
              />
            </div>
          </div>
        </div>
        <>
          {selType === "created" && <PrescriptionViews selType={selType} />}
          {selType === "requested" && <RequestPrescription selType={selType} />}
        </>
    </div>
  );
};
//
const PrescriptionViews = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [showPresView, setShowPresView] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [selType, setSelType] = useState("Accepted");
  const [hasMore, setHasMore] = useState(true);
  const [selPC, setSelPC] = useState({});
  const [formData, setFormData] = useState({
    start_date:  new Date(new Date().setDate(new Date().getDate() - 7)),
    end_date: new Date(),
  });
  const [ptnhs, setPtnhs] = useState("")
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [range, setRange] = useState("7 days");

  //console.log("prescriptions",prescriptions)
  //
  useEffect(() => {
    setPrescriptions([])
    fetchPrescriptions({pSkip: true});
  }, [formData.start_date, formData.end_date]);
  //
  const fetchPrescriptions = async ({pSkip}) => {
    try {
      const skip = pSkip ? 0 : prescriptions.length;
      const resp = await Get(
        `${apiEndpoints.doctor.getPrescriptions}?skip=${skip}&limit=${
          config.FETCH_LIMIT
        }&startDay=${formData.start_date}&endDay=${formData.end_date}`
      );
      //console.log("resp", resp);
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
  const updateRange = (val) => {
    switch (val) {
      case "7 days":
        setFormData({
          ...formData,
          start_date: new Date(new Date().setDate(new Date().getDate() - 7)),
        });
        break;
      case "1 month":
        setFormData({
          ...formData,
          start_date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        });
        break;
      case "1 year":
        setFormData({
          ...formData,
          start_date: new Date(
            new Date().setFullYear(new Date().getFullYear() - 1)
          ),
        });
        break;
      default:
        break;
    }
    setRange(val);
  };
  //
  if (isLoading) {
    return <LoadingView />;
  }
  //
  return (
    <>
      <div>
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
                <div className="row col-md-12">
            </div>
              </div>
              <div className="col">
              <label>Select Range</label>
              <div className="d-flex justify-content-between align-items-center">
              
                  {Interval.map((item, index) => (
                    <div className="button-container" key={item}>
                      <button
                        className={`tab-button ${
                          range === item ? "active" : ""
                        }`}
                        onClick={() => updateRange(item)}
                      >
                        {item}
                      </button>
                    </div>
                  ))}
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
        </div>
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
                style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" ,
                backgroundColor:  pr.presType == "Repeated" ? "#FFF9C9" : "#fff",
                
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
                    <FaClipboardList style={{ marginRight: "5px" }} />
                    <p className="card-text" style={{ fontWeight: "bold" }}>
                      {pr?.presType}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <FaInfo style={{ marginRight: "5px" }} />
                    <p className="card-text" style={{fontSize: 12,fontWeight: "bold"}}>
                      {pr?._id}
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
                    setSelPC(pr);
                    setShowPresView(true);
                  }}
                >
                  View Prescription
                </button>
                {/* <button
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
                  Update Prescription
                </button> */}
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
          prescription={selPC}
          medicineList={selPC?.medications}
          title={"Prescription View"}
        />
      )}
    </>
  );
};
//
const RequestPrescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [showPresView, setShowPresView] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [selPC, setSelPC] = useState({});
  const [formData, setFormData] = useState({
    start_date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end_date: new Date(),
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [showBtnLoader, setShowBtnLoader] = useState(false);
  const [range, setRange] = useState("1 month");
  const updateRange = (val) => {
    switch (val) {
      case "7 days":
        setFormData({
          ...formData,
          start_date: new Date(new Date().setDate(new Date().getDate() - 7)),
        });
        break;
      case "1 month":
        setFormData({
          ...formData,
          start_date: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        });
        break;
      case "1 year":
        setFormData({
          ...formData,
          start_date: new Date(
            new Date().setFullYear(new Date().getFullYear() - 1)
          ),
        });
        break;
      default:
        break;
    }
    setRange(val);
  };
  //
  useEffect(() => {
    setPrescriptions([])
    fetchPrescriptions({pSkip: true});
  }, [formData.start_date, formData.end_date]);
  //
  const fetchPrescriptions = async ({pSkip}) => {
    try {
      const skip = pSkip ? 0 : prescriptions.length;
      const resp = await Get(
        `${apiEndpoints.doctor.getPrescriptions}?skip=${skip}&limit=${
          config.FETCH_LIMIT
        }&startDay=${formData.start_date}&endDay=${formData.end_date}&repeated=${true}`
      );
      //console.log("resp", resp);
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
  if (isLoading) {
    return <LoadingView />;
  }
  //
  return (
    <>
      <div>
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
              <div className="col">
              <label>Select Range</label>
              <div className="d-flex justify-content-between align-items-center">
              
                  {Interval.map((item, index) => (
                    <div className="button-container" key={item}>
                      <button
                        className={`tab-button ${
                          range === item ? "active" : ""
                        }`}
                        onClick={() => updateRange(item)}
                      >
                        {item}
                      </button>
                    </div>
                  ))}
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
                minDate={ selectedField === "start_date" ? null : formData.start_date}
                onChange={(val) => handleDateChange(new Date(val))}
              />
            )}
          </div>
        </div>
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
                    <FaInfo style={{ marginRight: "5px" }} />
                    <p className="card-text" style={{fontSize: 12,fontWeight: "bold"}}>
                      {pr?._id}
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
                    setSelPC(pr);
                    setShowPresView(true);
                  }}
                >
                  Create Repeat Prescription
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
        <RepeatPrescription
          onCloseModal={() => {
            setShowPresView(false);
          }}
          prescription={selPC}
          medicineList={selPC?.medications}
          title={"Prescription View"}
        />
      )}
    </>
  );
};
//
const TabButton = ({ title, selType, setSelType, val }) => (
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
