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
import DoctorSelection from './DoctorSelection'
//
const NurseHome = () => {
  const [selDoc, setSelDoctor] = useState("")
  //
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
        <DoctorSelection selDoc={selDoc} setSelDoctor={setSelDoctor}/>
        </div>
      </div>
      <div className="doctor-list d-flex flex-wrap">
              
      </div>
    </div>
  );
};

export default NurseHome;
