/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState,useEffect } from "react";
import { Get, Post } from "../../api";
import { apiUrl } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
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
  const [days, setDays] = useState({});
  const [timeSlots, setTimeSlots] = useState({});
    //
    useEffect(() => {
      fetchTimeSlots();
    }, []);
    //
    const fetchTimeSlots = async () => {
      try {
        // setLoading(true);
        const formattedDate = new Date().toISOString();
        const resp = await Get(`${apiUrl()}/doctor/get-time-slots?date=${formattedDate}`);
        console.log("resp:::", JSON.stringify(resp));
        if (resp.success) {
          setTimeSlots(resp?.data);
        }
      } catch (err) {
        // setError(err?.message);
      } finally {
        // setLoading(false);
      }
    };
  //
  const handleDayChange = (event) => {
    try {
      const isChecked = event.target.checked;
      const day = event.target.value;
      console.log(isChecked);
      console.log(day);
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
      console.log("value:", value);
      console.log("name:", name);
      console.log("name:", day);
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
  
    console.log("slots", slots);
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
      console.log("timeSlotObj::", timeSlotObj);

      if (Object.entries(timeSlotObj).length) {
        const resp = await Post(
          `${apiUrl()}/doctor/create-time-slots`,
          {
            timeSlots: timeSlotObj,
          },
          "application/json"
        );
        console.log(resp);
        if (resp?.success) {
          setDays({});
        }
      }
    } catch (error) {
    } finally {
    }
  };
  //
  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create Time Slots</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
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
              <label className="form-check-label" htmlFor={day}>
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
                  <label className="form-label">Start Time:</label>
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
                  <label className="form-label">End Time:</label>
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
                  <label className="form-label">
                    Appointment Duration (minutes):
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
          Create Time Slots
        </button>
      </form>
      {
         Object.entries(timeSlots).length && 
         <TimeSlotsComponent timeSlotsData={timeSlots}/>
      }
    </div>
  );
};
const TimeSlotsComponent = ({ timeSlotsData }) => {
  return (
    <div className="container mt-5">
      {Object.entries(timeSlotsData).map(([day, slots]) => (
        <div key={day} className="mb-4">
          <h3>{day.charAt(0).toUpperCase() + day.slice(1)}</h3>
          <div className="row row-cols-2 row-cols-md-4 g-3">
            {Object.entries(slots).map(([time, slot]) => (
              <div key={time} className="col">
                <div className={`card ${slot.active ? 'bg-info' : 'bg-success'}`}>
                  {/* <button type="button" className="btn-close bg-danger" aria-label="Close" style={{ position: 'absolute', top: '15px', right: '10px' }} /> */}
                  <div className="card-body">
                    <h5 className="card-title">{slot.startTime}</h5>
                    <p className="card-text">Booked: {slot.active ? 'No' : 'Yes'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default AppointmentsTimetable;
