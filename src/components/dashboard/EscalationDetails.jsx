import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EscalationsContext } from "../../context/EscalationsContext";

import { CardBody, Col, Table } from "reactstrap";

import { Card } from "react-bootstrap";

const EscalationDetails = () => {
  const navigate = useNavigate();
  // const [audioUrls, setAudioUrls] = useState([]);

  const location = useLocation();
  const { filteredEscalations } = useContext(EscalationsContext);

  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 15;

  const queryParams = new URLSearchParams(location.search);
  const filter = queryParams.get("filter")?.toLowerCase();

  const filteredData = filter
    ? filteredEscalations.filter(
        (escalation) => escalation.userrating.toLowerCase() === filter
      )
    : filteredEscalations;

  if (!filteredData || filteredData.length === 0) {
    return <p>No escalations to display.</p>;
  }

  const lastIndex = currentPage * rowsPerPage;
  const firstIndex = lastIndex - rowsPerPage;

  const records = filteredData?.slice(firstIndex, lastIndex) || [];

  const npage = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const numbers = [...Array(npage + 1).keys()].slice(1);

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changePage(id) {
    setCurrentPage(id);
  }

  function nextPage() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }

  const handlerUserReport = (name) => {
    navigate(`/bi/agentReport/${name}`);
  };

  return (
    <div className="p-4">
      <h1>
        Escalations Rating -{" "}
        {filter ? filter.charAt(0).toUpperCase() + filter.slice(1) : "All"}
      </h1>
      <div className="sc-none" style={{ overflowX: "scroll" }}>
        <Col>
          <Card
            style={{
              display: "block",
              maxWidth: "100%",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="rounded"
          >
            <CardBody style={{ width: "max-content" }}>
              <Table bordered className="table-striped rounded">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Lead ID</th>
                    <th>Evaluated by</th>
                    <th>Agent Name</th>
                    <th>Team Leader</th>
                    <th>Lead Source</th>
                    <th>User Rating</th>
                    <th>Lead Status</th>
                    <th>Escalation Severity</th>
                    <th>Issue Identification</th>
                    <th>Escalation Action</th>
                    <th>Additional successrmation</th>
                    {/* <th>Audio</th> */}
                    {/* {user?.role === "admin" && <th>Delete</th>} */}
                  </tr>
                </thead>

                <tbody className="">
                  {records.map((val, index) => (
                    <tr
                      style={{ cursor: "pointer" }}
                      key={index}
                      onClick={() => handlerUserReport(val?.agentName)}
                    >
                      <th scope="row">{index + 1}</th>
                      <td>{val?.useremail}</td>
                      <td>{val?.leadID}</td>
                      <td>{val?.evaluatedby}</td>
                      <td>{val?.agentName}</td>
                      <td>{val?.teamleader}</td>
                      <td>{val?.leadsource}</td>
                      <td>{val?.userrating}</td>
                      <td>{val?.leadstatus}</td>
                      <td>{val?.escalationseverity}</td>
                      <td>{val?.issueidentification}</td>
                      <td>{val?.escalationaction}</td>
                      <td>{val?.additionalsuccessrmation}</td>
                      {/* <td>
                        <div className="">
                          {audioUrls[firstIndex + index] ? (
                            <audio controls>
                              <source
                                src={audioUrls[firstIndex + index]}
                                type="audio/mpeg"
                              />
                            </audio>
                          ) : (
                            "Loading..."
                          )}
                        </div>
                      </td> */}
                      {/* {user?.role === "admin" && (
                        <td>
                          <MdDelete
                            size={30}
                            color="red"
                            onClick={() => handleDeleteRow(val._id)}
                          />
                        </td>
                      )} */}
                    </tr>
                  ))}
                </tbody>
              </Table>
              <nav>
                <ul className="pagination">
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={(e) => {
                        e.preventDefault();
                        prePage();
                      }}
                    >
                      Previous
                    </button>
                  </li>
                  {numbers.map((n, i) => (
                    <li
                      className={`page-item ${
                        currentPage === n ? "active" : ""
                      }`}
                      key={i}
                    >
                      <button
                        className="page-link"
                        onClick={(e) => {
                          e.preventDefault();
                          changePage(n);
                        }}
                      >
                        {n}
                      </button>
                    </li>
                  ))}
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={(e) => {
                        e.preventDefault();
                        nextPage();
                      }}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </CardBody>
          </Card>
        </Col>
      </div>
    </div>
  );
};

export default EscalationDetails;
