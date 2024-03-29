/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import {
  FaAlignJustify,
  FaHome,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import Modal from "../../components/Modal";
import PLaceAutoComplete from "../../components/PlaceAutoComplete";
import { Regex } from "../../utils";
import { Post, Put } from "../../api";
import { apiUrl } from "../../config/appConfig";

const OrganizationsAddView = ({
  onCloseModal,
  addToOrganizationList,
  selectedOrganization,
  updateOrganizationList,
}) => {
  //
  const [errors, setError] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    img: "",
    addr: {
      line1: "",
      line2: "",
      city: "",
      county: "",
      country: "",
      postal_code: "",
      lat_lng: "",
      formatted_address: "",
    },
    active: true,
  });
  const [showResp, setShowResp] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  //
  useEffect(() => {
    console.log("selectedOrganization::::::",selectedOrganization)
    const mergedFormData = {
      ...formData,
      ...selectedOrganization,
    };
    setFormData(mergedFormData);
  }, [selectedOrganization]);
  //
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "active") {
      setFormData({
        ...formData,
        [name]: value == "true" ? true : false,
      });
    }
    else if (name == "img") {
      setFormData({
        ...formData,
        [name]: e.target.files[0],
      });
    }
    else if (name.includes("addr.")) {
      const addrField = name.split(".")[1];
      setFormData({
        ...formData,
        addr: {
          ...formData.addr,
          [addrField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  //@to-do need to do work here
  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      console.log("selectedOrganization",selectedOrganization)
      if (selectedOrganization && selectedOrganization._id) {
        await updateOrganization();
      } else {
        await addNewOrganization();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  //
  const validateForm = () => {
    let isValid = true;
    const errorsObj = {};

    if (!formData.name) {
      errorsObj.doc_email = "Please enter a valid email address";
      isValid = false;
    }
    setError(errorsObj);
    return isValid;
  };
  //
  const addNewOrganization = async () => {
    try {
      //
      console.log("params:: add new organization", formData);
      const resp = await Post(`${apiUrl()}/admin/createOrganization`, formData);
      console.log("resp:::", resp);
      const respObj = {};
      if (resp.success) {
        addToOrganizationList({ newDept: [resp?.data] });
        respObj.success = true;
        respObj.msg = resp?.message;
        setShowResp(respObj);
      } else {
        respObj.success = false;
        respObj.msg = resp?.error;
        setShowResp(respObj);
      }
    } catch (err) {
    } finally {
    }
  };
  //
  const updateOrganization = async () => {
    try {
      //
      console.log("params:: update organization", formData);
      const resp = await Put(`${apiUrl()}/admin/updadteOrganization`, formData);
      console.log("resp:::", resp);
      const respObj = {};
      if (resp.success) {
        updateOrganizationList({ updDept: formData });
        respObj.success = true;
        respObj.msg = resp?.message;
        setShowResp(respObj);
      } else {
        respObj.success = false;
        respObj.msg = resp?.error;
        setShowResp(respObj);
      }
    } catch (err) {
    } finally {
    }
  };
  //
  return (
    <Modal
      title={selectedOrganization ? "Update Organization"  : "Add New Organization" }
      body={
        <form onSubmit={handleSubmit} className="row">
          <ErrorAlert
            msg={!showResp?.success ? showResp?.msg : ""}
            hideMsg={() => setShowResp({})}
          />
          <SuccessAlert
            msg={showResp?.success ? showResp?.msg : ""}
            hideMsg={() => setShowResp({})}
          />

          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Name:</label>
              {errors.name && <p className="text-danger">{errors.name}</p>}
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone:</label>
              {errors.phone && <p className="text-danger">{errors.phone}</p>}
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email:</label>
              {errors.email && <p className="text-danger">{errors.email}</p>}
              <input
                type="text"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Status:</label>
              <select
                className="form-select"
                name="active"
                value={formData.active}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
            <div className="mb-3 ">
              <label className="form-label">Image:</label>
              {/* <input
                type="text"
                className="form-control"
                name="addr.line2"
                value={formData.addr.country}
                onChange={handleChange}
                required
              /> */}
              <input
                type="file"
                className="form-control"
                accept="image/*"
                name="img"
                onChange={handleChange}
              />
            </div>
            <div className="align-items-center">
              {formData.img && (
                <img
                  src={
                    typeof formData.img == "string"
                      ? `${apiUrl()}/uploads/${formData.img}`
                      : URL.createObjectURL(formData.img)
                  }
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                  }}
                />
              )}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Find Address:</label>
              <PLaceAutoComplete
                onPlaceSelected={(place) => {
                  console.log("place", place);
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    addr: {
                      ...prevFormData.addr,
                      ...place,
                    },
                  }));
                }}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Line1:</label>
              <input
                type="text"
                className="form-control"
                name="addr.line1"
                value={formData.addr.line1}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Line2:</label>
              <input
                type="text"
                className="form-control"
                name="addr.line2"
                value={formData.addr.line2}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">City:</label>
              <input
                type="text"
                className="form-control"
                name="addr.city"
                value={formData.addr.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Post Code:</label>
              <input
                type="text"
                className="form-control"
                name="addr.postal_code"
                value={formData.addr.postal_code}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">County:</label>
              <input
                type="text"
                className="form-control"
                name="addr.line2"
                value={formData.addr.county}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Country:</label>
              <input
                type="text"
                className="form-control"
                name="addr.line2"
                value={formData.addr.country}
                onChange={handleChange}
                required
              />
            </div>
          
          </div>
          <div className="col-12">
            <div className="d-grid">
              {isLoading ? (
                <button className="btn btn-primary" disabled>
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    {/* <span className="visually-hidden">Loading...</span> */}
                  </div>
                </button>
              ) : (
                <button type="submit" className="btn btn-primary">
                  {selectedOrganization
                    ? "Update Organization"
                    : "Create Organization"}
                </button>
              )}
            </div>
          </div>
        </form>
      }
      onCloseModal={onCloseModal}
      big={true}
    />
  );
};

export default OrganizationsAddView;
