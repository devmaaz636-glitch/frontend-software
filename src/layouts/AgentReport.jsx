import React, { useState, useEffect } from "react";
import { retrieveReport } from "../features/userApis";
import { useParams } from "react-router-dom";
import { Col, Card, CardTitle, CardBody, Table } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import Loader from "./loader/Loader";

const AgentReport = () => {
  const param = useParams();
  const [isLoading, setIsLoading] = useState(true); // Set to true initially
  const [userReport, setUserReport] = useState();

  const [usergraph, setUserGraph] = useState({
    series: [],
    options: {
      chart: {
        height: 350,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px",
            },
            value: {
              fontSize: "16px",
            },
            total: {
              show: true,
              label: "Total",
              formatter: function () {
                return Number(userReport?.counts?.total);
              },
            },
          },
        },
      },
      labels: ["Good", "Average", "Bad"],
    },
  });

  const [totalRatings, setTotalRatings] = useState({
    series: [],
    options: {
      chart: {
        height: 350,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px",
            },
            value: {
              fontSize: "16px",
            },
            total: {
              show: true,
              label: "Total",
              formatter: function () {
                return Number(userReport?.ev?.length + userReport?.esc?.length);
              },
            },
          },
        },
      },
      labels: ["Evaluation", "Escalation"],
    },
  });

  useEffect(() => {
    const getReport = async () => {
      setIsLoading(true);
      try {
        const { data } = await retrieveReport(param.name);
        setUserReport(data);
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getReport();
  }, [param.name]);

  useEffect(() => {
    if (userReport?.counts) {
      setUserGraph((pre) => ({
        ...pre,
        series: [
          Number(userReport?.counts?.good),
          Number(userReport?.counts?.average),
          Number(userReport?.counts?.bad),
        ],
      }));
      setTotalRatings((pre) => ({
        ...pre,
        series: [
          Number(userReport?.ev?.length),
          Number(userReport?.esc?.length),
        ],
      }));
    }
  }, [userReport]);

  return (
    <div className="d-flex flex-column gap-3">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-5">
          <div
            className="flex rounded mb-5"
            style={{ backgroundColor: "#fff" }}
          >
            <div
              style={{ display: "flex", justifyContent: "center", gap: "20px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    padding: "1rem",
                    fontWeight: "500",
                    fontSize: "0.9rem",
                    textAlign: "center",
                  }}
                >
                  Escalation Ratings
                </div>
                <ReactApexChart
                  options={usergraph?.options}
                  series={usergraph?.series}
                  type="radialBar"
                  height={350}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    padding: "1rem",
                    fontWeight: "500",
                    fontSize: "0.9rem",
                    textAlign: "center",
                  }}
                >
                  Total Ratings
                </div>
                <ReactApexChart
                  options={totalRatings?.options}
                  series={totalRatings?.series}
                  type="radialBar"
                  height={350}
                />
              </div>
            </div>
          </div>
          {userReport?.esc?.length > 0 && (
            <div className="mb-5">
              <div className="sc-none" style={{ overflowX: "scroll" }}>
                <Col lg="12" style={{ width: "max-content" }}>
                  <Card>
                    <CardTitle
                      tag="h6"
                      className="border-bottom p-3 mb-0 fw-bold"
                    >
                      No of Escalation {userReport?.esc?.length}
                    </CardTitle>
                    <CardBody>
                      <Table bordered>
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
                            <th>Additional Information</th>
                            <th>Audio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userReport?.esc?.map((val, index) => (
                            <tr key={index}>
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
                              <td>Loading...</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>
              </div>
            </div>
          )}
          {userReport?.ev?.length > 0 && (
            <div>
              <div className="sc-none" style={{ overflowX: "scroll" }}>
                <Col lg="12" style={{ width: "max-content" }}>
                  <Card>
                    <CardTitle
                      tag="h6"
                      className="border-bottom p-3 mb-0 fw-bold"
                    >
                      No of Evaluation {userReport?.ev?.length}
                    </CardTitle>
                    <CardBody>
                      <Table bordered>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Email</th>
                            <th>Lead ID</th>
                            <th>Evaluated by</th>
                            <th>Agent Name</th>
                            <th>Team Leader</th>
                            <th>Mode of Communication</th>
                            <th>Greetings</th>
                            <th>Accuracy & Compliance</th>
                            <th>Building Rapport & Discovery</th>
                            <th>Presenting Solutions & Making the Sale</th>
                            <th>Call Closing & Securing Commitment</th>
                            <th>Bonus Point</th>
                            <th>Evaluation Summary</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userReport?.ev?.map((val, index) => (
                            <tr key={index}>
                              <th scope="row">{index + 1}</th>
                              <td>{val?.useremail}</td>
                              <td>{val?.leadID}</td>
                              <td>{val?.evaluatedby}</td>
                              <td>{val?.agentName}</td>
                              <td>{val?.teamleader}</td>
                              <td>{val?.mod}</td>
                              <td>{val?.greetings}</td>
                              <td>{val?.accuracy}</td>
                              <td>{val?.building}</td>
                              <td>{val?.presenting}</td>
                              <td>{val?.closing}</td>
                              <td>{val?.bonus}</td>
                              <td>{val?.evaluationsummary}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentReport;
