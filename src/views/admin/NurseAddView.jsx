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
import { Regex, formatDateToString } from "../../utils";
import { Post, Put } from "../../api";
import { apiUrl } from "../../config/appConfig";
import AppCalendar from "../../components/Calendar";

const NursesAddView = ({
  onCloseModal,
  addToNurseList,
  selectedNurse,
  updateNurseList,
  departments,
  organizations,
}) => {
  //
  const [errors, setError] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [formData, setFormData] = useState({
    nur_email: "",
    f_name: "",
    l_name: "",
    dob: "",
    phone: "",
    gmc_licence: "",
    img: "",
    // addr: {
    //   line1: "",
    //   line2: "",
    //   city: "",
    //   county: "",
    //   country: "",
    //   postal_code: "",
    //   lat_lng: "",
    //   formatted_address: "",
    // },
    dept: "",
    active: true,
    organization: "BookMyDoc",
  });
  const [showResp, setShowResp] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  //
  useEffect(() => {
    const mergedFormData = {
      ...formData,
      ...selectedNurse,
    };
    mergedFormData.dept = selectedNurse?.dept?._id;
    mergedFormData.organization = selectedNurse?.organization?._id;

    setFormData(mergedFormData);
  }, [selectedNurse]);
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
      if (selectedNurse && selectedNurse._id) {
        await updateNurse();
      } else {
        await addNewNurse();
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

    if (!formData.nur_email || !Regex.emailRegex.test(formData.nur_email)) {
      errorsObj.nur_email = "Please enter a valid email address";
      isValid = false;
    }
    if (!formData.f_name) {
      errorsObj.f_name = "First Name is required";
      isValid = false;
    }
    if (!formData.l_name) {
      errorsObj.l_name = "Last Name is required";
      isValid = false;
    }
    if (!formData.dob) {
      errorsObj.dob = "Date Of Birth is required";
      isValid = false;
    }
    if (!formData.phone) {
      errorsObj.phone = "Phone is required";
      isValid = false;
    }
    if (!formData.dept) {
      errorsObj.dept = "Department is required";
      isValid = false;
    }
    if (!formData.gmc_licence) {
      errorsObj.gmc_licence = "GMC Licence is required";
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
  const addNewNurse = async () => {
    try {
      //
      //console.log("params:: add new nurse", formData);
      const resp = await Post(`${apiUrl()}/admin/registerNurse`, formData);
      //console.log("resp:::", resp);
      const respObj = {};
      if (resp.success) {
        addToNurseList({ newNur: [resp?.data] });
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
  const updateNurse = async () => {
    try {
      //
      //console.log("params:: update nurse", formData);
      const resp = await Put(`${apiUrl()}/admin/updateNurse`, formData);
      //console.log("resp:::", resp);
      const respObj = {};
      if (resp.success) {
        updateNurseList({ updNur: resp?.data });
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
  const calculateMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(
      today.getFullYear() - 16,
      today.getMonth(),
      today.getDate()
    );
    return maxDate;
  };
  return (
    <Modal
      title={selectedNurse ? "Update Nurse" : "Add New Nurse"}
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
              {errors.nur_email && (
                <p className="text-danger">{errors.nur_email}</p>
              )}
              <input
                type="email"
                className="form-control"
                name="nur_email"
                value={formData.nur_email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">First Name:</label>
              <input
                type="text"
                className="form-control"
                name="f_name"
                value={formData.f_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name:</label>
              <input
                type="text"
                className="form-control"
                name="l_name"
                value={formData.l_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Date Of Birth:</label>
              {/* <input
                type="text"
                className="form-control"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              /> */}
              <label
                className="form-control"
                style={{
                  border: "1px solid #ced4da",
                  borderRadius: "0.25rem",
                  padding: "0.375rem 0.75rem",
                  lineHeight: "1.5",
                }}
                onClick={() => setShowCalendar(true)}
              >
                {formatDateToString(formData.dob) || "dd-mm-yyyy"}
              </label>
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
              <label className="form-label">Gmc Licence:</label>
              <input
                type="text"
                className="form-control"
                name="gmc_licence"
                value={formData.gmc_licence}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {/* Address View */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Department:</label>
              <select
                className="form-select"
                name="dept"
                value={formData.dept}
                onChange={handleChange}
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
            <div className="mb-3">
              <label className="form-label">Organization:</label>
              <select
                className="form-select"
                name="organization"
                value={formData.organization}
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
                  {selectedNurse ? "Update Nurse" : "Create Account"}
                </button>
              )}
            </div>
            {showCalendar && (
              <AppCalendar
                onCloseModal={() => setShowCalendar(false)}
                value={formData.dob}
                onChange={(val) => {
                  setFormData({
                    ...formData,
                    dob: val,
                  });
                }}
                maxDate={calculateMaxDate()}
              />
            )}
          </div>
        </form>
      }
      onCloseModal={onCloseModal}
      big={true}
    />
  );
};

export default NursesAddView;
