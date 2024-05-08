/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { Get, getAddressFromLatLng } from "../../api";
import { apiUrl } from "../../config/appConfig";
import noData from "../../assets/images/no-data.jpg";
import LoadingView from "../../components/Loading";
import CreateAppointmentView from "./CreateAppointmentView";
import InfiniteScroll from "react-infinite-scroll-component";
import PLaceAutoComplete from "../../components/PlaceAutoComplete";
import Map from "../../components/Map";
import Modal from "../../components/Modal";
import AppCalendar from "../../components/AppCalendar";

import { FaHospitalUser, FaClinicMedical, FaMapMarker } from "react-icons/fa";
import { formatStringToDate } from "../../utils";
const Range = [5, 10, 25];
//
const PatientHome = () => {
  const [departments, setDepartments] = useState([]);
  const [selDept, setSelDept] = useState("");
  const [selDoc, setSelDoc] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [selDate, setSelDate] = useState(new Date());
  //
  const [curAddr, setCurAddr] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [range, setRange] = useState("");
  //
  const radians = (deg) => {
    return deg * (Math.PI / 180);
  };
  //
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = radians(lat2 - lat1);
    const dLon = radians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(radians(lat1)) *
        Math.cos(radians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    console.log("distance", parseFloat(distance * 0.621371).toFixed(2));
    return parseFloat(distance * 0.621371).toFixed(2);
  };
  //get current location
  // useEffect(() => {
  //   getLocation();
  // }, []);
  //
  useEffect(() => {
    fetchDepartments();
  }, []);
  //get Departments
  const fetchDepartments = async () => {
    try {
      const resp = await Get(`${apiUrl()}/patient/get-dept`);
      //console.log("resp:::", resp);
      if (resp.success) {
        setDepartments(resp.data);
      }
    } catch (err) {
      // console.error('err:', err);
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };
  //get data when change department
  useEffect(() => {
    setLoading(true);
    setDoctors([]);
    fetchDoctors({ pSkip: true });
  }, [selDept, selDate]);
  //get doctors
  const fetchDoctors = async ({ pSkip }) => {
    try {
      const skip = pSkip ? 0 : doctors.length;
      const resp = await Get(
          selDate
          ? `${apiUrl()}/patient/get-all-doctors-date?date=${selDate}&skip=${skip}&dept=${selDept}&lat=${latitude}&lng=${longitude}&range=${range}&limit=15`
          :
          selDept
          ? `${apiUrl()}/patient/get-doctors?skip=${skip}&dept=${selDept}&lat=${latitude}&lng=${longitude}&range=${range}&limit=15`
          : `${apiUrl()}/patient/get-all-doctors?skip=${skip}&lat=${latitude}&lng=${longitude}&range=${range}&limit=15`
      );
      console.log("resp::: doctors", resp);
      if (resp.success) {
        setDoctors((prevDoctors) => [...prevDoctors, ...resp.data]);
        setHasMore(resp.data.length > 0 ? true : false);
      }
    } catch (err) {
      // console.error('err:', err);
    } finally {
      setLoading(false);
    }
  };
  //
  useEffect(() => {
    if (latitude && longitude) {
      setLoading(true);
      setDoctors([]);
      fetchDoctors({ pSkip: true });
    }
  }, [latitude, longitude, range]);
  //
  // const getLocation = async () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const getAddress = async () => {
  //           if (position.coords.latitude && position.coords.longitude)
  //             setCurAddr(
  //               await getAddressFromLatLng(
  //                 position.coords.latitude,
  //                 position.coords.longitude
  //               )
  //             );
  //         };
  //         getAddress();
  //         setLatitude(position.coords.latitude);
  //         setLongitude(position.coords.longitude);
  //       },
  //       (err) => {
  //         setError(err.message);
  //       }
  //     );
  //   } else {
  //     setError("Geolocation is not supported by this browser.");
  //   }
  // };
  //
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-3 col-md-6">
          <div className="mb-3">
            <label className="form-label">Department:</label>
            <select
              className="form-select"
              name="selDept"
              value={selDept}
              onChange={(e) => setSelDept(e.target.value)}
              required
            >
              <option value="">All Departments</option>
              {departments.map(
                (dept) =>
                  dept.active && (
                    <option value={dept._id} key={dept._id}>
                      {dept.name}
                    </option>
                  )
              )}
            </select>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="mb-3">
            <label className="form-label">Search By Date:</label>
            <AppCalendar
              value={selDate}
              className="form-control me-2"
              placeholder="Date"
              onChange={(val) => {
                setSelDate(val);
              }}
              minDate={new Date()}
            />
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="mb-3">
            <label className="form-label">Location:</label>
            <PLaceAutoComplete
              onPlaceSelected={(place) => {
                console.log("place", place);
                setLatitude(place?.lat_lng[0]);
                setLongitude(place?.lat_lng[1]);
              }}
            />
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="mb-3">
            <label className="form-label">Range in miles:</label>
            <div className="row">
              <div className="col">
                <div className="d-flex justify-content-between align-items-center">
                  {Range.map((item, index) => (
                    <div className="button-container" key={item}>
                      <button
                        className={`tab-button ${
                          range === item ? "active" : ""
                        }`}
                        onClick={() => setRange(item)}
                      >
                        {item} miles
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <div className="doctor-list d-flex flex-wrap">
        {isLoading ? (
          <LoadingView />
        ) : (
          <>
            {!doctors.length && (
              <div className="container-fluid d-flex justify-content-center align-items-center">
                <img src={noData} className="no-data-img" alt="No data found" />
              </div>
            )}
            <InfiniteScroll
              dataLength={doctors.length}
              next={() => fetchDoctors({ pSkip: false })}
              hasMore={hasMore}
              loader={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                  }}
                >
                  <div className="spinner"></div>
                </div>
              }
              style={{ display: "flex", flexWrap: "wrap" }}
            >
              {doctors.map((doctor) => {
                return (
                  <div
                    key={doctor._id}
                    className="doctor-card card mb-3 mx-2"
                    onClick={() => {
                      // setSelectedDoctor(doctor);
                      // setOpenAddView(true);
                    }}
                  >
                    <img
                      src={
                        typeof doctor.img == "string"
                          ? `${apiUrl()}/uploads/${doctor.img}`
                          : URL.createObjectURL(doctor.img)
                      }
                      className="card-img-top"
                      alt={doctor.f_name}
                    />
                    <div className="card-body">
                      <h5 className="card-title">
                        {[doctor.f_name, doctor.l_name].join(" ")}
                      </h5>
                      <p className="card-text">{doctor?.dept?.name}</p>
                      <p className="card-text">{doctor?.organization?.name}</p>
                      {latitude && longitude && (
                        <p className="card-text">
                          Distance:{" "}
                          <strong>
                            {getDistance(
                              latitude,
                              longitude,
                              doctor?.organization?.addr?.lat_lng[0],
                              doctor?.organization?.addr?.lat_lng[1]
                            )}{" "}
                            miles
                          </strong>
                        </p>
                      )}
                    </div>
                    <button
                      style={{
                        width: "200px",
                        marginBottom: "10px",
                        backgroundColor: "#0E46A3",
                        borderColor: "#0E46A3",
                        transition: "background-color 0.3s, border-color 0.3s",
                      }}
                      className="btn btn-primary"
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = "#1a4a8a";
                        e.target.style.borderColor = "#1a4a8a";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = "#0E46A3";
                        e.target.style.borderColor = "#0E46A3";
                      }}
                      onClick={() => {
                        setSelDoc(doctor);
                        setShowDetails(true);
                      }}
                    >
                      Show Details
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
                        setSelDoc(doctor);
                        setShowAppointment(true);
                      }}
                    >
                      Book Appointment
                    </button>
                  </div>
                );
              })}
            </InfiniteScroll>
          </>
        )}
      </div>
      {showAppointment && (
        <CreateAppointmentView
          onCloseModal={() => {
            setSelDoc("");
            setShowAppointment(false);
          }}
          doctor={selDoc}
          selDate={selDate}
        />
      )}
      {showDetails && (
        <DoctorDetails
          onCloseModal={() => {
            setSelDoc("");
            setShowDetails(false);
          }}
          doctor={selDoc}
        />
      )}
    </div>
  );
};
// //
const DoctorDetails = ({ doctor, onCloseModal }) => {
  return (
    <Modal
      title={
        doctor?.f_name
          ? [doctor?.f_name, doctor?.l_name].join(" ")
          : "Doctor Details"
      }
      body={
        <div>
          <div className="col-md-12 apt-details">
            <div className="mb-3">
              <label className="form-label">Department:</label>
              <label
                className="form-control"
                style={{ display: "flex", alignItems: "center" }}
              >
                <FaHospitalUser style={{ marginRight: "5px" }} />

                {doctor?.dept?.name}
              </label>
            </div>
            <div className="mb-3">
              <label className="form-label">Organization:</label>
              <label
                className="form-control"
                style={{ display: "flex", alignItems: "center" }}
              >
                <FaClinicMedical style={{ marginRight: "5px" }} />

                {doctor.organization.name}
              </label>
            </div>
            <div className="mb-3">
              <label className="form-label">Address:</label>
              <label
                className="form-control"
                style={{ display: "flex", alignItems: "center" ,marginTop: 10 , marginBottom: 15}}
              >
                <FaMapMarker style={{ marginRight: "5px" }} />

                {doctor?.organization?.addr?.formatted_address}
              </label>
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12 d-flex justify-content-center">
                    <Map
                      location={{
                        lat: doctor.organization.addr.lat_lng[0],
                        lng: doctor.organization.addr.lat_lng[1],
                      }}
                    />
                  </div>
                </div>
              </div>
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
export default PatientHome;
