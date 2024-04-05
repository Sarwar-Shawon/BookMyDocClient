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
import moment from "moment";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import AppCalendar from "../../components/Calendar";
// const DoctorAppointments = () => {
//   const [selType, setSelType] = useState("Pending");
//   //
//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col">
//           <div className="d-flex justify-content-between align-items-center mb-3" style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
//             <TabButton title="Pending" selType={selType} setSelType={setSelType} />
//             <TabButton title="Accepted" selType={selType} setSelType={setSelType} />
//             <TabButton title="History" selType={selType} setSelType={setSelType} />
//           </div>
//         </div>
//       </div>
//       <>
//         {selType === "Pending" && <PendingView />}
//         {selType === "Accepted" && <AcceptedView />}
//         {selType === "History" && <HistoryView />}
//       </>
//     </div>
//   );
// };
// //
// const TabButton = ({ title, selType, setSelType }) => (
//   <div className="button-container">
//     <button className={`tab-button ${selType === title ? "active" : ""}`} onClick={() => setSelType(title)}>
//       {title}
//     </button>
//   </div>
// );
//
const DoctorAppointments = () => {
  const [selType, setSelType] = useState("Pending");
  //
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div
            className="d-flex justify-content-between align-items-center mb-3"
            style={{ borderBottom: "1px solid #ccc", paddingBottom: "10px" }}
          >
            <div className="button-container">
              <button
                className={`tab-button ${
                  selType === "Pending" ? "active" : ""
                }`}
                onClick={() => setSelType("Pending")}
              >
                Pending
              </button>
            </div>
            <div className="button-container">
              <button
                className={`tab-button ${
                  selType === "Accepted" ? "active" : ""
                }`}
                onClick={() => setSelType("Accepted")}
              >
                Accepted
              </button>
            </div>
            <div className="button-container">
              <button
                className={`tab-button ${
                  selType === "History" ? "active" : ""
                }`}
                onClick={() => setSelType("History")}
              >
                History
              </button>
            </div>
          </div>
        </div>
      </div>
      <>
        {selType == "Pending" ? (
          <PendingView aptType={selType} />
        ) : selType == "Accepted" ? (
          <AcceptedView aptType={selType} />
        ) : selType == "Hostory" ? (
          <HistoryView aptType={selType} />
        ) : null}
      </>
    </div>
  );
};
//
const PendingView = ({ aptType }) => {
  const [selApt, setSelApt] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showResp, setShowResp] = useState({});

  //
  useEffect(() => {
    fetchAppointments();
  }, []);
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
        `${apiUrl()}/doctor/get-appointments?skip=${skip}&status=${aptType}`
      );
      console.log("resp::: doctors", resp);
      if (resp.success) {
        setAppointments((prevApts) => [...prevApts, ...resp.data]);
        setHasMore(resp.data.length === limit);
      }
    } catch (err) {
      // console.error('err:', err);
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };
  //
  const handleOnclick = async ({ apt, type }) => {
    try {
      console.log("apt:::::::", apt);
      setSelApt(apt);
      if (type == "accept") {
        setShowAcceptModal(true);
      }
      if (type == "decline") {
        setShowDeclineModal(true);
      }
    } catch (err) {}
  };
  //accept appointments
  const acceptAppointments = async () => {
    try {
      setLoading(true);
      setShowResp({});
      const params = {
        apt_id: selApt._id,
      };
      const resp = await Put(
        `${apiUrl()}/doctor/accept-appointments`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
      if (resp.success) {
        const updatedAppointments = appointments.filter(
          (apt) => apt._id !== selApt._id
        );
        setAppointments(updatedAppointments);
        setShowResp({ success: true, msg: "Appointment has accepted" });
        setSelApt("");
      } else {
        setShowResp({ success: false, msg: resp?.error });
      }
    } catch (err) {
    } finally {
      setLoading(false);
      setShowAcceptModal(false);
    }
  };
  //cancel appointments
  const cancelAppointments = async () => {
    try {
      setLoading(true);
      setShowResp({});
      const params = {
        apt_id: selApt._id,
      };
      const resp = await Put(
        `${apiUrl()}/doctor/cancel-appointments`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
      if (resp.success) {
        const updatedAppointments = appointments.filter(
          (apt) => apt._id !== selApt._id
        );
        setAppointments(updatedAppointments);
        setShowResp({ success: true, msg: "Appointment has canceled" });
        setSelApt("");
      } else {
        setShowResp({ success: false, msg: resp?.error });
      }
    } catch (err) {
    } finally {
      setLoading(false);
      setShowDeclineModal(false);
    }
  };
  //
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
            {appointments.map((apt) => {
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
                      handleOnclick({ apt: apt, type: "accept" });
                    }}
                  >
                    Accept
                  </button>

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
                      handleOnclick({ apt: apt, type: "decline" });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
      {showAcceptModal && (
        <Modal
          title={"Appointment"}
          body={"Do you want to accept this appointment?"}
          btm_btn_1_txt={"No"}
          btm_btn_2_txt={"Yes"}
          btn1Click={() => {
            setShowAcceptModal(false);
          }}
          btn2Click={() => {
            acceptAppointments();
            setShowAcceptModal(false);
          }}
          showFooter={true}
          onCloseModal={() => setShowAcceptModal(false)}
        />
      )}
      {showDeclineModal && (
        <Modal
          title={"Appointment"}
          body={"Do you want to cancel this appointment?"}
          btm_btn_1_txt={"No"}
          btm_btn_2_txt={"Yes"}
          btn1Click={() => {
            setShowDeclineModal(false);
          }}
          btn2Click={() => {
            cancelAppointments();
            setShowDeclineModal(false);
          }}
          showFooter={true}
          onCloseModal={() => setShowDeclineModal(false)}
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
//
const AcceptedView = ({ aptType }) => {
  const [selApt, setSelApt] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [errors, setError] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showResp, setShowResp] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [formData, setFormData] = useState({
    apt_date: new Date(),
    timeslot: "",
  });
  const [isBtnLoading, setBtnLoading] = useState(false);

  //
  useEffect(() => {
    fetchAppointments();
  }, []);
  //
  useEffect(() => {
    fetchTimeSlots();
  }, [formData.apt_date]);
  //
  const fetchTimeSlots = async () => {
    try {
      // setLoading(true);
      const resp = await Get(
        `${apiUrl()}/doctor/get-time-slots-by-date?date=${formData.apt_date}`
      );
      console.log("resp:::", JSON.stringify(resp));
      if (resp.success) {
        setTimeSlots(resp?.data);
      }
    } catch (err) {
      // setError(err?.message);
    } finally {
      // setLoading(false);
    }
  };
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
        `${apiUrl()}/doctor/get-appointments?skip=${skip}&status=${aptType}`
      );
      console.log("resp::: doctors", resp);
      if (resp.success) {
        setAppointments((prevApts) => [...prevApts, ...resp.data]);
        setHasMore(resp.data.length === limit);
      }
    } catch (err) {
      // console.error('err:', err);
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };
  //
  const handleOnclick = async ({ apt, type }) => {
    try {
      setSelApt(apt);
      if (type == "cancel") {
        setShowDeclineModal(true);
      }
      if (type == "update") {
        setFormData({
          ...formData,
          apt_date: new Date(apt.apt_date),
          timeslot: apt.timeslot,
        });
        setShowUpdateModal(true);
      }
    } catch (err) {}
  };
  //cancel appointments
  const cancelAppointments = async () => {
    try {
      setLoading(true);
      setShowResp({});
      const params = {
        apt_id: selApt._id,
      };
      const resp = await Put(
        `${apiUrl()}/doctor/cancel-appointments`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
      if (resp.success) {
        const updatedAppointments = appointments.filter(
          (apt) => apt._id !== selApt._id
        );
        setAppointments(updatedAppointments);
        setShowResp({ success: true, msg: "Appointment has canceled" });
        setSelApt("");

      } else {
        setShowResp({ success: false, msg: resp?.error });
      }
    } catch (err) {
    } finally {
      setLoading(false);
      setShowDeclineModal(false);
    }
  };
  //update appointments
  const updateAppointments = async () => {
    try {
      setBtnLoading(true);
      setShowResp({});
      const params = {
        apt_id: selApt._id,
        apt_date: moment(formData.apt_date),
        timeslot: formData.timeslot,
      };
      const resp = await Put(
        `${apiUrl()}/doctor/update-appointments`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
      if (resp.success) {
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
      setBtnLoading(false);
    }
  };
  //
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
            {appointments.map((apt) => {
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
                      handleOnclick({ apt: apt, type: "update" });
                    }}
                  >
                    Update
                  </button>
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
                      handleOnclick({ apt: apt, type: "cancel" });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
      {/* Decline view */}
      {showDeclineModal && (
        <Modal
          title={"Appointment"}
          body={"Do you want to cancel this appointment?"}
          btm_btn_1_txt={"No"}
          btm_btn_2_txt={"Yes"}
          btn1Click={() => {
            setShowDeclineModal(false);
          }}
          btn2Click={() => {
            setShowDeclineModal(false);
            cancelAppointments();
          }}
          showFooter={true}
          onCloseModal={() => setShowDeclineModal(false)}
        />
      )}
      {/* Update view */}
      {showUpdateModal && (
        <Modal
          title={"Update Appointments"}
          body={
            <div>
                <ErrorAlert
                  msg={!showResp?.success ? showResp?.msg : ""}
                  hideMsg={() => setShowResp({})}
                />
                <SuccessAlert
                  msg={showResp?.success ? showResp?.msg : ""}
                  hideMsg={() => setShowResp({})}
                />
                <div className="col-md-12">
                  <div className="mb-3">
                    <label>Select Date</label>
                    {errors.date && (
                      <p
                        style={{ fontSize: 16, color: "red", marginBottom: 2 }}
                      >
                        *{errors.date}
                      </p>
                    )}
                    <label
                      className="form-control"
                      style={{
                        border: "1px solid #ced4da",
                        borderRadius: "0.25rem",
                        padding: "0.375rem 0.75rem",
                        lineHeight: "1.5",
                      }}
                      onClick={() => setShowCalendar(true)}
                    >
                      {formatDateToString(formData.apt_date) || "dd-mm-yyyy"}
                    </label>
                  </div>
                  <div className="mb-3">
                    <label>Select Slots</label>
                    {errors.slot && (
                      <p
                        style={{ fontSize: 16, color: "red", marginBottom: 2 }}
                      >
                        *{errors.slot}
                      </p>
                    )}
                    {Object.entries(timeSlots).length > 0 ? (
                      <TimeSlotsComponent
                        timeSlotsData={timeSlots}
                        setTimeSlot={(val) => {
                          setFormData({
                            ...formData,
                            ["timeslot"]: val,
                          });
                        }}
                        aptId={selApt._id}
                        val={formData.timeslot}
                      />
                    ) : (
                      <div className="container-fluid d-flex justify-content-center align-items-center">
                        <img
                          src={noData}
                          className="no-data-img"
                          alt="No data found"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-grid">
                    {isBtnLoading ? (
                      <button className="btn btn-primary" disabled>
                        <div
                          className="spinner-border spinner-border-sm"
                          role="status"
                        >
                          {/* <span className="visually-hidden">Loading...</span> */}
                        </div>
                      </button>
                    ) : (
                      <button type="button" onClick={updateAppointments} className="btn btn-primary">
                        {"Update Appointment"}
                      </button>
                    )}
                  </div>
                </div>
              {showCalendar && (
                <AppCalendar
                  onCloseModal={() => setShowCalendar(false)}
                  value={formData.apt_date}
                  onChange={(val) => {
                    const date1 = new Date(new Date(val).setHours(0, 0, 0, 0));
                    const date2 = new Date(new Date(selApt.apt_date).setHours(0, 0, 0, 0));
                    setFormData({
                      ...formData,
                      apt_date: new Date(val),
                      timeslot: date1.getTime() === date2.getTime() ? selApt.timeslot : ""
                    });
                    setShowCalendar(false);
                  }}
                  minDate={new Date()}
                />
              )}
            </div>
          }
          onCloseModal={() => {
            setShowUpdateModal(false);
            setShowResp({})
          }}
          big={true}
        />
      )}
    </div>
  );
};
//
const TimeSlotsComponent = ({ timeSlotsData, setTimeSlot, val, aptId }) => {
  return (
    <div className="mb-4">
      <div className="row row-cols-2 row-cols-md-4 g-3">
        {Object.entries(timeSlotsData).map(
          ([time, slot]) =>
            ((slot?.aptId && slot?.aptId == aptId) || slot.active) && (
              <div
                key={time}
                className="col"
                onClick={() => {
                  setTimeSlot(time);
                }}
              >
                <div
                  className={`card ${slot.active ? "active" : ""}`}
                  style={{
                    backgroundColor: val == time ? "#5C8374" : "#818FB4",
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">{time}</h5>
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};
//
const HistoryView = ({ aptType }) => {
  const [selType, setSelType] = useState("Pending");
  const [selApt, setSelApt] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showResp, setShowResp] = useState({});

  //
  useEffect(() => {
    // fetchAppointments();
  }, []);
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
        `${apiUrl()}/doctor/get-appointments?skip=${skip}&status=Pending`
      );
      console.log("resp::: doctors", resp);
      if (resp.success) {
        setAppointments((prevApts) => [...prevApts, ...resp.data]);
        setHasMore(resp.data.length === limit);
      }
    } catch (err) {
      // console.error('err:', err);
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };
  //
  const handleOnclick = async ({ apt, type }) => {
    try {
      console.log("apt:::::::", apt);
      setSelApt(apt);
      if (type == "accept") {
        setShowAcceptModal(true);
      }
      if (type == "decline") {
        setShowDeclineModal(true);
      }
    } catch (err) {}
  };
  //update appointments
  const updateAppointments = async ({ type }) => {
    try {
      setLoading(true);
      setShowResp({});
      const aptStatus =
        type == "accept" ? "Accepted" : type == "decline" ? "Canceled" : "";
      const params = {
        apt_id: selApt._id,
        status: aptStatus,
      };
      const resp = await Put(
        `${apiUrl()}/doctor/update-appointments`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
      if (resp.success) {
        setShowResp({ success: true, msg: "successful" });
        setSelApt("");
      } else {
        setShowResp({ success: false, msg: resp?.error });
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  //
  return (
    <div>
      <div className="doctor-list d-flex flex-wrap">
        <h1>History</h1>
      </div>
    </div>
  );
};
//
export default DoctorAppointments;
