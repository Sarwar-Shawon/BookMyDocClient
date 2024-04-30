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

const DepartmentsAddView = ({
  onCloseModal,
  addToDepartmentList,
  selectedDepartment,
  updateDepartmentList,
}) => {
  //
  const [errors, setError] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    img: "",
    active: true,
  });
  const [showResp, setShowResp] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  //
  useEffect(() => {
    const mergedFormData = {
      ...formData,
      ...selectedDepartment,
    };
    setFormData(mergedFormData);
  }, [selectedDepartment]);
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
    }else {
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
      if (selectedDepartment && selectedDepartment._id) {
        await updateDepartment();
      } else {
        await addNewDepartment();
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
  const addNewDepartment = async () => {
    try {
      //
      const resp = await Post(`${apiUrl()}/admin/createDepartment`, formData);
      //console.log("resp:::", resp);
      const respObj = {};
      if (resp.success) {
        addToDepartmentList({ newDept: [resp?.data] });
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
  const updateDepartment = async () => {
    try {
      //
      const resp = await Put(`${apiUrl()}/admin/updadteDepartment`, formData);
      //console.log("resp:::", resp);
      const respObj = {};
      if (resp.success) {
        updateDepartmentList({ updDept: formData });
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
      title={selectedDepartment ? "Update Department"  : "Add New Department" }
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

          <div className="col-md-12">
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
              <label className="form-label">Details:</label>
              <textarea
                className="form-control"
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows={3} 
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
          <div className="col-12">
            <div className="d-grid">
              {isLoading ? (
                <button className="btn btn-primary" disabled>
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                  </div>
                </button>
              ) : (
                <button type="submit" className="btn btn-primary">
                  {selectedDepartment
                    ? "Update Department"
                    : "Create Department"}
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

export default DepartmentsAddView;
