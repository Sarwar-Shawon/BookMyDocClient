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

//
const PatientAppointments = () => {
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
        ) : selType == "History" ? (
          <HistoryView aptType={selType} />
        ) : null}
      </>
    </div>
  );
};
// show pending appointments 
const PendingView = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState([]);
  const [selApt, setSelApt] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showResp, setShowResp] = useState({});
  //
  const [showDetails, setShowDetails] = useState(false);
  const [showCancelView, setShowCancelView] = useState(false);
  const [showUpdateView, setShowUpdateView] = useState(false);
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
  //
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const limit = 5;
      const skip = appointments.length;
      console.log("skip", skip);
      const resp = await Get(
        `${apiUrl()}/patient/get-appointments?skip=${skip}&status=${"Pending"}`
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
  //cancel appointments
  const cancelAppointments = async () => {
    try {
      setLoading(true);
      setShowResp({});
      const params = {
        apt_id: selApt._id,
      };
      if(!selApt._id){
        return ;
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
        setShowResp({ success: true, msg: "Appointment has canceled" });
      } else {
        setShowResp({ success: false, msg: resp?.error });
      }
    } catch (err) {
    } finally {
      setLoading(false);
      setSelApt('')
    }
  };
  //update appointments
  const updateAppointments = async () => {
    try {
      setShowResp({});
      const params = {
        apt_id: selApt._id,
        // apt_date: moment(formData.apt_date),
        // timeslot: formData.timeslot,
      };
      const resp = await Put(
        `${apiUrl()}/patient/update-appointments`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
      if (resp.success) {
        setShowResp({ success: true, msg: "successful" });
        const updatedAppointments = appointments.filter(
          (apnt) => apnt._id !== selApt._id
        );
        setAppointments(updatedAppointments);
      } else {
        setShowResp({ success: false, msg: resp?.error });
      }
    } catch (err) {
    } finally {
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
            {appointments.length && appointments.map((apt) => (
              <AppointmentView
                key={apt._id}
                apt={apt}
                setShowDetails={() => {
                  setSelApt(apt)
                  setShowDetails(true);
                }}
                setShowCancelView={() => {
                  setSelApt(apt)
                  setShowCancelView(true);
                }}
                setShowUpdateView={() => {
                  setSelApt(apt)
                  setShowUpdateView(true);
                }}
              />
            ))}
          </>
        )}
      </div>
      <CancelModal
        onCloseModal={() => setShowCancelView(false)}
        showModal={showCancelView}
        cancelAppointments={cancelAppointments}
      />
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
// show accepted appointments 

const AcceptedView = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

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
  //
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const limit = 10;
      const skip = appointments.length;
      console.log("skip", skip);
      const resp = await Get(
        `${apiUrl()}/patient/get-appointments?skip=${skip}&status=${"Accepted"}`
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
            {appointments.map((apt) => (
              <AppointmentView apt={apt} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
//
const HistoryView = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

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
  //
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const limit = 5;
      const skip = appointments.length;
      console.log("skip", skip);
      const resp = await Get(
        `${apiUrl()}/patient/get-appointments?skip=${skip}`
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
            {appointments.map((apt) => (
              <AppointmentView apt={apt} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
//
const AppointmentView = ({
  apt,
  setShowDetails,
  setShowCancelView, // Pass setShowCancelView as a prop
  setShowUpdateView,
}) => {
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
        <p className="card-text">{"Status: " + apt.status}</p>
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
        onClick={() => {}}
      >
        See Details
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
          // handleOnclick({ apt: apt, type: "update" });
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
          setShowCancelView();
        }}
      >
        Cancel
      </button>
    </div>
  );
};
//
const CancelModal = ({ onCloseModal, cancelAppointments, showModal }) => {
  return (
    showModal && (
      <Modal
        title={"Appointment"}
        body={"Do you want to cancel this appointment?"}
        btm_btn_1_txt={"No"}
        btm_btn_2_txt={"Yes"}
        btn1Click={() => {
          onCloseModal();
        }}
        btn2Click={() => {
          onCloseModal();
          cancelAppointments();
        }}
        showFooter={true}
        onCloseModal={() => onCloseModal()}
        show
      />
    )
  );
};
//
export default PatientAppointments;
