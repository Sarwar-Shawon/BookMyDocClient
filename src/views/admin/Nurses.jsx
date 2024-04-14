/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { FaPlusSquare, FaSearch } from "react-icons/fa";
import NursesAddView from "./NurseAddView";
import { Get } from "../../api";
import { apiUrl } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import InfiniteScroll from "react-infinite-scroll-component";
//
const Nurses = () => {
  const [searchText, setSearchText] = useState("");
  const [openAddView, setOpenAddView] = useState(false);
  const [nurses, setNurses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  const [selectedNurse, setSelectedNurse] = useState("");
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
      setNurses([]);
      await fetchNurses(true);
    };
    fetchData();
  }, [selDept, selOrg]);
  //
  const fetchNurses = async (pSkip) => {
    try {
      setLoading(true);
      const limit = 5;
      const skip = pSkip ? 0 : nurses.length;
      const resp = await Get(
        `${apiUrl()}/admin/getAllNurses?skip=${skip}&limit=15&dept=${selDept}&org=${selOrg}`
      );
      console.log("resp:::", resp);
      if (resp.success) {
        setNurses((prevNurses) => [...prevNurses, ...resp.data]);
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
  const addToNurseList = async ({ newNur }) => {
    try {
      setNurses((prevNurses) => [...prevNurses, ...newNur]);
    } catch (err) {
      //
    }
  };
  //
  const updateNurseList = async ({ updNur }) => {
    try {
      const updatedNewNur = nurses.map((nurse) =>
        nurse._id == updNur._id ? { ...nurse, ...updNur } : nurse
      );
      setNurses(updatedNewNur);
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
                placeholder="Search Nurse"
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
              Add New Nurse
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
              Add New Nurse
            </button>
            </div>
          </div>
          
        </div>
      </div>
      <div className="doctor-list d-flex flex-wrap">
        {!nurses.length && (
          <div className="container-fluid d-flex justify-content-center align-items-center">
            <img src={noData} className="no-data-img" alt="No data found" />
          </div>
        )}
        <InfiniteScroll
          dataLength={nurses.length}
          next={fetchNurses}
          hasMore={hasMore}
          loader={
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner"></div>
            </div>
          }
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {nurses.map((nurse) => {
            console.log(
              "typeof nurse.img",
              typeof nurse.img,
              nurse.img,
              `${apiUrl()}/uploads/${nurse.img}`
            );
            return (
              <div
                key={nurse._id}
                className="doctor-card card mb-3 mx-2"
                onClick={() => {
                  setSelectedNurse(nurse);
                  setOpenAddView(true);
                }}
              >
                <img
                  src={
                    typeof nurse.img == "string"
                      ? `${apiUrl()}/uploads/${nurse.img}`
                      : URL.createObjectURL(nurse.img)
                  }
                  className="card-img-top"
                  alt={nurse.f_name}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {[nurse.f_name, nurse.l_name].join(" ")}
                  </h5>
                  <p className="card-text">{nurse?.dept?.name}</p>
                  <p className="card-text">
                    {nurse.active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
      {openAddView && (
        <NursesAddView
          onCloseModal={() => {
            setOpenAddView(false);
            setSelectedNurse("");
          }}
          addToNurseList={addToNurseList}
          updateNurseList={updateNurseList}
          selectedNurse={selectedNurse}
          departments={departments}
          organizations={organizations}
        />
      )}
    </div>
  );
};

export default Nurses;
