/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { Get } from "../../api";
import { apiUrl } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
//
const DoctorProfile = () => {

  const [profile, setProfile] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(true);
  //
  useEffect(() => {
    fetchProfile();
  }, []);
  //
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const resp = await Get(`${apiUrl()}/doctor/get-profile`);
      console.log("resp:::", resp);
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
  const updateProfile = async ({ updProfile }) => {
    try {
      setProfile(updProfile);
    } catch (err) {
      //
    }
  };
  if (isLoading) {
    return <LoadingView />;
  }
  return (
    <div className="container-fluid">
      <div>Doctor Profile</div>
    </div>
  );
};

export default DoctorProfile;
