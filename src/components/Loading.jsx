/*
 * @copyRight by md sarwar hoshen.
 */
import React from "react";
import "../css/LoadingView.css"; // Make sure to create this CSS file
//
const LoadingView = () => {
  return (
    <div className="wrapper d-grid place-items: center">
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    </div>
  );
};
//
export default LoadingView;
