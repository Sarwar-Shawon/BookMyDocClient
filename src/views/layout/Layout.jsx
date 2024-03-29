/*
 * @copyRight by md sarwar hoshen.
 */
import React, { useState } from 'react';
import Header from "./Header";
import SideBar from "./SideBar";
import "./css/Layout.css";
const Layout = (props) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  //
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  //
  return (
    <div className="layout">
      <Header toggleSidebar={toggleSidebar} />
      <div className="main-container">
        <SideBar isVisible={isSidebarVisible}/>
        <div className={`body-container ${isSidebarVisible ? '' : 'body-container-left'}`} >{props.children}</div>
      </div>
    </div>
  );
};

export default Layout;
