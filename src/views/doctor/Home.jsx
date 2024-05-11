/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { Get, Post } from "../../services";
import { apiUrl } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import { formatDateToString } from "../../utils";
import AppCalendar from "../../components/Calendar";
import AppointmentDetails from "../common/AppointmentDetails";
import PrescriptionCreateView from './PrescriptionCreate'
import PatientsMedicalRecord from '../common/PatientsMedicalRecord'

//
const Home = ({ doctorId }) => {
  const [timeSlots, setTimeSlots] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [selDate, setSelDate] = useState(new Date());
  const [selApt, setSelApt] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showCreatePresView, setShowCreatePresView] = useState(false);
  const [showPtRecordView, setShowPatientRecordView] = useState(false);

  //
  useEffect(() => {
    fetchTimeSlots();
  }, [selDate]);
  //
  const updateApt = (medicalRecord) =>{
    const updatedPt = { ...selApt.pt, medical_history: medicalRecord };
    setSelApt({ ...selApt, pt: updatedPt });
    fetchTimeSlots();
  }
  //
  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const formattedDate = new Date(selDate).toISOString();
      const resp = await Get(
        `${apiUrl()}/doctor/get-time-slots-by-date?date=${formattedDate}&skip_con=${true}`
      );
      //console.log("resp:::", resp?.data);
      if (resp.success) {
        setTimeSlots(resp?.data);
      }
    } catch (err) {
      // setError(err?.message);
    } finally {
      setLoading(false);
    }
  };
  if (isLoading) {
    return <LoadingView />;
  }
  //
  return (
    <>
      <div className="container-fluid">
        <div className="col-md-12">
          <div className="mb-3">
            <label>Select Date</label>
            <input
              type="text"
              className="form-control"
              value={formatDateToString(selDate) || "dd-mm-yyyy"}
              onFocus={() => {
                setShowCalendar(true);
              }}
              readOnly
            />
          </div>
          {showCalendar && (
            <AppCalendar
              onCloseModal={() => setShowCalendar(false)}
              value={selDate}
              onChange={(val) => {
                setSelDate(new Date(val));
                setShowCalendar(false);
              }}
            />
          )}
        </div>
        <div className="col-md-12">
          {!Object.entries(timeSlots).length && (
            <div className="container-fluid d-flex justify-content-center align-items-center">
              <img src={noData} className="no-data-img" alt="No data found" />
            </div>
          )}
          {Object.entries(timeSlots).length > 0 && (
            <TimeSlotsComponent
              timeSlotsData={timeSlots}
              setSelApt={(apt) => {
                setSelApt(apt);
                setShowDetails(true);
              }}
            />
          )}
        </div>
      </div>
      {showDetails && (
        <AppointmentDetails
          onCloseModal={() => {
            setShowDetails(false);
            setSelApt("");
          }}
          selApt={selApt}
          doctor={true}
          setShowCreatePresView={() => {
            setShowDetails(false);
            setShowCreatePresView(true);
          }}
        />
      )}
      {
        showCreatePresView && 
        <PrescriptionCreateView onCloseModal={()=> setShowCreatePresView(false)} apt={selApt}/>
      }
      {showPtRecordView && (
        <PatientsMedicalRecord
          onCloseModal={() => setShowPatientRecordView(false)}
          apt={selApt}
          updateApt={updateApt}
        />
      )}
    </>
  );
};
//
const TimeSlotsComponent = ({ timeSlotsData,setSelApt }) => {
  return (
    <>
      {Object.entries(timeSlotsData).map(([day, slots]) => (
        <div key={day} className="mb-4">
          <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
          <div className="row row-cols-2 row-cols-md-4 g-3">
            {Object.entries(slots).map(([time, slot]) => (
              <div
                key={time}
                className="col"
                onClick={() => slot?.apt ? setSelApt(slot?.apt) : {} }
              >
                <div
                  className={`card `}
                  style={{
                    // backgroundColor: slot.active ? "#213555" : "#17594A",
                    backgroundColor: (slot?.apt && !slot.active) ? "#007400" : !slot.active ? "#BF3131" : "#0B2447",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* <button type="button" className="btn-close bg-danger" aria-label="Close" style={{ position: 'absolute', top: '15px', right: '10px' }} /> */}
                  <div className="card-body">
                    <h5 className="card-title" style={{ color: "#fff" }}>
                      {slot.startTime}
                    </h5>
                    {slot?.apt?.pt && (
                      <h5
                        className="card-title"
                        style={{
                          fontSize: "0.8em",
                          color: "#fff",
                          fontWeight: "normal",
                        }}
                      >
                        {[slot?.apt?.pt.f_name, slot?.apt?.pt.l_name].join(" ")}
                      </h5>
                    )}
                    {slot?.apt?.pt && (
                      <h5
                        className="card-title"
                        style={{
                          fontSize: "0.8em",
                          color: "#fff",
                          fontWeight: "normal",
                        }}
                      >
                        {"Nhs:" + slot?.apt?.pt.nhs}
                      </h5>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};
//
export default Home;
