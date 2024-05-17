/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { FaPlusSquare, FaSearch } from "react-icons/fa";
import DoctorsAddView from "./DoctorAddView";
import { Get } from "../../services";
import apiEndpoints from "../../config/apiEndpoints";

import LoadingView from "../../components/Loading";
import doctorDummy from "../../assets/images/doctor-dummy.jpg";
import noData from "../../assets/images/no-data.jpg";
import InfiniteScroll from "react-infinite-scroll-component";
//
const Doctors = () => {
  const [searchText, setSearchText] = useState("");
  const [openAddView, setOpenAddView] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selDept, setSelDept] = useState("");
  const [selOrg, setSelOrg] = useState("");

  //
  useEffect(() => {
    fetchOrganizations();
    fetchDepartments();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setDoctors([]);
      await fetchDoctors(true);
    };
    fetchData();
  }, [selDept, selOrg]);
  //
  const fetchDoctors = async (pSkip) => {
    try {
      const skip = pSkip ? 0 : doctors.length;
      const resp = await Get(
        `${apiEndpoints.admin.getAllDoctors}?skip=${skip}&limit=15&dept=${selDept}&org=${selOrg}`
      );
      //console.log("resp:::", resp);
      if (resp.success) {
        setDoctors((prevDoctors) => [...prevDoctors, ...resp.data]);
        setHasMore(resp.data.length > 0 ? true : false);
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
      const resp = await Get(apiEndpoints.admin.getAllOrganizations);
      //console.log("resp:::", resp);
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
      const resp = await Get(apiEndpoints.admin.getAllDepartments);
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
  const delteFromDoctorList = async ({del_id}) => {
    try {
      const updatedNewDoc = doctors.filter((doctor) => doctor._id !== del_id);
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
      {/* <div className="row">
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
      </div> */}
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="mb-3">
              <label className="form-label">Organization:</label>
              <select
                className="form-select"
                name="selOrg"
                value={selOrg}
                onChange={(e) => setSelOrg(e.target.value)}
                required
              >
                <option value="">All Organizations</option>
                <>
                  {organizations.length &&
                    organizations.map((org) => (
                      <option value={org._id} key={org._id}>
                        {org.name}
                      </option>
                    ))}
                </>
              </select>
            </div>
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
                <>
                  {departments.length &&
                    departments.map((dept) => (
                      <option value={dept._id} key={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                </>
              </select>
            </div>
            <div className="mb-3">
            <button
              style={{
                width: "200px",
                marginTop: "15px",
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
      </div>
      <div className="doctor-list d-flex flex-wrap">
        {!doctors.length && (
          <div className="container-fluid d-flex justify-content-center align-items-center">
            <img src={noData} className="no-data-img" alt="No data found" />
          </div>
        )}
        <InfiniteScroll
          dataLength={doctors.length}
          next={fetchDoctors}
          hasMore={hasMore}
          loader={
            <div className="d-flex justify-content-center align-items-center">
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
                  setSelectedDoctor(doctor);
                  setOpenAddView(true);
                }}
              >
                {
                  doctor.img &&
                  <img
                  src={
                    typeof doctor.img == "string"
                      ? `${apiEndpoints.upload.url}/${doctor.img}`
                      : URL.createObjectURL(doctor.img)
                  }
                  className="card-img-top"
                  alt={doctor.f_name}
                />
                }
                
                <div className="card-body">
                  <h5 className="card-title">
                    {[doctor.f_name, doctor.l_name].join(" ")}
                  </h5>
                  <p className="card-text">{doctor?.dept?.name}</p>
                  <p className="card-text">
                    {doctor?.organization?.name}
                  </p>
                  <p className="card-text">
                    {doctor.active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
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
          delteFromDoctorList={delteFromDoctorList}
        />
      )}
      
    </div>
  );
};

export default Doctors;
