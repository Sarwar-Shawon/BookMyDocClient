/*
 * @copyRight by md sarwar hoshen.
 */
import React from "react";
import { Link } from "react-router-dom";
import NotFoundImage from "../../assets/images/404.jpg";

const NotFoundPage = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <img src={NotFoundImage} alt="404 Not Found" className="img-fluid" />
          <p className="text-center mt-3">
            <Link to="/">Go to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
//
export default NotFoundPage;
