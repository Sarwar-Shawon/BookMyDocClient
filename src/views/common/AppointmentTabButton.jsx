/*
 * @copyRight by md sarwar hoshen.
 */
import React from "react";
//
const AppointmentTabButton = ({ selType, setSelType , body }) => {
  //
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          <div
            className="d-flex justify-content-between align-items-center mb-3"
            style={{
              borderRadius: "5px",
              borderBottom: "1px solid #ccc",
              paddingBottom: "2px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <TabButton
              title="Pending"
              selType={selType}
              style={{ borderBottomLeftRadius: "5px" }}
              setSelType={setSelType}
            />
            <TabButton
              title="Accepted"
              selType={selType}
              setSelType={setSelType}
            />
            <TabButton
              title="History"
              selType={selType}
              setSelType={setSelType}
              style={{ borderBottomRightRadius: "5px" }}
            />
          </div>
        </div>
      </div>
      <>
        {body}
      </>
    </div>
  );
};
//
const TabButton = ({ title, selType, setSelType, style }) => (
  <div className="button-container">
    <button
      className={`tab-button ${selType === title ? "active" : ""}`}
      onClick={() => setSelType(title)}
      style={style}
    >
      {title}
    </button>
  </div>
);
//
export default AppointmentTabButton;
