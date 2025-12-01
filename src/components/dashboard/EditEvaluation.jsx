import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import { editEvaluationApi, fetchEvaluationById, summonUserData } from "../../features/userApis";

const EditEvaluation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

   useEffect(() => {
  const getUserData = async () => {
    try {
      const { data: responseData } = await summonUserData(id);
      console.log(responseData); // optional
    } catch (err) {
      console.error("Error loading user data", err);
    }
  };
  getUserData();
}, [id]);

    useEffect(() => {
  const getEvaluation = async () => {
    try {
      const { data } = await fetchEvaluationById(id);
      setFormData(data.evaluation || data);  // depending on your API response shape
    } catch (error) {
      setMessage("Failed to load evaluation data.");
    }
  };
  getEvaluation();
}, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editEvaluationApi(id, formData);
      setMessage("Evaluation updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating evaluation:", error);
      setMessage("Update failed.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Edit Evaluation</h2>
      {message && <Alert variant="info">{message}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>User Email</Form.Label>
              <Form.Control type="email" name="useremail" value={formData.useremail || ""} onChange={handleChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Agent Name</Form.Label>
              <Form.Control type="text" name="agentName" value={formData.agentName || ""} onChange={handleChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Team Leader</Form.Label>
              <Form.Control type="text" name="teamleader" value={formData.teamleader || ""} onChange={handleChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Mode of Communication</Form.Label>
              <Form.Control type="text" name="mod" value={formData.mod || ""} onChange={handleChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Response Time</Form.Label>
              <Form.Control type="text" name="responsetime" value={formData.responsetime || ""} onChange={handleChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Greetings</Form.Label>
              <Form.Control
                type="text"
                name="greetings"
                value={Array.isArray(formData.greetings) ? formData.greetings.join(", ") : formData.greetings || ""}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, greetings: e.target.value.split(",").map(s => s.trim()) }))
                }
              />
              <Form.Text className="text-muted">Enter greetings as comma-separated values.</Form.Text>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Lead ID</Form.Label>
              <Form.Control type="text" name="leadID" value={formData.leadID || ""} onChange={handleChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Accuracy</Form.Label>
              <Form.Control type="text" name="accuracy" value={formData.accuracy || ""} onChange={handleChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Building Rapport</Form.Label>
              <Form.Control type="text" name="building" value={formData.building || ""} onChange={handleChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Presenting Solutions</Form.Label>
              <Form.Control type="text" name="presenting" value={formData.presenting || ""} onChange={handleChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Call Closing</Form.Label>
              <Form.Control type="text" name="closing" value={formData.closing || ""} onChange={handleChange} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Bonus Point</Form.Label>
              <Form.Control type="text" name="bonus" value={formData.bonus || ""} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group>
          <Form.Label>Evaluation Summary</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="evaluationsummary"
            value={formData.evaluationsummary || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Button type="submit" className="mt-3">Save Changes</Button>
      </Form>
    </Container>
  );
};

export default EditEvaluation;
