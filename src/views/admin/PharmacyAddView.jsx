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

const PharmacyAddView = ({
  onCloseModal,
  addToPharmacyList,
  selectedPharmacy,
  updatePharmacyList,
  organizations,
}) => {
  //
  const [errors, setError] = useState({});
  const [formData, setFormData] = useState({
    phar_email: "",
    name: "",
    phone: "",
    licence: "",
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
    org: "",
  });
  const [showResp, setShowResp] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  //
  useEffect(() => {
    const mergedFormData = {
      ...formData,
      ...selectedPharmacy,
    };
    mergedFormData.org = selectedPharmacy?.org?._id;

    setFormData(mergedFormData);
  }, [selectedPharmacy]);
  //
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "active") {
      setFormData({
        ...formData,
        [name]: value == "true" ? true : false,
      });
    } else if (name == "img") {
      setFormData({
        ...formData,
        [name]: e.target.files[0],
      });
    } else if (name.includes("addr.")) {
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
      if (validateForm()) {
        if (selectedPharmacy && selectedPharmacy._id) {
          await updatePharmacy();
        } else {
          await addNewPharmacy();
        }
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

    if (!formData.phar_email || !Regex.emailRegex.test(formData.phar_email)) {
      errorsObj.phar_email = "Please enter a valid email address";
      isValid = false;
    }
    if (!formData.name) {
      errorsObj.l_name = "Name is required";
      isValid = false;
    }
    if (!formData.phone) {
      errorsObj.phone = "Phone is required";
      isValid = false;
    }
    if (!formData.licence) {
      errorsObj.licence = "Licence is required";
      isValid = false;
    }
    if (!formData.active) {
      errorsObj.active = "Status is required";
      isValid = false;
    }
    if (!formData.addr.line1) {
      errorsObj.addr_line1 = "Address Line 1 is required";
      isValid = false;
    }
    if (!formData.addr.city) {
      errorsObj.addr_city = "City is required";
      isValid = false;
    }
    if (!formData.addr.postal_code) {
      errorsObj.addr_postal_code = "Postal Code is required";
      isValid = false;
    }
    setError(errorsObj);
    return isValid;
  };
  //
  const addNewPharmacy = async () => {
    try {
      //
      console.log("params:: add new pharmacy", formData);
      const resp = await Post(`${apiUrl()}/admin/registerPharmacy`, formData);
      console.log("resp:::", resp);
      const respObj = {};
      if (resp.success) {
        addToPharmacyList({ newNur: [resp?.data] });
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
  const updatePharmacy = async () => {
    try {
      //
      console.log("params:: update pharmacy", formData);
      const resp = await Put(`${apiUrl()}/admin/updatePharmacy`, formData);
      console.log("resp:::", resp);
      const respObj = {};
      if (resp.success) {
        updatePharmacyList({ updNur: resp?.data });
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
  console.log("fr", formData);
  return (
    <Modal
      title={selectedPharmacy ? "Update Pharmacy" : "Add New Pharmacy"}
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
              <label className="form-label">Email:</label>
              {errors.phar_email && (
                <p className="text-danger">{errors.phar_email}</p>
              )}
              <input
                type="email"
                className="form-control"
                name="phar_email"
                value={formData.phar_email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Name:</label>
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
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const numericInput = e.target.value.replace(/\D/g, "");
                  setFormData({
                    ...formData,
                    ["phone"]: numericInput,
                  });
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Licence:</label>
              <input
                type="text"
                className="form-control"
                name="licence"
                value={formData.licence}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Organization:</label>
              <select
                className="form-select"
                name="org"
                value={formData.org}
                onChange={handleChange}
                required
              >
                <option value="">Select Organization</option>
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
          {/* Address View */}
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
                name="addr.county"
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
                name="addr.country"
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
                  {selectedPharmacy ? "Update Pharmacy" : "Create Account"}
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

export default PharmacyAddView;
