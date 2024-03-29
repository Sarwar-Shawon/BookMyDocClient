import React, { useState, useEffect } from "react";

const ErrorAlert = ({ msg, hideMsg }) => {
  //
  return (
    <>
      {msg && (
        <div
          className="alert alert-danger d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>{msg}</span>
          <button
            type="button"
            className="btn-close"
            onClick={hideMsg}
            aria-label="Close"
          ></button>
        </div>
      )}
    </>
  );
};
//
const SuccessAlert = ({ msg, hideMsg }) => {
  //
  return (
    <>
      {msg && (
        <div
          className="alert alert-success d-flex justify-content-between align-items-center"
          role="alert"
        >
          <span>{msg}</span>
          <button
            type="button"
            className="btn-close"
            onClick={hideMsg}
            aria-label="Close"
          ></button>
        </div>
      )}
    </>
  );
};

export {ErrorAlert, SuccessAlert}