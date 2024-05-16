/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { FaPlusSquare, FaSearch } from "react-icons/fa";
import PharmacyAddView from "./PharmacyAddView";
import { Get } from "../../services";
import apiEndpoints from "../../config/apiEndpoints";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import InfiniteScroll from "react-infinite-scroll-component";
//
const Pharmacies = () => {
  const [searchText, setSearchText] = useState("");
  const [openAddView, setOpenAddView] = useState(false);
  const [pharmacies, setPharmacies] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  const [selectedPharmacy, setSelectedPharmacy] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [selOrg, setSelOrg] = useState("");

  //
  useEffect(() => {
    fetchOrganizations();
    // fetchPharmacies();
  }, []);
  //
  const fetchPharmacies = async (pSkip) => {
    try {
      const skip = pSkip ? 0 : pharmacies.length;
      const resp = await Get(
        `${apiEndpoints.admin.getAllPharmacies}?skip=${skip}&limit=15&org=${selOrg}`
      );
      //console.log("resp:::", resp);
      if (resp.success) {
        setPharmacies((prevPharmacies) => [...prevPharmacies, ...resp.data]);
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
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setPharmacies([]);
      await fetchPharmacies(true);
    };
    fetchData();
  }, [selOrg]);
  //
  const addToPharmacyList = async ({ newNur }) => {
    try {
      setPharmacies((prevPharmacies) => [...prevPharmacies, ...newNur]);
    } catch (err) {
      //
    }
  };
  //
  const updatePharmacyList = async ({ updNur }) => {
    try {
      const updatedNewNur = pharmacies.map((pharmacy) =>
        pharmacy._id == updNur._id ? { ...pharmacy, ...updNur } : pharmacy
      );
      setPharmacies(updatedNewNur);
    } catch (err) {
      //
    }
  };
  //
  const delteFromPharmacyList = async ({del_id}) => {
    try {
      const updatedPharmacies = pharmacies.filter((pharmacy) => pharmacy._id !== del_id);
      setPharmacies(updatedPharmacies);
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
              Add New Pharmacy
            </button>
          </div>
        </div>
      </div>
      <div className="doctor-list d-flex flex-wrap">
        {!pharmacies.length && (
          <div className="container-fluid d-flex justify-content-center align-items-center">
            <img src={noData} className="no-data-img" alt="No data found" />
          </div>
        )}
        <InfiniteScroll
          dataLength={pharmacies.length}
          next={fetchPharmacies}
          hasMore={hasMore}
          loader={
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner"></div>
            </div>
          }
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {pharmacies.map((pharmacy) => {
            return (
              <div
                key={pharmacy._id}
                className="doctor-card card mb-3 mx-2"
                onClick={() => {
                  setSelectedPharmacy(pharmacy);
                  setOpenAddView(true);
                }}
              >
                <img
                  src={
                    typeof pharmacy.img == "string"
                      ? `${apiEndpoints.upload.url}/${pharmacy.img}`
                      : URL.createObjectURL(pharmacy.img)
                  }
                  className="card-img-top"
                  alt={pharmacy.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{pharmacy.name}</h5>
                  <p className="card-text">{pharmacy?.org?.name}</p>
                  <p className="card-text">
                    {pharmacy.active ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
      {openAddView && (
        <PharmacyAddView
          onCloseModal={() => {
            setOpenAddView(false);
            setSelectedPharmacy("");
          }}
          addToPharmacyList={addToPharmacyList}
          updatePharmacyList={updatePharmacyList}
          selectedPharmacy={selectedPharmacy}
          organizations={organizations}
          delteFromPharmacyList={delteFromPharmacyList}
        />
      )}
    </div>
  );
};

export default Pharmacies;
