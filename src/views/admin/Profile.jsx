/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { Put } from "../../api";
import { apiUrl } from "../../config/appConfig";
import { PasswordInput } from "../../components/Password";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";

const Profile = () => {
  const [name, setName] = useState("John Doe"); // Example name
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResp, setShowResp] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  //
  // useEffect(() => {
  //   fetchProfile();
  // }, []);
  //  //
  //  const fetchProfile = async () => {
  //   try {
  //     setLoading(true);
  //     const resp = await Get(`${apiUrl()}/admin/get-profile`);
  //     console.log("resp:::", resp);
  //     if (resp.success) {
  //     }
  //   } catch (err) {
  //     // console.error('err:', err);
  //     setError(err?.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  //
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
          `${apiUrl()}/auth/changePassword`,
          params,
          "application/json"
        );
        console.log("resp:::", resp);
        if (resp.success) {
          setShowResp({ success: true, msg: "successful" });
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
    <div className="container">
      <h2 className="mt-4">Profile</h2>
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
  );
};

export default Profile;
