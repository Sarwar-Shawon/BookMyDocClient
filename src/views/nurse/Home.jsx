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
import { formatDateToString } from "../../utils";
import AppCalendar from "../../components/Calendar";
import AppointmentDetails from "../common/AppointmentDetails";
//
const NurseHome = () => {
  const [selDoc, setSelDoctor] = useState("")
  const [timeSlots, setTimeSlots] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [selDate, setSelDate] = useState(new Date());
  const [selApt, setSelApt] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  //
  useEffect(() => {
    if(selDoc){
      fetchTimeSlots();
    }
  }, [selDate , selDoc]);
  //
  const fetchTimeSlots = async () => {
    try {
        setLoading(true)
        const formattedDate = new Date(selDate).toISOString();
        const resp = await Get(
          `${apiUrl()}/nurse/get-time-slots-by-date?date=${formattedDate}&skip_con=${true}&doc_id=${selDoc}`
        );
        console.log("resp:::", resp?.data);
        if (resp.success) {
          setTimeSlots(resp?.data);
        }
  
    } catch (err) {
      // setError(err?.message);
    } finally {
      setLoading(false);
    }
  };
  //
  //
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <DoctorSelection selDoc={selDoc} setSelDoctor={setSelDoctor} />
        </div>
        <div>
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
      </div>
      <div className="doctor-list d-flex flex-wrap">
        {isLoading && <LoadingView />}
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
          apt={selApt}
        />
      )}
    </div>
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
                onClick={() => {
                  setSelApt(slot?.apt)
                }}
              >
                <div
                  className={`card `}
                  style={{
                    // backgroundColor: slot.active ? "#213555" : "#17594A",
                    backgroundColor: slot.active ? "#0B2447" : "#007400",
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
export default NurseHome;
