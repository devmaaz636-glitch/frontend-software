// import React, { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// // import Sidebar from "./Sidebar";
// import Header from "./Header";
// import { Container, Row } from "reactstrap";
// import { getNotification } from "../features/userApis";
// import { socket } from "../socket";

// const FullLayout = () => {
//   const [notifications, setNotifications] = useState([]);
//   // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const res = await getNotification();
//       setNotifications(res?.data?.data);
//     };
//     fetchNotifications();
//   }, []);

//   useEffect(() => {
//     socket.on("receive-notification", (data) => {
//       setNotifications((prev) => [data, ...prev]);
//       setCount((prev) => prev + 1);
//     });

//     return () => {
//       socket.off("receive-notification");
//     };
//   }, []);

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   return (
//     <>
//       <div className={`full-layout  ${isSidebarOpen ? "sidebar-open" : ""}`}> 
      
//         <Header
//           notifications={notifications}
//           count={count}
//           toggleSidebar={toggleSidebar}
//           isSidebarOpen={isSidebarOpen}
//         />
//         <Container fluid>
//           <Row className="top">
//             {/* <Sidebar isOpen={isSidebarOpen} /> */}
//             <div className="main-content">
//               <Outlet />
//             </div>
//           </Row>
//         </Container>
//       </div>
//     </>
//   );
// };

// export default FullLayout;
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Container, Row } from "reactstrap";
import { getNotification } from "../features/userApis";
import { socket } from "../socket";

const FullLayout = () => {
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await getNotification();
      setNotifications(res?.data?.data);
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    socket.on("receive-notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
      setCount((prev) => prev + 1);
    });

    return () => {
      socket.off("receive-notification");
    };
  }, []);

  return (
    <>
      <div className="full-layout">
        <Header
          notifications={notifications}
          count={count}
        />
        <Container fluid>
          <Row className="top">
            <div className="main-content">
              <Outlet />
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default FullLayout;