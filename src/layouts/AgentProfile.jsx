import React, { useEffect, useState } from "react";
import { socket } from "../socket.js";
import ProjectTables from "../components/dashboard/ProjectTable.js";
import { Card, Col, Row, Container } from "react-bootstrap";
import RealNotification from "../components/dashboard/RealNotification.jsx";
import { getNotification } from "../features/userApis.js";
import AllEscalations from "../components/dashboard/AllEscalations.jsx";

const AgentProfile = () => {
  const [notifications, setNotifications] = useState([]);
  const user = JSON.parse(localStorage.getItem("bicuserData"));

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotification();
        setNotifications(res?.data?.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    socket.on("receive-notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("receive-notification");
    };
  }, []);

  useEffect(() => {
    const handleConnect = () => console.log("Connected");
    const handleUserConnect = (data) => console.log(data);

    socket.on("connected", handleConnect);
    socket.on("user-connect", handleUserConnect);
    socket.emit("join-room", {
      username: user?.name,
      userRoom: "notification-Room",
    });

    return () => {
      socket.off("connected", handleConnect);
      socket.off("user-connect", handleUserConnect);
      socket.disconnect();
    };
  }, [user]);

  return (
    <Container fluid className="p-4">
      <Row className="gy-4">
        <Col xs={12} md={4}>
          <Card className="shadow-sm">
            <ProjectTables />
          </Card>
        </Col>
        <Col xs={12} md={8}>
          <Card className="rounded-4 shadow-sm p-4">
            <AllEscalations />
          </Card>
          <div className="mt-3">
            <RealNotification notifications={notifications} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AgentProfile;
