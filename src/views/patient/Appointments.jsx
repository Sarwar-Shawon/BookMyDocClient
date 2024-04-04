/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { Get } from "../../api";
import { apiUrl } from "../../config/appConfig";
import noData from "../../assets/images/no-data.jpg";
import LoadingView from "../../components/Loading";
import { formatDateToString} from "../../utils";
//
const PatientAppointments = () => {
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
      const resp = await Get(`${apiUrl()}/patient/get-appointments?skip=${skip}`);
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
            <div className="mb-3">
              {/*  */}
            </div>
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
                    <p className="card-text">{ formatDateToString(apt?.apt_date) + " " + apt?.timeslot }</p>
                    <p className="card-text">{ "Status: "+ apt.status }</p>
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
                    onClick={() => {
                    }}
                  >
                    See Details
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};
//
export default PatientAppointments;

