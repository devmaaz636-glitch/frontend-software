import React, { useRef, useState } from "react";
import { Nav, NavItem } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { MdOutlineMenu } from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaRegFileCode } from "react-icons/fa";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { MdOutlineBarChart } from "react-icons/md";
import Logo from "./Logo";
import { IoIosHome } from "react-icons/io";

const Model = React.lazy(() => import("../views/ui/Model.js"));

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const navigation = useNavigate();
  const user = JSON.parse(localStorage.getItem("bicuserData"));

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const newState = !prev;
      document
        .querySelector(".full-layout")
        .classList.toggle("sidebar-open", newState);
      return newState;
    });
  };

  const navigateToDashBoard = () => {
    navigation("/bi/profile");
    window.location.reload();
  };
  const navigateToEvaluation = () => {
    navigation("/bi/agentform");
    window.location.reload();
  };

  const navigateToEscalation = () => {
    navigation("/bi/escalationform");
    window.location.reload();
  };

  const navigateToPPC = () => {
    navigation("/bi/ppcform");
    window.location.reload();
  };

  return (
    <>
      <div className="p-3">
        <MdOutlineMenu
          size={30}
          onClick={toggleSidebar}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div
        className={`sidebar-container  ${isSidebarOpen ? "open" : ""}`}
        ref={sidebarRef}
      >
        <div className="d-flex align-items-center justify-content-between">
          <Logo />
          <IoMdCloseCircleOutline
            className="p-1"
            size={40}
            onClick={toggleSidebar}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="p-2">
          <Nav vertical className="d-flex justify-content-center gap-3">
            <NavItem
              style={{ cursor: "pointer" }}
              className="nav-item-custom d-flex align-items-center h4 gap-3"
              onClick={navigateToDashBoard}
            >
              <IoIosHome size={25} />
              Dashboard
            </NavItem>
            <NavItem
              style={{ cursor: "pointer" }}
              className="nav-item-custom d-flex align-items-center h4 gap-3"
              onClick={navigateToEvaluation}
            >
              <FaRegFileCode size={25} />
              Evaluation
            </NavItem>
            <NavItem
              style={{ cursor: "pointer" }}
              className="nav-item-custom d-flex align-items-center h4 gap-3"
              onClick={navigateToEscalation}
            >
              <MdOutlineBarChart size={25} />
              Escalation
            </NavItem>
            <NavItem
              style={{ cursor: "pointer" }}
              className="nav-item-custom d-flex align-items-center h4 gap-3"
              onClick={navigateToPPC}
            >
              <RiMoneyDollarCircleFill size={25} />
              PPC
            </NavItem>

            {user?.role === "admin" && <Model />}
      
          </Nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
