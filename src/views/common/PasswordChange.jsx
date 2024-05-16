/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/login.css";
import { Regex } from "../../utils";
import { ErrorAlert } from "../../components/Alert";
import { PasswordInput } from "../../components/Password";
import { setItem, getItem } from "../../utils";
import { Put } from "../../services";
import apiEndpoints from "../../config/apiEndpoints";

import Header from "../layout/Header";

//
const PasswordChange = () => {
  const [showPass, setShowPass] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [respMsg, setRespMsg] = useState({});
  const navigate = useNavigate();

  //
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (validateForm()) {
        setLoading(true);
        await changePassword();
      }
    } catch {
      setErrors("");
    } finally {
      setLoading(false);
    }
  };
  //validate login form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    // Validate email
    if (!oldPassword) {
      newErrors.oldPassword = "Old Password is required";
      isValid = false;
    }
    if (!newPassword) {
      newErrors.newPassword = "New Password is required";
      isValid = false;
    }
    if (newPassword && !Regex.passwordRegex.test(newPassword)) {
      newErrors.newPassword = "New Password doesn't match the requirements";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  //Change Password
  const changePassword = async () => {
    try {
      setLoading(true);
      setRespMsg({});
      const params = {
        old_password: oldPassword,
        new_password: newPassword,
      };
      const resp = await Put(
        apiEndpoints.auth.changePassword,
        params,
        "application/json"
      );
      //console.log("resp:::", resp);
      if (resp.success) {
        //
        const user = await getItem("usr");
        user.pas_cg_rq = false;
        setItem("usr", user);
        setRespMsg({ success: true, msg: resp?.message });
      } else {
        setRespMsg({ success: false, msg: resp?.error });
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  //
  return (
    <div className="container-fluid">
      <div className="row no-gutter">
        <Header />
        <div className="col-md-6 d-none d-md-flex bg-image"></div>
        <div className="col-md-6 bg-light">
          <div className="login d-flex align-items-center py-5">
            <div className="auth-inner">
              {respMsg?.success ? (
                <div>
                  <h3>Verification</h3>
                  <div className="alert alert-success" role="alert">
                    "Congratulations! you have successfully changed your password now you can access your dashboard."
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        navigate("/home", { replace: true });
                      }}
                    >
                      Click here to go to your dashboard!
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3>Change Password</h3>
                  <ErrorAlert
                    msg={!respMsg?.success ? respMsg?.msg : ""}
                    hideMsg={() => setRespMsg({})}
                  />
                  <div className="mb-3">
                    <label>Old Password *</label>
                    {errors.oldPassword && (
                      <p
                        style={{ fontSize: 16, color: "red", marginBottom: 2 }}
                      >
                        *{errors.oldPassword}
                      </p>
                    )}
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter old password"
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <PasswordInput
                      password={newPassword}
                      showPass={showPass}
                      setPassword={setNewPassword}
                      setShowPass={setShowPass}
                      label={"New Password*"}
                      placeholder={"Enter New Password"}
                    />
                    {errors.newPassword && (
                      <p
                        style={{ fontSize: 16, color: "red", marginBottom: 2 }}
                      >
                        *{errors.newPassword}
                      </p>
                    )}
                  </div>
                  <div className="d-grid">
                    {loading ? (
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
                        Change Password
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PasswordChange;
