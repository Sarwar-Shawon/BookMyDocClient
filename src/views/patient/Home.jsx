/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { Get } from "../../api";
import { apiUrl } from "../../config/appConfig";
import noData from "../../assets/images/no-data.jpg";
//
const PatientHome = () => {
  const [departments, setDepartments] = useState([]);
  const [selDept, setSelDept] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  //
  useEffect(() => {
    fetchOrganizations();
    fetchDepartments();
  }, []);
  //
  useEffect(() => {
    setDoctors([]);
    fetchDoctors({pSkip: true});
  }, [selDept]);
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
      fetchDoctors();
    }
  };
  //
  const fetchDoctors = async ({pSkip}) => {
    try {
      setLoading(true);
      const limit = 5;
      const skip = pSkip ? 0 : doctors.length;
      console.log("skip", skip)
      const resp = await Get(`${apiUrl()}/patient/get-doctors?skip=${skip}&dept=${selDept}`);
      console.log("resp::: doctors", resp);
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
      const resp = await Get(`${apiUrl()}/patient/get-dept`);
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
  
  //
  return (
    <div className="container-fluid">
      <div className="mb-3">
        <label className="form-label">Department:</label>
        <select
          className="form-select"
          name="selDept"
          value={selDept}
          onChange={(e)=> setSelDept(e.target.value)}
          required
        >
          <option value="">Select Department</option>
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
                <p className="card-text">
                  {doctor.active ? "Active" : "Inactive"}
                </p>
                {/* ... other customer details */}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default PatientHome;
