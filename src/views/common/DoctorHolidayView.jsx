/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { Get, Post } from "../../api";
import { apiUrl } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import Modal from "../../components/Modal";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { formatDateToString } from "../../utils";

//
const DoctorHolidayView = ({ onCloseModal, title , updateHolidays , selHoliday}) => {
  const [selectedRange, setSelectedRange] = useState([]);
  const [formData, setFormData] = useState({
    start_date: new Date(),
    end_date: new Date(),
  });
  const handleRangeChange = (newRange) => {
    setFormData({
      ...formData,
      start_date: newRange[0],
      end_date: newRange[1],
    });
    setSelectedRange(newRange);
  };
  console.log("formData", formData , formData.start_date.getTime())
  //
  return (
    <Modal
      title={title}
      body={
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Start Date</label>
                  <input
                    type="text"
                    className="form-control"
                    value={
                      formatDateToString(formData.start_date) || "dd-mm-yyyy"
                    }
                    onFocus={() => {}}
                    readOnly
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label>End Date</label>
                  <input
                    type="text"
                    className="form-control"
                    value={
                      formatDateToString(formData.end_date) || "dd-mm-yyyy"
                    }
                    onFocus={() => {}}
                    readOnly
                  />
                </div>
              </div>
              <Calendar
                selectRange
                startDate={selectedRange[0]}
                endDate={selectedRange[1]}
                onChange={handleRangeChange}
                minDate={new Date()}
                maxDate={new Date(2025, 0, 1)}
                highlightSelectedDates
              />
              <div className="row justify-content-center mt-3">
                <div className="col-md-6">
                  <button
                    style={{
                      width: "100%",
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
                        updateHolidays({type: 'add' , formData })
                    }}
                  >
                    {"Add Holiday"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      onCloseModal={onCloseModal}
      big={true}
    />
  );
};
//
export default DoctorHolidayView;
