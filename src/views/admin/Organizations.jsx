/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { FaPlusSquare, FaSearch } from "react-icons/fa";
import OrganizationsAddView from "./OrganizationAddView";
import { Get } from "../../services";
import apiEndpoints from "../../config/apiEndpoints";

import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
const Organizations = () => {
  const [searchText, setSearchText] = useState("");
  const [openAddView, setOpenAddView] = useState(false);
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
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const skip = organizations.length;
      const resp = await Get(`${apiEndpoints.admin.getAllOrganizations}?skip=${skip}`);
      //console.log("resp:::", resp);
      if (resp.success) {
        setOrganizations((prevOrganizations) => [...prevOrganizations, ...resp.data]);
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
  //
  return (
    <div className="container-fluid">
      <div className="row">
      <div className="col">
          <div className="d-flex justify-content-end align-items-center mb-3">
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
                    ? `${apiEndpoints.upload.url}/${organization.img}`
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
