/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import Modal from "../../components/Modal";
import { formatDateToString } from "../../utils";
import { Post, Get } from "../../api";
import { apiUrl } from "../../config/appConfig";
import AppCalendar from "../../components/Calendar";
import noData from "../../assets/images/no-data.jpg";
import LoadingView from "../../components/Loading";
import moment from "moment";

const CreateAppointmentView = ({ onCloseModal, doctor }) => {
  //
  const [errors, setError] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const [formData, setFormData] = useState({
    apt_date: new Date(),
    timeslot: "",
  });
  const [showResp, setShowResp] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  //
  //
  useEffect(() => {
    console.log("assasa");
    fetchTimeSlots();
  }, [formData.apt_date]);
  //
  const fetchTimeSlots = async () => {
    try {
      setIsLoading(true);
      const resp = await Get(
        `${apiUrl()}/patient/get-time-slots?date=${
          formData.apt_date
        }&doc_email=${doctor.doc_email}`
      );
      console.log("resp:::", JSON.stringify(resp));
      if (resp.success) {
        setTimeSlots(resp?.data);
      }
    } catch (err) {
      // setError(err?.message);
    } finally {
      setIsLoading(false);
    }
  };
  //
  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      if (validateForm()) {
        await createAppointment();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  //
  const validateForm = () => {
    let isValid = true;
    const errorsObj = {};

    if (!formData.apt_date) {
      errorsObj.date = "Please select a date";
      isValid = false;
    }
    if (!formData.timeslot) {
      errorsObj.slot = "Please select a time slot";
      isValid = false;
    }
    setError(errorsObj);
    return isValid;
  };
  //
  const createAppointment = async () => {
    try {
      const params = {
        doc_id: doctor._id,
        apt_date: moment(formData.apt_date),
        dept: doctor.dept._id,
        org: doctor.organization._id,
        timeslot: formData.timeslot,
      };
      console.log("params", params)
      const resp = await Post(
        `${apiUrl()}/patient/create-appointment`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
      const respObj = {};
      if (resp.success) {
        respObj.success = true;
        respObj.msg = resp?.message;
        setShowResp(respObj);
      } else {
        respObj.success = false;
        respObj.msg = resp?.error;
        setShowResp(respObj);
      }
    } catch (err) {
    } finally {
    }
  };
  //
  return (
    <Modal
      title={"Create New Appointment"}
      body={
        <div>
          <form onSubmit={handleSubmit} className="row">
            <ErrorAlert
              msg={!showResp?.success ? showResp?.msg : ""}
              hideMsg={() => setShowResp({})}
            />
            <SuccessAlert
              msg={showResp?.success ? showResp?.msg : ""}
              hideMsg={() => setShowResp({})}
            />
            <div className="col-md-12">
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
              <div className="mb-3">
                <label>Select Slots</label>
                {errors.slot && (
                  <p style={{ fontSize: 16, color: "red", marginBottom: 2 }}>
                    *{errors.slot}
                  </p>
                )}
                {Object.entries(timeSlots).length > 0 ? (
                  <TimeSlotsComponent
                    timeSlotsData={timeSlots}
                    setTimeSlot={(val) => {
                      setFormData({
                        ...formData,
                        ["timeslot"]: val,
                      });
                    }}
                    val={formData.timeslot}
                  />
                ) : (
                  <div className="container-fluid d-flex justify-content-center align-items-center">
                    <img
                      src={noData}
                      className="no-data-img"
                      alt="No data found"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="col-12">
              <div className="d-grid">
                {isLoading ? (
                  <button className="btn btn-primary" disabled>
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      {/* <span className="visually-hidden">Loading...</span> */}
                    </div>
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    {"Create Appointment"}
                  </button>
                )}
              </div>
            </div>
          </form>
          {showCalendar && (
            <AppCalendar
              onCloseModal={() => setShowCalendar(false)}
              value={formData.apt_date}
              onChange={(val) => {
                console.log("val:", val)
                setFormData({
                  ...formData,
                  ["apt_date"]: new Date(val),
                });
                setShowCalendar(false);
              }}
              minDate={new Date()}
            />
          )}
        </div>
      }
      onCloseModal={onCloseModal}
      big={true}
    />
  );
};
//
const TimeSlotsComponent = ({ timeSlotsData, setTimeSlot, val }) => {
  return (
    <div className="mb-4">
      <div className="row row-cols-2 row-cols-md-4 g-3">
        {Object.entries(timeSlotsData).map(
          ([time, slot]) =>
            slot.active && (
              <div
                key={time}
                className="col"
                onClick={() => {
                  setTimeSlot(time);
                }}
              >
                <div
                  className={`card ${slot.active ? "active" : ""}`}
                  style={{
                    backgroundColor: val == time ? "#5C8374" : "#818FB4",
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
export default CreateAppointmentView;
