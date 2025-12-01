import React, { useEffect, useState } from "react";
import { Input, FormGroup, Label, FormFeedback } from "reactstrap";
import { evaluationApi, fetchleaders, leaddelete } from "../features/userApis";
import { useNavigate } from "react-router-dom";
import BtnLoader from "./loader/BtnLoader";
import { socket } from "../socket";
import toast from "react-hot-toast";
import LeadModel from "../views/ui/LeadModel";

const user = JSON.parse(localStorage.getItem("bicuserData"));

const AgentForm = () => {
  const navigate = useNavigate();
  const [fetchLatestUser, setFetchLatestUser] = useState(false);
  const [load, setLoad] = useState(false);
  const [leaders, setLeader] = useState([]);
  const [errors, setErrors] = useState({});
  const [userRate, setUseRate] = useState({
    greeting: { rateVal: 0 },
    accuracy: { rateVal: 0 },
    building: { rateVal: 0 },
    presenting: { rateVal: 0 },
    closing: { rateVal: 0 },
    bonus: { rateVal: 0 },
  });

  const [evaluation, setEvaluation] = useState({
    email: user?.email || "",
    leadId: "",
    agentName: "",
    mod: "",
    responsetime: "",
    teamleader: "",
    greetings: "",
    greetingsReason: "",
    greetingsOtherComment: "",
    accuracy: "",
    building: "",
    presenting: "",
    closing: "",
    bonus: "",
    evaluationsummary: "",
    rating: " ",
  });

  const validateForm = () => {
    const newErrors = {};
    if (!evaluation.leadId.trim()) newErrors.leadId = "Lead ID is required";
    if (!evaluation.agentName.trim())
      newErrors.agentName = "Agent name is required";
    if (!evaluation.mod) newErrors.mod = "Mode is required";
    if (!evaluation.responsetime)
      newErrors.responsetime = "Response time is required";
    if (!evaluation.teamleader)
      newErrors.teamleader = "Team leader is required";
    if (!evaluation.greetings)
      newErrors.greetings = "Greetings rating is required";
    if (!evaluation.accuracy)
      newErrors.accuracy = "Accuracy rating is required";
    if (!evaluation.building)
      newErrors.building = "Building rating is required";
    if (!evaluation.presenting)
      newErrors.presenting = "Presenting rating is required";
    if (!evaluation.closing) newErrors.closing = "Closing rating is required";
    if (!evaluation.bonus) newErrors.bonus = "Bonus rating is required";
    if (!evaluation.evaluationsummary.trim())
      newErrors.evaluationsummary = "Summary is required";

    // Greetings reason validation
    if (!evaluation.greetings) {
      newErrors.greetings = "Greetings rating is required";
    } else if (evaluation.greetings === "Not upto the mark") {
      if (!evaluation.greetingsReason) {
        newErrors.greetingsReason = "Please select a reason for poor greeting";
      } else if (
        evaluation.greetingsReason === "Other" &&
        !evaluation.greetingsOtherComment.trim()
      ) {
        newErrors.greetingsOtherComment = "Please specify your reason";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlerChangeEvl = (name, value) => {
    setEvaluation((pre) => ({
      ...pre,
      [name]: value,
    }));
    // Clear error when field is changed
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlerDel = async (id) => {
    const { data } = await leaddelete(id);
    if (data.success) {
      fetchleaders();
    }
  };

  const fetchlead = async () => {
    try {
      let data = await fetchleaders();
      setLeader(data);
    } catch (error) {
      toast.error("Failed to load leaders");
    }
  };

  useEffect(() => {
    fetchlead();
  }, []);

  useEffect(() => {
    if (fetchLatestUser) {
      fetchlead();
      setFetchLatestUser(false);
    }
  }, [fetchLatestUser]);

  useEffect(() => {
    const calTotalRating = () => {
      return Object.values(userRate).reduce(
        (total, cat) => total + cat.rateVal,
        0
      );
    };

    const total = calTotalRating();
    setEvaluation((pre) => ({
      ...pre,
      rating: total,
    }));
  }, [userRate]);

  const handlerEscForm = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setLoad(true);
    try {
      const getUser = JSON.parse(localStorage.getItem("bicuserData"));
      const id = getUser.id;

      // Prepare greetings data for submission
      let greetingsSubmission = [];
      if (evaluation.greetings === "Not upto the mark") {
        greetingsSubmission = ["Not upto the mark"]; // Always include the rating first
        if (evaluation.greetingsReason) {
          greetingsSubmission.push(evaluation.greetingsReason);
          if (
            evaluation.greetingsReason === "Other" &&
            evaluation.greetingsOtherComment
          ) {
            greetingsSubmission.push(evaluation.greetingsOtherComment);
          }
        }
      } else {
        greetingsSubmission = [evaluation.greetings];
      }

      const submissionData = {
        ...evaluation,
        greetings: greetingsSubmission,
        // Remove temporary fields that shouldn't go to the backend
        greetingsReason: undefined,
        greetingsOtherComment: undefined,
      };

      const data = await evaluationApi(submissionData);

      if (data.data.success) {
        // Reset form
        setEvaluation({
          email: user?.email || "",
          leadId: "",
          agentName: "",
          mod: "",
          responsetime: "",
          teamleader: "",
          greetings: "",
          greetingsReason: "",
          greetingsOtherComment: "",
          accuracy: "",
          building: "",
          presenting: "",
          closing: "",
          bonus: "",
          evaluationsummary: "",
          rating: "",
        });

        toast.success("Evaluation submitted successfully!");
        socket.emit("sent-notification", {
          id: id,
          username: getUser.name,
          description: "submitted Evaluation form!",
          userRoom: "notification-Room",
        });
        navigate("/bi/profile");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit evaluation"
      );
    } finally {
      setLoad(false);
    }
  };

  // Custom radio button component
  const CustomRadio = ({
    id,
    name,
    value,
    checked,
    onChange,
    label,
    description,
  }) => (
    <div className="mb-3 p-3 bg-light rounded">
      <FormGroup check>
        <Label check className="d-flex align-items-start gap-3">
          <Input
            type="radio"
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            className="mt-1"
          />
          <div>
            <span className="fw-medium">{label}</span>
            {description && (
              <div className="text-muted small mt-1">{description}</div>
            )}
          </div>
        </Label>
      </FormGroup>
    </div>
  );

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white text-center py-3">
              <h1 className="fw-bolder mb-0">BI COMM</h1>
              <h3 className="mb-0">Evaluation Form</h3>
            </div>

            <div className="card-body">
              {/* User Info Section */}
              <div className="mb-4">
                <h4 className="mb-3 border-bottom pb-2">Basic Information</h4>

                <FormGroup className="mb-3">
                  <Label for="email">Your Email</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter Your Email Here"
                    value={evaluation.email}
                    readOnly
                    className="bg-light"
                  />
                </FormGroup>

                <FormGroup className="mb-3">
                  <Label for="leadId">
                    Lead ID <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="leadId"
                    placeholder="Enter Lead ID Here"
                    value={evaluation.leadId}
                    onChange={(e) => handlerChangeEvl("leadId", e.target.value)}
                    invalid={!!errors.leadId}
                  />
                  <FormFeedback>{errors.leadId}</FormFeedback>
                </FormGroup>

                <FormGroup className="mb-3">
                  <Label for="agentName">
                    Agent Name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="text"
                    id="agentName"
                    placeholder="Enter Agent Name Here"
                    value={evaluation.agentName}
                    onChange={(e) =>
                      handlerChangeEvl("agentName", e.target.value)
                    }
                    invalid={!!errors.agentName}
                  />
                  <FormFeedback>{errors.agentName}</FormFeedback>
                </FormGroup>
              </div>

              {/* Team Leader Section */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0 border-bottom pb-2">
                    Team Leader <span className="text-danger">*</span>
                  </h4>
                  {user.role === "admin" && (
                    <LeadModel setFetchLatestUser={setFetchLatestUser} />
                  )}
                </div>

                {leaders?.data?.data?.length <= 0 ? (
                  <div className="text-center py-3">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <div className="list-group">
                    {leaders?.data?.data?.map((val, index) => (
                      <div className="list-group-item" key={index}>
                        <div className="d-flex justify-content-between align-items-center">
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="radio"
                                name="teamleader"
                                value={val.leadName}
                                checked={evaluation.teamleader === val.leadName}
                                onChange={(e) =>
                                  handlerChangeEvl("teamleader", e.target.value)
                                }
                              />
                              <span className="ms-2">{val.leadName}</span>
                            </Label>
                          </FormGroup>
                          {user.role === "admin" && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handlerDel(val._id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {errors.teamleader && (
                  <div className="text-danger small mt-1">
                    {errors.teamleader}
                  </div>
                )}
              </div>

              {/* Communication Mode */}
              <div className="mb-4">
                <h4 className="mb-3 border-bottom pb-2">
                  Mode of Communication <span className="text-danger">*</span>
                </h4>
                <div className="d-flex gap-4">
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="mod"
                        value="Chat"
                        checked={evaluation.mod === "Chat"}
                        onChange={(e) =>
                          handlerChangeEvl("mod", e.target.value)
                        }
                      />
                      <span className="ms-2">Chat</span>
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="mod"
                        value="Call"
                        checked={evaluation.mod === "Call"}
                        onChange={(e) =>
                          handlerChangeEvl("mod", e.target.value)
                        }
                      />
                      <span className="ms-2">Call</span>
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="mod"
                        value="Both"
                        checked={evaluation.mod === "Both"}
                        onChange={(e) =>
                          handlerChangeEvl("mod", e.target.value)
                        }
                      />
                      <span className="ms-2">Both</span>
                    </Label>
                  </FormGroup>
                </div>
                {errors.mod && (
                  <div className="text-danger small mt-1">{errors.mod}</div>
                )}
              </div>

              {/* Response Time */}
              <div className="mb-4">
                <h4 className="mb-3 border-bottom pb-2">
                  Response Time <span className="text-danger">*</span>
                </h4>
                <div className="d-flex gap-4">
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="responsetime"
                        value="With In An Hour"
                        checked={evaluation.responsetime === "With In An Hour"}
                        onChange={(e) =>
                          handlerChangeEvl("responsetime", e.target.value)
                        }
                      />
                      <span className="ms-2">With In An Hour</span>
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="responsetime"
                        value="Within A Day"
                        checked={evaluation.responsetime === "Within A Day"}
                        onChange={(e) =>
                          handlerChangeEvl("responsetime", e.target.value)
                        }
                      />
                      <span className="ms-2">Within A Day</span>
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="responsetime"
                        value="More Than One Day"
                        checked={
                          evaluation.responsetime === "More Than One Day"
                        }
                        onChange={(e) =>
                          handlerChangeEvl("responsetime", e.target.value)
                        }
                      />
                      <span className="ms-2">More Than One Day</span>
                    </Label>
                  </FormGroup>
                </div>
                {errors.responsetime && (
                  <div className="text-danger small mt-1">
                    {errors.responsetime}
                  </div>
                )}
              </div>

              {/* Evaluation Sections */}
              <div className="mb-4">
                {/* Greetings Section */}
                {/* Greetings Section */}
                {/* Greetings Section */}
                <div className="mb-4">
                  <h3>
                    Greetings <span className="text-danger">*</span>
                  </h3>

                  {/* Positive Option */}
                  <CustomRadio
                    id="greeting-positive"
                    name="greetings"
                    value="Uses a professional and friendly Greeting"
                    checked={
                      evaluation.greetings ===
                      "Uses a professional and friendly Greeting"
                    }
                    onChange={(e) => {
                      handlerChangeEvl("greetings", e.target.value);
                      setUseRate((prev) => ({
                        ...prev,
                        greeting: { rateVal: 16 },
                      }));
                      handlerChangeEvl("greetingsReason", "");
                      handlerChangeEvl("greetingsOtherComment", "");
                    }}
                    label="Professional greeting"
                  />

                  {/* Negative Option */}
                  <CustomRadio
                    id="greeting-negative"
                    name="greetings"
                    value="Not upto the mark"
                    checked={evaluation.greetings === "Not upto the mark"}
                    onChange={(e) => {
                      handlerChangeEvl("greetings", e.target.value);
                      setUseRate((prev) => ({
                        ...prev,
                        greeting: { rateVal: 0 },
                      }));
                    }}
                    label="Not up to standard"
                  />

                  {/* Reasons Only Appear If "Not upto the mark" is selected */}
                  {evaluation.greetings === "Not upto the mark" && (
                    <div className="mt-3 p-3 bg-light rounded">
                      <h5>
                        Select Reason <span className="text-danger">*</span>
                      </h5>

                      {/* Standard Reasons */}
                      {[
                        "Irrelevant Response",
                        "No Booking Approach",
                        "Concern Handling",
                      ].map((reason) => (
                        <FormGroup check key={reason}>
                          <Label check>
                            <Input
                              type="radio"
                              name="greetingsReason"
                              value={reason}
                              checked={evaluation.greetingsReason === reason}
                              onChange={(e) => {
                                handlerChangeEvl(
                                  "greetingsReason",
                                  e.target.value
                                );
                                handlerChangeEvl("greetingsOtherComment", ""); // Clear other comment if a standard reason is selected
                              }}
                            />
                            <span className="ms-2">{reason}</span>
                          </Label>
                        </FormGroup>
                      ))}

                      {/* Other Option */}
                      <FormGroup check>
                        <Label check>
                          <Input
                            type="radio"
                            name="greetingsReason"
                            value="Other"
                            checked={evaluation.greetingsReason === "Other"}
                            onChange={(e) =>
                              handlerChangeEvl(
                                "greetingsReason",
                                e.target.value
                              )
                            }
                          />
                          <span className="ms-2">Other</span>
                        </Label>
                      </FormGroup>

                      {/* Comment for "Other" */}
                      {evaluation.greetingsReason === "Other" && (
                        <div className="mt-3">
                          <Label>
                            Comment <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="textarea"
                            value={evaluation.greetingsOtherComment || ""}
                            onChange={(e) =>
                              handlerChangeEvl(
                                "greetingsOtherComment",
                                e.target.value
                              )
                            }
                            placeholder="Enter details..."
                          />
                          {errors.greetingsOtherComment && (
                            <div className="text-danger small mt-1">
                              {errors.greetingsOtherComment}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Accuracy & Compliance */}
                <div className="mb-4">
                  <h3>
                    Accuracy & Compliance <span className="text-danger">*</span>
                  </h3>
                  <p className="text-muted">
                    Provides accurate and up-to-date information about the
                    company's products or services, adhering to all relevant
                    scripts and policies.
                  </p>

                  <CustomRadio
                    id="accuracy-positive"
                    name="accuracy"
                    value="Asks clear and concise questions"
                    checked={
                      evaluation.accuracy === "Asks clear and concise questions"
                    }
                    onChange={(e) => {
                      handlerChangeEvl("accuracy", e.target.value);
                      setUseRate((pre) => ({
                        ...pre,
                        accuracy: { rateVal: 16 },
                      }));
                    }}
                    label="Asks clear and concise questions to accurately identify the customer's needs or inquiries."
                  />

                  <CustomRadio
                    id="accuracy-negative"
                    name="accuracy"
                    value="Not upto the mark"
                    checked={evaluation.accuracy === "Not upto the mark"}
                    onChange={(e) => {
                      handlerChangeEvl("accuracy", e.target.value);
                      setUseRate((pre) => ({
                        ...pre,
                        accuracy: { rateVal: 0 },
                      }));
                    }}
                    label="Not upto the mark"
                  />
                  {errors.accuracy && (
                    <div className="text-danger small mt-1">
                      {errors.accuracy}
                    </div>
                  )}
                </div>

                {/* Building Rapport & Discovery */}
                <div className="mb-4">
                  <h3>
                    Building Rapport & Discovery{" "}
                    <span className="text-danger">*</span>
                  </h3>
                  <p className="text-muted">
                    Identifies potential pain points or opportunities where the
                    product/service can provide value to the customer.
                  </p>

                  <CustomRadio
                    id="building-positive"
                    name="building"
                    value="Demonstrates Active Listening Skills"
                    checked={
                      evaluation.building ===
                      "Demonstrates Active Listening Skills"
                    }
                    onChange={(e) => {
                      handlerChangeEvl("building", e.target.value);
                      setUseRate((pre) => ({
                        ...pre,
                        building: { rateVal: 16 },
                      }));
                    }}
                    label="Demonstrates active listening skills and asks open-ended questions to understand the customer's needs and potential interest in the product/service."
                  />

                  <CustomRadio
                    id="building-negative"
                    name="building"
                    value="Not Upto The Mark"
                    checked={evaluation.building === "Not Upto The Mark"}
                    onChange={(e) => {
                      handlerChangeEvl("building", e.target.value);
                      setUseRate((pre) => ({
                        ...pre,
                        building: { rateVal: 0 },
                      }));
                    }}
                    label="Not upto the mark"
                  />
                  {errors.building && (
                    <div className="text-danger small mt-1">
                      {errors.building}
                    </div>
                  )}
                </div>

                {/* Presenting Solutions & Making the Sale */}
                <div className="mb-4">
                  <h3>
                    Presenting Solutions & Making the Sale{" "}
                    <span className="text-danger">*</span>
                  </h3>
                  <p className="text-muted">
                    Clearly and concisely presents the product/service features
                    and benefits tailored to the customer's needs identified
                    earlier.
                  </p>

                  <CustomRadio
                    id="presenting-positive"
                    name="presenting"
                    value="Attempts to overcome objections professionally"
                    checked={
                      evaluation.presenting ===
                      "Attempts to overcome objections professionally"
                    }
                    onChange={(e) => {
                      handlerChangeEvl("presenting", e.target.value);
                      setUseRate((pre) => ({
                        ...pre,
                        presenting: { rateVal: 16 },
                      }));
                    }}
                    label="Attempts to overcome objections professionally using established techniques and effectively guides the customer towards booking an appointment."
                  />

                  <CustomRadio
                    id="presenting-negative"
                    name="presenting"
                    value="Not upto the mark"
                    checked={evaluation.presenting === "Not upto the mark"}
                    onChange={(e) => {
                      handlerChangeEvl("presenting", e.target.value);
                      setUseRate((pre) => ({
                        ...pre,
                        presenting: { rateVal: 0 },
                      }));
                    }}
                    label="Not upto the mark"
                  />
                  {errors.presenting && (
                    <div className="text-danger small mt-1">
                      {errors.presenting}
                    </div>
                  )}
                </div>

                {/* Call Closing & Securing Commitment */}
                <div className="mb-4">
                  <h3>
                    Call Closing & Securing Commitment{" "}
                    <span className="text-danger">*</span>
                  </h3>
                  <p className="text-muted">
                    Confirms the customer's details and secures their commitment
                    for the sale or appointment. Thanks the customer for their
                    time and offers further assistance if needed.
                  </p>

                  <CustomRadio
                    id="closing-positive"
                    name="closing"
                    value="Professionally summarizes key points"
                    checked={
                      evaluation.closing ===
                      "Professionally summarizes key points"
                    }
                    onChange={(e) => {
                      handlerChangeEvl("closing", e.target.value);
                      setUseRate((pre) => ({
                        ...pre,
                        closing: { rateVal: 16 },
                      }));
                    }}
                    label="Professionally summarizes key points discussed and clearly outlines the next steps, including the call to action (e.g., callback, appointment booking)."
                  />

                  <CustomRadio
                    id="closing-negative"
                    name="closing"
                    value="Not upto the mark"
                    checked={evaluation.closing === "Not upto the mark"}
                    onChange={(e) => {
                      handlerChangeEvl("closing", e.target.value);
                      setUseRate((pre) => ({
                        ...pre,
                        closing: { rateVal: 0 },
                      }));
                    }}
                    label="Not upto the mark"
                  />
                  {errors.closing && (
                    <div className="text-danger small mt-1">
                      {errors.closing}
                    </div>
                  )}
                </div>

                {/* Bonus Point */}
                <div className="mb-4">
                  <h3>
                    Bonus Point <span className="text-danger">*</span>
                  </h3>

                  <CustomRadio
                    id="bonus-positive"
                    name="bonus"
                    value="Goes above and beyond by exceeding customer"
                    checked={
                      evaluation.bonus ===
                      "Goes above and beyond by exceeding customer"
                    }
                    onChange={(e) => {
                      handlerChangeEvl("bonus", e.target.value);
                      setUseRate((pre) => ({ ...pre, bonus: { rateVal: 16 } }));
                    }}
                    label="Goes above and beyond by exceeding customer expectations, offering additional solutions, demonstrating exceptional product knowledge, or successfully overcoming a significant objection."
                  />

                  <CustomRadio
                    id="bonus-negative"
                    name="bonus"
                    value="Not upto the mark"
                    checked={evaluation.bonus === "Not upto the mark"}
                    onChange={(e) => {
                      handlerChangeEvl("bonus", e.target.value);
                      setUseRate((pre) => ({ ...pre, bonus: { rateVal: 0 } }));
                    }}
                    label="Not upto the mark"
                  />
                  {errors.bonus && (
                    <div className="text-danger small mt-1">{errors.bonus}</div>
                  )}
                </div>
              </div>

              {/* Evaluation Summary */}
              <div className="mb-4">
                <h4 className="mb-3 border-bottom pb-2">
                  Evaluation Summary <span className="text-danger">*</span>
                </h4>
                <FormGroup>
                  <Label for="evaluationsummary">Additional Comments</Label>
                  <Input
                    type="textarea"
                    id="evaluationsummary"
                    placeholder="Enter your evaluation summary here..."
                    rows="4"
                    value={evaluation.evaluationsummary}
                    onChange={(e) =>
                      handlerChangeEvl("evaluationsummary", e.target.value)
                    }
                    invalid={!!errors.evaluationsummary}
                  />
                  <FormFeedback>{errors.evaluationsummary}</FormFeedback>
                </FormGroup>
              </div>

              {/* Submit Button */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  className="btn btn-primary btn-lg px-5 py-2"
                  onClick={handlerEscForm}
                  disabled={load}
                >
                  {load ? (
                    <>
                      <BtnLoader /> Submitting...
                    </>
                  ) : (
                    "Submit Evaluation"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentForm;
