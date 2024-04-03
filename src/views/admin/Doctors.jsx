/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { FaPlusSquare, FaSearch } from "react-icons/fa";
import DoctorsAddView from "./DoctorAddView";
import { Get } from "../../api";
import { apiUrl } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import doctorDummy from "../../assets/images/doctor-dummy.jpg";
import noData from "../../assets/images/no-data.jpg";
//
const Doctors = () => {
  const [searchText, setSearchText] = React.useState("");
  const [openAddView, setOpenAddView] = React.useState(false);
  const [doctors, setDoctors] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(true);
  //
  useEffect(() => {
    fetchOrganizations();
    fetchDepartments();
    fetchDoctors();
  }, []);
  //
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight &&
      hasMore
    ) {
      fetchDoctors();
    }
  };
  //
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);
  //
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const limit = 5;
      const skip = doctors.length;
      const resp = await Get(`${apiUrl()}/admin/getAllDoctors?skip=${skip}`);
      console.log("resp:::", resp);
      if (resp.success) {
        setDoctors((prevDoctors) => [...prevDoctors, ...resp.data]);
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
  const fetchOrganizations = async () => {
    try {
      const resp = await Get(`${apiUrl()}/admin/getAllOrganizations`);
      console.log("resp:::", resp);
      if (resp.success) {
        setOrganizations(resp.data);
      }
    } catch (err) {
      // console.error('err:', err);
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };
  //
  const fetchDepartments = async () => {
    try {
      const resp = await Get(`${apiUrl()}/admin/getAllDepartments`);
      console.log("resp:::", resp);
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
  //
  const addToDoctorList = async ({ newDoc }) => {
    try {
      setDoctors((prevDoctors) => [...prevDoctors, ...newDoc]);
    } catch (err) {
      //
    }
  };
  //
  const updateDoctorList = async ({ updDoc }) => {
    try {
      const updatedNewDoc = doctors.map((doctor) =>
        doctor._id == updDoc._id ? { ...doctor, ...updDoc } : doctor
      );
      setDoctors(updatedNewDoc);
    } catch (err) {
      //
    }
  };
  //
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };
  if (isLoading) {
    return <LoadingView />;
  }
  //
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div
              className="input-group flex-grow-1"
              style={{ marginRight: "10px" }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search Doctor"
                onChange={handleSearchChange}
                style={{ height: "38px" }}
              />
            </div>
            <button
              style={{
                width: "100px",
                marginRight: 10,
                backgroundColor: "#0B2447",
                borderColor: "#0B2447",
                transition: "background-color 0.3s, border-color 0.3s",
              }}
              className="btn btn-primary"
              onClick={() => {}}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#1a4a8a";
                e.target.style.borderColor = "#1a4a8a";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#0B2447";
                e.target.style.borderColor = "#0B2447";
              }}
            >
              Search
            </button>
            <button
              style={{
                width: "200px",
                marginRight: 10,
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
              onClick={() => setOpenAddView(true)}
            >
              Add New Doctor
            </button>
          </div>
        </div>
      </div>
      <div className="doctor-list d-flex flex-wrap">
        {!doctors.length && (
          <div className="container-fluid d-flex justify-content-center align-items-center">
            <img src={noData} className="no-data-img" alt="No data found" />
          </div>
        )}
        {doctors.map((doctor) => {
          return (
            <div
              key={doctor._id}
              className="doctor-card card mb-3 mx-2"
              onClick={() => {
                setSelectedDoctor(doctor);
                setOpenAddView(true);
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
                <p className="card-text">
                  {doctor.active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {openAddView && (
        <DoctorsAddView
          onCloseModal={() => {
            setOpenAddView(false);
            setSelectedDoctor("");
          }}
          addToDoctorList={addToDoctorList}
          updateDoctorList={updateDoctorList}
          selectedDoctor={selectedDoctor}
          departments={departments}
          organizations={organizations}
        />
      )}
    </div>
  );
};

export default Doctors;
