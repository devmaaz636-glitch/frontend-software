import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import moment from "moment";
import { editEscalationApi, fetchEscalationById, summonUserData } from "../../features/userApis";

const EditEscalations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const [data, setData] = useState({ esc: []});
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const getUserData = async () => {
    setLoading(true);
    try {
      const { data: responseData } = await summonUserData(id);
      if (responseData) {
        const esc = responseData.esc?.filter((r) =>
          moment(r.createdAt).isAfter(moment().subtract(5, "days"))
        );
        console.log("Escalations in past 5 days", esc);
      }
    } catch (err) {
      console.error("Error loading user data", err);
    } finally {
      setLoading(false);
    }
  };
  getUserData();
}, [id]);



useEffect(() => {
  const getEscalation = async () => {
    try {
      const { data } = await fetchEscalationById(id);
      const esc = data.escalation;

      const normalized = {
        userEmail: esc.useremail || "",
        leadID: esc.leadID || "",
        evaluatedBy: esc.evaluatedby || "",
        agentName: esc.agentName || "",
        teamLeader: esc.teamleader || "",
        leadSource: esc.leadsource || "",
        leadStatus: esc.leadstatus || "",
        escalationSeverity: esc.escalationseverity || "",
        issueIdentification: esc.issueidentification || "",
        escalationAction: esc.escalationaction || "",
        additionalInformation: esc.additionalsuccessrmation || "",
        userRating: esc.userrating || "",
      };

      setFormData(normalized);
    } catch (error) {
      setMessage("Failed to load Escalation data.");
    }
  };
  getEscalation();
}, [id]);




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formattedData = {
      useremail: formData.userEmail,
      leadID: formData.leadID,
      evaluatedby: formData.evaluatedBy,
      agentName: formData.agentName,
      teamleader: formData.teamLeader,
      leadsource: formData.leadSource,
      leadstatus: formData.leadStatus,
      escalationseverity: formData.escalationSeverity,
      issueidentification: formData.issueIdentification,
      escalationaction: formData.escalationAction,
      additionalsuccessrmation: formData.additionalInformation,
      userrating: formData.userRating,
    };

    await editEscalationApi(id, formattedData);
    setMessage("Escalation updated successfully!");
    navigate(-1);
  } catch (error) {
    console.error("Error updating Escalation:", error);
    setMessage("Update failed.");
  }
};


  if (loading) return <Container><p>Loading escalation data...</p></Container>;

  return (
    <Container className="mt-4">
      <h2>Edit Escalation</h2>
      {message && <Alert variant="info">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="userEmail"
                value={formData.userEmail || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lead ID</Form.Label>
              <Form.Control
                type="text"
                name="leadID"
                value={formData.leadID || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Evaluated By</Form.Label>
              <Form.Control
                type="text"
                name="evaluatedBy"
                value={formData.evaluatedBy || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Agent Name</Form.Label>
              <Form.Control
                type="text"
                name="agentName"
                value={formData.agentName || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Team Leader</Form.Label>
              <Form.Control
                type="text"
                name="teamLeader"
                value={formData.teamLeader || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lead Source</Form.Label>
              <Form.Control
                type="text"
                name="leadSource"
                value={formData.leadSource || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>User Rating</Form.Label>
              <Form.Control
                type="text"
                name="userRating"
                value={formData.userRating || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lead Status</Form.Label>
              <Form.Control
                type="text"
                name="leadStatus"
                value={formData.leadStatus || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Escalation Severity</Form.Label>
              <Form.Control
                type="text"
                name="escalationSeverity"
                value={formData.escalationSeverity || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Issue Identification</Form.Label>
              <Form.Control
                type="text"
                name="issueIdentification"
                value={formData.issueIdentification || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Escalation Action</Form.Label>
              <Form.Control
                type="text"
                name="escalationAction"
                value={formData.escalationAction || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Additional Information</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="additionalInformation"
                value={formData.additionalInformation || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" className="mt-3">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default EditEscalations;
