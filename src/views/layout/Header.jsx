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

        <div className="title">BookMyDoc</div>
        <button
          className="btn btn-primary"
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
