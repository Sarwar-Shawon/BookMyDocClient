/*
 * @copyRight by md sarwar hoshen.
 */

import React, { useState, useEffect } from "react";
import { Get, Put } from "../../api";
import { apiUrl } from "../../config/appConfig";
import LoadingView from "../../components/Loading";
import noData from "../../assets/images/no-data.jpg";
import DoctorHolidayView from "../common/DoctorHolidayView";
import { formatDateToString } from "../../utils";
import moment from "moment";
import Modal from "../../components/Modal";

//
const _days = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
};
//
const Holidays = ({ doctorId }) => {
  const [holidays, setHolidays] = useState([]);
  const [showHoliday, setShowHoliday] = useState(false);
  const [showCancelModal, sethowCancelModal] = useState(false);
  const [selHoliday, setSelHoliday] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isBtnLoading, setBtnLoading] = useState(false);
  const [startDate, setStartDate] = useState("10/04/2024");
  const [endDate, setEndDate] = useState("18/04/2024");
  //
  useEffect(() => {
    fetchHolidays();
  }, []);
  //
  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const resp = await Get(`${apiUrl()}/doctor/get-holidays`);
      console.log("resp:::", JSON.stringify(resp));
      if (resp.success) {
        setHolidays(resp?.data);
      }
    } catch (err) {
      // setError(err?.message);
    } finally {
      setLoading(false);
    }
  };
  //
  const updateHolidays = async ({ type, formData, selHoliday }) => {
    try {
      setBtnLoading(true);
      let newHolidays = [...holidays];
      console.log(type, formData, selHoliday);
      if (type == "add") {
        newHolidays.push({
          start_date: formatDateToString(formData.start_date),
          end_date: formatDateToString(formData.end_date),
          _id: new Date().getTime(),
        });
      }
    //   if (type == "update") {
    //     newHolidays.map((holiday) => {
    //       if (holiday._id === selHoliday._id) {
    //         return {
    //           ...holiday,
    //           ...{
    //             start_date: formatDateToString(formData.start_date),
    //             end_date: formatDateToString(formData.end_date),
    //           },
    //         };
    //       }
    //       return holiday;
    //     });
    //   }
      if (type == "delete") {
        newHolidays = newHolidays.filter((item) => item._id !== selHoliday?._id);
      }
      console.log("newHolidaysnewHolidaysnewHolidays:::", newHolidays);
      const resp = await Put(
        `${apiUrl()}/doctor/update-holidays`,
        {
            holidays: newHolidays,
        },
        "application/json"
      );
      console.log('RESP:::', resp)
      if (resp.success) {
        setHolidays(resp?.data);
      }

    } catch (err) {
    } finally {
      setBtnLoading(false);
    }
  };
  //
  const calculateTotalDays = (start, end) => {
    const startDateObj = moment(start, "DD-MM-YYYY");
    const endDateObj = moment(end, "DD-MM-YYYY");
    const differenceInDays = endDateObj.diff(startDateObj, "days") + 1;
    return differenceInDays;
  };
  //
  const formattedDate = (dt) => {
    return moment(dt, "DD-MM-YYYY").format("DD MMMM YYYY");
  };
  //
  if (isLoading) {
    return <LoadingView />;
  }
  //
  return (
    <>
      <div className="container-fluid">
        <div className="col-md-12">
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >
            <button
              style={{
                width: "200px",
                backgroundColor: "#0B2447",
                borderColor: "#0B2447",
                transition: "background-color 0.3s, border-color 0.3s",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                marginRight: "5px",
              }}
              className="btn btn-primary"
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#1a4a8a";
                e.target.style.borderColor = "#1a4a8a";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#0B2447";
                e.target.style.borderColor = "#0B2447";
              }}
              onClick={() => {
                setShowHoliday(true);
              }}
            >
              Add Holidays
            </button>
          </div>
        </div>
        {holidays.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th className="align-middle">Start Date</th>
                  <th className="align-middle">End Date</th>
                  <th className="align-middle">Total Days</th>
                  <th className="align-middle">Action</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((item) => (
                  <tr key={item._id}>
                    <td className="align-middle">{item?.start_date}</td>
                    <td className="align-middle">{item?.end_date}</td>
                    <td className="align-middle">{calculateTotalDays(item?.start_date , item?.end_date)}</td>
                    <td className="align-middle">
                      {/* <button
                        className="btn btn-primary me-2"
                        onClick={() => {
                          setSelHoliday(item);
                        }}
                      >
                        Update
                      </button> */}
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => {
                          setSelHoliday(item);
                          sethowCancelModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="container-fluid d-flex justify-content-center align-items-center">
            <img src={noData} className="no-data-img" alt="No data found" />
          </div>
        )}
      </div>
      {showHoliday && (
        <DoctorHolidayView
          onCloseModal={() => {
            setShowHoliday(false);
          }}
          title={"Manage Holiday"}
          updateHolidays={updateHolidays}
        />
      )}
      {showCancelModal && (
        <Modal
          title={"Logout"}
          body={"Do you want to delete this holiday?"}
          btm_btn_1_txt={"No"}
          btm_btn_2_txt={"Yes"}
          btn1Click={() => {
            sethowCancelModal(false);
          }}
          btn2Click={() => {
            updateHolidays({
              type: "delete",
              formData: {},
              selHoliday: selHoliday,
            });
          }}
          showFooter={true}
          onCloseModal={() => sethowCancelModal(false)}
        />
      )}
    </>
  );
};
//
export default Holidays;
