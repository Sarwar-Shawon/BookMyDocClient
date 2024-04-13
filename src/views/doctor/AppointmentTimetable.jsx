/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { Get, Post } from "../../api";
import { apiUrl } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import TimetableAdd from "./TimeTableAdd";
import TimetableUpdate from "./TimeTableUpdate";
import DoctorHolidayView from "../common/DoctorHolidayView";
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
const AppointmentsTimetable = ({ doctorId }) => {
  const [timeSlots, setTimeSlots] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);

  //
  useEffect(() => {
    fetchTimeSlots();
  }, []);
  //
  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const formattedDate = new Date().toISOString();
      const resp = await Get(
        `${apiUrl()}/doctor/get-time-slots?date=${formattedDate}`
      );
      console.log("resp:::", JSON.stringify(resp));
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
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
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
            <TimeSlotsComponent timeSlotsData={timeSlots} />
          )}
        </div>
      </div>
      {showNew && (
        <TimetableAdd
          onCloseModal={() => {
            setShowNew(false);
          }}
          title={"Add New TimeTable"}
          setTimeSlots={(val) => setTimeSlots(val)}
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
        />
      )}
    </>
  );
};
const TimeSlotsComponent = ({ timeSlotsData }) => {
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
                    backgroundColor: slot.active ? "#1874C3" : "#404B69",
                  }}
                >
                  {/* <button type="button" className="btn-close bg-danger" aria-label="Close" style={{ position: 'absolute', top: '15px', right: '10px' }} /> */}
                  <div className="card-body">
                    <h5 className="card-title">{slot.startTime}</h5>
                    {/* <p className="card-text">
                      Booked: {slot.active ? "No" : "Yes"}
                    </p> */}
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
export default AppointmentsTimetable;
