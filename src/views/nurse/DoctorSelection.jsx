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
const DoctorSelection = ({selDoc, setSelDoctor}) => {
  const [doctors, setDoctors] = useState([]);
//   const [selDoc, setSelDoctor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  //
  useEffect(() => {
    console.log('asd::: called')
    fetchDoctors();
  }, []);
  //get Attatched Doctors
  const fetchDoctors = async () => {
    try {
      setIsLoading(true);
      const resp = await Get(`${apiUrl()}/nurse/get-doctors`);
      console.log("resp::: doctors", resp);
      if (resp.success) {
        setSelDoctor(resp.data[0]?._id);
        setDoctors(resp.data);
      }
    } catch (err) {
      // console.error('err:', err);
    } finally {
      setIsLoading(false);
    }
  };
  console.log("selDoc", selDoc);
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="mb-3">
        <label className="form-label">Select Doctors:</label>
        <select
          className="form-select"
          name="selDoc"
          value={selDoc}
          onChange={(e) => setSelDoctor(e.target.value)}
          required
        >
          {/* <option value="">Select Doctor</option> */}
          <>
            {doctors.length > 0 &&
              doctors.map((doctor) => (
                <option value={doctor._id} key={doctor._id}>
                  {[doctor.f_name, doctor.l_name].join(" ")}
                </option>
              ))}
          </>
        </select>
      </div>
    </div>
  );
};

export default DoctorSelection;