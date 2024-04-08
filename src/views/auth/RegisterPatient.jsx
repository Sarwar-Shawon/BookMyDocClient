/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/login.css";
import { FaMale, FaFemale, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { PasswordInput } from "../../components/Password";
import AppCalendar from "../../components/Calendar";
import moment from "moment";
import { formatDateToString, setItem, Regex } from "../../utils";
import { PublicPost } from "../../api";
import { apiUrl } from "../../config/appConfig";

//
const SignUp = () => {
  //
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState();
  const [gender, setGender] = useState("male");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nhsId, setNhsId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const minDate = moment().subtract(18, "years").format("DD-MM-YYYY");

  //
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const [showCalendar, setShowCalendar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/signin";

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true)
      if (validateForm()) {
        const params = {
          username,
          password,
          gender,
          firstName,
          lastName,
          nhsId,
          dob,
        };
        const resp = await PublicPost(`${apiUrl()}/auth/register`, params);
        console.log("resp:::", resp);
        if (resp.success) {
          // const { data } = resp;
          // setItem("usr", {
          //   email: data.email,
          // });
          navigate("/verification" , { state: { showOtpMsg: true } });
        } else {
          //handle err
        }
      }
      // navigate("/about");
    } catch {
      
    }
    finally{
      setIsLoading(false)
    }
  };
  //validate signup form
  const validateForm = () => {
    let isValid = true;
    //
    const errorsObj = {};
    // Validate email
    if (!username) {
      errorsObj.email = "Email is required";
      isValid = false;
    }
    if (username && !Regex.emailRegex.test(username)) {
      errorsObj.email = "Please insert a valid email address";
      isValid = false;
    }
    // Validate password
    if (!password) {
      errorsObj.password = "Password is required";
      isValid = false;
    }
    if (password && !Regex.passwordRegex.test(password)) {
      errorsObj.password = "Password is not matced the requirements";
      isValid = false;
    }
    if (!firstName) {
      errorsObj.firstName = "First Name is required";
      isValid = false;
    }
    if (!gender) {
      errorsObj.gender = "Gender is required";
      isValid = false;
    }
    if (!nhsId) {
      errorsObj.nhsId = "Nhs Id is required";
      isValid = false;
    }
    console.log("dob", dob);
    if (!dob) {
      errorsObj.dob = "Date Of Birth is required";
      isValid = false;
    }
    setErrors(errorsObj);
    return isValid;
  };
  //
  const calculateMinDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    return maxDate;
  };
  //
  const isFormValid = Object.keys(errors).length === 0;
  //
  return (
    <div className="container-fluid">
      <div className="row no-gutter">
        <div className="col-md-6 d-none d-md-flex bg-image"></div>
        <div className="col-md-6 bg-light">
          <div className="login d-flex align-items-center py-5">
            <div className="auth-inner">
              <form onSubmit={handleSubmit} disabled={!isFormValid}>
                <h3>Create Patient Account</h3>
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
                    required
                  />
                </div>
                <div className="mb-2">
                  {errors.password && (
                    <p style={{ fontSize: 16, color: "red", marginBottom: 2 }}>
                      *{errors.password}
                    </p>
                  )}
                  
                  <PasswordInput
                    password={password}
                    showPass={showPass}
                    setPassword={setPassword}
                    setShowPass={setShowPass}
                    label={"Password"}
                  />
                </div>

                <div className="mb-2">
                  <label>First Name</label>
                  {errors.firstName && (
                    <p style={{ fontSize: 16, color: "red", marginBottom: 2 }}>
                      *{errors.firstName}
                    </p>
                  )}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value.replace(/[^a-zA-Z]/g, ""));
                    }}
                  />
                </div>
                <div className="mb-2">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value.replace(/[^a-zA-Z]/g, ""))}
                  />
                </div>
                <div className="mb-2">
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
                          value={gender}
                          checked={true}
                          onChange={() => setGender("male")}
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
                          value={gender}
                          onChange={() => setGender("male")}
                        />
                        <span style={{ marginLeft: "4px" }}>Female</span>
                        <FaFemale style={{ fontSize: "16px" }} />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <label>NHS Id</label>
                  {errors.nhsId && (
                    <p style={{ fontSize: 16, color: "red", marginBottom: 2 }}>
                      *{errors.nhsId}
                    </p>
                  )}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter NHS Id"
                    value={nhsId}
                    onChange={(e) => setNhsId(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label>Date Of Birth</label>
                  {errors.dob && (
                    <p style={{ fontSize: 16, color: "red", marginBottom: 2 }}>
                      *{errors.dob}
                    </p>
                  )}
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
                    {formatDateToString(dob) || "dd-mm-yyyy"}
                  </label>
                </div>
                {/* <div className="mb-2">
                  <label>Address</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Last Name"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div> */}
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
                      Create Account
                    </button>
                  )}
                </div>
                <p className="forgot-password text-center">
                  Already have an account! <a href="/signin">Sign In</a>
                </p>
              </form>
              {showCalendar && (
                <AppCalendar
                  onCloseModal={() => setShowCalendar(false)}
                  value={dob}
                  onChange={(val) => setDob(val)}
                  maxDate={calculateMinDate()}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
//
export default SignUp;
