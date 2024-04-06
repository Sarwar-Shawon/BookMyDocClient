/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { FaPlusSquare, FaSearch } from "react-icons/fa";
import DepartmentsAddView from "./DepartmentAddView";
import { Get } from "../../api";
import { apiUrl } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
const Departments = () => {
  const [searchText, setSearchText] = React.useState("");
  const [openAddView, setOpenAddView] = React.useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(true);
  //
  useEffect(() => {
    fetchDepartments();
  }, []);
  //

  //
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight &&
      hasMore
    ) {
      fetchDepartments();
    }
  };
  //
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);
  //
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const limit = 5;
      const skip = departments.length;
      const resp = await Get(`${apiUrl()}/admin/getAllDepartments?skip=${skip}`);
      console.log("resp:::", resp);
      if (resp.success) {
        setDepartments((prevDepartments) => [...prevDepartments, ...resp.data]);
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

  //
  const addToDepartmentList = async ({ newDept }) => {
    try {
      setDepartments((prevDepartments) => [...prevDepartments, ...newDept]);
    } catch (err) {
      //
    }
  };
  //
  const updateDepartmentList = async ({ updDept }) => {
    try {
      const updatedNewdept = departments.map((department) =>
        department._id === updDept._id ? { ...department, ...updDept } : department
      );
      setDepartments(updatedNewdept);
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
                width: "250px",
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
              Add New Department
            </button>
          </div>
        </div>
      </div>
      <div className="doctor-list d-flex flex-wrap">
        {!departments.length && (
          <div className="container-fluid d-flex justify-content-center align-items-center">
            <img src={noData} className="no-data-img" alt="No data found" />
          </div>
        )}
        {departments.map((department) => {
          return (
            <div
              key={department._id}
              className="department-card card mb-3 mx-2"
              onClick={() => {
                setSelectedDepartment(department);
                setOpenAddView(true);
              }}
            >
              {/* <img
                src={
                  typeof department.img == "string"
                    ? `${apiUrl()}/uploads/${department.img}`
                    : URL.createObjectURL(department.img)
                }
                className="card-img-top"
                alt={department.name}
              /> */}
              <div className="card-body">
                <h5 className="card-title">
                  {department.name}
                </h5>
                <p className="card-text">
                  {department.active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {openAddView && (
        <DepartmentsAddView
          onCloseModal={() => {
            setOpenAddView(false);
            setSelectedDepartment("");
          }}
          addToDepartmentList={addToDepartmentList}
          updateDepartmentList={updateDepartmentList}
          selectedDepartment={selectedDepartment}
        />
      )}
    </div>
  );
};

export default Departments;
