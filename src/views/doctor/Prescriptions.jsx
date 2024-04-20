/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { Get, Put } from "../../api";
import { apiUrl, config } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import PrescriptionPreview from "../common/PrescriptionPreview";
import RepeatPrescription from "../common/RepeatPrescription";
import { formatDateToString } from "../../utils";
import moment from "moment";
import Modal from "../../components/Modal";
import AppCalendar from "../../components/Calendar";
import InfiniteScroll from "react-infinite-scroll-component";

import { FaCalendarAlt, FaHospitalUser } from "react-icons/fa";
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
    start_date: new Date(),
    end_date: new Date(),
  });
  const [ptnhs, setPtnhs] = useState("")
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  console.log("prescriptions",prescriptions)
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
        `${apiUrl()}/doctor/get-prescriptions?skip=${skip}&limit=${
          config.FETCH_LIMIT
        }&startDay=${formData.start_date}&endDay=${formData.end_date}`
      );
      console.log("resp", resp);
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
                <div className="d-flex">
                  <div
                    className="button-container"
                    style={{ marginRight: "10px"}}
                  >
                    <label>Enter Nhs Id:</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ptnhs}
                      onChange={(e) => setPtnhs(e.target.value)}
                    />
                  </div>
                  <div className="button-container" >
                  
                    <button
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
                      onClick={() => {
                        
                      }}
                    >
                      Find Prescription
                    </button>
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
          apt={selPC}
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
    start_date: new Date(),
    end_date: new Date(),
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [showBtnLoader, setShowBtnLoader] = useState(false);

  console.log("prescriptions",prescriptions)
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
        `${apiUrl()}/doctor/get-prescriptions?skip=${skip}&limit=${
          config.FETCH_LIMIT
        }&startDay=${formData.start_date}&endDay=${formData.end_date}&repeated=${true}`
      );
      console.log("resp", resp);
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
   //need validation
   const createRepeatPrescription = async () => {
    try {
      //
      setShowBtnLoader(true)
      // const userMedicineList = medicineList.map(
      //   ({ suggestions, ...rest }) => rest
      // );

      // const params = {
      //   apt_id: apt?._id,
      //   phr_id: selPhr?._id,
      //   medications: userMedicineList,
      //   validDt: formatStringToDate(calculateValidDt(validDt || 1)),
      // };
      // console.log("params",params)
      // //
      // const resp = await Post(
      //   `${apiUrl()}/doctor/create-prescription`,
      //   params,
      //   "application/json"
      // );
      // console.log("resp:::", resp);
      // const respObj = {};
      // if (resp.success) {
      //   setShowPreview(false)
      //   respObj.success = true;
      //   respObj.msg = resp?.message;
      // } else {
      //   respObj.success = false;
      //   respObj.msg = resp?.error;
      // }
      // setShowResp(respObj)
    } catch (err) {
    } finally {
      setShowBtnLoader(false)
    }
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
                    setSelPC(pr);
                    setShowPresView(true);
                  }}
                >
                  View Old Prescription
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
          apt={selPC}
          medicineList={selPC?.medications}
          title={"Prescription View"}
          createRepeatPrescription={createRepeatPrescription}
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
