/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState, useEffect } from "react";
import { useLocation , useNavigate} from "react-router-dom";
import { apiUrl } from "../../config/appConfig";
import { Post } from "../../api";
import Modal from "../../components/Modal";
import { ErrorAlert, SuccessAlert } from "../../components/Alert";
import LoadingView from "../../components/Loading";
import Header from "../../views/layout/Header"

//
const CheckoutSuccess = () => {
  const [showResp, setShowResp] = useState({});
  const [showLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { search } = location.state || {};
  const searchParams = new URLSearchParams(search);
  const sessionId = searchParams.get("session_id");
  console.log("sessionId::::", sessionId);
  //
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        // Make a request to your server to fetch transaction details using the session ID
        const resp = await Post(
          `${apiUrl()}/stripe/update-transaction-details`,
          {
            sessionId: sessionId,
            // sessionId:
            //   "cs_test_a1XK0tbhmWuPY2xvkYVSwGaDU4aCCM7ScjByXeUrmUptqzAuBNEZzgeQ4Y",
          },
          "application/json"
        );
        console.log("resp:::", resp);
        //
        const respObj = {};
        if (resp.success) {
          respObj.success = true;
          respObj.msg = resp?.message;
          setShowResp(respObj);
        } else {
          respObj.success = false;
          respObj.msg = resp?.error;
          setShowResp(respObj);
        }
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      }
    };
    fetchTransactionDetails();
  }, [sessionId]);

  return (
    <div className="layout">
      <Header  />
      <div className="container mt-5">
        {showLoading && <LoadingView />}
        {showResp?.msg && (
          <Modal
            title={"Payment Response"}
            body={
              <div>
                <ErrorAlert msg={!showResp?.success ? showResp?.msg : ""} />
                <SuccessAlert msg={showResp?.success ? showResp?.msg : ""} />
              </div>
            }
            btm_btn_2_txt={"Go to prescriptions page"}
            btn2Click={() => {
              navigate("/prescriptions", { replace: true });
            }}
            showFooter={true}
            onCloseModal={() => {}}
          />
        )}
      </div>
    </div>
  );
};

export default CheckoutSuccess;
