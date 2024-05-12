/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import {Post } from "../../services";
import apiEndpoints from "../../config/apiEndpoints";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import Modal from "../../components/Modal";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";

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
const TimetableUpdate = ({ onCloseModal, title, timeSlots, setTimeSlots,selDoc }) => {
  const initialDaysState = {};
  const [showResp, setShowResp] = useState({});
  const [days, setDays] = useState(initialDaysState);
  //
  useEffect(() => {
    let intObj = {};
    if (Object.entries(timeSlots).length) {
      Object.entries(timeSlots).map(([day, slots]) => {
        const timeSlot = Object.entries(slots);
        //console.log("slots", slots);
        const startTimeObj = new Date(`01/01/2024 ${timeSlot[0][0]}`);
        const nextTimeObj = new Date(`01/01/2024 ${timeSlot[1][0]}`);
        const durationInMinutes = (nextTimeObj - startTimeObj) / (1000 * 60);
        const mint = durationInMinutes % 60;
        const lastSlot = timeSlot[timeSlot.length - 1][0];
        const [hours, minutes] = lastSlot.split(":");
        const end_time = `${String(
          (parseInt(hours) + Math.floor((parseInt(minutes) + mint) / 60)) % 24
        ).padStart(2, "0")}:${String((parseInt(minutes) + mint) % 60).padStart(
          2,
          "0"
        )}`;
        intObj[day] = {
          startTime: timeSlot[0][0],
          endTime: end_time,
          duration: mint,
        };
      });
      //console.log("intObj::", intObj);
      setDays(intObj);
    }
  }, []);
  //
  const handleDayChange = (event) => {
    try {
      const isChecked = event.target.checked;
      const day = event.target.value;
      //console.log(isChecked);
      //console.log(day);
      //
      if (isChecked) {
        setDays({
          ...days,
          [day]: { startTime: "", endTime: "", duration: 15 },
        });
      } else {
        const updatedDays = { ...days };
        delete updatedDays[day];
        setDays(updatedDays);
      }
    } catch (err) {}
  };

  const handleTimeChange = (event, day) => {
    try {
      const value = event.target.value;
      const name = event.target.name;
      //console.log("value:", value);
      //console.log("name:", name);
      //console.log("name:", day);
      // if (name == "duration") value = parseInt(value);
      setDays({
        ...days,
        [day]: {
          ...days[day],
          [name]: value,
        },
      });
    } catch (err) {}
  };
  //create timeslots by duraion form start time to end time
  const createIntervalSlots = (startTime, endTime, duration) => {
    const slots = {};
    const startTimeObj = new Date(`01/01/2024 ${startTime}`);
    const endTimeObj = new Date(`01/01/2024 ${endTime}`);
    let currentSlot = new Date(startTimeObj);

    while (currentSlot < endTimeObj) {
      const formattedSlot = currentSlot.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      slots[formattedSlot] = {
        startTime: formattedSlot,
        active: true,
      };

      currentSlot.setMinutes(currentSlot.getMinutes() + parseInt(duration));
    }

    //console.log("slots", slots);
    return slots;
  };
  //
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formattedSlots = Object.entries(days).map(([day, obj]) => ({
        day,
        startTime: obj.startTime,
        endTime: obj.endTime,
        duration: obj.duration,
      }));
      //
      let timeSlotObj = {};
      //
      formattedSlots.map((slot) => {
        timeSlotObj[slot.day.toLowerCase()] = createIntervalSlots(
          slot.startTime,
          slot.endTime,
          slot.duration
        );
      });
      //console.log("timeSlotObj::", timeSlotObj);

      if (Object.entries(timeSlotObj).length) {
        const resp = await Post(
          `${apiEndpoints.nurse.updateTimeSlots}?doc_id=${selDoc}`,
          {
            timeSlots: timeSlotObj,
          },
          "application/json"
        );
        //console.log(resp);
        let respObj = {};

        if (resp?.success) {
          setTimeSlots(timeSlotObj);
          respObj.success = true;
          respObj.msg = resp?.message;
          setShowResp(respObj);
        } else {
          respObj.success = false;
          respObj.msg = resp?.error;
          setShowResp(respObj);
        }
      }
    } catch (error) {
    } finally {
    }
  };
  //console.log("showRespshowRespshowResp::",showResp)
  //
  return (
    <Modal
      title={title}
      body={
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
          <ErrorAlert
            msg={!showResp?.success ? showResp?.msg : ""}
            hideMsg={() => setShowResp({})}
          />
          <SuccessAlert
            msg={showResp?.success ? showResp?.msg : ""}
            hideMsg={() => setShowResp({})}
          />
            <legend className="fw-bold">Select Available Days:</legend>
            {Object.keys(_days).map((day) => (
              <div className="form-check form-check-inline" key={day}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={day}
                  value={day}
                  checked={days[day]}
                  onChange={handleDayChange}
                />
                <label
                  className="form-check-label"
                  htmlFor={day}
                  style={{ color: "#083AA9" }}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </label>
              </div>
            ))}
            {/* Repeat for other days */}
          </div>
          {Object.entries(days).map(([day, obj]) => (
            <div className="mb-3" key={day}>
              <legend className="fw-bold">
                {day.charAt(0).toUpperCase() + day.slice(1)}:
              </legend>
              <div className="row">
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label" style={{ color: "#219F94" }}>
                      Start Time:
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      value={obj.startTime}
                      onChange={(e) => handleTimeChange(e, day)}
                      name="startTime"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label" style={{ color: "#EB6440" }}>
                      End Time:
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      value={obj.endTime}
                      onChange={(e) => handleTimeChange(e, day)}
                      name="endTime"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label className="form-label" style={{ color: "#5D8BF4" }}>
                      Appointment Duration:
                    </label>
                    <select
                      className="form-select"
                      value={obj.duration}
                      name="duration"
                      onChange={(e) => handleTimeChange(e, day)}
                    >
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button type="submit" className="btn btn-primary">
            Update Time Slots
          </button>
        </form>
      }
      onCloseModal={onCloseModal}
      big={true}
    />
  );
};
//
export default TimetableUpdate;
