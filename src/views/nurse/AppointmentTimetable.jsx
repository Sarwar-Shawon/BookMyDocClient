/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { Get, Post } from "../../services";
import apiEndpoints from "../../config/apiEndpoints";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import TimetableAdd from "./TimeTableAdd";
import TimetableUpdate from "./TimeTableUpdate";
import DoctorSelection from "./DoctorSelection";
//
const _days = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
};
//
const NurseAppointmentsTimetable = () => {
  const [selDoc, setSelDoctor] = useState("");
  //
  return (
    <div className="container">
      <DoctorSelection selDoc={selDoc} setSelDoctor={setSelDoctor} />
      <AppointmentsTimetable selDoc={selDoc}/>
    </div>
  );
};
//
const AppointmentsTimetable = ({selDoc}) => {
  const [timeSlots, setTimeSlots] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  //
  useEffect(() => {
    //console.log("selDocselDoc:::",selDoc)
    if(selDoc){
      setTimeSlots([]);
      fetchTimeSlots();
    }
  }, [selDoc]);
  //
  const UpdateActive = async () => {
    try {
      const resp = await Post(
        `${apiEndpoints.nurse.updateTimeSlots}?doc_id=${selDoc}`,
        {
          timeSlots: timeSlots,
        },
        "application/json"
      );
      //console.log(resp);
      if (resp?.success) {
        setTimeSlots(timeSlots);
      }
    } catch (error) {
    } finally {
    }
  };
  //
  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const formattedDate = new Date().toISOString();
      const resp = await Get(
        `${apiEndpoints.nurse.getTimeSlots}?date=${formattedDate}&doc_id=${selDoc}`
      );
      //console.log("resp:::111111", JSON.stringify(resp));
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
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{
              width: "200px",
              backgroundColor: "#0B2447",
              borderColor: "#0B2447",
              transition: "background-color 0.3s, border-color 0.3s",
            }}
            className="btn btn-primary"
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#1a4a8a";
              e.target.style.borderColor = "#1a4a8a";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#0B2447";
              e.target.style.borderColor = "#0B2447";
            }}
            onClick={() => {
              Object.entries(timeSlots).length > 0
                ? setShowUpdate(true)
                : setShowNew(true);
            }}
          >
            {Object.entries(timeSlots).length > 0
              ? "Update TimeTable"
              : "Add New TimeTable"}
          </button>
        </div>
        {!Object.entries(timeSlots).length && (
          <div className="container-fluid d-flex justify-content-center align-items-center">
            <img src={noData} className="no-data-img" alt="No data found" />
          </div>
        )}
        {Object.entries(timeSlots).length > 0 && (
          <TimeSlotsComponent timeSlotsData={timeSlots} UpdateActive={UpdateActive}/>
        )}
      </div>
      {showNew && (
        <TimetableAdd
          onCloseModal={() => {
            setShowNew(false);
          }}
          title={"Add New TimeTable"}
          setTimeSlots={(val) => setTimeSlots(val)}
          selDoc={selDoc}
        />
      )}
      {showUpdate && (
        <TimetableUpdate
          onCloseModal={() => {
            setShowUpdate(false);
          }}
          title={"Update TimeTable"}
          timeSlots={timeSlots}
          setTimeSlots={(val) => setTimeSlots(val)}
          selDoc={selDoc}

        />
      )}
    </>
  );
};
const TimeSlotsComponent = ({ timeSlotsData,UpdateActive }) => {
  const [active, setDt] = useState(new Date().getTime())
  const handleToggle = async (slot) => {
    slot.active = !slot.active
    await UpdateActive()
    setDt(new Date().getTime())
  };
  return (
    <>
      {Object.entries(timeSlotsData).map(([day, slots]) => (
        <div key={day} className="mb-4">
          <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
          <div className="row row-cols-2 row-cols-md-4 g-3">
            {Object.entries(slots).map(([time, slot]) => (
              <div key={time} className="col">
                <div
                  className={`card `}
                  style={{
                    backgroundColor: slot.active ? "#14274E" : "#BF3131",
                  }}
                >
                  {/* <button type="button" className="btn-close bg-danger" aria-label="Close" style={{ position: 'absolute', top: '15px', right: '10px' }} /> */}
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title" style={{color: '#fff'}}>{slot.startTime}</h5>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="switch"
                          checked={slot.active}
                          onChange={()=>handleToggle(slot)}
                        />
                      </div>
                    </div>
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
export default NurseAppointmentsTimetable;
