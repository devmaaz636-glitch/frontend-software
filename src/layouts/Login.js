import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LoginApi } from "../features/userApis";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBIcon,
} from "mdb-react-ui-kit";
import Cookies from "universal-cookie";
import { Button } from "reactstrap";
import BtnLoader from "./loader/BtnLoader";
import toast from "react-hot-toast";
const cookie = new Cookies();

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  async function clii(e) {
    e.preventDefault();
    setLoad(true);
    if (email.trim() === "" || password.trim() === "") {
      toast.error("Please fill in all fields");
      setLoad(false);
      return;
    } else {
      let data = { email, password };

      try {
        const res = await LoginApi(data);
        if (res.status === 200 && res.data.success === true) {
          localStorage.setItem(
            "bicuserData",
            JSON.stringify({
              email: res.data.user.email,
              id: res.data.user._id,
              role: res.data.user.role,
              name: res.data.user.name,
            })
          );
          cookie.set("bictoken", res.data.token);
          toast.success("Login successful ");
          setTimeout(() => {
            nav("/bi/profile");
            window.location.reload();
          });
          setLoad(false);
        } else {
          setLoad(false);
          toast.error("Login failed. Please check your credentials.");
        }
      } catch (error) {
        setLoad(false);
        if (error.response) {
          toast.error(
            `Error: ${error.response.data.message || "An error occurred"}`
          );
        } else if (error.request) {
          toast.error(
            "No response received from the server. Please try again later."
          );
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      }
    }
  }

  return (
    <MDBContainer
      fluid
      className="p-4 background-radial-gradient overflow-hidden d-flex justify-content-center align-items-center"
    >
      <MDBRow>
        <MDBCol
          md="6"
          className="text-center text-md-start d-flex flex-column justify-content-center"
        >
          <h1
            className="my-5 display-3 fw-bold ls-tight px-3"
            style={{ color: "hsl(56, 100%, 50%)" }}
          >
            Bright Idea's <br />
            <span style={{ color: "hsl(218, 81%, 75%)" }}>Communication</span>
          </h1>

          <p className="px-4" style={{ color: "hsl(0, 0%, 100%)" }}>
            <b>
              Welcome to Bright Ideas Communications, where innovation meets
              excellence in IT solutions. With a passion for cutting-edge
              technology and a commitment to client success, we deliver bespoke
              strategies and seamless execution to drive your business forward.
              Explore our comprehensive suite of services designed to elevate
              your digital presence and maximize efficiency. Discover why Bright
              Ideas Communications is your trusted partner in navigating the
              evolving landscape of technology.
            </b>
          </p>
        </MDBCol>

        <MDBCol
          md="6"
          className="position-relative d-flex justify-content-center align-items-center"
        >
          <div
            id="radius-shape-1"
            className="position-absolute rounded-circle shadow-5-strong"
          ></div>
          <div
            id="radius-shape-2"
            className="position-absolute shadow-5-strong"
          ></div>

          <MDBCard className="my-5 bg-primary bg-gradient w-75">
            <MDBCardBody className="p-5">
              <form onSubmit={clii}>
                <p style={{ fontFamily: "revert-layer" }}>Email</p>
                <MDBInput
                  wrapperClass="mb-4"
                  // label="Email"
                  placeholder="Email Address"
                  id="form3"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p style={{ fontFamily: "revert-layer" }}>Password</p>
                <div className="mb-4 position-relative">
                  <MDBInput
                    placeholder="Password"
                    id="form4"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="d-flex align-items-center"
                    style={{ paddingRight: "30px" }}
                  />
                  <span
                    className="position-absolute end-0 top-50 translate-middle-y  me-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEye size={20} />
                    ) : (
                      <FaEyeSlash size={20} />
                    )}
                  </span>
                </div>

                <div className="d-flex justify-content-start mb-4">
                  <MDBCheckbox
                    name="flexCheck"
                    value=""
                    id="flexCheckDefault"
                    label="Remember me"
                  />
                </div>

                <Button
                  className="w-100 signupBtn d-flex gap-2 justify-content-center align-content-center"
                  type="submit"
                  disabled={load}
                >
                  Sign-in {load && <BtnLoader />}
                </Button>
              </form>
              <div className="text-center">
                <MDBBtn
                  tag="a"
                  color="none"
                  className="mx-3"
                  style={{ color: "#1266f1" }}
                >
                  <MDBIcon fab icon="facebook-f" size="sm" />
                </MDBBtn>

                <MDBBtn
                  tag="a"
                  color="none"
                  className="mx-3"
                  style={{ color: "#1266f1" }}
                >
                  <MDBIcon fab icon="twitter" size="sm" />
                </MDBBtn>

                <MDBBtn
                  tag="a"
                  color="none"
                  className="mx-3"
                  style={{ color: "#1266f1" }}
                >
                  <MDBIcon fab icon="google" size="sm" />
                </MDBBtn>

                <MDBBtn
                  tag="a"
                  color="none"
                  className="mx-3"
                  style={{ color: "#1266f1" }}
                >
                  <MDBIcon fab icon="github" size="sm" />
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
