/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import Modal from "../../components/Modal";
import { Post, Get } from "../../api";
import { apiUrl } from "../../config/appConfig";
import moment from "moment";
import TimeSlotView from '../common/TimeSlotView'
//
const CreateAppointmentView = ({ onCloseModal, doctor ,selDate}) => {
  //
  const [errors, setError] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const [showResp, setShowResp] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [formData, setFormData] = useState({
    apt_date: selDate ? new Date(selDate) : new Date(),
    timeslot: "",
  });
  //
  useEffect(() => {
    //console.log("assasa");
    fetchTimeSlots();
  }, [formData.apt_date]);
  //fetch TimeSlots
  const fetchTimeSlots = async () => {
    try {
      setIsLoading(true);
      const resp = await Get(
        `${apiUrl()}/patient/get-time-slots?date=${
          formData.apt_date
        }&doc_email=${doctor.doc_email}`
      );
      //console.log("resp:::", resp);
      if (resp.success) {
        setTimeSlots(resp?.data);
      }
    } catch (err) {
      // setError(err?.message);
    } finally {
      setIsLoading(false);
    }
  };
  //handle submit
  const handleSubmit = async (e) => {
    setIsBtnLoading(true);
    e.preventDefault();
    try {
      if (validateForm()) {
        await createAppointment();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsBtnLoading(false);
    }
  };
  //Validate Form
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
  //create appointment
  const createAppointment = async () => {
    try {
      const params = {
        doc_id: doctor._id,
        apt_date: moment(formData.apt_date),
        dept: doctor.dept._id,
        org: doctor.organization._id,
        timeslot: formData.timeslot,
      };
      //console.log("params", params)
      const resp = await Post(
        `${apiUrl()}/patient/create-appointment`,
        params,
        "application/json"
      );
      //console.log("resp:::", resp);
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
  //render
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
            {isLoading && (
              <div className="wrapper d-grid place-items: center">
                <div className="loading-container">
                  <div className="spinner"></div>
                </div>
              </div>
            )}
            <TimeSlotView
              timeSlots={timeSlots}
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
            <div className="col-12">
              <div className="d-grid">
                {isBtnLoading ? (
                  <button className="btn btn-primary" disabled>
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    ></div>
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    {"Create Appointment"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      }
      onCloseModal={onCloseModal}
      big={true}
    />
  );
};
//
export default CreateAppointmentView;
