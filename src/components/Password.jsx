/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState } from "react";
// import "../css/login.css";
import { FaRegEye, FaRegEyeSlash, FaCheck } from "react-icons/fa";
import { Regex } from "../utils"
//
const PasswordInput = (props) => {
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);
  return (
    <>
      <div style={{ position: "relative" }}>
        <label>{props.label || "Password"}</label>
        <input
          type={props.showPass ? "text" : "password"}
          className="form-control"
          placeholder={props.placeholder || "Enter password"}
          onChange={(e) => props.setPassword(e.target.value)}
          onFocus={props.onFocusDisable ? null : onFocus}
          onBlur={props.onBlurDisable ? null :onBlur}
          required
        />
        <span
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
          }}
          onClick={() => {
            props.setShowPass(!props.showPass);
          }}
        >
          {props.showPass ? (
            <FaRegEyeSlash style={{ fontSize: "24px" }} />
          ) : (
            <FaRegEye style={{ fontSize: "24px" }} />
          )}
        </span>
      </div>
      {focused && (
        <div style={{ paddingLeft: 10 }}>
          <label
            style={{
              color: Regex.uppercaseRegex.test(props.password)
                ? "#29753c"
                : "#888c89",
            }}
          >
            <FaCheck style={{ fontSize: "16px", paddingRight: 4 }} />
            Password has a capital letter
          </label>
          <label
            style={{
              color: Regex.specialCharacterRegex.test(props.password)
                ? "#29753c"
                : "#888c89",
            }}
          >
            <FaCheck style={{ fontSize: "16px", paddingRight: 4 }} />
            Password has special characters
          </label>
          <label
            style={{
              color: Regex.numericRegex.test(props.password) ? "#29753c" : "#888c89",
            }}
          >
            <FaCheck style={{ fontSize: "16px", paddingRight: 4 }} />
            Password has a number
          </label>
          <label
            style={{
              color: props.password.length >= 8 ? "#29753c" : "#888c89",
            }}
          >
            <FaCheck style={{ fontSize: "16px", paddingRight: 4 }} />
            Password has atleast 8 characters
          </label>
        </div>
      )}
    </>
  );
};
//
export { PasswordInput };
