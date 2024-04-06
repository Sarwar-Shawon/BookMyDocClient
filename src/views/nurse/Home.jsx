/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { FaPlusSquare, FaSearch } from "react-icons/fa";
import { Get } from "../../api";
import { apiUrl } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import doctorDummy from "../../assets/images/doctor-dummy.jpg";
import noData from "../../assets/images/no-data.jpg";
const NurseHome = () => {

  return (
    <div className="container-fluid">
      <div>Doctor Home</div>
    </div>
  );
};

export default NurseHome;
