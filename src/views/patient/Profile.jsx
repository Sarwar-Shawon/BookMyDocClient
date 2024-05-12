/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect, Profiler } from "react";
import { Get, Put } from "../../services";
import apiEndpoints from "../../config/apiEndpoints";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import Modal from "../../components/Modal";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import ChnagePasswordView from "../common/ChangePasswordView"
import PLaceAutoComplete from "../../components/PlaceAutoComplete";
import MedicalRecords from './MedicalRecords'
//
const PatientProfile = () => {
  //
  const [formData, setFormData] = useState({
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
  });
  //
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isBtnLoading, setBtnLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCngPassModal, setShowCngPassModal] = useState(false);
  const [showMedRecord, setShowMedRecord] = useState(false);
  const [showResp, setShowResp] = useState({});
  const [medicalHistory, setMedicalHistory] = useState({});
  //
  const handleChange = (e) => {
    const { name, value, options } = e.target;
    if (name == "img") {
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
  //
  useEffect(() => {
    fetchProfile();
  }, []);
  //
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const resp = await Get(apiEndpoints.patient.getProfile);
      // console.log("resp:::", resp);
      if (resp.success) {
        setFormData({
          ...formData,
          ...resp?.data
        });
        setMedicalHistory(resp?.data?.medical_history)
      }
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };
  //
  const updatePatient = async (e) => {
    e.preventDefault();
    try {
      //
      setBtnLoading(true)
      //console.log("params:: update patient", formData);
      const params = {
        f_name: formData.f_name,
        l_name: formData.l_name,
        dob: formData.dob, 
        phone: formData.phone,
        nhs: formData.nhs,
        img: formData.img,
        addr: formData.addr,
      }
      //console.log("params",params)
      const resp = await Put(apiEndpoints.patient.updateProfile, params);
      //console.log("resp:::", resp);
      const respObj = {};
      if (resp.success) {
        respObj.success = true;
        respObj.msg = resp?.message;
        setShowResp(respObj);
        setFormData({
          ...formData,
          ...resp?.data
        });
      } else {
        respObj.success = false;
        respObj.msg = resp?.error;
        setShowResp(respObj);
      }
    } catch (err) {
    } finally {
      setBtnLoading(false)
    }
  };
  if (isLoading) {
    return <LoadingView />;
  }
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <label className="form-control">{formData?.pt_email}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">First Name:</label>
            <label className="form-control">{formData?.f_name}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name:</label>
            <label className="form-control">{formData?.l_name}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Date Of Birth:</label>
            <label className="form-control">{formData?.dob}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Phone:</label>
            <label className="form-control">{formData?.phone}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Nhs Id:</label>
            <label className="form-control">{formData?.nhs}</label>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Gender:</label>
            <label className="form-control">{formData?.gender}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Address:</label>
            <label className="form-control">{formData?.addr?.formatted_address}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Image:</label>
            <div style={{ paddingBottom: "10px" }}>
              {formData?.img && (
                <img
                  src={
                    typeof formData?.img === "string"
                      ? `${apiEndpoints.upload.url}/${formData?.img}`
                      : URL.createObjectURL(formData?.img)
                  }
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 mb-3">
          <button
            style={{
              width: "200px",
              backgroundColor: "#0B2447",
              borderColor: "#0B2447",
              transition: "background-color 0.3s, border-color 0.3s",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              margin: 10,
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
            onClick={() => {
              setShowUpdateModal(true);
            }}
          >
            Edit Profile
          </button>
          <button
            style={{
              width: "200px",
              backgroundColor: "#0B2447",
              borderColor: "#0B2447",
              transition: "background-color 0.3s, border-color 0.3s",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              margin: 10,
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
            onClick={() => setShowCngPassModal(true)}
          >
            Chnage Password
          </button>
          <button
            style={{
              width: "200px",
              backgroundColor: "#0B2447",
              borderColor: "#0B2447",
              transition: "background-color 0.3s, border-color 0.3s",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              margin: 10,
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
            onClick={() => setShowMedRecord(true)}
          >
            Show Medical Records
          </button>
        </div>
      </div>
      {showUpdateModal && (
        <UpdateProfileView
          isLoading={isBtnLoading}
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          updatePatient={updatePatient}
          showResp={showResp}
          setShowResp={setShowResp}
          onCloseModal={() => setShowUpdateModal(false)}
        />
      )}
      {showMedRecord && (
        <MedicalRecords
          medical_history={medicalHistory}
          onCloseModal={() => setShowMedRecord(false)}
        />
      )}
      {
        showCngPassModal &&
        <ChnagePasswordView onCloseModal={()=> setShowCngPassModal(false)}/>
      }
    </div>
  );
};
//
const UpdateProfileView = ({isLoading , formData, setFormData , handleChange , updatePatient , showResp , setShowResp , onCloseModal}) => {
  //
  return (
    <Modal
      title={"Update Patient"}
      body={
        <form onSubmit={updatePatient} className="row">
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
              <input
                type="text"
                className="form-control"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
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
                    phone: numericInput,
                  });
                }}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nhs Id:</label>
              <input
                type="text"
                className="form-control"
                name="nhs"
                value={formData.nhs}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3 ">
              <label className="form-label">Image:</label>
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
          <div className="col-md-6">
            <div className="mb-3">
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
            </div>
            
          </div>
          <div className="col-12">
            <div className="d-grid">
              {isLoading ? (
                <button className="btn btn-primary" disabled>
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></div>
                </button>
              ) : (
                <button type="submit" className="btn btn-primary">
                  Update Profile
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
}
//
export default PatientProfile;
