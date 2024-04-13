/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { Get } from "../../api";
import { apiUrl } from "../../config/appConfig";
import noData from "../../assets/images/no-data.jpg";
import LoadingView from "../../components/Loading";
import { formatDateToString } from "../../utils";
import AppCalendar from "../../components/Calendar";
import moment from "moment";

//
const TimeSlotView = ({
  timeSlots,
  formData,
  setFormData,
  apt,
  errors,
  user_type,
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  //
  return (
    <div className="col-md-12">
      {/* select date */}
      <div className="mb-3">
        <label>Select Date</label>
        {errors.date && (
          <p style={{ fontSize: 16, color: "red", marginBottom: 2 }}>
            *{errors.date}
          </p>
        )}
        <label
          className="form-control"
          style={{
            border: "1px solid #ced4da",
            borderRadius: "0.25rem",
            padding: "0.375rem 0.75rem",
            lineHeight: "1.5",
          }}
          onClick={() => setShowCalendar(true)}
        >
          {formatDateToString(formData.apt_date) || "dd-mm-yyyy"}
        </label>
      </div>
      {/* select slots */}
      <div className="mb-3">
        <label>Select Slots</label>
        {errors.slot && (
          <p style={{ fontSize: 16, color: "red", marginBottom: 2 }}>
            *{errors.slot}
          </p>
        )}
        {Object.entries(timeSlots).length > 0 ? (
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body time-table-list">
                  <TimeSlotsComponent
                    timeSlotsData={timeSlots}
                    setTimeSlot={(val) => {
                      setFormData((prevFormData) => {
                        const newTimeslot =
                          prevFormData.timeslot === val ? "" : val;
                        return {
                          ...prevFormData,
                          timeslot: newTimeslot,
                        };
                      });
                    }}
                    aptId={apt?._id}
                    aptTimeslot={apt?.timeslot}
                    val={formData.timeslot}
                    user_type={user_type}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container-fluid d-flex justify-content-center align-items-center">
            <img src={noData} className="no-data-img" alt="No data found" />
          </div>
        )}
      </div>
      {showCalendar && (
        <AppCalendar
          onCloseModal={() => setShowCalendar(false)}
          value={formData.apt_date}
          onChange={(val) => {
            if (apt?.apt_date) {
              const date1 = new Date(new Date(val).setHours(0, 0, 0, 0));
              const date2 = new Date(
                new Date(apt?.apt_date).setHours(0, 0, 0, 0)
              );
              setFormData({
                ...formData,
                apt_date: new Date(val),
                timeslot:
                  date1.getTime() === date2.getTime() ? apt.timeslot : "",
              });
            } else {
              setFormData({
                ...formData,
                apt_date: new Date(val),
                timeslot: "",
              });
            }
            setShowCalendar(false);
          }}
          minDate={new Date()}
        />
      )}
    </div>
  );
};
//
const TimeSlotsComponent = ({
  timeSlotsData,
  setTimeSlot,
  val,
  aptId,
  user_type,
  aptTimeslot,
}) => {
  return (
    <div className="mb-4">
      <div className="row row-cols-2 row-cols-md-4 g-3">
        {Object.entries(timeSlotsData).map(
          ([time, slot]) =>
            ((user_type === "doctor" && slot?.aptId && slot?.aptId == aptId) ||
              (user_type === "patient" && aptId && time == aptTimeslot) ||
              slot.active) && (
              <div
                key={time}
                className="col"
                onClick={() => {
                  setTimeSlot(time);
                }}
              >
                <div
                  className={`card justify-content-center align-items-center ${slot.active ? "active" : ""}`}
                  style={{
                    backgroundColor: val == time ? "#4FB783" : "#404B69",
                    color: '#ffffff'
                  }}
                >
                  <div className="card-body">
                    <h5 className="card-title">{time}</h5>
                  </div>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};
//
export default TimeSlotView;
