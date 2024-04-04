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
            <div className="mb-3">
              <button
                style={{
                  width: "100px",
                  marginRight: 10,
                  backgroundColor: "#0B2447",
                  borderColor: "#0B2447",
                  transition: "background-color 0.3s, border-color 0.3s",
                  color: "#fff",
                }}
                className="btn btn-primary"
                onClick={() => setSelType("Pending")}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#1a4a8a";
                  e.target.style.borderColor = "#1a4a8a";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#0B2447";
                  e.target.style.borderColor = "#0B2447";
                }}
              >
                Pending
              </button>
            </div>
            <div className="mb-3">
              <button
                style={{
                  width: "100px",
                  marginRight: 10,
                  backgroundColor: "#0B2447",
                  borderColor: "#0B2447",
                  transition: "background-color 0.3s, border-color 0.3s",
                  color: "#fff",
                }}
                className="btn btn-primary"
                onClick={() => setSelType("Accepted")}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#1a4a8a";
                  e.target.style.borderColor = "#1a4a8a";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#0B2447";
                  e.target.style.borderColor = "#0B2447";
                }}
              >
                Accepted
              </button>
            </div>
            <div className="mb-3">
              <button
                style={{
                  width: "100px",
                  marginRight: 10,
                  backgroundColor: "#0B2447",
                  borderColor: "#0B2447",
                  transition: "background-color 0.3s, border-color 0.3s",
                  color: "#fff",
                }}
                className="btn btn-primary"
                onClick={() => setSelType("History")}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#1a4a8a";
                  e.target.style.borderColor = "#1a4a8a";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#0B2447";
                  e.target.style.borderColor = "#0B2447";
                }}
              >
                History
              </button>
            </div>
          </div>
        </div>
      </div>
      <>
        { 
          selType == "Pending" ?  <PendingView aptType={selType} /> :
          selType == "Accepted" ?  <AcceptedView aptType={selType} /> :
          selType == "Hostory" ?  <HistoryView aptType={selType} /> :
          null
        }
      </>
    </div>
  );
};
//
const PendingView = ({aptType}) => {
  const [selApt, setSelApt] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [respMsg, setRespMsg] = useState({});

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
      console.log("apt:::::::", apt)
      setSelApt(apt);
      if(type == 'accept'){
        setShowAcceptModal(true)
      }
      if(type == 'decline'){
        setShowDeclineModal(true)
      }
    } catch (err) {}
  };
  //update appointments
  const updateAppointments = async ({type}) => {
    try {
      setLoading(true);
      setRespMsg({});
      const aptStatus = type == "accept" ? "Accepted" : type == "decline" ? "Canceled" : ""
      const params = {
        apt_id: selApt._id,
        status: aptStatus,
      };
      console.log("apt_idapt_idapt_idapt_id",params)
      const resp = await Put(
        `${apiUrl()}/doctor/update-appointments`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
      if (resp.success) {
        setRespMsg({ success: true, msg: "successful" });
      setSelApt("")

      } else {
        setRespMsg({ success: false, msg: resp?.error });
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
                      handleOnclick({ apt: apt, type: "accept" });

                    }}
                  >
                    Decline
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
      {showAcceptModal && (
          <Modal
            title={"Logout"}
            body={"Do you want to accept this appointment?"}
            btm_btn_1_txt={"No"}
            btm_btn_2_txt={"Yes"}
            btn1Click={() => {
              setShowAcceptModal(false);
            }}
            btn2Click={() => {updateAppointments({type: 'accept'})} }
            showFooter={true}
            onCloseModal={() => setShowAcceptModal(false)}
          />
        )}
      {showDeclineModal && (
          <Modal
            title={"Logout"}
            body={"Do you want to decline this appointment?"}
            btm_btn_1_txt={"No"}
            btm_btn_2_txt={"Yes"}
            btn1Click={() => {
              setShowDeclineModal(false);
            }}
            btn2Click={() => {updateAppointments({type: 'decline'})} }
            showFooter={true}
            onCloseModal={() => setShowDeclineModal(false)}
          />
        )}
    </div>
  );
};
//
const AcceptedView = ({aptType}) => {
  const [selType, setSelType] = useState("Pending");
  const [selApt, setSelApt] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [respMsg, setRespMsg] = useState({});

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
      console.log("apt:::::::", apt)
      setSelApt(apt);
      if(type == 'decline'){
        setShowDeclineModal(true)
      }
    } catch (err) {}
  };
  //update appointments
  const updateAppointments = async ({type}) => {
    try {
      setLoading(true);
      setRespMsg({});
      const aptStatus = type == "accept" ? "Accepted" : type == "decline" ? "Canceled" : ""
      const params = {
        apt_id: selApt._id,
        status: aptStatus,
      };
      console.log("apt_idapt_idapt_idapt_id",params)
      const resp = await Put(
        `${apiUrl()}/doctor/update-appointments`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
      if (resp.success) {
        setRespMsg({ success: true, msg: "successful" });
      setSelApt("")

      } else {
        setRespMsg({ success: false, msg: resp?.error });
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
                      handleOnclick({ apt: apt, type: "accept" });

                    }}
                  >
                    Decline
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
      {showDeclineModal && (
          <Modal
            title={"Logout"}
            body={"Do you want to decline this appointment?"}
            btm_btn_1_txt={"No"}
            btm_btn_2_txt={"Yes"}
            btn1Click={() => {
              setShowDeclineModal(false);
            }}
            btn2Click={() => {updateAppointments({type: 'decline'})} }
            showFooter={true}
            onCloseModal={() => setShowDeclineModal(false)}
          />
        )}
    </div>
  );
};
//
const HistoryView = ({aptType}) => {
  const [selType, setSelType] = useState("Pending");
  const [selApt, setSelApt] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [respMsg, setRespMsg] = useState({});

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
      console.log("apt:::::::", apt)
      setSelApt(apt);
      if(type == 'accept'){
        setShowAcceptModal(true)
      }
      if(type == 'decline'){
        setShowDeclineModal(true)
      }
    } catch (err) {}
  };
  //update appointments
  const updateAppointments = async ({type}) => {
    try {
      setLoading(true);
      setRespMsg({});
      const aptStatus = type == "accept" ? "Accepted" : type == "decline" ? "Canceled" : ""
      const params = {
        apt_id: selApt._id,
        status: aptStatus,
      };
      console.log("apt_idapt_idapt_idapt_id",params)
      const resp = await Put(
        `${apiUrl()}/doctor/update-appointments`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
      if (resp.success) {
        setRespMsg({ success: true, msg: "successful" });
      setSelApt("")

      } else {
        setRespMsg({ success: false, msg: resp?.error });
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
