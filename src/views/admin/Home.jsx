/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import LoadingView from "../../components/Loading";
import { Get } from "../../services";
import apiEndpoints from "../../config/apiEndpoints";
import { useNavigate } from "react-router-dom";

const Home = () => {
  //
  const navigate = useNavigate();
  //
  const [dashboardData, setDashboardData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  //
  useEffect(() => {
    fetchDashboardData();
}, []);
//
const fetchDashboardData = async () => {
  try {
    const resp = await Get(apiEndpoints.admin.adminDashboard);
    // console.log("resp", resp)
    if (resp.success) {
      setDashboardData(resp?.data);
    }
  } catch (err) {
  } finally {
    setIsLoading(false);
  }
};
//
if (isLoading) {
  return <LoadingView />;
}
  //
  return (
    <div className="container-fluid" style={{ margin: 10 }}>
      <div className="row">
        <div className="doctor-list d-flex flex-wrap">
          <div className="department-card card mb-3 mx-2" onClick={() => navigate("/organizations")}>
            <div className="card-body">
              <h5 className="card-title">Organizations</h5>
              <p className="card-text">Count: {dashboardData?.organizations}</p>
            </div>
          </div>
          <div className="department-card card mb-3 mx-2" onClick={() => navigate("/departments")}>
            <div className="card-body">
              <h5 className="card-title">Departments</h5>
              <p className="card-text">Count: {dashboardData?.departments}</p>
            </div>
          </div>
          <div className="department-card card mb-3 mx-2" onClick={() => navigate("/doctors")}>
            <div className="card-body ">
              <h5 className="card-title">Doctors</h5>
              <p className="card-text">Count: {dashboardData?.doctors}</p>
            </div>
          </div>
          <div className="department-card card mb-3 mx-2" onClick={() => navigate("/nurses")}>
            <div className="card-body">
              <h5 className="card-title">Nurses</h5>
              <p className="card-text">Count: {dashboardData?.nurses}</p>
            </div>
          </div>
          <div className="department-card card mb-3 mx-2" onClick={() => navigate("/pharmacies")}>
            <div className="card-body">
              <h5 className="card-title">Pharmacies</h5>
              <p className="card-text">Count: {dashboardData?.pharmacies}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
