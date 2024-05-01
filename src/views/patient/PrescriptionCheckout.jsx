/*
 * @copyRight by md sarwar hoshen.
 */
import React from "react";
import { formatDateToString, calculateAge } from "../../utils";
import Modal from "../../components/Modal";
import { apiUrl } from "../../config/appConfig";
//
const PrescriptionCheckout = ({ onCloseModal, prescription }) => {
  return (
    <Modal
      title={"Prescription Items Preview"}
      body={
        <div className="container">
          <form onSubmit={() => {}}>
            <div className="row mt-4">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <span>Medicine List</span>
                  </div>
                  <div className="card-body medicine-list">
                    {prescription?.medications &&
                    prescription?.medications.length > 0 ? (
                      prescription?.medications.map((item, index) => (
                        <div className="d-flex justify-content-between">
                          <div className="medicine" key={index}>
                            <h3>{item.name}</h3>
                            {item.type && (
                              <p>
                                <strong>Type:</strong> {item.type}
                              </p>
                            )}
                          </div>
                          <div>
                            <p>
                              <strong>Price:</strong> {"£" + process.env.REACT_APP_PRES_PRICE}
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
                <div className="card-header row">
                  <div className="col" style={{marginLeft: 15}}>
                    <strong>Total Amount:</strong>
                  </div>
                  <div className="col text-end" style={{marginRight: 15}}>
                  {"£" + parseFloat(prescription?.medications.length * process.env.REACT_APP_PRES_PRICE).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12 mt-4">
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Checkout
                </button>
              </div>
            </div>
          </form>
        </div>
      }
      onCloseModal={onCloseModal}
      bigger={true}
    />
  );
};
//
export default PrescriptionCheckout;
