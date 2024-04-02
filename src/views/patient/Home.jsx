/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { Get } from "../../api";
import { apiUrl } from "../../config/appConfig";
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
    fetchDoctors();
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
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const limit = 5;
      const skip = doctors.length;
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
    </div>
  );
};

export default PatientHome;
