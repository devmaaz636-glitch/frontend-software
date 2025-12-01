import React, { useEffect, useState } from "react";
import { Input } from "reactstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { escalationApi, fetchleaders, leaddelete } from "../features/userApis";
import LeadModel from "../views/ui/LeadModel";
import { useNavigate } from "react-router-dom";
import BtnLoader from "./loader/BtnLoader";
import { socket } from "../socket";
import { Form } from "react-bootstrap";
import toast from "react-hot-toast";

const EscalationForm = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("bicuserData"));
  const [otherReason, setOtherReason] = useState("");
  const [leaders, setLeader] = useState([]);
  const [load, setLoad] = useState(false);
  const [fetchLatestUser, setFetchLatestUser] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [escalation, setEscalation] = useState({
    email: user?.email || "",
    leadId: "",
    evaluatedBy: "",
    agentName: "",
    teamLeader: "",
    leadSource: "",
    leadStatus: "",
    escSeverity: "",
    issueIden: "",
    escAction: "",
    successmaration: "",
    userrating: "",
    // audio: null,
    otherIssue: '',
  });

  const handlerEscalation = (name, value) => {
    setEscalation((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const handlerOtherChange = (e) => {
    setOtherReason(e.target.value);
  };

  useEffect(() => {
    if (otherReason.trim() !== "") {
      handlerEscalation("escAction", otherReason);
    }
  }, [otherReason]);

  const fetchlead = async () => {
    let data = await fetchleaders();
    setLeader(data);
  };

  useEffect(() => {
    fetchlead();
  }, []);

  useEffect(() => {
    const fetchlead = async () => {
      let data = await fetchleaders();
      setLeader(data);
      setFetchLatestUser(false);
    };
    fetchlead();
  }, [fetchLatestUser]);

  const handlerDel = async (id) => {
    const { data } = await leaddelete(id);
    if (data.success) {
      fetchlead();
    }
  };

  const handlerEscForm = async () => {
    setLoad(true);

    if (escalation.issueIden === "Other" && escalation.otherIssue.trim() !== "") {
    escalation.issueIden = escalation.otherIssue.trim(); // Set actual value instead of "Other"
  }
  if (escalation.escAction === "Other" && otherReason.trim() !== "") {
  escalation.escAction = otherReason.trim();
}


    if (
      escalation.email.trim() === "" ||
      escalation.leadId.trim() === "" ||
      escalation.evaluatedBy.trim() === "" ||
      escalation.agentName.trim() === "" ||
      escalation.teamLeader.trim() === "" ||
      escalation.leadSource.trim() === "" ||
      escalation.leadStatus.trim() === "" ||
      escalation.escSeverity.trim() === "" ||
      escalation.issueIden.trim() === "" ||
      escalation.userrating.trim() === "" ||
      (escalation.escAction === "Call" && otherReason.trim() === "") ||
      escalation.successmaration.trim() === ""
    ) {
      toast.error("Please fill fields!");
      // alert("Please fill fields!");
      setLoad(false);
      return;
    } else {
      const getUser = JSON.parse(localStorage.getItem("bicuserData"));
      const id = getUser.id;
      escalation._id = id;
      const data = await escalationApi(escalation);
      if (data.data.success === true) {
        setOtherReason("");
        setEscalation({
          email: "",
          leadId: "",
          evaluatedBy: "",
          agentName: "",
          teamLeader: "",
          leadSource: "",
          leadStatus: "",
          escSeverity: "",
          issueIden: "",
          escAction: "",
          successmaration: "",
          userrating: "",
          // audio: null,
          otherIssue: '',
        });
        // alert("Successfully Created!");
        toast.success("Successfully Created! ");

        socket.emit("sent-notification", {
          id: id,
          username: getUser.name,
          description: "submitted Escalation form!",
          userRoom: "notification-Room",
        });
        navigate("/bi/profile");
        window.location.reload();
        setLoad(false);
      } else {
        setLoad(false);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="w-50 bg-gray d-flex flex-column gap-3">
        <div className="bg-card-color rounded d-flex justify-content-center flex-column align-items-center my-60px mx-50px">
          <h1 className="fw-bolder">BI COMM</h1>
          <h2 className="text-danger">Escalation Form</h2>
        </div>
        <div className="bg-card-color rounded d-flex justify-content-center flex-column ">
          <div className="d-flex flex-start p-4">
            <label>
              Enter your email: <br />
              <Input
                className="border-none"
                type="email"
                placeholder="Enter Your Email Here"
                value={escalation.email}
                readOnly
                // onChange={(e) => handlerEscalation("email", e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="bg-card-color rounded d-flex justify-content-center flex-column">
          <div className="d-flex flex-start p-4">
            <label>
              lead ID: <br />
              <Input
                className="border-none"
                type="text"
                placeholder="Enter Your Lead ID Here"
                value={escalation.leadId}
                onChange={(e) => handlerEscalation("leadId", e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="bg-card-color rounded d-flex justify-content-center flex-column">
          <div className="d-flex flex-start p-4">
            <label>
              Evaluated by: <br />
              <Input
                className="border-none"
                type="text"
                placeholder="Enter Your Name Here"
                value={escalation.evaluatedBy}
                onChange={(e) =>
                  handlerEscalation("evaluatedBy", e.target.value)
                }
              />
            </label>
          </div>
        </div>
        <div className="bg-card-color rounded d-flex justify-content-center flex-column">
          <div className="d-flex flex-start p-4">
            <label>
              Agent Name: <br />
              <Input
                className="border-none"
                type="text"
                placeholder="Enter Agent Name Here"
                value={escalation.agentName}
                onChange={(e) => handlerEscalation("agentName", e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="bg-card-color rounded d-flex justify-content-center flex-column">
          <div className="d-flex justify-content-between align-items-center mx-4">
            <h3 className="mt-2">Team Leader</h3>
            {user.role === "admin" && (
              <div>
                <LeadModel setFetchLatestUser={setFetchLatestUser} />
              </div>
            )}
          </div>
          {leaders?.data?.data?.length < 0 ? (
            <div>Loading...</div>
          ) : (
            leaders?.data?.data?.map((val, index) => (
              <form
                class="bg-gray px-4 py-2 mt-0 w-100  d-flex justify-content-between align-items-center"
                key={index}
              >
                <label className="w-100">
                  <Input
                    className="m-1"
                    type="radio"
                    name="Department"
                    id="lead"
                    value={`${val.leadName}`}
                    onChange={(e) =>
                      handlerEscalation("teamLeader", e.target.value)
                    }
                    checked={escalation.teamLeader === `${val.leadName}`}
                  ></Input>
                  {val.leadName}
                </label>
                {user.role === "admin" && (
                  <i
                    class="bi bi-x-octagon"
                    style={{ fontSize: "20px", cursor: "pointer" }}
                    onClick={() => handlerDel(val._id)}
                  ></i>
                )}
                <br />
              </form>
            ))
          )}
        </div>
        <div className="bg-card-color rounded d-flex justify-content-center flex-column">
          <div className=" p-4">
            <h3>Lead Source</h3>
            <label>
              <Input
                className="m-2"
                type="radio"
                id="social"
                name="account"
                value="Facebook"
                checked={escalation.leadSource === "Facebook"}
                onChange={(e) =>
                  handlerEscalation("leadSource", e.target.value)
                }
              />
              Facebook
            </label>{" "}
            <br />
            <label>
              <Input
                className="m-2"
                type="radio"
                id="social"
                name="account"
                value="Instagram"
                checked={escalation.leadSource === "Instagram"}
                onChange={(e) =>
                  handlerEscalation("leadSource", e.target.value)
                }
              />
              Instagram
            </label>{" "}
            <br />
            <label>
              <Input
                className="m-2"
                type="radio"
                id="social"
                name="account"
                value="Live chat"
                checked={escalation.leadSource === "Live chat"}
                onChange={(e) =>
                  handlerEscalation("leadSource", e.target.value)
                }
              />
              Live chat
            </label>{" "}
            <br />
            <label>
              <Input
                className="m-2"
                type="radio"
                id="social"
                name="account"
                value="Call"
                checked={escalation.leadSource === "Call"}
                onChange={(e) =>
                  handlerEscalation("leadSource", e.target.value)
                }
              />
              Call
            </label>{" "}
            <br />
            <label>
              <Input
                className="m-2"
                type="radio"
                id="social"
                name="account"
                value="WhatsApp"
                checked={escalation.leadSource === "WhatsApp"}
                onChange={(e) =>
                  handlerEscalation("leadSource", e.target.value)
                }
              />
              WhatsApp
            </label>{" "}
            <br />
            <label>
              <Input
                className="m-2"
                type="radio"
                id="social"
                name="account"
                value="PPC"
                checked={escalation.leadSource === "PPC"}
                onChange={(e) =>
                  handlerEscalation("leadSource", e.target.value)
                }
              />
              PPC
            </label>{" "}
            <br />
            <label>
              <Input
                className="m-2"
                type="radio"
                id="social"
                name="account"
                value="Tiktok"
                checked={escalation.leadSource === "Tiktok"}
                onChange={(e) =>
                  handlerEscalation("leadSource", e.target.value)
                }
              />
              TikTok
            </label>{" "}
            <br />
            <label>
              <Input
                className="m-2"
                type="radio"
                id="social"
                name="account"
                value="Snapchat"
                checked={escalation.leadSource === "Snapchat"}
                onChange={(e) =>
                  handlerEscalation("leadSource", e.target.value)
                }
              />
              Snapchat
            </label>{" "}
            <br />
            <label>
              <Input
                className="m-2"
                type="radio"
                id="social"
                name="account"
                value="SEO"
                checked={escalation.leadSource === "SEO"}
                onChange={(e) =>
                  handlerEscalation("leadSource", e.target.value)
                }
              />
              SEO
            </label>{" "}
            <br />
          </div>
        </div>
        {/* <div className="bg-card-color rounded d-flex justify-content-center flex-column">
          <div className="p-4">
            <h3>User Rating</h3>
            <label>
              <Input
                className="m-2"
                type="radio"
                id="userrate"
                name="userrate"
                value="bad"
                checked={escalation.userrating === "bad"}
                onChange={(e) =>
                  handlerEscalation("userrating", e.target.value)
                }
              />
              Bad
            </label>{" "}
            <br />
            <label>
              <Input
                className="m-2"
                type="radio"
                id="userrate"
                name="userrate"
                value="average"
                checked={escalation.userrating === "average"}
                onChange={(e) =>
                  handlerEscalation("userrating", e.target.value)
                }
              />
              Average
            </label>{" "}
            <br />
            <label>
              <Input
                className="m-2"
                type="radio"
                id="userrate"
                name="userrate"
                value="good"
                checked={escalation.userrating === "good"}
                onChange={(e) =>
                  handlerEscalation("userrating", e.target.value)
                }
              />
              Good
            </label>{" "}
            <br />
          </div>
        </div> */}
        <div className="bg-card-color rounded d-flex justify-content-center flex-column">
          <div className="p-4">
            <h3>User Rating</h3>
            <Form.Select
              aria-label="User Rating Option"
              value={escalation.userrating}
              onChange={(e) => handlerEscalation("userrating", e.target.value)}
            >
              <option value="">Open this select menu</option>
              <option value="good">Good</option>
              <option value="average">Average</option>
              <option value="bad">Bad</option>
            </Form.Select>
          </div>
        </div>

        <div className="bg-card-color rounded d-flex justify-content-center flex-column">
          <div className="d-flex flex-start p-4">
            <label>
              <h4>Lead Status</h4>
              <p>What is the parked status of the lead?</p>
              <label for="exampleFormControlTextarea1">Other</label>
              <textarea
                class="form-control mt-1"
                placeholder="Your Answer"
                id="exampleFormControlTextarea1"
                rows="3"
                value={escalation.leadStatus}
                onChange={(e) =>
                  handlerEscalation("leadStatus", e.target.value)
                }
              ></textarea>
            </label>
          </div>
        </div>
        <div className="bg-card-color rounded d-flex justify-content-center flex-column">
          <div className="p-4">
            <h3>Escalation Severity</h3>
            <label className="d-flex align-items-center">
              <Input
                className="m-3"
                type="radio"
                id="sev"
                name="Severity"
                value="Urgent Action required"
                checked={escalation.escSeverity === "Urgent Action required"}
                onChange={(e) =>
                  handlerEscalation("escSeverity", e.target.value)
                }
              />
              Urgent Action Required
            </label>
            <label className="d-flex align-items-center">
              <Input
                className="m-3"
                type="radio"
                id="sev"
                name="Severity"
                value="High"
                checked={escalation.escSeverity === "High"}
                onChange={(e) =>
                  handlerEscalation("escSeverity", e.target.value)
                }
              />
              High
            </label>
            <label className="d-flex align-items-center">
              <Input
                className="m-3"
                type="radio"
                id="sev"
                name="Severity"
                value="Repeated"
                checked={escalation.escSeverity === "Repeated"}
                onChange={(e) =>
                  handlerEscalation("escSeverity", e.target.value)
                }
              />
              Repeated
            </label>
          </div>
        </div>
        <div className="bg-card-color rounded d-flex justify-content-center flex-column">
  <div className="p-4">
    <h3>Issue Identification</h3>

    {/* Facebook */}
    <label className="d-flex align-items-center gap-1">
      <Input
        className="m-3"
        type="radio"
        name="Issue"
        value="Facebook"
        checked={escalation.issueIden === "Facebook"}
        onChange={(e) => handlerEscalation("issueIden", e.target.value)}
      />
      Product Knowledge: Sales rep lacked knowledge of product features and benefits
    </label>

    {/* Instagram */}
    <label className="d-flex align-items-center gap-1">
      <Input
        className="m-3"
        type="radio"
        name="Issue"
        value="Instagram"
        checked={escalation.issueIden === "Instagram"}
        onChange={(e) => handlerEscalation("issueIden", e.target.value)}
      />
      Sales Process: Deviation from established sales process (e.g., not qualifying leads, not handling objections properly)
    </label>

    {/* Live chat */}
    <label className="d-flex align-items-center">
      <Input
        className="m-3"
        type="radio"
        name="Issue"
        value="Live chat"
        checked={escalation.issueIden === "Live chat"}
        onChange={(e) => handlerEscalation("issueIden", e.target.value)}
      />
      Communication: Poor communication skills (e.g., unclear explanations, unprofessional language)
    </label>

    {/* Call */}
    <label className="d-flex align-items-center">
      <Input
        className="m-3"
        type="radio"
        name="Issue"
        value="Call"
        checked={escalation.issueIden === "Call"}
        onChange={(e) => handlerEscalation("issueIden", e.target.value)}
      />
      Customer Focus: Not actively listening to customer needs, aggressive sales tactics
    </label>

    {/* WhatsApp */}
    <label className="d-flex align-items-center">
      <Input
        className="m-3"
        type="radio"
        name="Issue"
        value="WhatsApp"
        checked={escalation.issueIden === "WhatsApp"}
        onChange={(e) => handlerEscalation("issueIden", e.target.value)}
      />
      SOP's: Failing to update BITRIX or BOOKING Software in a proper manner
    </label>

    {/* Other option */}
    <label className="d-flex align-items-start flex-column mt-3">
      <div className="d-flex align-items-center">
        <Input
          className="m-3"
          type="radio"
          name="Issue"
          value="Other"
          checked={escalation.issueIden === "Other"}
          onChange={(e) => handlerEscalation("issueIden", e.target.value)}
        />
        <span>Other</span>
      </div>

      {escalation.issueIden === "Other" && (
        <Input
          type="text"
          className="ms-5 mt-1 w-75"
          placeholder="Please specify the issue..."
          value={escalation.otherIssue || ""}
          onChange={(e) => handlerEscalation("otherIssue", e.target.value)}
        />
      )}
    </label>
  </div>
</div>
        <div className="bg-card-color rounded d-flex justify-content-center flex-column">
          <div className="p-4">
            <h3>Escalation Action</h3>
            <label className="d-flex align-items-center">
              <Input
                className="m-3"
                type="radio"
                id="action"
                name="Action"
                value="Facebook"
                checked={escalation.escAction === "Facebook"}
                onChange={(e) => handlerEscalation("escAction", e.target.value)}
              />
              Coaching Required: Recommend coaching for the sales rep by the
              Sales Manager.
            </label>{" "}
            <br />
            <label className="d-flex align-items-center">
              <Input
                className="m-3"
                type="radio"
                id="action"
                name="Action"
                value="Instagram"
                checked={escalation.escAction === "Instagram"}
                onChange={(e) => handlerEscalation("escAction", e.target.value)}
              />
              Additional Training Needed: Recommend specific sales training for
              the rep..
            </label>{" "}
            <br />
            <label className="d-flex align-items-center">
              <Input
                className="m-3"
                type="radio"
                id="action"
                name="Action"
                value="Live chat"
                checked={escalation.escAction === "Live chat"}
                onChange={(e) => handlerEscalation("escAction", e.target.value)}
              />
              Policy Violation: Report potential policy violation to the Sales
              Manager.
            </label>{" "}
            <br />
            <label className="d-flex align-items-start flex-column mt-3">
  <div className="d-flex align-items-center">
    <Input
      className="m-3"
      type="radio"
      name="Action"
      value="Other"
      checked={escalation.escAction === "Other"}
      onChange={(e) => handlerEscalation("escAction", e.target.value)}
    />
    <span>Other</span>
  </div>

  {escalation.escAction === "Other" && (
    <textarea
      className="form-control mt-1 ms-5 w-75"
      placeholder="Please specify the action..."
      value={otherReason}
      onChange={(e) => handlerOtherChange(e)}
    ></textarea>
  )}
</label>

          </div>
        </div>
        <div className="bg-card-color rounded d-flex justify-content-center flex-column">
          <div className="d-flex flex-start p-4">
            <label>
              <h4>Additional information</h4>
              <p>Provide any additional information relevant to the issue</p>
              <label for="exampleFormControlTextarea1">Other</label>
              <textarea
                class="form-control mt-1"
                id="exampleFormControlTextarea1"
                placeholder="Your Answer"
                rows="3"
                value={escalation.successmaration}
                onChange={(e) =>
                  handlerEscalation("successmaration", e.target.value)
                }
              ></textarea>
            </label>
          </div>
        </div>
        <div className="input-group px-4">
  <h5>Attach relevant recording (call), transcript (chat), or file (image, PDF, doc).</h5>
  <input
    type="file"
    accept="audio/*,image/*,application/pdf,.doc,.docx,.txt"
    name="agentaudio"
    className="form-control"
    id="inputGroupFile02"
    multiple
    onChange={(e) => {
      const newFiles = Array.from(e.target.files);

      // Prevent duplicates
      const updatedFiles = [...selectedFiles];
      newFiles.forEach(file => {
        if (!updatedFiles.some(f => f.name === file.name && f.lastModified === file.lastModified)) {
          updatedFiles.push(file);
        }
      });

      setSelectedFiles(updatedFiles);
      handlerEscalation("audio", updatedFiles);
    }}
  />
</div>
        <div className="p-4">
          <button
            type="button"
            class="btn btn-outline-success btn-lg d-flex gap-2 justify-content-center align-content-center"
            onClick={handlerEscForm}
            disabled={load}
            style={{ backgroundColor: "#39c449", color: "#fff" }}
          >
            Submit {load && <BtnLoader />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EscalationForm;
