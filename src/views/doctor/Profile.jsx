/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { Get, Put } from "../../services";
import apiEndpoints from "../../config/apiEndpoints";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import Modal from "../../components/Modal";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import ChnagePasswordView from "../common/ChangePasswordView"
//
const DoctorProfile = () => {
  //
  const [formData, setFormData] = useState({
    doc_email: "",
    f_name: "",
    l_name: "",
    dob: "",
    phone: "",
    gmc_licence: "",
    img: "",
    dept: "",
    active: true,
    organization: "",
    nurses: [],
    pSign: ""
  });
  //
  const [profile, setProfile] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isBtnLoading, setBtnLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCngPassModal, setShowCngPassModal] = useState(false);
  const [showResp, setShowResp] = useState({});
  //
  const handleChange = (e) => {
    const { name, value, options } = e.target;
    if (name == "nurses") {
      //console.log(options)
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
    }
    else if (name == "pSign") {
      setFormData({
        ...formData,
        [name]: e.target.files[0],
      });
    } 
    else if (name == "img") {
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
      const resp = await Get(apiEndpoints.doctor.getProfile);
      //console.log("resp:::", resp);
      if (resp.success) {
        setProfile(resp?.data);
      }
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };
  //
  const updateDoctor = async (e) => {
    e.preventDefault();
    try {
      //
      setBtnLoading(true)
      //console.log("params:: update doctor", formData);
      const params = {
        f_name: formData.f_name,
        l_name: formData.l_name,
        dob: formData.dob,
        phone: formData.phone,
        active: formData.active,
        img: formData.img,
        pSign: formData.pSign,
      }
      const resp = await Put(apiEndpoints.doctor.updateProfile, params);
      //console.log("resp:::", resp);
      const respObj = {};
      if (resp.success) {
        respObj.success = true;
        respObj.msg = resp?.message;
        fetchProfile();
        setShowResp(respObj);
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
            <label className="form-control">{profile?.doc_email}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">First Name:</label>
            <label className="form-control">{profile?.f_name}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name:</label>
            <label className="form-control">{profile?.l_name}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Date Of Birth:</label>
            <label className="form-control">{profile?.dob}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Phone:</label>
            <label className="form-control">{profile?.phone}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Gmc Licence:</label>
            <label className="form-control">{profile?.gmc_licence}</label>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Department:</label>
            <label className="form-control">{profile?.dept?.name}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Organization:</label>
            <label className="form-control">
              {profile?.organization?.name}
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">Status:</label>
            <label className="form-control">
              {profile?.active ? "Active" : "Inactive"}
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">Attachted Nurses:</label>
            {profile?.nurses.length > 0
              ? profile.nurses.map((nurse) => (
                  <label className="form-control" key={nurse._id}>
                    {[nurse.f_name, nurse.l_name].join(" ")}
                  </label>
                ))
              : null}
          </div>
          <div style={{ display: "flex", flexDirection: "row" , justifyContent: 'space-between'}}>
            <div className="mb-3">
              <label className="form-label">Image:</label>
              <div style={{ paddingBottom: "10px" }}>
                {profile?.img && (
                  <img
                    src={
                      typeof profile?.img === "string"
                        ? `${apiEndpoints.upload.url}/${profile?.img}`
                        : URL.createObjectURL(profile?.img)
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
            <div className="mb-3">
              <label className="form-label">Prescription Signature:</label>
              <div style={{ paddingBottom: "10px" }}>
                {profile?.pSign && (
                  <img
                    src={
                      typeof profile?.pSign === "string"
                        ? `${apiEndpoints.upload.url}/${profile?.pSign}`
                        : URL.createObjectURL(profile?.pSign)
                    }
                    style={{
                      width: 300,
                      height: 100,
                      // borderRadius: 100,
                    }}
                  />
                )}
              </div>
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
              setFormData(profile);
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
        </div>
      </div>
      {showUpdateModal && (
        <UpdateProfileView
          isLoading={isBtnLoading}
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          updateDoctor={updateDoctor}
          showResp={showResp}
          setShowResp={setShowResp}
          onCloseModal={() => setShowUpdateModal(false)}
        />
      )}
      {showCngPassModal && (
        <ChnagePasswordView onCloseModal={() => setShowCngPassModal(false)} />
      )}
    </div>
  );
};
//
const UpdateProfileView = ({isLoading , formData, setFormData , handleChange , updateDoctor , showResp , setShowResp , onCloseModal}) => {
  //
  return (
    <Modal
      title={"Update Doctor"}
      body={
        <form onSubmit={updateDoctor} className="row">
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
                    ["phone"]: numericInput.slice(0, 11),
                  });
                }}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
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
            {/* <div className="mb-3">
              <label className="form-label">Attach Nurses With Doctror:</label>
              <CheckboxSelect
                options={allNurses}
                selectedValues={formData.nurses}
                onChange={(selectedValues) => {
                  setFormData({ ...formData, nurses: selectedValues });
                }}
              />
            </div> */}
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
            <div className="mb-3 ">
              <label className="form-label">Prescription Signature:</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                name="pSign"
                onChange={handleChange}
              />
            </div>
            <div className="align-items-center">
              {formData.pSign && (
                <img
                  src={
                    typeof formData.pSign == "string"
                      ? `${apiEndpoints.upload.url}/${formData.pSign}`
                      : URL.createObjectURL(formData.pSign)
                  }
                  style={{
                    width: 300,
                    height: 100,
                    // borderRadius: 50,
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
  )
}
//
export default DoctorProfile;
