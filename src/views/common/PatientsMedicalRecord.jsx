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
//
const PatientsMedicalRecord = ({ onCloseModal }) => {
  //
  const [showCalendar, setShowCalendar] = useState(false);

  const [formData, setFormData] = useState({
    healthInfo: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      weight: "",
      height: "",
    },
    allergies: [{ allergen: "" }],
    diagnoses: [{ diagnosis: "", date: new Date() }],
    notes: [{ note: "", date: new Date() }],
  });
  //
  const handleInputChange = (index, category, key, value) => {
    const updatedFormData = { ...formData };
    updatedFormData[category][index][key] = value;
    setFormData(updatedFormData);
  };
  //
  const handleAddField = (category) => {
    const updatedFormData = { ...formData };
    updatedFormData[category].push({ diagnosis: "", date: "" });
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
      const params = {
        healthInfo: {
          bloodPressure: "",
          heartRate: "",
          temperature: "",
          weight: "",
          height: "",
        },
        allergies: [{ allergen: "" }],
        diagnoses: [{ diagnosis: "", date: "" }],
        notes: [{ date: "", note: "" }],
      };
      console.log("params",formData)
      const resp = await Put(
        `${apiUrl()}/nurse/update-patient-record`,
        params,
        "application/json"
      );
      console.log("resp:::", resp);
    //   const respObj = {};
    //   if (resp.success) {
    //     respObj.success = true;
    //     respObj.msg = resp?.message;
    //     setShowResp(respObj);
    //   } else {
    //     respObj.success = false;
    //     respObj.msg = resp?.error;
    //     setShowResp(respObj);
    //   }
    } catch (err) {
    } finally {
    }
  };
  //
  console.log("formdata", formData);
  return (
    <Modal
      title={"Patient Data"}
      body={
        <form onSubmit={updatePatientRecord} className="row">
          {/* <ErrorAlert
            msg={!showResp?.success ? showResp?.msg : ""}
            hideMsg={() => setShowResp({})}
          />
          <SuccessAlert
            msg={showResp?.success ? showResp?.msg : ""}
            hideMsg={() => setShowResp({})}
          /> */}
          <div className="container">
            <div>
              <h3>Vital Signs</h3>
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
                  <input
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
                  />
                  <FaTrash
                    style={{ color: "red" }}
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
                  <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Diagnosis"
                    value={diagnosis.diagnosis}
                    onChange={(e) =>
                      handleInputChange(
                        index,
                        "diagnoses",
                        "diagnosis",
                        e.target.value
                      )
                    }
                  />
                  <AppCalendar
                    onCloseModal={() => setShowCalendar(false)}
                    value={diagnosis.date}
                    className="form-control me-2"
                    placeholder="Date"
                    onChange={(val) => {
                        handleInputChange(
                        index,
                        "diagnoses",
                        "date",
                        val
                      )
                    }}
                    //   maxDate={calculateMaxDate()}
                  />
                  <FaTrash
                    style={{ color: "red" }}
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
                  <input
                    type="text"
                    className="form-control me-3"
                    placeholder="Note"
                    value={note.note}
                    onChange={(e) =>
                      handleInputChange(index, "notes", "note", e.target.value)
                    }
                  />
                  <AppCalendar
                    onCloseModal={() => setShowCalendar(false)}
                    value={note.date}
                    className="form-control me-2"
                    placeholder="Date"
                    onChange={(val) => {
                        handleInputChange(
                        index,
                        "note",
                        "date",
                        val
                      )
                    }}
                    //   maxDate={calculateMaxDate()}
                  />
                  <FaTrash
                    style={{ color: "red" }}
                    onClick={() => handleRemoveField(index, "notes")}
                  />
                </div>
              </div>
            ))}
            <div className="col-12">
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
                    {"Update Patient Record"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      }
      onCloseModal={onCloseModal}
      big={true}
    />
  );
};
//
export default PatientsMedicalRecord;
