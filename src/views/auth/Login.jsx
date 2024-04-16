/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/login.css";
import { useAuthContext } from "../../context";
import { Regex } from "../../utils";
import {ErrorAlert} from "../../components/Alert"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

//
const Login = () => {
  //
  const { signIn, authError } = useAuthContext();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [showAuthError, setShowAuthError] = useState("");
  const [showPass, setShowPass] = useState(false);

  //
  //
  useEffect(() => {
    setShowAuthError(authError);
  }, [authError]);
  //
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (validateForm()) {
        setLoading(true);
        await signIn({ username, password });
        setLoading(false);
      }
    } catch {
      setErrors("Invalid username or password");
    }
  };
  //validate login form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    // Validate email
    if (!username) {
      newErrors.email = "Email is required";
      isValid = false;
    }
    if (username && !Regex.emailRegex.test(username)) {
      newErrors.email = "Please insert a valid email address";
      isValid = false;
    }
    // Validate password
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  //
  return (
    <div className="container-fluid">
      <div className="row no-gutter">
        <div className="col-md-6 d-none d-md-flex bg-image"></div>
        <div className="col-md-6 bg-light">
          <div className="login d-flex align-items-center py-5">
            <div className="auth-inner">
              <form onSubmit={handleSubmit}>
                <h3>Sign In</h3>
                <ErrorAlert
                  msg={showAuthError}
                  hideMsg={() => setShowAuthError("")}
                />
                <div className="mb-2">
                  <label>Email address</label>
                  {errors.email && (
                    <p style={{ fontSize: 16, color: "red", marginBottom: 2 }}>
                      *{errors.email}
                    </p>
                  )}
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label>Password</label>
                  {errors.password && (
                    <p style={{ fontSize: 16, color: "red", marginBottom: 2 }}>
                      *{errors.password}
                    </p>
                  )}
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPass ? "text" : "password"}
                      className="form-control"
                      value={password}
                      placeholder={"Enter password"}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: "20%",
                        right: "15px",
                      }}
                      onClick={() => {
                        setShowPass(!showPass);
                      }}
                    >
                      {showPass ? (
                        <FaRegEyeSlash style={{ fontSize: "24px" }} />
                      ) : (
                        <FaRegEye style={{ fontSize: "24px" }} />
                      )}
                    </span>
                  </div>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    SignIn
                  </button>
                </div>
                {/* <p className="forgot-password text-right">
                  <a href="#">Forgot password?</a>
                </p> */}
                <p className="forgot-password text-center">
                  Don't have an account! <a href="/signup">Sign Up</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
