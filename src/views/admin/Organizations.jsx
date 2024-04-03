/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { FaPlusSquare, FaSearch } from "react-icons/fa";
import OrganizationsAddView from "./OrganizationAddView";
import { Get } from "../../api";
import { apiUrl } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
const Organizations = () => {
  const [searchText, setSearchText] = React.useState("");
  const [openAddView, setOpenAddView] = React.useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(true);
  //
  useEffect(() => {
    fetchOrganizations();
  }, []);
  //
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight &&
      hasMore
    ) {
      fetchOrganizations();
    }
  };
  //
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);
  //
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const limit = 5;
      const skip = organizations.length;
      const resp = await Get(`${apiUrl()}/admin/getAllOrganizations?skip=${skip}`);
      console.log("resp:::", resp);
      if (resp.success) {
        setOrganizations((prevOrganizations) => [...prevOrganizations, ...resp.data]);
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
  const addToOrganizationList = async ({ newDept }) => {
    try {
      setOrganizations((prevOrganizations) => [...prevOrganizations, ...newDept]);
    } catch (err) {
      //
    }
  };
  //
  const updateOrganizationList = async ({ updDept }) => {
    try {
      const updatedNewdept = organizations.map((organization) =>
        organization._id === updDept._id ? { ...organization, ...updDept } : organization
      );
      setOrganizations(updatedNewdept);
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
  console.log("organizations.length", organizations.length);
  const imageUrl =
    "http://localhost:3080/uploads/ee76ef83ccf7086edc43b8162ffcc415"; // URL of the uploaded image

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
              Add New Organization
            </button>
          </div>
        </div>
      </div>
      <div className="doctor-list d-flex flex-wrap">
        {!organizations.length && (
          <div className="container-fluid d-flex justify-content-center align-items-center">
            <img src={noData} className="no-data-img" alt="No data found" />
          </div>
        )}
        {organizations.map((organization) => {
          return (
            <div
              key={organization._id}
              className="department-card card mb-3 mx-2"
              onClick={() => {
                setSelectedOrganization(organization);
                setOpenAddView(true);
              }}
            >
              {/* <img
                src={
                  typeof organization.img == "string"
                    ? `${apiUrl()}/uploads/${organization.img}`
                    : URL.createObjectURL(organization.img)
                }
                className="card-img-top"
                alt={organization.name}
              /> */}
              <div className="card-body">
                <h5 className="card-title">
                  {organization.name}
                </h5>
                <p className="card-text">
                  {organization.active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {openAddView && (
        <OrganizationsAddView
          onCloseModal={() => {
            setOpenAddView(false);
            setSelectedOrganization("");
          }}
          addToOrganizationList={addToOrganizationList}
          updateOrganizationList={updateOrganizationList}
          selectedOrganization={selectedOrganization}
        />
      )}
    </div>
  );
};

export default Organizations;
