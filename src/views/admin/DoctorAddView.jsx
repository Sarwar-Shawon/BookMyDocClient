/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import Modal from "../../components/Modal";
import { Regex, formatDateToString } from "../../utils";
import { Post, Put, Get,Delete } from "../../services";
import apiEndpoints from "../../config/apiEndpoints";
import AppCalendar from "../../components/Calendar";
import { FaMale, FaFemale } from "react-icons/fa";

const DoctorsAddView = ({
  onCloseModal,
  addToDoctorList,
  selectedDoctor,
  updateDoctorList,
  delteFromDoctorList,
  departments,
  organizations,
}) => {
  //
  const [showCalendar, setShowCalendar] = useState(false);
  const [errors, setError] = useState({});
  const [allNurses, setNurses] = useState([]);
  const [showDeleteView, setShowDeleteView] = useState(false);
  const [formData, setFormData] = useState({
    doc_email: "",
    f_name: "",
    l_name: "",
    dob: "",
    phone: "",
    gmc_licence: "",
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
    gender: "Male",
    dept: "",
    active: true,
    organization: "",
    nurses: [],
  });
  const [showResp, setShowResp] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  //
  useEffect(() => {
    setFormData({
      ...formData,
      nurses: selectedDoctor?.nurses ? selectedDoctor?.nurses : [],
    });
    fetchNurses();
  }, [formData.dept, formData.organization]);
  //
  const fetchNurses = async () => {
    try {
      if (!formData.dept || !formData.organization) {
        return;
      }
      const resp = await Get(
        `${apiEndpoints.admin.getAllNursesByDeptOrg}?dept=${formData.dept}&org=${
          formData.organization
        }`
      );
      ////console.log("fetchNurses:: resp:::", resp);
      if (resp.success) {
        setNurses(resp?.data);
      }
    } catch (err) {
    } finally {
    }
  };
  //
  useEffect(() => {
    const mergedFormData = {
      ...formData,
      ...selectedDoctor,
    };
    mergedFormData.dept = selectedDoctor?.dept?._id;
    mergedFormData.organization = selectedDoctor?.organization?._id;
    mergedFormData.nurses = selectedDoctor?.nurses;
    setFormData(mergedFormData);
  }, [selectedDoctor]);
  //
  const handleChange = (e) => {
    const { name, value, options } = e.target;

    if (name == "nurses") {
      ////console.log(options);
      let selectedNurses = formData.nurses;
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedNurses.push(options[i].value);
        }
      }
      setFormData({ ...formData, [name]: selectedNurses });
    } else if (name == "active") {
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
      if (selectedDoctor && selectedDoctor._id) {
        await updateDoctor();
      } else {
        await addNewDoctor();
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

    if (!formData.doc_email || !Regex.emailRegex.test(formData.doc_email)) {
      errorsObj.doc_email = "Please enter a valid email address";
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
    if (!formData.gender) {
      errorsObj.gender = "Gender is required";
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
    // if (!formData.active) {
    //   errorsObj.active = "Status is required";
    //   isValid = false;
    // }
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
  const addNewDoctor = async () => {
    try {
      //
      ////console.log("params:: add new doctor", formData);
      const resp = await Post(apiEndpoints.admin.registerDoctor, formData);
      ////console.log("resp:::", resp);
      const respObj = {};
      if (resp.success) {
        addToDoctorList({ newDoc: [resp?.data] });
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
  const deleteDoctor = async () => {
    try {
      //
      if(selectedDoctor?._id){
        const resp = await Delete(apiEndpoints.admin.deleteDoctor, {_id: selectedDoctor._id});
        console.log("resp:::", resp);
        const respObj = {};
        if (resp.success) {
          delteFromDoctorList({ del_id: resp?.data });
          respObj.success = true;
          respObj.msg = resp?.message;
          setShowResp(respObj);
        } else {
          respObj.success = false;
          respObj.msg = resp?.error;
          setShowResp(respObj);
        }
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
  //
  const updateDoctor = async () => {
    try {
      //
      ////console.log("params:: update doctor", formData);
      const resp = await Put(apiEndpoints.admin.updateDoctor, formData);
      ////console.log("resp:::", resp);
      const respObj = {};
      if (resp.success) {
        updateDoctorList({ updDoc: resp?.data });
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
      title={selectedDoctor ? "Update Doctor" : "Add New Doctor"}
      body={
        <form onSubmit={handleSubmit} className="row">
          <ErrorAlert
            msg={!showResp?.success ? showResp?.msg : ""}
            hideMsg={() => setShowResp({})}
          />
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label">Email:</label>
              {errors.doc_email && (
                <p className="text-danger">{errors.doc_email}</p>
              )}
              <input
                type="email"
                className="form-control"
                name="doc_email"
                value={formData.doc_email}
                onChange={handleChange}
                required
                disabled={selectedDoctor ? true : false}
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
            {/* <div className="mb-3">
              <label className="form-label">Find Address:</label>
              <PLaceAutoComplete
                onPlaceSelected={(place) => {
                  //console.log("place", place);
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
            </div> */}
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
                  {departments.length > 0 &&
                    departments.map((dept) => (
                      <option value={dept._id} key={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                </>
              </select>
            </div>
            <div className="mb-3">
              <label>Gender</label>
              {errors.gender && (
                <p style={{ fontSize: 16, color: "red", marginBottom: 2 }}>
                  *{errors.gender}
                </p>
              )}
              <div className="radio-row">
                <div className="radio">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value={formData.gender}
                      checked={formData.gender == "Male" ? true : false}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          ["gender"]: "Male",
                        });
                      }}
                    />
                    <span style={{ marginLeft: "4px" }}>Male</span>
                    <FaMale style={{ fontSize: "16px" }} />
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value={formData.gender}
                      checked={formData.gender == "Female" ? true : false}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          ["gender"]: "Female",
                        });
                      }}
                    />
                    <span style={{ marginLeft: "4px" }}>Female</span>
                    <FaFemale style={{ fontSize: "16px" }} />
                  </label>
                </div>
              </div>
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
                  {organizations.length > 0 &&
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
            <div className="mb-3">
              <label className="form-label">Attach Nurses With Doctror:</label>
              <CheckboxSelect
                options={allNurses}
                selectedValues={formData.nurses}
                onChange={(selectedValues) => {
                  setFormData({ ...formData, nurses: selectedValues });
                }}
              />
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
                      ? `${apiEndpoints.upload.url}/${formData.img}`
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
          <div className="col-12" style={{ marginTop: 10 }}>
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
                  {selectedDoctor ? "Update Doctor" : "Create Account"}
                </button>
              )}
            </div>
          </div>
          {selectedDoctor && (
            <div className="col-12" style={{ marginTop: 10 }}>
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
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => setShowDeleteView(true)}
                  >
                    Delete Doctor
                  </button>
                )}
              </div>
            </div>
          )}

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
          {showDeleteView && (
            <Modal
              title={"Logout"}
              body={"Do you want to delete this doctor?"}
              btm_btn_1_txt={"No"}
              btm_btn_2_txt={"Yes"}
              btn1Click={() => {
                setShowDeleteView(false);
              }}
              btn2Click={() => deleteDoctor()}
              showFooter={true}
              onCloseModal={() => setShowDeleteView(false)}
            />
          )}
          {showResp?.success && (
            <Modal
              title={"Response"}
              body={
                <div>
                  <ErrorAlert msg={!showResp?.success ? showResp?.msg : ""} />
                  <SuccessAlert msg={showResp?.success ? showResp?.msg : ""} />
                </div>
              }
              btm_btn_2_txt={"Ok"}
              btn2Click={() => {
                setShowResp({});
                onCloseModal();
              }}
              showFooter={true}
              onCloseModal={() => setShowResp({})}
            />
          )}
        </form>
      }
      onCloseModal={onCloseModal}
      big={true}
    />
  );
};
//
const CheckboxSelect = ({ options, selectedValues, onChange }) => {
  const handleChange = (event) => {
    const { value } = event.target;
    let updatedSelectedItems = selectedValues ? [...selectedValues] : [];
    if (selectedValues && selectedValues.includes(value)) {
      updatedSelectedItems = updatedSelectedItems.filter(
        (item) => item !== value
      );
    } else {
      updatedSelectedItems.push(value);
    }
    onChange(updatedSelectedItems);
  };
  return (
    <div className="checkbox-container">
      {!options.length && (
        <div style={{ fontWeight: "bold" }}>No Nurses are found</div>
      )}
      {options.length > 0 &&
        options.map((option) => (
          <label className="checkbox-label" key={option._id}>
            <input
              type="checkbox"
              className="checkbox-input"
              value={option._id}
              checked={selectedValues && selectedValues.includes(option._id)}
              onChange={handleChange}
            />
            <span className="checkbox-text">
              {[option.f_name, option.l_name].join(" ")}
            </span>
          </label>
        ))}
    </div>
  );
};
//
export default DoctorsAddView;
