/*
 * @copyRight by md sarwar hoshen.
 */
import React ,{useState, useEffect} from "react";
import {
  formatDateToString,
  calculateAge,
  calculateValidDt,
} from "../../utils";
import Modal from "../../components/Modal";
import { apiUrl } from "../../config/appConfig";
const repeatVal = ["Yes", "No"];
const validSel = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  // 'One Time Use'
];
//
const PrescriptionUpdate = ({
  onCloseModal,
  medicineList,
  prescription,
  prescriptionRepeat,
  showBtnLoader,
  updatePrescription
}) => {
    const [status, setStatus] = useState(prescription?.status);
    const [payStatus, setPayStatus] = useState(prescription?.payStatus);
    const [paidBy, setPaidBy] = useState(prescription?.paidBy);
  return (
    <Modal
      title={"Prescription Preview"}
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
                    <strong>Name:</strong>{" "}
                    {[prescription?.pt.f_name, prescription?.pt.l_name]}
                  </p>
                  <p>
                    <strong>Age:</strong> {calculateAge(prescription?.pt.dob)}
                  </p>
                  <p>
                    <strong>DOB:</strong> {prescription?.pt.dob}
                  </p>
                  <p>
                    <strong>Nhs:</strong> {prescription?.pt.nhs}
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
                    {[prescription?.doc.f_name, prescription?.doc.l_name]}
                  </p>
                  <p>
                    <strong>Dept:</strong>{" "}
                    {prescription?.dept
                      ? prescription?.dept?.name
                      : prescription?.doc?.dept?.name}
                  </p>
                  <p>
                    <strong>GP Center:</strong>{" "}
                    {prescription?.org
                      ? prescription?.org?.name
                      : prescription?.doc?.organization?.name}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {prescription?.org
                      ? prescription?.org?.name
                      : prescription?.doc?.organization?.addr
                          ?.formatted_address}
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
                    <p>
                      <strong>Name:</strong> {prescription?.phar?.name}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {prescription?.phar?.addr?.formatted_address}
                    </p>
                    <p>
                      <strong>Phone:</strong> {prescription?.phar?.phone}
                    </p>
                  </>
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
                      <div className="d-flex justify-content-between">
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
                        <div>
                            <p>
                              <strong>Price:</strong> {"£9.65"}
                            </p>
                        </div>
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
                  <strong>
                    {"Total Amount:"}
                  </strong>{" £"}
                  {prescription?.amount}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <strong>
                    {"Created Date:"}
                  </strong>{" "}
                  {formatDateToString(prescription?.createdAt || new Date())}
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <strong>Repeat Option:</strong>{" "}
                  {prescription?.repeatOption ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <strong>Appointment Status:</strong>{" "}
                  <select
                    className="form-select"
                    name="active"
                    value={status}
                    onChange={(e)=>setStatus(e.target.value)}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value={"New"}>New</option>
                    <option value={"Ready"}>Ready</option>
                    <option value={"Dispensed"}>Dispensed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <strong>Payment Status:</strong>{" "}
                  <select
                    className="form-select"
                    name="active"
                    value={payStatus}
                    onChange={(e)=>setPayStatus(e.target.value)}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value={"Paid"}>Paid</option>
                    <option value={"Unpaid"}>Unpaid</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <strong>Paid By:</strong>{" "}
                  <select
                    className="form-select"
                    name="active"
                    value={paidBy}
                    onChange={(e)=>setPaidBy(e.target.value)}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value={"Card"}>Card</option>
                    <option value={"Cash"}>Cash</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-header">
                  <strong>Valid Date:</strong>{" "}
                  {formatDateToString(prescription?.validDt)}
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
                    <img
                      src={`${apiUrl()}/uploads/${prescription?.doc?.pSign}`}
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
                {showBtnLoader ? (
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
                    onClick={() => {updatePrescription({status, payStatus, paidBy})}}
                  >
                    Update Prescription
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
export default PrescriptionUpdate;
