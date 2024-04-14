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
import "./medicine-suggestions.css";
import { formatDateToString } from "../../utils";
import Autosuggest from "react-autosuggest";
const dose = ["150ml", "250ml"];
const prescriptionInstructions = [
    "Before meals",
    "Use as much as desired",
    "Twice a day",
    "With food",
    "Every other day",
    "After meals",
    "Every other day",
    "Every day",
    "Every hour",
    "Every night at bedtime",
    "Every three hours",
    "Four times a day",
    "Every week",
    "Three times a day",
    "Times",
    "Daily",
    "Morning",
    "Twice daily, 12-hrly",
    "Three times daily, 8-hrly",
    "Four times daily, 6-hrly",
    "Six times daily, 4-hrly",
    "As required",
    "With/after food",
];

//
const PrescriptionCreateView = ({
  onCloseModal,
  title,
  updateHolidays,
  selHoliday,
}) => {
  const patientDetails = {
    name: "John Doe",
    age: 30,
    dob: "01-01-1994",
  };
  //
  const [medicineList, setMedicineList] = useState([
    { name: "Medicine 1", dose: "10mg", timing: "Morning", supply: 0 }
  ]);
  const [suggestions, setSuggestions] = useState([]);
  //
  const handleAddMedicine = () => {
    setMedicineList([
      ...medicineList,
      { name: "", dose: "", timing: "", supply: "" },
    ]);
  };
  //
  const handleMedicineChange = (index, field, value) => {
    const updatedMedicineList = [...medicineList];
    updatedMedicineList[index][field] = value;
    setMedicineList(updatedMedicineList);
  };
  //
  const handleRemoveMedicine = (index) => {
    const updatedMedicineList = [...medicineList];
    updatedMedicineList.splice(index, 1);
    setMedicineList(updatedMedicineList);
  };
  //
  const doctorDetails = {
    name: "Dr. Jane Smith",
    specialization: "Internal Medicine",
    clinic: "ABC Clinic",
  };
  //
  const getSuggestions = async (value) => {
    try {
      //
      const resp = await Get(
        `${apiUrl()}/doctor/get-medicine-suggestions?search_text=${value}`
      );
      console.log("resp:::", resp?.data);
      if (resp.success) {
        return resp?.data;
      }
      const suggestions = [
        {
          genericName: "Medicine 1",
          dose: "10mg",
          timing: "Morning",
          quantity: "1",
        },
        {
          genericName: "Medicine 2",
          dose: "20mg",
          timing: "Evening",
          quantity: "2",
        },
      ];
      return suggestions.filter((medicine) =>
        medicine.genericName.toLowerCase().includes(value.toLowerCase())
      );
    } catch (err) {
    } finally {
    }
  };
  //
  const renderSuggestion = (suggestion) => <div>{suggestion.genericName}</div>;
  //
  const handleSuggestionSelected = (event, { suggestion, method }) => {
    if (method === "click" || method === "enter") {
      handleMedicineChange(medicineList.length - 1, "name", suggestion.name);
      handleMedicineChange(medicineList.length - 1, "dose", suggestion.dose);
      handleMedicineChange(
        medicineList.length - 1,
        "timing",
        suggestion.timing
      );
      handleMedicineChange(
        medicineList.length - 1,
        "quantity",
        suggestion.quantity
      );
    }
  };
  //
  return (
    <Modal
      title={title}
      body={
        <div className="container">
          {/* <div className="row">
            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">Patient</div>
                <div className="card-body">
                  <p>Name: {patientDetails.name}</p>
                  <p>Age: {patientDetails.age}</p>
                  <p>DOB: {patientDetails.dob}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">Doctor</div>
                <div className="card-body">
                  <p>Doctor: {doctorDetails.name}</p>
                  <p>Dept: {doctorDetails.specialization}</p>
                  <p>Clinic: {doctorDetails.clinic}</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card">
                <div className="card-header">Pharmacy</div>
                <div className="card-body">
                  <p>Doctor: {doctorDetails.name}</p>
                  <p>Dept: {doctorDetails.specialization}</p>
                  <p>Clinic: {doctorDetails.clinic}</p>
                </div>
              </div>
            </div>
          </div> */}
          {/* Medicine List */}
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span>Medicine List</span>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={handleAddMedicine}
                  >
                    Add Medicine
                  </button>
                </div>
                <div className="card-body medicine-list">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Dose</th>
                        <th>Timing</th>
                        <th>Supply</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicineList.map((medicine, index) => (
                        <tr key={index}>
                          <td>
                            <Autosuggest
                              suggestions={suggestions}
                              onSuggestionsFetchRequested={({ value }) => {
                                getSuggestions(value)
                                  .then((suggestions) => {
                                    console.log("suggestions", suggestions);
                                    setSuggestions(suggestions);
                                  })
                                  .catch((error) => {
                                    console.error(
                                      "Error fetching suggestions:",
                                      error
                                    );
                                    // Handle error
                                  });
                              }}
                              onSuggestionsClearRequested={() =>
                                setSuggestions([])
                              }
                              getSuggestionValue={(suggestion) =>
                                suggestion.genericName
                              }
                              renderSuggestion={renderSuggestion}
                              inputProps={{
                                value: medicine.name,
                                onChange: (e, { newValue }) =>
                                  handleMedicineChange(index, "name", newValue),
                              }}
                            />
                            {/* <input
                              type="text"
                              value={medicine.name}
                              onChange={(e) =>
                                handleMedicineChange(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              style={{ width: "200px" }}
                            /> */}
                          </td>
                          <td>
                            <select
                              className="form-select"
                              name="dose"
                              value={medicine.dose}
                              onChange={(e) =>
                                handleMedicineChange(
                                  index,
                                  "dose",
                                  e.target.value
                                )
                              }
                            >
                              <>
                                {dose.length > 0 &&
                                  dose.map((_dose) => (
                                    <option value={_dose} key={_dose}>
                                      {_dose}
                                    </option>
                                  ))}
                              </>
                            </select>
                            {/* <input
                              type="text"
                              value={medicine.dose}
                              onChange={(e) =>
                                handleMedicineChange(
                                  index,
                                  "dose",
                                  e.target.value
                                )
                              }
                              style={{ width: "80px" }}
                            /> */}
                          </td>
                          <td>
                            <select
                              className="form-select"
                              name="dose"
                              value={medicine.timing}
                              onChange={(e) =>
                                handleMedicineChange(
                                  index,
                                  "timing",
                                  e.target.value
                                )
                              }
                            >
                              <>
                                {prescriptionInstructions.length > 0 &&
                                    prescriptionInstructions.map((item) => (
                                    <option value={item} key={item}>
                                      {item}
                                    </option>
                                  ))}
                              </>
                            </select>
                            {/* <input
                              type="text"
                              value={medicine.timing}
                              onChange={(e) =>
                                handleMedicineChange(
                                  index,
                                  "timing",
                                  e.target.value
                                )
                              }
                            /> */}
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="text"
                              value={medicine.supply}
                              style={{ width: "50px" }}
                              onChange={(e) =>
                                handleMedicineChange(
                                  index,
                                  "supply",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRemoveMedicine(index)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  Date: {formatDateToString(new Date())}
                </div>
              </div>
            </div>
          </div> */}
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="d-grid">
                {false ? (
                  <button className="btn btn-primary" disabled>
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    ></div>
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    Create Prescription
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      }
      onCloseModal={onCloseModal}
      bigger={true}
    />
  );
};
//
export default PrescriptionCreateView;
