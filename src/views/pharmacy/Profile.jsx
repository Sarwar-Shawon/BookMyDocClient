/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { Get, Put } from "../../api";
import { apiUrl } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import Modal from "../../components/Modal";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import ChnagePasswordView from "../common/ChangePasswordView";
import PLaceAutoComplete from "../../components/PlaceAutoComplete";

//
const PharmacyProfile = () => {
  //
  const [formData, setFormData] = useState({
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
    active: true
  });
  //
  const [profile, setProfile] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isBtnLoading, setBtnLoading] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCngPassModal, setShowCngPassModal] = useState(false);
  const [showResp, setShowResp] = useState({});
  //
  const handleChange = (e) => {
    const { name, value, options } = e.target;
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
      const resp = await Get(`${apiUrl()}/pharmacy/get-profile`);
      //console.log("resp:::", resp);
      if (resp.success) {
        setProfile(resp?.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  //
  const updatePharmacy = async (e) => {
    e.preventDefault();
    try {
      //
      setBtnLoading(true)
      const params = {
        name: formData.name,
        phone: formData.phone,
        licence: formData.licence,
        active: formData.active,
        img: formData.img,
        addr: formData.addr,
      }
      const resp = await Put(`${apiUrl()}/pharmacy/update-profile`, params);
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
            <label className="form-control">{profile?.phar_email}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Name:</label>
            <label className="form-control">{profile?.name}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Licence:</label>
            <label className="form-control">{profile?.licence}</label>
          </div>
          <div className="mb-3">
            <label className="form-label">Phone:</label>
            <label className="form-control">{profile?.phone}</label>
          </div>
        </div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Organization:</label>
            <label className="form-control">
              {profile?.org?.name}
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">Status:</label>
            <label className="form-control">
              {profile?.active ? "Active" : "Inactive"}
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">Address:</label>
            <label className="form-control">{profile?.addr?.formatted_address}</label>
          </div>
          <div style={{ display: "flex", flexDirection: "row" , justifyContent: 'space-between'}}>
            <div className="mb-3">
              <label className="form-label">Image:</label>
              <div style={{ paddingBottom: "10px" }}>
                {profile?.img && (
                  <img
                    src={
                      typeof profile?.img === "string"
                        ? `${apiUrl()}/uploads/${profile?.img}`
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
          updatePharmacy={updatePharmacy}
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
const UpdateProfileView = ({isLoading , formData, setFormData , handleChange , updatePharmacy , showResp , setShowResp , onCloseModal}) => {
  //
  return (
    <Modal
      title={"Update Pharmacy"}
      body={
        <form onSubmit={updatePharmacy} className="row">
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
export default PharmacyProfile;
