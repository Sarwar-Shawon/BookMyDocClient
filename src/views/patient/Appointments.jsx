/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { Get, Put } from "../../api";
import { apiUrl, config } from "../../config/appConfig";
import noData from "../../assets/images/no-data.jpg";
import LoadingView from "../../components/Loading";
import { formatDateToString } from "../../utils";
import Modal from "../../components/Modal";
import moment from "moment";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import AppCalendar from "../../components/Calendar";
import TimeSlotView from "../common/TimeSlotView";
import InfiniteScroll from "react-infinite-scroll-component";
import AppointmentDetails from "../common/AppointmentDetails";

//
const PatientAppointments = () => {
  const [selType, setSelType] = useState("Accepted");
  //
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div
            className="d-flex justify-content-between align-items-center mb-3"
            style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px" }}
          >
           {/*  <TabButton
              title="Pending"
              val="Pending"
              selType={selType}
              setSelType={setSelType}
            /> */}
            <TabButton
              title="Upcoming Appointments"
              val="Accepted"
              selType={selType}
              setSelType={setSelType}
            />
            <TabButton
              val="History"
              title="History"
              selType={selType}
              setSelType={setSelType}
            />
          </div>
        </div>
      </div>
      <>
        {/* {selType === "Pending" && <AppointmentView selType={selType} />} */}
        {selType === "Accepted" && <AppointmentView selType={selType} />}
        {selType === "History" && <HistoryView selType={selType} />}
      </>
    </div>
  );
};
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
// show pending appointments
const AppointmentView = ({ selType }) => {
  const [appointments, setAppointments] = useState([]);
  const [selApt, setSelApt] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showResp, setShowResp] = useState({});
  //
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelView, setShowCancelView] = useState(false);
  const [showUpdateView, setShowUpdateView] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  //
  const [formData, setFormData] = useState({
    apt_date: new Date(),
    timeslot: "",
  });
  //
  useEffect(() => {
    setAppointments([]);
    fetchAppointments();
  }, [selType]);
  //
  const fetchAppointments = async () => {
    try {
      const skip = appointments.length;
      const resp = await Get(
        `${apiUrl()}/patient/get-appointments?skip=${skip}&status=${selType}&limit=${
          config.FETCH_LIMIT
        }`
      );
      console.log("resp::: doctors", resp);
      if (resp.success) {
        setAppointments((prevApts) => [...prevApts, ...resp.data]);
        setHasMore(resp.data.length > 0 ? true : false);  
      }
    } catch (err) {
      // console.error('err:', err);
    } finally {
      setLoading(false);
    }
  };
  //cancel appointments
  const cancelAppointments = async () => {
    try {
      setIsBtnLoading(true);
      setShowResp({});
      const params = {
        apt_id: selApt._id,
      };
      if (!selApt._id) {
        return;
      }
      const resp = await Put(
        `${apiUrl()}/patient/cancel-appointments`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
      if (resp.success) {
        const updatedAppointments = appointments.filter(
          (apnt) => apnt._id !== selApt._id
        );
        setAppointments(updatedAppointments);
        setShowCancelView(false);
        setShowResp({ success: true, msg: "Appointment has been canceled" });
      } else {
        setShowResp({ success: false, msg: resp?.error });
      }
    } catch (err) {
    } finally {
      setIsBtnLoading(false);
      setShowCancelView(false);
      setSelApt("");
    }
  };
  //update appointments
  const updateAppointments = async () => {
    try {
      setShowResp({});
      setIsBtnLoading(true);
      const params = {
        apt_id: selApt._id,
        apt_date: moment(formData.apt_date),
        timeslot: formData.timeslot,
      };
      const resp = await Put(
        `${apiUrl()}/patient/update-appointments`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
      if (resp.success) {
        setShowUpdateView(false);
        setShowResp({ success: true, msg: "successful" });
        const updatedApt = appointments.map((apnt) =>
          apnt._id == resp?.data._id ? { ...apnt, ...resp?.data } : apnt
        );
        setAppointments(updatedApt);
      } else {
        setShowResp({ success: false, msg: resp?.error });
      }
    } catch (err) {
    } finally {
      setIsBtnLoading(false);
      setShowUpdateView(false);
      setSelApt("");
    }
  };
  //
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="mb-3">{/*  */}</div>
          </div>
        </div>
      </div>
      <div className="doctor-list d-flex flex-wrap">
        {isLoading ? (
          <LoadingView />
        ) : (
          <>
            {!appointments.length && (
              <div className="container-fluid d-flex justify-content-center align-items-center">
                <img src={noData} className="no-data-img" alt="No data found" />
              </div>
            )}
            <InfiniteScroll
              dataLength={appointments.length}
              next={fetchAppointments}
              hasMore={hasMore}
              loader={
                <div className="d-flex justify-content-center align-items-center">
                  <div className="spinner"></div>
                </div>
              }
              style={{ display: "flex", flexWrap: "wrap" }}
            >
              {appointments.length > 0 &&
                appointments.map((apt) => (
                  <AppointmentCard
                    key={apt._id}
                    apt={apt}
                    setShowDetails={() => {
                      setSelApt(apt);
                      setShowDetails(true);
                    }}
                    setShowCancelView={() => {
                      setSelApt(apt);
                      setShowCancelView(true);
                    }}
                    setShowUpdateView={() => {
                      setSelApt(apt);
                      setFormData({
                        ...formData,
                        apt_date: new Date(apt?.apt_date),
                        timeslot: apt?.timeslot,
                      });
                      setShowUpdateView(true);
                    }}
                    aptType={selType}
                  />
                ))}
            </InfiniteScroll>
          </>
        )}
      </div>
      <CancelModal
        onCloseModal={() => setShowCancelView(false)}
        showModal={showCancelView}
        cancelAppointments={cancelAppointments}
        isLoading={isBtnLoading}
      />
      {showUpdateView && (
        <UpdateModal
          onCloseModal={() => setShowUpdateView(false)}
          updateAppointments={updateAppointments}
          apt={selApt}
          formData={formData}
          setFormData={setFormData}
          isBtnLoading={isBtnLoading}
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
      {
        showDetails && 
        <AppointmentDetails
          onCloseModal={() => {
            setShowDetails(false);
            setSelApt("");
          }}
          apt={selApt}
        />
      }
    </div>
  );
};
//
const AppointmentCard = ({
  apt,
  setShowDetails,
  setShowCancelView,
  setShowUpdateView,
  aptType,
}) => {
  console.log("aptTypeaptTypeaptType",aptType)
  return (
    <div
      key={apt._id}
      className="doctor-card card mb-3 mx-2"
      onClick={() => {
        // setSelectedDoctor(doctor);
        // setOpenAddView(true);
      }}
    >
      <img
        src={
          typeof apt?.doc.img == "string"
            ? `${apiUrl()}/uploads/${apt?.doc.img}`
            : URL.createObjectURL(apt?.doc.img)
        }
        className="card-img-top"
        alt={apt?.doc.f_name}
      />
      <div className="card-body">
        <h5 className="card-title">
          {[apt?.doc.f_name, apt?.doc.l_name].join(" ")}
        </h5>
        <p className="card-text">{apt?.dept?.name}</p>
        <p className="card-text">
          {formatDateToString(apt?.apt_date) + " " + apt?.timeslot}
        </p>
        {/* <p className="card-text">{"Status: " + apt.status}</p> */}
        <p className="card-text">{apt?.org?.name}</p>
        <p className="card-text">{apt?.org?.addr.formatted_address}</p>
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
        onClick={() => setShowDetails()}
      >
        See Details
      </button>
      {
        aptType !== "History" &&  
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
            setShowUpdateView();
          }}
        >
          Update
        </button>
      }
      {
        aptType !== "History" &&  
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
      }
    
    </div>
  );
};
//
const CancelModal = ({
  onCloseModal,
  cancelAppointments,
  showModal,
  isLoading,
}) => {
  return (
    showModal && (
      <Modal
        title={"Appointment"}
        body={
          <div>
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center">
                <div className="spinner"></div>
              </div>
            ) : (
              "Do you want to cancel this appointment?"
            )}
          </div>
        }
        btm_btn_1_txt={"No"}
        btm_btn_2_txt={"Yes"}
        btn1Click={() => {
          onCloseModal();
        }}
        btn2Click={() => {
          cancelAppointments();
        }}
        showFooter={true}
        onCloseModal={() => onCloseModal()}
        show
      />
    )
  );
};
// Update Modal
const UpdateModal = ({
  onCloseModal,
  updateAppointments,
  apt,
  formData,
  setFormData,
  isBtnLoading,
}) => {
  //
  const [isLoading, setIsLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState([]);
  const [errors, setError] = useState({});
  //
  useEffect(() => {
    fetchTimeSlots();
  }, [formData.apt_date]);
  //fetch TimeSlots
  const fetchTimeSlots = async () => {
    try {
      setIsLoading(true);
      const resp = await Get(
        `${apiUrl()}/patient/get-time-slots?date=${
          formData.apt_date
        }&doc_email=${apt?.doc?.doc_email}`
      );
      console.log("resp:::", resp);
      if (resp.success) {
        setTimeSlots(resp?.data);
      }
    } catch (err) {
      // setError(err?.message);
    } finally {
      setIsLoading(false);
    }
  };
  //Validate Form
  const validateForm = () => {
    let isValid = true;
    const errorsObj = {};
    if (!formData.apt_date) {
      errorsObj.date = "Please select a date";
      isValid = false;
    }
    if (!formData.timeslot) {
      errorsObj.slot = "Please select a time slot";
      isValid = false;
    }
    setError(errorsObj);
    return isValid;
  };
  //
  return (
    <Modal
      title={"Create New Appointment"}
      body={
        <div>
          {isLoading && (
            <div className="wrapper-wo-bg d-grid place-items: center">
              <div className="loading-container-wo-bg">
                <div className="spinner"></div>
              </div>
            </div>
          )}
          <TimeSlotView
            timeSlots={timeSlots}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            apt={apt}
            user_type={"patient"}
          />
          <div className="col-12">
            <div className="d-grid">
              {isBtnLoading ? (
                <button className="btn btn-primary" disabled>
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (validateForm()) {
                      updateAppointments();
                    }
                  }}
                  className="btn btn-primary"
                >
                  {"Update Appointment"}
                </button>
              )}
            </div>
          </div>
        </div>
      }
      onCloseModal={onCloseModal}
      big={true}
    />
  );
};
//
const HistoryView = ({ selType }) => {
  //
  const [selApt, setSelApt] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [formData, setFormData] = useState({
    start_date: new Date(),
    end_date: new Date(),
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
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
  useEffect(() => {
    fetchAppointments();
  }, [formData.start_date, formData.end_date]);
  //get appointments
  const fetchAppointments = async () => {
    try {
      const skip = appointments.length;
      const resp = await Get(
        `${apiUrl()}/patient/get-appointments-history?skip=${skip}&startDay=${
          formData.start_date
        }&endDay=${formData.end_date}&limit=${config.FETCH_LIMIT}`
      );
      if (resp.success) {
        setAppointments((prevApts) => [...prevApts, ...resp.data]);
        setHasMore(resp.data.length > 0 ? true : false);
      }
    } catch (err) {
      // console.error('err:', err);
    } finally {
      setIsLoading(false);
    }
  };
  //
  return (
    <div>
      <div className="doctor-list d-flex flex-wrap">
        <h1>History</h1>
        <div className="col-md-12">
          <div className="mb-3">
            <label>Select Start Date</label>
            <input
              type="text"
              className="form-control"
              value={formatDateToString(formData.start_date) || "dd-mm-yyyy"}
              onFocus={() => {
                setShowCalendar(true);
                setSelectedField("start_date");
              }}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label>Select End Date</label>
            <input
              type="text"
              className="form-control"
              value={formatDateToString(formData.end_date) || "dd-mm-yyyy"}
              onFocus={() => {
                setShowCalendar(true);
                setSelectedField("end_date");
              }}
              readOnly
            />
          </div>
          {showCalendar && (
            <AppCalendar
              onCloseModal={() => setShowCalendar(false)}
              value={
                selectedField === "start_date"
                  ? formData.start_date
                  : formData.end_date
              }
              onChange={(val) => handleDateChange(new Date(val))}
            />
          )}
        </div>
      </div>
      <div className="doctor-list d-flex flex-wrap">
        {isLoading ? (
          <LoadingView />
        ) : (
          <>
            {!appointments.length && (
              <div className="container-fluid d-flex justify-content-center align-items-center">
                <img src={noData} className="no-data-img" alt="No data found" />
              </div>
            )}
            {appointments.length > 0 && (
              <InfiniteScroll
                dataLength={appointments.length}
                next={fetchAppointments}
                hasMore={hasMore}
                loader={
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="spinner"></div>
                  </div>
                }
                style={{ display: "flex", flexWrap: "wrap" }}
              >
                {appointments.map((apt) => {
                  return (
                    <AppointmentCard
                      key={apt._id}
                      apt={apt}
                      aptType={selType}
                      setShowDetails={() => {
                        setSelApt(apt);
                        setShowDetails(true);
                      }}
                    />
                  );
                })}
              </InfiniteScroll>
            )}
          </>
        )}
        {showDetails && (
        <AppointmentDetails
          onCloseModal={() => {
            setShowDetails(false);
            setSelApt("");
          }}
          apt={selApt}
        />
      )}
      </div>
    </div>
  );
};
//
export default PatientAppointments;
