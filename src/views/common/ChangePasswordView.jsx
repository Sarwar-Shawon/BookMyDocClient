/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { Put } from "../../services";
import apiEndpoints from "../../config/apiEndpoints";
import { PasswordInput } from "../../components/Password";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import Modal from "../../components/Modal";
//
const ChnagePasswordView = ({ onCloseModal }) => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResp, setShowResp] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      if (password && newPassword) {
        const params = {
          old_password: password,
          new_password: newPassword,
        };
        const resp = await Put(
          apiEndpoints.auth.changePassword,
          params,
          "application/json"
        );
        //console.log("resp:::", resp);
        if (resp.success) {
          setShowResp({ success: true, msg: "You have successfully changed the password." });
        } else {
          setShowResp({ success: false, msg: resp?.error });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  //
  return (
    <Modal
      title={"Change Password"}
      body={
        <div className="container">
         
          <ErrorAlert
            msg={!showResp?.success ? showResp?.msg : ""}
            hideMsg={() => setShowResp({})}
          />
          <SuccessAlert
            msg={showResp?.success ? showResp?.msg : ""}
            hideMsg={() => setShowResp({})}
          />
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <PasswordInput
                password={password}
                showPass={showPass}
                setPassword={setPassword}
                setShowPass={setShowPass}
                label={"Old Password:"}
                required={true}
                onFocusDisable={true}
                onBlurDisable={true}
              />
            </div>
            <div className="mb-3">
              <PasswordInput
                password={newPassword}
                showPass={showNewPass}
                setPassword={setNewPassword}
                setShowPass={setShowNewPass}
                label={"New Password:"}
                required={true}
              />
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
                    Change Password
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      }
      onCloseModal={onCloseModal}
      big={true}
    />
  );
};
//
export default ChnagePasswordView;
