/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { Get, Post } from "../../services";
import apiEndpoints from "../../config/apiEndpoints";
import noData from "../../assets/images/no-data.jpg";
import Modal from "../../components/Modal";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import "react-calendar/dist/Calendar.css";
import "./medicine-suggestions.css";
import {
  formatStringToDate,
  calculateValidDt,
  calculateAge,
  formatDateToString
} from "../../utils";
import Autosuggest from "react-autosuggest";
import {prescriptionInstructionsOptions, validOptions, repeatOptions} from '../../utils'
import PrescriptionPreview from "../common/PrescriptionPreview";
//
const PrescriptionCreateView = ({ onCloseModal, title, apt }) => {
  //
  const [medicineList, setMedicineList] = useState([
    {
      name: "",
      type: "",
      dose: "",
      instruction: "",
      supply: "",
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
  const [validDt, setVdt] = useState("1");
  const [repeatOption, setRepeatOption] = useState("No");
  useEffect(() => {
    fetchPharmacies();
  }, []);
  //
  const fetchPharmacies = async () => {
    try {
      const resp = await Get(apiEndpoints.doctor.getOrgPharmacy);
      //console.log("resp:::", resp);
      if (resp.success) {
        setPharmacies(resp?.data);
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
        `${apiEndpoints.doctor.getMedicineSuggestions}?search_text=${value}`
      );
      //console.log("resp:::", resp?.data);
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
  const createNewPrescription = async () => {
    try {
      //
      setShowBtnLoader(true);
      const userMedicineList = medicineList.map(
        ({ suggestions, ...rest }) => rest
      );
      const params = {
        apt_id: apt?._id,
        phr_id: selPhr,
        medications: userMedicineList,
        validDt: formatStringToDate(calculateValidDt(validDt || 1)),
        repeatOption: repeatOption == "Yes" ? true : false,
      };
      //console.log("params", params);
      //
      const resp = await Post(
        apiEndpoints.doctor.createPrescription,
        params,
        "application/json"
      );
      //console.log("resp:::", resp);
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
  //
  const prescriptionShowPreview=(e)=>{
    e.preventDefault();
    if (!medicineList.length) {
      let respObj = {};
      respObj.success = false;
      respObj.msg = "Pleaase add a medicine";
      setShowResp(respObj);
      return;
    }
    setShowPreview(true);
  }
  //
  const filItem = pharmacies.filter((item) => item._id == selPhr);
  //
  return (
    <Modal
      title={title}
      body={
        <form onSubmit={prescriptionShowPreview} className="row">
          <div className="container">
            <div className="row">
              <div className="col-lg-4">
                <div className="card" style={{ height: "200px" }}>
                  <div className="card-header">
                    <strong>Patient</strong>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Name:</strong> {[apt?.pt.f_name, apt?.pt.l_name]}
                    </p>
                    <p>
                      <strong>Age:</strong> {calculateAge(apt?.pt.dob)}
                    </p>
                    <p>
                      <strong>DOB:</strong> {apt?.pt.dob}
                    </p>
                    <p>
                      <strong>Nhs:</strong> {apt?.pt.nhs}
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
                      {[apt?.doc.f_name, apt?.doc.l_name]}
                    </p>
                    <p>
                      <strong>Dept:</strong>{" "}
                      {apt?.dept ? apt?.dept?.name : apt?.doc?.dept?.name}
                    </p>
                    <p>
                      <strong>GP Center:</strong>{" "}
                      {apt?.org ? apt?.org?.name : apt?.doc?.organization?.name}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {apt?.org
                        ? apt?.org?.name
                        : apt?.doc?.organization?.addr?.formatted_address}
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
                    {createNewPrescription ? (
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
                    ) : (
                      <>
                        <p>
                          <strong>Name:</strong> {apt?.phar?.name}
                        </p>
                        <p>
                          <strong>Address:</strong>{" "}
                          {apt?.phar?.addr?.formatted_address}
                        </p>
                        <p>
                          <strong>Phone:</strong> {apt?.phar?.phone}
                        </p>
                      </>
                    )}
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
                  <div className="card-body">
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
                                      //console.log("suggestions", suggestions);
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
                                  required: true
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
                                  {prescriptionInstructionsOptions.length > 0 &&
                                    prescriptionInstructionsOptions.map((item) => (
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
                                required
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
                    {formatDateToString(apt?.createdAt || new Date())}
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
                            {repeatOptions.map((item) => (
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
                    {/* {formatDateToString(apt?.createdAt || new Date())} */}
                    <>
                      {
                        <select
                          className="form-select"
                          name="validDt"
                          value={validDt}
                          onChange={(e) => setVdt(e.target.value)}
                        >
                          <>
                            {validOptions &&
                              validOptions.map((item) => (
                                <option value={item} key={item}>
                                  {item === "One Time Use" ? (
                                    <>{ item }</>
                                  ) : (
                                    <>
                                      Duration: {item} month
                                      {", "}
                                      End Date: {calculateValidDt(item)}
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
                    {
                      apt?.doc?.pSign &&
                      <img
                        src={`${apiEndpoints.upload.url}/${apt?.doc?.pSign}`}
                        style={{
                          width: 250,
                          height: 80,
                          // borderRadius: 100,
                        }}
                      />
                    }
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
                    >
                      Preview Prescription
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
                prescription={apt}
                selPhr={selPhr}
                doctor={true}
                setSelPhar={setSelPhar}
                setVdt={setVdt}
                validDt={validDt}
                setRepeatOption={setRepeatOption}
                repeatOption={repeatOption}
                showBtnLoader={showBtnLoader}
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
        </form>
      }
      onCloseModal={onCloseModal}
      bigger={true}
    />
  );
};

//
export default PrescriptionCreateView;
