/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { Get, Put } from "../../api";
import { apiUrl } from "../../config/appConfig";
import noData from "../../assets/images/no-data.jpg";
import LoadingView from "../../components/Loading";
import { formatDateToString } from "../../utils";
import Modal from "../../components/Modal";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import TimeSlotView from "../common/TimeSlotView";
import moment from "moment";
import AppCalendar from "../../components/Calendar";
import DoctorSelection from "./DoctorSelection";
//
const NurseAppointments = () => {
  const [selDoc, setSelDoctor] = useState("");
  const [selType, setSelType] = useState("Pending");
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
            <TabButton
              title="Pending"
              selType={selType}
              setSelType={setSelType}
            />
            <TabButton
              title="Accepted"
              selType={selType}
              setSelType={setSelType}
            />
            <TabButton
              title="History"
              selType={selType}
              setSelType={setSelType}
            />
          </div>
        </div>
      </div>
      <>
        {selType === "Pending" && (
          <AppointmentView aptType={selType} selDoc={selDoc} />
        )}
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
const TabButton = ({ title, selType, setSelType }) => (
  <div className="button-container">
    <button
      className={`tab-button ${selType === title ? "active" : ""}`}
      onClick={() => setSelType(title)}
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
  //
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);
  //
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight &&
      hasMore
    ) {
      fetchAppointments();
    }
  };
  //get appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const limit = 5;
      const skip = appointments.length;
      console.log("skip", skip);
      const resp = await Get(
        `${apiUrl()}/nurse/get-appointments?skip=${skip}&status=${aptType}&doc_id=${selDoc}`
      );
      console.log("fetchAppointments resp:::", resp);
      if (resp.success) {
        setAppointments((prevApts) => [...prevApts, ...resp.data]);
        setHasMore(resp.data.length === limit);
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
        `${apiUrl()}/nurse/accept-appointments?doc_id=${selDoc}`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
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
        `${apiUrl()}/nurse/cancel-appointments?doc_id=${selDoc}`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
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
        `${apiUrl()}/nurse/update-appointments?doc_id=${selDoc}`,
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
                    aptType={aptType}
                  />
                );
              })}
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
    </div>
  );
};
//appointment card view
const AppointmentCard = ({
  apt,
  setShowDetails,
  setShowCancelView,
  setShowUpdateView,
  setShowAcceptView,
  aptType,
}) => {
  return (
    <div key={apt._id} className="doctor-card card mb-3 mx-2">
      <img
        src={
          typeof apt?.doc.img == "string"
            ? `${apiUrl()}/uploads/${apt?.pt.img}`
            : URL.createObjectURL(apt?.pt.img)
        }
        className="card-img-top"
        alt={apt?.pt.f_name}
      />
      <div className="card-body">
        <h5 className="card-title">
          {[apt?.pt.f_name, apt?.pt.l_name].join(" ")}
        </h5>
        <p className="card-text">
          {formatDateToString(apt?.apt_date) + " " + apt?.timeslot}
        </p>
        <p className="card-text">{"Nhs: " + apt?.pt?.nhs}</p>
        <p className="card-text">{"Status: " + apt.status}</p>
      </div>
      {/* Accept Button */}
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
        onClick={() => {}}
      >
        See Details
      </button>
      {/* Accept Button */}
      {aptType == "Pending" && (
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
            setShowAcceptView();
          }}
        >
          Accept
        </button>
      )}
      {/* Update Button */}
      {aptType == "Accepted" && (
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
      )}
      {/* Cancel Button */}
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
        `${apiUrl()}/nurse/get-time-slots-by-date?date=${
          formData.apt_date
        }&doc_id=${selDoc}`
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
const HistoryView = ({ aptType, selDoc }) => {
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
  //
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);
  //
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight &&
      hasMore
    ) {
      fetchAppointments();
    }
  };
  //get appointments
  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const limit = 5;
      const skip = appointments.length;
      console.log("skip", skip);
      const resp = await Get(
        `${apiUrl()}/nurse/get-appointments-history?skip=${skip}&doc_id=${selDoc}&startDay=${
          formData.start_date
        }&endDay=${formData.end_date}`
      );
      console.log("resp::: doctors", resp);
      if (resp.success) {
        setAppointments((prevApts) => [...prevApts, ...resp.data]);
        setHasMore(resp.data.length === limit);
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
            {appointments.length > 0 &&
              appointments.map((apt) => {
                return (
                  <AppointmentCard key={apt._id} apt={apt} aptType={aptType} />
                );
              })}
          </>
        )}
      </div>
    </div>
  );
};
//
export default NurseAppointments;
