/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { Get, Put } from "../../services";
import { config } from "../../config/appConfig";
import apiEndpoints from "../../config/apiEndpoints";
import { formatDateToString } from "../../utils";
import noData from "../../assets/images/no-data.jpg";
import LoadingView from "../../components/Loading";
import Modal from "../../components/Modal";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import TimeSlotView from "../common/TimeSlotView";
import moment from "moment";
import AppCalendar from "../../components/Calendar";
import DoctorSelection from "./DoctorSelection";
import InfiniteScroll from "react-infinite-scroll-component";
import AppointmentCard from "../common/AppointmentCard"
import AppointmentDetails from "../common/AppointmentDetails";
import PatientsMedicalRecord from '../common/PatientsMedicalRecord'
//
const NurseAppointments = () => {
  const [selDoc, setSelDoctor] = useState("");
  const [selType, setSelType] = useState("Accepted");
  //
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <DoctorSelection selDoc={selDoc} setSelDoctor={setSelDoctor} />
          <div
            className="d-flex justify-content-between align-items-center mb-3"
            style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px" }}
          >
            {/* <TabButton
              val="Pending"
              title="Pending"
              selType={selType}
              setSelType={setSelType}
            /> */}
            <TabButton
              val="Accepted"
              title="Upcoming Appointments"
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
        {/* {selType === "Pending" && (
          <AppointmentView aptType={selType} selDoc={selDoc} />
        )} */}
        {selType === "Accepted" && (
          <AppointmentView aptType={selType} selDoc={selDoc} />
        )}
        {selType === "History" && (
          <HistoryView aptType={selType} selDoc={selDoc} />
        )}
      </>
    </div>
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
const AppointmentView = ({ aptType, selDoc }) => {
  const [selApt, setSelApt] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showResp, setShowResp] = useState({});
  //
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelView, setShowCancelView] = useState(false);
  const [showUpdateView, setShowUpdateView] = useState(false);
  const [showAcceptView, setShowAcceptView] = useState(false);
  const [showPtRecordView, setShowPatientRecordView] = useState(false);
  //
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  //
  const [formData, setFormData] = useState({
    apt_date: new Date(),
    timeslot: "",
  });
  //
  useEffect(() => {
    if (selDoc) {
      setAppointments([]);
      fetchAppointments();
    }
  }, [aptType && selDoc]);
  //get appointments
  const fetchAppointments = async () => {
    try {
      const skip = appointments.length;
      const resp = await Get(
        `${apiEndpoints.nurse.getAppointments}?skip=${skip}&status=${aptType}&doc_id=${selDoc}&limit=${config.FETCH_LIMIT}`
      );
      //console.log("fetchAppointments resp:::", resp);
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
  //accept appointments
  const acceptAppointments = async () => {
    try {
      setIsBtnLoading(true);
      setShowResp({});
      const params = {
        apt_id: selApt._id,
      };
      const resp = await Put(
        `${apiEndpoints.nurse.acceptAppointments}?doc_id=${selDoc}`,
        params,
        "application/json"
      );
      //console.log("resp:::", resp);
      if (resp.success) {
        const updatedAppointments = appointments.filter(
          (apt) => apt._id !== selApt._id
        );
        setAppointments(updatedAppointments);
        setShowAcceptView(false);
        setShowResp({ success: true, msg: "Appointment has been accepted" });
      } else {
        setShowResp({ success: false, msg: resp?.error });
      }
    } catch (err) {
    } finally {
      setIsBtnLoading(false);
      setShowAcceptView(false);
      setSelApt("");
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
      const resp = await Put(
        `${apiEndpoints.nurse.cancelAppointments}?doc_id=${selDoc}`,
        params,
        "application/json"
      );
      //console.log("resp:::", resp);
      if (resp.success) {
        const updatedAppointments = appointments.filter(
          (apt) => apt._id !== selApt._id
        );
        setShowCancelView(false);
        setAppointments(updatedAppointments);
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
  const updateAppointments = async ({ formData }) => {
    try {
      setIsBtnLoading(true);
      setShowResp({});
      const params = {
        apt_id: selApt._id,
        apt_date: moment(formData.apt_date),
        timeslot: formData.timeslot,
      };
      const resp = await Put(
        `${apiEndpoints.nurse.updateAppointments}?doc_id=${selDoc}`,
        params,
        "application/json"
      );
      //console.log("resp:::", resp);
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
  const updateApt = (medicalRecord) =>{
    //
    const updatedPt = { ...selApt.pt, medical_history: medicalRecord };
    const updatedApt = appointments.map((apnt) =>
      apnt._id === selApt._id
        ? { ...apnt, pt: updatedPt }
        : apnt
    );
    setAppointments(updatedApt);
    setSelApt({ ...selApt, pt: updatedPt });
  }
  //render
  return (
    <div>
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
                appointments.map((apt) => {
                  return (
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
                      setShowAcceptView={() => {
                        setSelApt(apt);
                        setShowAcceptView(true);
                      }}
                      setShowPatientRecordView={() => {
                        setSelApt(apt);
                        setShowPatientRecordView(true);
                      }}
                      aptType={aptType}
                    />
                  );
                })}
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
      <AcceptModal
        onCloseModal={() => setShowAcceptView(false)}
        showModal={showAcceptView}
        acceptAppointments={acceptAppointments}
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
          selDoc={selDoc}
        />
      )}
      {showPtRecordView && (
        <PatientsMedicalRecord
          onCloseModal={() => setShowPatientRecordView(false)}
          apt={selApt}
          updateApt={updateApt}
          selDoc={selDoc}
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
      {showDetails && (
        <AppointmentDetails
          onCloseModal={() => {
            setShowDetails(false);
            setSelApt("");
          }}
          setShowPatientRecordView={() => {
            setShowDetails(false);
            setShowPatientRecordView(true);
          }}
          selApt={selApt}
        />
      )}
    </div>
  );
};
//Cancel Modal
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
// Accept Modal
const AcceptModal = ({
  onCloseModal,
  acceptAppointments,
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
              "Do you want to accept this appointment?"
            )}
          </div>
        }
        btm_btn_1_txt={"No"}
        btm_btn_2_txt={"Yes"}
        btn1Click={() => {
          onCloseModal();
        }}
        btn2Click={() => {
          acceptAppointments();
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
  isBtnLoading,
  formData,
  setFormData,
  selDoc
}) => {
  //
  const [isLoading, setIsLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState([]);
  const [errors, setError] = useState({});
  useEffect(() => {
    fetchTimeSlots();
  }, [formData.apt_date]);
  //fetch TimeSlots
  const fetchTimeSlots = async () => {
    try {
      setIsLoading(true);
      const resp = await Get(
        `${apiEndpoints.nurse.getTimeSlotsByDate}?date=${
          formData.apt_date
        }&doc_id=${selDoc}`
      );
      //console.log("resp:::", resp);
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
      title={"Update Appointment"}
      body={
        <div>
          {isLoading && (
            <div className="wrapper d-grid place-items: center">
              <div className="loading-container">
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
            user_type={"doctor"}
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
                      updateAppointments({ formData });
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
const HistoryView = ({ aptType,selDoc }) => {
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
        `${apiEndpoints.nurse.getAppointmentsHistory}?skip=${skip}&doc_id=${selDoc}&startDay=${
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
                appointments.map((apt) => {
                  return (
                    <AppointmentCard
                      key={apt._id}
                      apt={apt}
                      setShowDetails={() => {
                        setSelApt(apt);
                        setShowDetails(true);
                      }}
                      aptType={aptType}
                    />
                  );
                })}
            </InfiniteScroll>
          </>
        )}
      </div>
      {
        showDetails && 
        <AppointmentDetails
          onCloseModal={() => {
            setShowDetails(false);
            setSelApt("");
          }}
          selApt={selApt}
        />
      }
    </div>
  );
};
//
export default NurseAppointments;
