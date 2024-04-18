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
import { formatDateToString, calculateAge } from "../../utils";
import Autosuggest from "react-autosuggest";
import PrescriptionPreview from '../common/PrescriptionPreview'
//
const dose = ["150ml", "250ml"];
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
//
const PrescriptionCreateView = ({ onCloseModal, title, apt }) => {
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
  const [selPhr, setSelPhar] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showBtnLoader, setShowBtnLoader] = useState(false);
  const [showResp, setShowResp] = useState({});
  useEffect(()=>{
    fetchPharmacies()
  },[])
  //
  const fetchPharmacies = async () =>{
    try{
      const resp = await Get(`${apiUrl()}/doctor/get-org-pharmacy`);
      console.log("resp:::", resp);
      if (resp.success) {
        setPharmacies(resp?.data)
      }
    }catch(err){

    }finally{

    }
  }
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
  //
  const createNewPrescription = async () => {
    try {
      //
      setShowBtnLoader(true)
      const userMedicineList = medicineList.map(
        ({ suggestions, ...rest }) => rest
      );

      const params = {
        apt_id: apt?._id,
        phr_id: selPhr,
        medications: userMedicineList,
        validDt: new Date(),
      };
      //
      const resp = await Post(
        `${apiUrl()}/doctor/create-prescription`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
      const respObj = {};
      if (resp.success) {
        setShowPreview(false)
        respObj.success = true;
        respObj.msg = resp?.message;
      } else {
        respObj.success = false;
        respObj.msg = resp?.error;
      }
      setShowResp(respObj)
    } catch (err) {
    } finally {
      setShowBtnLoader(false)
    }
  };
  //
  return (
    <Modal
      title={title}
      body={
        <div className="container">
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
              createNewPrescription={createNewPrescription}
              onCloseModal={() => setShowPreview(false)}
              pharmacies={pharmacies}
              apt={apt}
              selPhr={selPhr}
              setSelPhar={setSelPhar}
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
export default PrescriptionCreateView;
