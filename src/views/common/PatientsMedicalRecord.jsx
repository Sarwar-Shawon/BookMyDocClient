/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { FaPlus, FaTrash } from "react-icons/fa";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import Modal from "../../components/Modal";
import { Regex, formatDateToString } from "../../utils";
import { Post, Put, Get } from "../../api";
import { apiUrl } from "../../config/appConfig";
import AppCalendar from "../../components/AppCalendar";
import Autosuggest from "react-autosuggest";
import { allergiesLists, diagnosesLists } from "../../utils";

//
const PatientsMedicalRecord = ({ onCloseModal, medicalRecord, apt }) => {
  //
  const [allergiesSuggestions, setAllergiesSuggestions] =
    useState(allergiesLists);
  const [diagnosesSuggestions, setDiagnosesSuggestions] =
    useState(diagnosesLists);
  const [showResp, setShowResp] = useState({});
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const [formData, setFormData] = useState({
    healthInfo: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      weight: "",
      height: "",
    },
    allergies: [{ val: "" }],
    diagnoses: [{ val: "", date: new Date() }],
    notes: [{ val: "", date: new Date() }],
  });
  //
  //   useEffect(() => {
  //     if(apt?.pt?.medical_history){
  //         setFormData(prevState => ({
  //             ...prevState,
  //             ...apt?.pt?.medical_history
  //           }));
  //     }
  //   }, [apt]);
  //
  const handleInputChange = (index, category, key, value) => {
    const updatedFormData = { ...formData };
    updatedFormData[category][index][key] = value;
    setFormData(updatedFormData);
  };
  //
  const handleAddField = (category) => {
    const updatedFormData = { ...formData };
    updatedFormData[category].push({ val: "", date: new Date() });
    setFormData(updatedFormData);
  };
  //
  const handleRemoveField = (index, category) => {
    const updatedFormData = { ...formData };
    updatedFormData[category].splice(index, 1);
    setFormData(updatedFormData);
  };
  //
  const updatePatientRecord = async (e) => {
    e.preventDefault();
    try {
      //
      setIsBtnLoading(true);
      let medicalRecord = {};
      if (apt?.pt?.medical_history) {
        medicalRecord = {
          healthInfoList: [
            ...apt?.pt?.medical_history?.healthInfoList,
            ...[{ data: formData.healthInfo, date: new Date() }],
          ],
          allergies: [
            ...apt?.pt?.medical_history?.allergies,
            ...formData.allergies,
          ],
          diagnoses: [
            ...apt?.pt?.medical_history?.diagnoses,
            ...formData.diagnoses,
          ],
          notes: [...apt?.pt?.medical_history?.notes, ...formData.notes],
        };
      } else {
        medicalRecord = {
          healthInfoList: [{ data: formData.healthInfo, date: new Date() }],
          allergies: formData.allergies,
          diagnoses: formData.diagnoses,
          notes: formData.notes,
        };
      }
      const params = {
        pt_id: apt?.pt?._id,
        medical_history: medicalRecord,
      };
      console.log("params", apt);
      console.log("params", params);
      const resp = await Put(
        `${apiUrl()}/nurse/update-patient-record`,
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
      setIsBtnLoading(false);
    }
  };
  //
  const getAllergySuggestions = (value) => {
    const inputValue = value.value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const data =
      inputLength === 0
        ? allergiesLists
        : allergiesLists.filter(
            (allery) =>
              allery.toLowerCase().slice(0, inputLength) === inputValue
          );
    setAllergiesSuggestions(data);
  };
  //
  const getDiagnosisSuggestions = (value) => {
    const inputValue = value.value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const data =
      inputLength === 0
        ? diagnosesLists
        : diagnosesLists.filter(
            (diagnosis) =>
              diagnosis.toLowerCase().slice(0, inputLength) === inputValue
          );
    console.log("data", data);
    setDiagnosesSuggestions(data);
  };
  //
  console.log("formdata", formData, apt);
  //
  return (
    <Modal
      title={"Patient Data"}
      body={
        <form onSubmit={updatePatientRecord} className="row">
          <ErrorAlert
            msg={!showResp?.success ? showResp?.msg : ""}
            hideMsg={() => setShowResp({})}
          />
          <SuccessAlert
            msg={showResp?.success ? showResp?.msg : ""}
            hideMsg={() => setShowResp({})}
          />
          <div className="d-flex container pt-record">
            <div style={{ marginRight: "10px" }}>
              <div>
                <h3>Medical Record</h3>
                <div className="row">
                  {Object.entries(formData.healthInfo).map(([key, value]) => (
                    <div key={key} className="col-md-4">
                      <input
                        type="text"
                        className="form-control mb-3"
                        placeholder={key}
                        value={value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            healthInfo: {
                              ...formData.healthInfo,
                              [key]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Allergies</h3>
                <FaPlus
                  style={{ color: "green" }}
                  onClick={() => handleAddField("allergies")}
                />
              </div>
              {formData.allergies.map((allergy, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex align-items-center">
                    <Autosuggest
                      suggestions={allergiesSuggestions}
                      onSuggestionsFetchRequested={getAllergySuggestions}
                      getSuggestionValue={(suggestion) => suggestion}
                      renderSuggestion={(suggestion) => <div>{suggestion}</div>}
                      onSuggestionSelected={(event, { suggestion }) => {
                        handleInputChange(
                          index,
                          "allergies",
                          "val",
                          suggestion
                        );
                      }}
                      onSuggestionsClearRequested={() =>
                        setAllergiesSuggestions([])
                      }
                      inputProps={{
                        value: allergy.val,
                        onChange: (e, { newValue }) =>
                          handleInputChange(
                            index,
                            "allergies",
                            "val",
                            e.target.value
                          ),
                        className: "form-control",
                        placeholder: "Allergen",
                      }}
                    />
                    {/* <input
                        type="text"
                        className="form-control me-2"
                        placeholder="Allergen"
                        value={allergy.allergen}
                        onChange={(e) =>
                        handleInputChange(
                            index,
                            "allergies",
                            "allergen",
                            e.target.value
                        )
                        }
                    /> */}

                    <FaTrash
                      style={{ color: "red", marginLeft: 5 }}
                      onClick={() => handleRemoveField(index, "allergies")}
                    />
                  </div>
                </div>
              ))}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Diagnoses</h3>
                <FaPlus
                  style={{ color: "green" }}
                  onClick={() => handleAddField("diagnoses")}
                />
              </div>
              {formData.diagnoses.map((diagnosis, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex align-items-center">
                    <Autosuggest
                      suggestions={diagnosesSuggestions}
                      onSuggestionsFetchRequested={getDiagnosisSuggestions}
                      getSuggestionValue={(suggestion) => suggestion}
                      renderSuggestion={(suggestion) => <div>{suggestion}</div>}
                      onSuggestionSelected={(event, { suggestion }) => {
                        handleInputChange(
                          index,
                          "diagnoses",
                          "val",
                          suggestion
                        );
                      }}
                      onSuggestionsClearRequested={() =>
                        setDiagnosesSuggestions([])
                      }
                      inputProps={{
                        value: diagnosis.val,
                        onChange: (e, { newValue }) =>
                          handleInputChange(
                            index,
                            "diagnoses",
                            "val",
                            e.target.value
                          ),
                        className: "form-control",
                        placeholder: "Diagnosis",
                      }}
                    />
                    <div style={{ marginLeft: 5 }}>
                      <AppCalendar
                        value={diagnosis.date}
                        className="form-control me-2"
                        placeholder="Date"
                        onChange={(val) => {
                          handleInputChange(index, "diagnoses", "date", val);
                        }}
                        //   maxDate={calculateMaxDate()}
                      />
                    </div>
                    <FaTrash
                      style={{ color: "red", marginLeft: 5 }}
                      onClick={() => handleRemoveField(index, "diagnoses")}
                    />
                  </div>
                </div>
              ))}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Notes</h3>
                <FaPlus
                  style={{ color: "green" }}
                  onClick={() => handleAddField("notes")}
                />
              </div>
              {formData.notes.map((note, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex align-items-center">
                    <textarea
                      type="text"
                      className="form-control me-3"
                      placeholder="Note"
                      value={note.val}
                      onChange={(e) =>
                        handleInputChange(index, "notes", "val", e.target.value)
                      }
                    />
                    <AppCalendar
                      value={note.date}
                      className="form-control me-2"
                      placeholder="Date"
                      onChange={(val) => {
                        handleInputChange(index, "notes", "date", val);
                      }}
                      //   maxDate={calculateMaxDate()}
                    />
                    <FaTrash
                      style={{ color: "red", marginLeft: 5 }}
                      onClick={() => handleRemoveField(index, "notes")}
                    />
                  </div>
                </div>
              ))}
            </div>
            {apt?.pt.medical_history && (
              <div
                className="col-md-6"
                style={{ borderLeft: "2px solid #074173", paddingLeft: "10px" }}
              >
                <div>
                  <h3 style={{ color: "#074173" }}>Previous Medical Records</h3>
                  <div>
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                          <tr>
                            <th className="align-middle">Date</th>
                            <th className="align-middle">Data</th>
                          </tr>
                        </thead>
                        <tbody>
                          {apt?.pt.medical_history.healthInfoList.map(
                            (item, index) => (
                              <tr key={index}>
                                <td className="align-middle">
                                  {formatDateToString(item?.date)}
                                </td>
                                <td className="align-middle">
                                  {Object.entries(item?.data).map(
                                    ([key, value]) => (
                                      <div key={key}>
                                        <span>
                                          {key}: {value}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <h3 style={{ color: "#074173" }}>Allergies</h3>

                <div className="d-flex align-items-center mb-3">
                  {apt?.pt?.medical_history?.allergies.map((item, index) => (
                    <div key={item?.val}>
                      <h5>{item?.val}{index !==
                        apt.pt.medical_history.allergies.length - 1 && (
                        <span>, </span>
                      )}</h5>
                      
                    </div>
                  ))}
                </div>
                <div>
                  <h3 style={{ color: "#074173" }}>Diagnoses</h3>
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th className="align-middle">Date</th>
                          <th className="align-middle">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apt?.pt.medical_history.diagnoses.map(
                          (item, index) => (
                            <tr key={index}>
                              <td className="align-middle">
                                {formatDateToString(item?.date)}
                              </td>
                              <td className="align-middle">
                                <label>{item.val}</label>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 style={{ color: "#074173" }}>Notes</h3>
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th className="align-middle">Date</th>
                          <th className="align-middle">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {apt?.pt.medical_history.notes.map((item, index) => (
                          <tr key={index}>
                            <td className="align-middle">
                              {formatDateToString(item?.date)}
                            </td>
                            <td className="align-middle">
                              <label>{item.val}</label>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-12"></div>
              </div>
            )}
          </div>
          <div style={{ padding: 10 }} className="col-6">
            <div className="d-grid">
              {false ? (
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
                  {"Add Patient Record"}
                </button>
              )}
            </div>
          </div>
        </form>
      }
      onCloseModal={onCloseModal}
      bigger={true}
    />
  );
};
//
export default PatientsMedicalRecord;
