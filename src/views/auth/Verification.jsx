/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/login.css";
import apiEndpoints from "../../config/apiEndpoints";
import { PublicPost, PublicGet } from "../../services";

//
const OtpPage = () => {
  //
  const location = useLocation();
  const { state } = location;
  const [otp, setOtp] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [msg, setMsg] = useState( state?.showOtpMsg ? "An Otp has sent to your email address." : "");
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      setMsg("");
    }, 5000);
    //
    return () => {
      clearTimeout(timer);
    };
  }, [msg]);
  //
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (validateForm()) {
        const params = {
          otp,
        };
        const resp = await PublicPost(
          apiEndpoints.auth.verifySignupOtp,
          params
        );
        //console.log("resp:::", resp);
        if (resp.success) {
          setSuccessMsg(resp?.message);
        } else {
          //handle err
        }
      }
    } catch {
      setErrors("Invalid username or password");
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
    setErrors(newErrors);
    return isValid;
  };
  //
  const requestForNewOtp = async (event) => {
    setLoading(true);
    try {
      const resp = await PublicGet(
        apiEndpoints.auth.requestOtp
      );
      //console.log("resp:::", resp);
      if (resp.success) {
        setMsg(resp?.message);
      } else {
        //handle err
        setMsg(resp?.error);
      }
    } catch {
      setErrors("Invalid username or password");
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
              {successMsg ? (
                <div>
                  <h3>Verification</h3>
                  <div className="alert alert-success" role="alert">
                    {successMsg}
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        navigate("/signin", { replace: true });
                      }}
                    >
                      Click here to login!
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3>Verification</h3>
                  {msg && (
                    <div className="alert alert-success" role="alert">
                      {msg}
                    </div>
                  )}
                  <div className="mb-3">
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
                      placeholder="Enter Otp"
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
                        >
                          {/* <span className="visually-hidden">Loading...</span> */}
                        </div>
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-primary">
                        Verify OTP
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
                  {/* <p className="forgot-password text-center">
                  Don't have an account! <a href="/signup">Sign Up</a>
                </p> */}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OtpPage;
