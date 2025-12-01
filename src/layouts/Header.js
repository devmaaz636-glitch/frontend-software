import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  NavItem,
  NavbarBrand,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Cookies from "universal-cookie";
import { logoutApi, LeadRegister, getNotification } from "../features/userApis";
import { ReactComponent as LogoWhite } from "../assets/images/logos/bi2.svg";
import user2 from "../assets/images/users/avatar.jpg";
import { socket } from "../socket";
import moment from "moment";
import { IoIosHome } from "react-icons/io";
import { FaRegFileCode, FaEyeSlash, FaEye } from "react-icons/fa";
import { FaRectangleAd } from "react-icons/fa6";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { MdOutlineBarChart, MdOutlineMenu } from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";
import Logo from "./Logo";
import toast from "react-hot-toast";

const cookie = new Cookies();

const Header = () => {
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("bicuserData"));
  // const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenNotification, setDropdownOpenNotification] = useState(false);
  const [notification, setNotification] = useState([]);
  const [count, setCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [activeItem, setActiveItem] = useState('');
  
  // Models component state
  const [showPassword, setShowPassword] = useState(false);
  const [modal, setModal] = useState(false);
  const [credential, setCredential] = useState({
    email: "",
    password: "",
    role: "user",
    name: "",
  });

  const handlerLogout = async () => {
    const res = await logoutApi();
    if (res.data.success === true) {
      localStorage.removeItem("bicuserData");
      cookie.remove("bictoken");
      nav("/");
      window.location.reload();
    }
  };

  useEffect(() => {
    const gettingNotification = async () => {
      const res = await getNotification();
      setNotification(res?.data?.data);
    };
    if (user?.role === "admin") {
      gettingNotification();
    }
  }, [user?.role]);

  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const toggleNotification = () => {
    setDropdownOpenNotification((prevState) => !prevState);
    setCount(0);
  };

  // const Handletoggle = () => {
  //   setIsOpen(!isOpen);
  // };

  useEffect(() => {
    socket.on("receive-notification", (data) => {
      setNotification((prev) => [data, ...prev]);
      setCount((prev) => prev + 1);
    });
    return () => {
      socket.off("receive-notification");
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => {
      const newState = !prev;
      document
        .querySelector(".full-layout")
        ?.classList.toggle("sidebar-open", newState);
      return newState;
    });
  };

  // Navigation functions
  const navigate = (path) => {
    setActiveItem(path);
    nav(path);
    if (window.innerWidth < 992) {
      setIsSidebarOpen(false);
    }
  };

  // Click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isSidebarOpen) {
        if (!event.target.classList.contains('menu-toggle')) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Models component functions
  const toggleModal = () => setModal(!modal);
  
  const handleChange = (name, value) => {
    setCredential((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const handlerRegister = async (e) => {
    e.preventDefault();
    if (
      credential.email.trim() === "" ||
      credential.password.trim() === "" ||
      credential.name.trim() === ""
    ) {
      toast.error("Field Required To Fill!");
      return;
    } else {
      try {
        const { data } = await LeadRegister(credential);
        if (data.success) {
          toast.success("Team Leader Added!");
          setCredential({ email: "", password: "", role: "user", name: "" });
          toggleModal();
        } else {
          toast.error("registration failed. Please check your credentials.");
        }
      } catch (error) {
        if (error.response) {
          alert(`Error: ${error.response.data.message || "An error occurred"}`);
        } else if (error.request) {
          alert(
            "No response received from the server. Please try again later."
          );
        } else {
          alert("An error occurred. Please try again later.");
        }
      }
    }
  };

  // Team Lead Component (previously Models component)
  const TeamLeadComponent = () => {
    return (
      <div>
        <div
          onClick={toggleModal}
          style={{ 
            cursor: "pointer", 
            color: "#fff",
            display: "flex",
            alignItems: "center",
          }}
          className="d-flex align-items-center"
        >
          <FaRectangleAd size={18} className="me-2" /> Add Team Lead
        </div>
        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Add user</ModalHeader>
          <ModalBody>
            <Form onSubmit={handlerRegister}>
              <FormGroup>
                <Label for="username">Name</Label>
                <Input
                  id="username"
                  name="name"
                  placeholder="Enter name"
                  type="text"
                  value={credential.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </FormGroup>
              <FormGroup>
                <Label for="useremail">Email</Label>
                <Input
                  id="useremail"
                  name="email"
                  placeholder="Enter email"
                  type="email"
                  value={credential.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </FormGroup>
              <Label for="userpass">Password</Label>
              <FormGroup className="position-relative">
                <Input
                  id="userpass"
                  name="password"
                  placeholder="Enter Password"
                  type={showPassword ? "text" : "password"}
                  value={credential.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                />
                <span
                  className="position-absolute end-0 top-50 translate-middle-y me-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                </span>
              </FormGroup>
              <ModalFooter>
                <Button color="primary" type="submit">
                  Submit
                </Button>{" "}
                <Button color="secondary" onClick={toggleModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  };

  return (
    <>
      <Navbar 
        className="fixed-header" 
        color="light" 
        expand="lg" 
        dark 
        style={{ 
          background: "linear-gradient(to right, #1a2980, #26d0ce)",
          padding: "0px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}
      >
        <div className="d-flex align-items-center">
          <Button
            color="transparent"
            className="menu-toggle d-lg-none me-2"
            onClick={toggleSidebar}
            style={{ border: "none", padding: "0" }}
          >
            <MdOutlineMenu size={28} color="#fff" />
          </Button>
          <NavbarBrand href="/" className="d-flex align-items-center">
            <LogoWhite style={{ height: "40px" }} />
          </NavbarBrand>
        </div>

        {/* Desktop Navigation */}
        <Nav className="me-auto d-none d-lg-flex" navbar>
          <NavItem 
            className={`px-3 nav-link ${activeItem === '/bi/profile' ? 'active-nav' : ''}`}
            onClick={() => navigate('/bi/profile')}
            style={{ 
              cursor: "pointer", 
              color: "#fff",
              display: "flex",
              alignItems: "center",
              borderBottom: activeItem === '/bi/profile' ? "2px solid #fff" : "none"
            }}
          >
            <IoIosHome size={18} className="me-2" /> Dashboard
          </NavItem>
          <NavItem 
            className={`px-3 nav-link ${activeItem === '/bi/agentform' ? 'active-nav' : ''}`}
            onClick={() => navigate('/bi/agentform')}
            style={{ 
              cursor: "pointer", 
              color: "#fff",
              display: "flex",
              alignItems: "center",
              borderBottom: activeItem === '/bi/agentform' ? "2px solid #fff" : "none"
            }}
          >
            <FaRegFileCode size={18} className="me-2" /> Evaluation
          </NavItem>
          <NavItem 
            className={`px-3 nav-link ${activeItem === '/bi/escalationform' ? 'active-nav' : ''}`}
            onClick={() => navigate('/bi/escalationform')}
            style={{ 
              cursor: "pointer", 
              color: "#fff",
              display: "flex",
              alignItems: "center",
              borderBottom: activeItem === '/bi/escalationform' ? "2px solid #fff" : "none"
            }}
          >
            <MdOutlineBarChart size={18} className="me-2" /> Escalation
          </NavItem>
          <NavItem 
            className={`px-3 nav-link ${activeItem === '/bi/ppcform' ? 'active-nav' : ''}`}
            onClick={() => navigate('/bi/ppcform')}
            style={{ 
              cursor: "pointer", 
              color: "#fff",
              display: "flex",
              alignItems: "center",
              borderBottom: activeItem === '/bi/ppcform' ? "2px solid #fff" : "none" 
            }}
          >
            <RiMoneyDollarCircleFill size={18} className="me-2" /> PPC
          </NavItem>
          {user?.role === "admin" && (
            <NavItem 
              className={`px-3 nav-link`}
              style={{ 
                cursor: "pointer", 
                color: "#fff",
                display: "flex",
                alignItems: "center",
                borderBottom: "none"
              }}
            >
              <TeamLeadComponent />
            </NavItem>
          )}
        </Nav>

        <div className="d-flex align-items-center gap-3">
          {user?.role === "admin" && (
            <Dropdown
              style={{ position: "relative" }}
              isOpen={dropdownOpenNotification}
              toggle={toggleNotification}
            >
              {count > 0 && (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    color: "#000",
                    backgroundColor: "#fff",
                    padding: "5px",
                    position: "absolute",
                    right: "-5px",
                    top: "-5px",
                    borderRadius: "50%",
                    height: "20px",
                    width: "20px",
                    fontSize: "12px",
                    fontWeight: "bold"
                  }}
                >
                  {count}
                </div>
              )}
              <DropdownToggle
                color="transparent"
                style={{ 
                  border: "1px solid rgba(255,255,255,0.3)", 
                  borderRadius: "10px",
                  padding: "8px 12px"
                }}
              >
                <i className="bi bi-bell-fill text-white" style={{ fontSize: "18px" }}></i>
              </DropdownToggle>
              {notification.length > 0 ? (
                <DropdownMenu
                  style={{
                    maxHeight: "490px",
                    minHeight: "90px",
                    overflowY: "scroll",
                    width: "300px",
                    padding: "10px",
                    borderRadius: "8px",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
                  }}
                >
                  {notification.map((item, index) => (
                    <DropdownItem key={index}>
                      <div className="fw-bold">
                        {item.userName} {item.description}
                      </div>
                      <div className="text-muted small">
                        {moment(item.lastActive).format("MMMM Do YYYY, h:mm a")}
                      </div>
                      {index < notification.length - 1 && <DropdownItem divider />}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              ) : (
                <DropdownMenu
                  style={{
                    padding: "15px",
                    borderRadius: "8px",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
                  }}
                >
                  <span style={{ display: "flex", justifyContent: "center" }}>
                    No notifications
                  </span>
                </DropdownMenu>
              )}
            </Dropdown>
          )}

          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle color="transparent">
              <div 
                style={{ 
                  border: "2px solid #fff", 
                  borderRadius: "50%", 
                  padding: "2px"
                }}
              >
                <img
                  src={user2}
                  alt="profile"
                  className="rounded-circle"
                  width="36"
                  height="36"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </DropdownToggle>
            <DropdownMenu end
              style={{
                borderRadius: "8px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                padding: "8px"
              }}
            >
              <DropdownItem header style={{ fontWeight: "bold" }}>Role: {user?.role}</DropdownItem>
              <DropdownItem style={{ color: "#666" }}>{user?.email}</DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={handlerLogout} style={{ color: "#dc3545" }}>
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Navbar>

      {/* Mobile Sidebar */}
      <div
        className={`sidebar-mobile ${isSidebarOpen ? "open" : ""}`}
        ref={sidebarRef}
        style={{
          position: "fixed",
          top: "0",
          left: isSidebarOpen ? "0" : "-280px",
          width: "280px",
          height: "100vh",
          background: "linear-gradient(to bottom, #1a2980, #26d0ce)",
          boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
          zIndex: "1050",
          transition: "left 0.3s ease",
          overflowY: "auto",
          color: "#fff",
          padding: "20px"
        }}
      >
        <div className="d-flex align-items-center justify-content-between mb-4">
          <Logo />
          <IoMdCloseCircleOutline
            size={32}
            onClick={toggleSidebar}
            style={{ cursor: "pointer", color: "#fff" }}
          />
        </div>

        <div className="p-2">
          <Nav vertical className="d-flex flex-column gap-3">
            <NavItem
              style={{ 
                cursor: "pointer",
                padding: "12px",
                borderRadius: "8px",
                background: activeItem === '/bi/profile' ? "rgba(255,255,255,0.1)" : "transparent",
                transition: "all 0.2s ease"
              }}
              className="d-flex align-items-center gap-3"
              onClick={() => navigate('/bi/profile')}
            >
              <IoIosHome size={22} />
              <span className="fw-semi-bold">Dashboard</span>
            </NavItem>
            <NavItem
              style={{ 
                cursor: "pointer",
                padding: "12px",
                borderRadius: "8px",
                background: activeItem === '/bi/agentform' ? "rgba(255,255,255,0.1)" : "transparent",
                transition: "all 0.2s ease"
              }}
              className="d-flex align-items-center gap-3"
              onClick={() => navigate('/bi/agentform')}
            >
              <FaRegFileCode size={22} />
              <span className="fw-semi-bold">Evaluation</span>
            </NavItem>
            <NavItem
              style={{ 
                cursor: "pointer",
                padding: "12px",
                borderRadius: "8px",
                background: activeItem === '/bi/escalationform' ? "rgba(255,255,255,0.1)" : "transparent",
                transition: "all 0.2s ease"
              }}
              className="d-flex align-items-center gap-3"
              onClick={() => navigate('/bi/escalationform')}
            >
              <MdOutlineBarChart size={22} />
              <span className="fw-semi-bold">Escalation</span>
            </NavItem>
            <NavItem
              style={{ 
                cursor: "pointer",
                padding: "12px",
                borderRadius: "8px",
                background: activeItem === '/bi/ppcform' ? "rgba(255,255,255,0.1)" : "transparent",
                transition: "all 0.2s ease"
              }}
              className="d-flex align-items-center gap-3"
              onClick={() => navigate('/bi/ppcform')}
            >
              <RiMoneyDollarCircleFill size={22} />
              <span className="fw-semi-bold">PPC</span>
            </NavItem>

            {user?.role === "admin" && (
              <NavItem
                style={{ 
                  cursor: "pointer",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "transparent",
                  transition: "all 0.2s ease"
                }}
                className="d-flex align-items-center gap-3"
              >
                <TeamLeadComponent />
              </NavItem>
            )}
          </Nav>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "rgba(0,0,0,0.5)",
            zIndex: "1040"
          }}
          onClick={toggleSidebar}
        />
      )}

      <style jsx>{`
        .active-nav {
          font-weight: bold;
        }
        .nav-link {
          transition: all 0.2s ease;
          padding: 0.5rem 1rem;
          border-radius: 4px;
        }
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        @media (max-width: 991px) {
          .sidebar-mobile {
            padding-top: 60px;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
