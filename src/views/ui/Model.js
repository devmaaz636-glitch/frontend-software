// import React, { useState } from "react";
// import { FaRectangleAd } from "react-icons/fa6";
// import {
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   Form,
//   FormGroup,
//   Label,
//   Input,
// } from "reactstrap";
// import { LeadRegister } from "../../features/userApis";
// import { FaEyeSlash } from "react-icons/fa";
// import { FaEye } from "react-icons/fa";
// import toast from "react-hot-toast";
// const Models = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [modal, setModal] = useState(false);
//   const [credential, setCredential] = useState({
//     email: "",
//     password: "",
//     role: "user",
//     name: "",
//   });
//   const toggle = () => setModal(!modal);
//   const handleChange = (name, value) => {
//     setCredential((pre) => ({
//       ...pre,
//       [name]: value,
//     }));
//   };

//   const handlerRegister = async (e) => {
//     e.preventDefault();
//     if (
//       credential.email.trim() === "" ||
//       credential.password.trim() === "" ||
//       credential.name.trim() === ""
//     ) {
//       toast.error("Field Required To Fill!");
//       return;
//     } else {
//       try {
//         const { data } = await LeadRegister(credential);
//         if (data.success) {
//           toast.success("Team Leader Added!");
//           setCredential({ email: "", password: "" });
//           toggle();
//         } else {
//           toast.error("registration failed. Please check your credentials.");
//         }
//       } catch (error) {
//         if (error.response) {
//           alert(`Error: ${error.response.data.message || "An error occurred"}`);
//         } else if (error.request) {
//           alert(
//             "No response received from the server. Please try again later."
//           );
//         } else {
//           alert("An error occurred. Please try again later.");
//         }
//       }
//     }
//   };

//   return (
//     <div>
//       <div
//         onClick={toggle}
//         style={{ cursor: "pointer" }}
//         className="nav-item-custom d-flex align-items-center h5 gap-3"
//       >
//         <FaRectangleAd />
//         Add Team Lead
//       </div>
//       <Modal isOpen={modal} toggle={toggle}>
//         <ModalHeader toggle={toggle}>Add user</ModalHeader>
//         <ModalBody>
//           <Form onSubmit={handlerRegister}>
//             <FormGroup>
//               <Label for="username">Name</Label>
//               <Input
//                 id="username"
//                 name="name"
//                 placeholder="Enter name"
//                 type="text"
//                 value={credential.name}
//                 onChange={(e) => handleChange("name", e.target.value)}
//               />
//             </FormGroup>
//             <FormGroup>
//               <Label for="useremail">Email</Label>
//               <Input
//                 id="useremail"
//                 name="email"
//                 placeholder="Enter email"
//                 type="email"
//                 value={credential.email}
//                 onChange={(e) => handleChange("email", e.target.value)}
//               />
//             </FormGroup>
//             <Label for="userpass">Password</Label>
//             <FormGroup className="position-relative">
//               <Input
//                 id="userpass"
//                 name="password"
//                 placeholder="Enter Password"
//                 type={showPassword ? "text" : "password"}
//                 value={credential.password}
//                 onChange={(e) => handleChange("password", e.target.value)}
//               />
//               <span
//                 className="position-absolute  end-0 top-50 translate-middle-y me-4"
//                 style={{ cursor: "pointer" }}
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
//               </span>
//             </FormGroup>
//             <ModalFooter>
//               <Button color="primary" type="submit">
//                 Submit
//               </Button>{" "}
//               <Button color="secondary" onClick={toggle}>
//                 Cancel
//               </Button>
//             </ModalFooter>
//           </Form>
//         </ModalBody>
//       </Modal>
//     </div>
//   );
// };

// export default Models;
