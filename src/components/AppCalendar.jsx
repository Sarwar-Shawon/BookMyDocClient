/*
 * @copyRight by md sarwar hoshen.
 */
import React ,{ useState }from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../css/AppCalendar.css";
import { formatDateToString } from "../utils";

//
const AppCalendar = (props) => {
  //
  const [showCalendar, setShowCalendar] = useState(false);
  //
  return (
    <div>
      <input
        type="text"
        className={props.className}
        placeholder={props.placeholder}
        value={formatDateToString(props.value)}
        onFocus={() => {
          setShowCalendar(true);
        }}
        onChange={()=>{}}
      />
      {showCalendar && (
        <div
          className="modal fade show"
          id="exampleModalCenter"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
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
                  onClick={()=>setShowCalendar(false)}
                ></button>
              </div>
              <div className="modal-body">
                <Calendar
                  onChange={props.onChange}
                  value={props.value}
                  minDate={props.minDate}
                  maxDate={props.maxDate}
                />
              </div>
              <div className="modal-footer">
                {/* <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
              onClick={props.onCloseModal}
            >
                Cancel
            </button> */}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setShowCalendar(false);
                  }}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
//
export default AppCalendar;
