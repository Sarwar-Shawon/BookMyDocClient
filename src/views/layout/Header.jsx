/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import {
  FaAlignJustify,
  FaHome,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import Modal from "../../components/Modal";
const Header = ({ toggleSidebar }) => {
  //
  const [showModal, setShowModal] = useState(false);
  const { signOut, error } = useAuthContext();
  //
  return (
    <div className="header">
      <div className="header-buttons">
        {toggleSidebar && (
          <button className="menu-btn" onClick={toggleSidebar}>
            <FaAlignJustify />
          </button>
        )}

        <div className="title">BookMyDoctor</div>
        <button
          style={{
            width: "200px",
            backgroundColor: "#0B2447",
            borderColor: "#0B2447",
            transition: "background-color 0.3s, border-color 0.3s",
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
            setShowModal(true);
          }}
        >
          Logout
        </button>
        {showModal && (
          <Modal
            title={"Logout"}
            body={"Do you want to logout?"}
            btm_btn_1_txt={"No"}
            btm_btn_2_txt={"Yes"}
            btn1Click={() => {
              setShowModal(false);
            }}
            btn2Click={() => signOut()}
            showFooter={true}
            onCloseModal={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Header;
