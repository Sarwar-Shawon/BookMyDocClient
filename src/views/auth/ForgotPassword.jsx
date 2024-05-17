/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/login.css";
import apiEndpoints from "../../config/apiEndpoints";
import { PublicPost, PublicGet } from "../../services";
import { PasswordInput } from "../../components/Password";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";

//
const ForgotPassword = () => {
  //
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [respMsg, setRespMsg] = useState({});
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  //
  useEffect(() => {
    const timer = setTimeout(() => {
      setRespMsg({});
    }, 5000);
    //
    return () => {
      clearTimeout(timer);
    };
  }, [respMsg]);
  //handleSendOtpSubmit
  const handleSendOtpSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (email) {
        const params = {
          username: email,
        };
        const resp = await PublicPost(
          apiEndpoints.auth.sendforgotPasswordOtp,
          params
        );
        // console.log("resp:::", resp);
        if(resp?.success){
            setOtpSuccess(true);
        }
        setRespMsg(resp);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };
  //validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    if (!otp) {
      newErrors.otp = "OTP is required";
      isValid = false;
    }
    if (!password) {
      newErrors.otp = "New Password is required";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  //handleChangePasswordSubmit
  const handleChangePasswordSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (validateForm()) {
        const params = {
          username: email,
          otp: otp,
          new_password: password
        };
        const resp = await PublicPost(
          apiEndpoints.auth.changeForgotPassword,
          params
        );
        // console.log("resp:::", resp);
        setRespMsg(resp);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };
  //
  const requestForNewOtp = async (event) => {
    setLoading(true);
    try {
      const resp = await PublicGet(apiEndpoints.auth.requestOtp);
      // console.log("resp:::", resp);
      setRespMsg(resp);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };
  //
  return (
    <div className="container-fluid">
      <div className="row no-gutter">
        <div className="col-md-6 d-none d-md-flex bg-image"></div>
        <div className="col-md-6 bg-light">
          <div className="login d-flex align-items-center py-5">
            <div className="auth-inner">
              {otpSuccess ? (
                <form onSubmit={handleChangePasswordSubmit}>
                  <h3>Create New Password</h3>
                  <ErrorAlert
                    msg={!respMsg?.success ? respMsg?.error : ""}
                    hideMsg={() => setRespMsg({})}
                  />
                  <SuccessAlert
                    msg={respMsg?.success ? respMsg?.message : ""}
                    hideMsg={() => setRespMsg({})}
                  />
                  <div className="mb-3">
                    {errors.password && (
                      <p
                        style={{ fontSize: 16, color: "red", marginBottom: 2 }}
                      >
                        *{errors.password}
                      </p>
                    )}
                    <PasswordInput
                      password={password}
                      showPass={showPass}
                      setPassword={setPassword}
                      setShowPass={setShowPass}
                      label={"Enter New Password"}
                    />
                  </div>
                  <div className="mb-3">
                    <label>Enter OTP</label>
                    {errors.otp && (
                      <p
                        style={{ fontSize: 16, color: "red", marginBottom: 2 }}
                      >
                        *{errors.otp}
                      </p>
                    )}
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter OTP "
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <div className="d-grid">
                    {isLoading ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled
                      >
                        <div
                          className="spinner-border spinner-border-sm"
                          role="status"
                        ></div>
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-primary">
                        Create New Password
                      </button>
                    )}
                  </div>
                  <p className="forgot-password text-right">
                    Need a new otp!
                    <button
                      type="button"
                      onClick={() => {
                        requestForNewOtp();
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: "blue",
                        cursor: "pointer",
                        paddingLeft: 2,
                      }}
                    >
                      Resend
                    </button>
                  </p>
                  <p className="forgot-password text-center">
                    Already have an account! <a href="/signin">Sign In</a>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSendOtpSubmit}>
                  <h3>Forgot Password</h3>
                  <ErrorAlert
                    msg={!respMsg?.success ? respMsg?.error : ""}
                    hideMsg={() => setRespMsg({})}
                  />
                  <div className="mb-3">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter Email"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-grid">
                    {isLoading ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled
                      >
                        <div
                          className="spinner-border spinner-border-sm"
                          role="status"
                        ></div>
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-primary">
                        Send Otp
                      </button>
                    )}
                  </div>
                  <p className="forgot-password text-center">
                    Already have an account! <a href="/signin">Sign In</a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
