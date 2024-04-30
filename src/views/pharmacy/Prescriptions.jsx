/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { Get, Put,Post } from "../../api";
import { apiUrl, config } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import PrescriptionPreview from "../common/PrescriptionPreview";
import { formatDateToString } from "../../utils";
import moment from "moment";
import Modal from "../../components/Modal";
import AppCalendar from "../../components/Calendar";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaCalendarAlt, FaHospitalUser,FaClipboardList } from "react-icons/fa";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
//
const PharmacyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [showPresView, setShowPresView] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isBtnLoading, seBtntLoading] = useState(false);
  const [showResp, setShowResp] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [selPC, setSelPC] = useState({});
  const [formData, setFormData] = useState({
    start_date: new Date(),
    end_date: new Date(),
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  //console.log("prescriptions", prescriptions);
  //
  useEffect(() => {
    setPrescriptions([]);
    fetchPrescriptions({ pSkip: true });
  }, [formData.start_date, formData.end_date]);
  //
  const fetchPrescriptions = async ({ pSkip }) => {
    try {
      const skip = pSkip ? 0 : prescriptions.length;
      const resp = await Get(
        `${apiUrl()}/pharmacy/get-prescriptions?skip=${skip}&limit=${
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
  //
  const requestRepeatPrescription = async () => {
    try {

      if(!selPC._id){
        return ;
      }
      seBtntLoading(true)
      const params = {
        pres_id: selPC._id
      }
      const resp = await Post(
        `${apiUrl()}/pharmacy/request-prescription`,
        params,
        "application/json"
      );
      //
      //console.log("resp", resp);
      const respObj = {};
      if (resp.success) {
        setPrescriptions((prevPres) => prevPres.map(obj => ({ ...obj, ...resp.data })));
        respObj.success = true;
        respObj.msg = resp?.message;
        setShowResp(respObj);
      } else {
        respObj.success = false;
        respObj.msg = resp?.error;
        setShowResp(respObj);
      }
    } catch (err) {
      // setError(err?.message);
    } finally {
      seBtntLoading(false);
      setShowRepeatModal(false);
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
                style={{
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  backgroundColor:   pr.status == "Dispensed" ? "#98D8AA" : pr.presType == "Repeated" ? "#FFF9C9" : pr.repeatReq ? "#FFF9C9" : "#fff",
                }}
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
                  Update Prescription
                </button>
          
                {
                  (pr.repeatOption &&
                  !pr.repeatReq &&
                  pr.status === "Dispensed"&&
                  !pr.rpid
                  ) &&
                 (
                    <button
                      style={{
                        width: "200px",
                        marginBottom: "10px",
                        backgroundColor: "#527853",
                        borderColor: "#527853",
                        transition: "background-color 0.3s, border-color 0.3s",
                      }}
                      className="btn btn-primary"
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#495E57";
                        e.target.style.borderColor = "#495E57";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#527853";
                        e.target.style.borderColor = "#527853";
                      }}
                      onClick={() => {
                        setSelPC(pr);
                        setShowRepeatModal(true);
                      }}
                    >
                      Request Repeat Prescription
                    </button>
                  )}
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
      {showRepeatModal && (
        <Modal
          title={"Repeat Prescription"}
          body={
            isBtnLoading ? (
              <div className="d-flex justify-content-center align-items-center">
                <div className="spinner"></div>
              </div>
            ) : (
              <div>"Do you want to request for a repeat prescription?"</div>
            )
          }
          btm_btn_1_txt={"No"}
          btm_btn_2_txt={"Yes"}
          btn1Click={() => {
            setShowRepeatModal(false);
          }}
          btn2Click={() => requestRepeatPrescription()}
          showFooter={true}
          onCloseModal={() => setShowRepeatModal(false)}
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
const RequestPrescription = () => {
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
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
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
        `${apiUrl()}/doctor/get-prescriptions?skip=${skip}&limit=${
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
          prescription={selPC}
          medicineList={selPC?.medications}
          title={"Prescription View"}
        />
      )}
    </>
  );
};
//
export default PharmacyPrescriptions;
