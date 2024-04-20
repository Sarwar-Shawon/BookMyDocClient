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
import moment from "moment/moment";
import {
  formatStringToDate,
  calculateValidDt,
  calculateAge,
  formatDateToString
} from "../../utils";
import Autosuggest from "react-autosuggest";
import PrescriptionPreview from "../common/PrescriptionPreview";
//
const prescriptionInstructions = [
  "Before meals",
  "Use as much as desired",
  "Twice a day",
  "With food",
  "Every other day",
  "After meals",
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
const validSel = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  'One Time Use'
]
const repeatVal = [ "Yes" , "No" ]
//
const RepeatPrescription = ({ onCloseModal, title, prescription }) => {
  //
  const [medicineList, setMedicineList] = useState([
    {
      name: "",
      type: "",
      dose: "",
      instruction: "",
      supply: 0,
      extra_instruction: "",
      suggestions: {},
    },
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [selPhr, setSelPhar] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [showBtnLoader, setShowBtnLoader] = useState(false);
  const [showResp, setShowResp] = useState({});
  const [validDt, setVdt] = useState("1");
  const [repeatOption, setRepeatOption] = useState("No");
  //
  useEffect(() => {
    fetchPharmacies();
    setupMedicine();
  }, []);
  //
  const setupMedicine = async () => {
    try {
      setRepeatOption(prescription.setRepeatOption ? "Yes" : "No")
      const startDate = moment(moment(prescription.createdAt).format("YYYY-MM-DD"));
      const endDate = moment(moment(prescription.validDt).format("YYYY-MM-DD"));
      const monthDiff = endDate.diff(startDate, 'months');
      setVdt(monthDiff)
      prescription.medications.map(async (item)=>{
          const resp = await await Get(
            `${apiUrl()}/doctor/get-medicine-suggestions?search_text=${item.name}`
          )
          item.suggestions = resp?.data[0]
      })
      setMedicineList(prescription.medications)
    } catch (err) {
    } finally {
    }
  };
  //
  const fetchPharmacies = async () => {
    try {
      const resp = await Get(`${apiUrl()}/doctor/get-org-pharmacy`);
      if (resp.success) {
        setPharmacies(resp?.data);
        setSelPhar(prescription.phar?._id)
      }
    } catch (err) {
    } finally {
    }
  };
  //
  const handleAddMedicine = () => {
    setMedicineList([
      ...medicineList,
      {
        name: "",
        type: "",
        dose: "",
        instruction: "",
        supply: 0,
        extra_instruction: "",
        suggestions: {},
      },
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
  const getSuggestions = async (value) => {
    try {
      //
      const resp = await Get(
        `${apiUrl()}/doctor/get-medicine-suggestions?search_text=${value}`
      );
      console.log("resp:::", resp?.data);
      if (resp.success) {
        return resp?.data;
      } else {
        return [];
      }
    } catch (err) {
    } finally {
    }
  };
  //
  const renderSuggestion = (suggestion) => <div>{suggestion.genericName}</div>;
  //need validation
  const createRepeatPrescription = async () => {
    try {
      //
      setShowBtnLoader(true);
      const userMedicineList = medicineList.map(
        ({ suggestions, ...rest }) => rest
      );

      const params = {
        pres_id: prescription?._id,
        phr_id: selPhr,
        medications: userMedicineList,
        validDt: formatStringToDate(calculateValidDt(validDt || 1)),
        repeatOption: repeatOption == "Yes" ? true : false,
      };
      console.log("params", params);
      //
      const resp = await Post(
        `${apiUrl()}/doctor/create-repeat-prescription`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
      const respObj = {};
      if (resp.success) {
        setShowPreview(false);
        respObj.success = true;
        respObj.msg = resp?.message;
      } else {
        respObj.success = false;
        respObj.msg = resp?.error;
      }
      setShowResp(respObj);
    } catch (err) {
    } finally {
      setShowBtnLoader(false);
    }
  };
  
  const filItem = pharmacies.filter((item) => item._id == selPhr);

  //
  return (
    <Modal
      title={title}
      body={
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="card" style={{ height: "200px" }}>
                <div className="card-header">
                  <strong>Patient</strong>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Name:</strong> {[prescription.pt.f_name, prescription.pt.l_name]}
                  </p>
                  <p>
                    <strong>Age:</strong> {calculateAge(prescription.pt.dob)}
                  </p>
                  <p>
                    <strong>DOB:</strong> {prescription.pt.dob}
                  </p>
                  <p>
                    <strong>Nhs:</strong> {prescription.pt.nhs}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card" style={{ height: "200px" }}>
                <div className="card-header">
                  <strong>Doctor</strong>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Doctor:</strong>{" "}
                    {[prescription.doc.f_name, prescription.doc.l_name]}
                  </p>
                  <p>
                    <strong>Dept:</strong>{" "}
                    {prescription.dept ? prescription.dept?.name : prescription.doc?.dept?.name}
                  </p>
                  <p>
                    <strong>GP Center:</strong>{" "}
                    {prescription.org ? prescription.org?.name : prescription.doc?.organization?.name}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {prescription.org
                      ? prescription.org?.name
                      : prescription.doc?.organization?.addr?.formatted_address}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card" style={{ height: "200px" }}>
                <div className="card-header">
                  <strong>Pharmacy</strong>
                </div>
                <div className="card-body">
                  <>
                    <select
                      className="form-select"
                      name="pharmacy"
                      value={selPhr}
                      onChange={(e) => setSelPhar(e.target.value)}
                    >
                      <option value="">Select Pharmacy</option>

                      <>
                        {pharmacies &&
                          pharmacies.map((phr) => (
                            <option value={phr._id} key={phr._id}>
                              {phr.name}
                            </option>
                          ))}
                      </>
                    </select>
                    {filItem.length > 0 && (
                      <p>
                        <strong>Address:</strong>{" "}
                        {filItem[0]?.addr?.formatted_address}
                      </p>
                    )}
                    {filItem.length > 0 && (
                      <p>
                        <strong>Phone:</strong> {filItem[0]?.phone}
                      </p>
                    )}
                  </>
                </div>
              </div>
            </div>
          </div>
          {/* Medicine List */}
          <div className="row mt-4 medicine-list">
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
                        <th>Type</th>
                        <th>Dose</th>
                        <th>Instruction</th>
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
                                  });
                              }}
                              onSuggestionsClearRequested={() =>
                                setSuggestions([])
                              }
                              onSuggestionSelected={(event, { suggestion }) => {
                                handleMedicineChange(
                                  index,
                                  "suggestions",
                                  suggestion
                                );
                              }}
                              getSuggestionValue={(suggestion) =>
                                suggestion.genericName
                              }
                              renderSuggestion={renderSuggestion}
                              inputProps={{
                                value: medicine.name,
                                onChange: (e, { newValue }) =>
                                  handleMedicineChange(index, "name", newValue),
                                className: "form-control",
                              }}
                            />
                          </td>
                          <td>
                            <select
                              className="form-select"
                              name="type"
                              value={medicine.type}
                              onChange={(e) =>
                                handleMedicineChange(
                                  index,
                                  "type",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select Type</option>

                              <>
                                {medicine.suggestions?.type &&
                                  medicine.suggestions?.type.map((type) => (
                                    <option value={type} key={type}>
                                      {type}
                                    </option>
                                  ))}
                              </>
                            </select>
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
                              <option value="">Select Dose</option>

                              <>
                                {medicine.suggestions?.strength &&
                                  medicine.suggestions?.strength[
                                    medicine.type
                                  ] &&
                                  medicine.suggestions?.strength[
                                    medicine.type
                                  ].map((_dose) => (
                                    <option value={_dose} key={_dose}>
                                      {_dose}
                                    </option>
                                  ))}
                              </>
                            </select>
                          </td>
                          <td>
                            <select
                              className="form-select"
                              name="dose"
                              value={medicine.instruction}
                              onChange={(e) =>
                                handleMedicineChange(
                                  index,
                                  "instruction",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select Instruction</option>

                              <>
                                {prescriptionInstructions.length > 0 &&
                                  prescriptionInstructions.map((item) => (
                                    <option value={item} key={item}>
                                      {item}
                                    </option>
                                  ))}
                              </>
                            </select>
                            <div style={{ marginTop: "5px" }}>
                              <input
                                className="form-control"
                                type="text"
                                placeholder="Type Instruction"
                                value={medicine.extra_instruction}
                                onChange={(e) =>
                                  handleMedicineChange(
                                    index,
                                    "extra_instruction",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </td>
                          <td>
                            <input
                              className="form-control"
                              type="text"
                              value={medicine.supply}
                              style={{ width: "80px" }}
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

          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <strong>Created Date:</strong>{" "}
                  {formatDateToString(prescription.createdAt || new Date())}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <strong>Repeat Option:</strong>{" "}
                  <>
                    {
                      <select
                        className="form-select"
                        name="reapetOption"
                        value={repeatOption}
                        onChange={(e) => setRepeatOption(e.target.value)}
                      >
                        <>
                          {repeatVal.map((item) => (
                            <option value={item} key={item}>
                              {item}
                            </option>
                          ))}
                        </>
                      </select>
                    }
                  </>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <strong>Valid Date:</strong>{" "}
                  {/* {formatDateToString(prescription.createdAt || new Date())} */}
                  <>
                    {
                      <select
                        className="form-select"
                        name="validDt"
                        value={validDt}
                        onChange={(e) => setVdt(e.target.value)}
                      >
                        <>
                          {validSel &&
                            validSel.map((item) => (
                              <option value={item} key={item}>
                                {item === "One Time Use" ? (
                                  <strong>{item}</strong>
                                ) : (
                                  <>
                                    <strong>Duration:</strong> {item} month
                                    {", "}
                                    <strong>End Date:</strong>{" "}
                                    {calculateValidDt(item)}
                                  </>
                                )}
                              </option>
                            ))}
                        </>
                      </select>
                    }
                  </>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <strong>Doctor Signature:</strong>
                </div>
              </div>
            </div>
          </div>
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
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => setShowPreview(true)}
                  >
                    View Prescription
                  </button>
                )}
              </div>
            </div>
          </div>
          {showPreview && (
            <PrescriptionPreview
              medicineList={medicineList}
              createNewPrescription={createRepeatPrescription}
              onCloseModal={() => setShowPreview(false)}
              pharmacies={pharmacies}
              apt={prescription}
              selPhr={selPhr}
              doctor={true}
              setSelPhar={setSelPhar}
              setVdt={setVdt}
              validDt={validDt}
              setRepeatOption={setRepeatOption}
              repeatOption={repeatOption}
              prescriptionRepeat={true}
            />
          )}
          {showResp?.msg && (
            <Modal
              title={"Response"}
              body={
                <div>
                  <ErrorAlert msg={!showResp?.success ? showResp?.msg : ""} />
                  <SuccessAlert msg={showResp?.success ? showResp?.msg : ""} />
                </div>
              }
              btm_btn_2_txt={"Ok"}
              btn2Click={() => {
                setShowResp({});
              }}
              showFooter={true}
              onCloseModal={() => setShowResp({})}
            />
          )}
        </div>
      }
      onCloseModal={onCloseModal}
      bigger={true}
    />
  );
};

//
export default RepeatPrescription;
