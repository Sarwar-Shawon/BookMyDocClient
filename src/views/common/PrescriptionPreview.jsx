/*
 * @copyRight by md sarwar hoshen.
 */
import React from "react";
import { formatDateToString, calculateAge } from "../../utils";
import Modal from "../../components/Modal";

//
const PrescriptionPreview = ({
    onCloseModal,
    medicineList,
    apt,
    pharmacies,
    selPhr,
    setSelPhar,
    // patientDetails,
    // doctorDetails,
    // pharmacyDetails,
    createNewPrescription,
  }) => {
    console.log("medicineList", medicineList);
    const patientDetails = {
      name: "Md Sarwar Hoshen",
      age: 29,
      dob: "01-01-1995",
    };
    //
    const doctorDetails = {
      name: "Dr. Md Deloar",
      specialization: "Internal Medicine",
      clinic: "Clinic",
    };
    return (
      <Modal
        title={"Prescription Preview"}
        body={
          <div className="container">
            <div className="row">
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-header">Patient</div>
                  <div className="card-body">
                    <p>Name: {[apt?.pt.f_name, apt?.pt.l_name]}</p>
                    <p>Age: {calculateAge(apt?.pt.dob)}</p>
                    <p>DOB: {apt?.pt.dob}</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-header">Doctor</div>
                  <div className="card-body">
                    <p>Doctor: {[apt?.doc.f_name, apt?.doc.l_name]}</p>
                    <p>
                      Dept: {apt?.dept ? apt?.dept?.name : apt?.doc?.dept?.name}
                    </p>
                    <p>
                      Org:{" "}
                      {apt?.org ? apt?.org?.name : apt?.doc?.organization?.name}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-header">Pharmacy</div>
                  <div className="card-body">
                    {createNewPrescription ? (
                      <>
                        <select
                          className="form-select"
                          name="type"
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
                      </>
                    ) : (
                      <>
                        <p>Doctor: {doctorDetails.name}</p>
                        <p>Dept: {doctorDetails.specialization}</p>
                        <p>Clinic: {doctorDetails.clinic}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Medicine List */}
            <div className="row mt-4">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <span>Medicine List</span>
                  </div>
                  <div className="card-body medicine-list">
                    {medicineList && medicineList.length > 0 ? (
                      medicineList.map((item, index) => (
                        <div className="medicine" key={index}>
                          <h3>{item.name}</h3>
                          {item.type && (
                            <p>
                              <strong>Type:</strong> {item.type}
                            </p>
                          )}
                          {item.dose && (
                            <p>
                              <strong>Dose:</strong> {item.dose}
                            </p>
                          )}

                          {item.instruction && (
                            <p>
                              <strong>Instruction:</strong> {item.instruction}{" "}
                              {item.extra_instruction
                                ? item.extra_instruction
                                : ""}
                            </p>
                          )}
                          {item.supply ? (
                            <p>
                              <strong>Supply:</strong> {item.supply}
                            </p>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <p>No medicines prescribed.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    Date: {formatDateToString(new Date())}
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
                      type="button"
                      className="btn btn-primary"
                      onClick={createNewPrescription}
                    >
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
  export default PrescriptionPreview;
  