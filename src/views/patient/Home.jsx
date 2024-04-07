/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { Get } from "../../api";
import { apiUrl } from "../../config/appConfig";
import noData from "../../assets/images/no-data.jpg";
import LoadingView from "../../components/Loading";
import CreateAppointmentView from "./CreateAppointmentView";
import InfiniteScroll from "react-infinite-scroll-component";

//
const PatientHome = () => {
  const [departments, setDepartments] = useState([]);
  const [selDept, setSelDept] = useState("");
  const [selDoc, setSelDoc] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showAppointment, setShowAppointment] = useState(false);

  //
  useEffect(() => {
    // fetchOrganizations();
    fetchDepartments();
  }, []);
  //
  useEffect(() => {
    console.log("asd");
    setDoctors([]);
    fetchDoctors({ pSkip: true });
  }, [selDept]);
  //
  const fetchDoctors = async ({ pSkip }) => {
    try {
      const skip = pSkip ? 0 : doctors.length;
      const resp = await Get(
        selDept
          ? `${apiUrl()}/patient/get-doctors?skip=${skip}&dept=${selDept}&limit=15`
          : `${apiUrl()}/patient/get-all-doctors?skip=${skip}&dept=${selDept}&limit=15`
      );
      console.log("resp::: doctors", resp);
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
  // const fetchOrganizations = async () => {
  //   try {
  //     const resp = await Get(`${apiUrl()}/admin/getAllOrganizations`);
  //     console.log("resp:::", resp);
  //     if (resp.success) {
  //       setOrganizations(resp.data);
  //     }
  //   } catch (err) {
  //     // console.error('err:', err);
  //     setError(err?.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
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
      <div className="row">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="mb-3">
              <label className="form-label">Department:</label>
              <select
                className="form-select"
                name="selDept"
                value={selDept}
                onChange={(e) => setSelDept(e.target.value)}
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
              onClick={() => {}}
            >
              Search Doctor
            </button>
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
        />
      )}
    </div>
  );
};

export default PatientHome;
