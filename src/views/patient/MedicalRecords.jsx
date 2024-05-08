/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import { formatDateToString } from "../../utils";
import noData from "../../assets/images/no-data.jpg";

//
const MedicalRecords = ({ medical_history, onCloseModal }) => {
  //
  return (
    <Modal
      title={"Medical Details"}
      body={
        <div className="container">
          { (medical_history && Object.keys(medical_history).length) ? (
            <div className="col-md-12 pt-record">
              <div>
                <h3 style={{ color: "#074173" }}>Previous Medical Records</h3>
                <div>
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-primary">
                        <tr>
                          <th className="align-middle">Date</th>
                          <th className="align-middle">Data</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medical_history?.healthInfoList.map((item, index) => (
                          <tr key={"h" + index}>
                            <td className="align-middle">
                              {formatDateToString(item?.date)}
                            </td>
                            <td className="align-middle">
                              {Object.entries(item?.data).map(
                                ([key, value]) => (
                                  <div key={"as" + key}>
                                    <span>
                                      {key}: {value}
                                    </span>
                                  </div>
                                )
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <h3 style={{ color: "#074173" }}>Allergies</h3>

              <div className="d-flex align-items-center mb-3">
                {medical_history?.allergies.map((item, index) => (
                  <div key={"r" + index}>
                    <h5>
                      {item?.val}
                      {index !== medical_history?.allergies.length - 1 && (
                        <span>, </span>
                      )}
                    </h5>
                  </div>
                ))}
              </div>
              <div>
                <h3 style={{ color: "#074173" }}>Diagnoses</h3>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="table-primary">
                      <tr>
                        <th className="align-middle">Date</th>
                        <th className="align-middle">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medical_history?.diagnoses.map((item, index) => (
                        <tr key={"vd" + index}>
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
              <div>
                <h3 style={{ color: "#074173" }}>Notes</h3>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="table-primary">
                      <tr>
                        <th className="align-middle">Date</th>
                        <th className="align-middle">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medical_history?.notes.map((item, index) => (
                        <tr key={"vn" + index}>
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
          ) : (
            <div className="container-fluid d-flex justify-content-center align-items-center">
              <img src={noData} className="no-data-img" alt="No data found" />
            </div>
          )}
        </div>
      }
      onCloseModal={onCloseModal}
      bigger={true}
    />
  );
};
//
export default MedicalRecords;
