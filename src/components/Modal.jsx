/*
 * @copyRight by md sarwar hoshen.
 */
import React from "react";
//
const Modal = (props) => {
  return (
    <div
      className="modal fade show"
      id="exampleModalCenter"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className={`modal-dialog modal-dialog-centered ${props.big ? "modal-lg" : ""}`} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">
              {props?.title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={props.onCloseModal}
            ></button>
          </div>
          <div className="modal-body">{props?.body}</div>
          {props.showFooter && (
            <div className="modal-footer">
              {props?.btm_btn_1_txt && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={props.btn1Click}
                >
                  {props?.btm_btn_1_txt}
                </button>
              )}
              {props?.btm_btn_2_txt && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={props.btn2Click}
                >
                  {props?.btm_btn_2_txt}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
//
export default Modal;
