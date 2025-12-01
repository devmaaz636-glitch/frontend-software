  import React, { useEffect, useState, useCallback, useMemo } from "react";
  import {
    Container,
    Table,
    Tab,
    Tabs,
    Button,
    Card,
    Spinner,
    Placeholder,
    Pagination as BootstrapPagination,
  } from "react-bootstrap";
  import { useNavigate, useParams } from "react-router-dom";
  import jsPDF from "jspdf";
  import { FaEdit } from "react-icons/fa";
  import moment from "moment";
  import { summonUserData, fetchmarketingApi } from "../features/userApis";

  const ROWS_PER_PAGE = 10;
  const ROWS_PER_PAGES = 20;
  const ROWS_PER_MARKETING_PAGE = 10;

  const UserData = () => {
    const { id, name } = useParams();
    const [data, setData] = useState({ esc: [], ev: [] });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPages, setCurrentPages] = useState(1);
    const [marketingData, setMarketingData] = useState([]);
    const [marketingLoading, setMarketingLoading] = useState(true);
    const [marketingCurrentPage, setMarketingCurrentPage] = useState(1);
    const navigate = useNavigate();
    const formattedDate = useMemo(() => new Date().toLocaleDateString("en-CA"), []);
    const doc = useMemo(() => new jsPDF({ orientation: "landscape", unit: "in", format: [20, 20] }), []);

    useEffect(() => {
      const getUserData = async () => {
        setLoading(true);
        try {
          const { data: responseData } = await summonUserData(id);
          if (responseData) {
            const processedData = {
              esc: responseData.esc?.filter((r) => moment(r.createdAt).isAfter(moment().subtract(5, "days"))) || [],
              ev: responseData.ev?.filter((r) => moment(r.createdAt).isAfter(moment().subtract(5, "days"))) || [],
            };
            setData(processedData);
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
      const getMarketingData = async () => {
        setMarketingLoading(true);
        try {
          const res = await fetchmarketingApi(id);
          // console.log("Marketing API response:", res);
          const marketingData = res?.data?.marketingData;  
          setMarketingData(Array.isArray(marketingData) ? marketingData : []);
        } catch (err) {
          // console.error("Error fetching marketing data", err);
          setMarketingData([]);
        } finally {
          setMarketingLoading(false);
        }
      };
      getMarketingData();
    }, [id]);

    const handleEditEvaluation = (id) => {
  navigate(`/bi/edit-evaluation/${id}`);
};

const handleEditEscalations = (id) => {
  navigate(`/bi/edit-escalations/${id}`);
};
    

    const handlerExport = useCallback(
      (e) => {
        e.preventDefault();
        if (!data.ev.length && !data.esc.length) return;
        doc.autoTable({ html: "#evaluation-table" });
        doc.autoTable({ html: "#escalation-table" });
        doc.save(`${name}_report_${formattedDate}.pdf`);
      },
      [doc, formattedDate, name, data]
    );

    const paginationData = useMemo(() => {
      const { esc, ev } = data;
      return {
        esc: esc.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE),
        ev: ev.slice((currentPages - 1) * ROWS_PER_PAGES, currentPages * ROWS_PER_PAGES),
        escPages: Math.ceil(esc.length / ROWS_PER_PAGE),
        evPages: Math.ceil(ev.length / ROWS_PER_PAGES),
      };
    }, [data, currentPage, currentPages]);

    const marketingPagination = useMemo(() => {
      const safeData = Array.isArray(marketingData) ? marketingData : [];
      const totalPages = Math.ceil(safeData.length / ROWS_PER_MARKETING_PAGE);
      const rows = safeData.slice(
        (marketingCurrentPage - 1) * ROWS_PER_MARKETING_PAGE,
        marketingCurrentPage * ROWS_PER_MARKETING_PAGE
      );
      return { rows, totalPages };
    }, [marketingData, marketingCurrentPage]);

    const renderPagination = (current, total, onChange) => {
      const pageItems = [];
      const range = 2;
      const createItem = (page) => (
        <BootstrapPagination.Item key={page} active={page === current} onClick={() => onChange(page)}>
          {page}
        </BootstrapPagination.Item>
      );

      if (total <= 10) {
        for (let i = 1; i <= total; i++) pageItems.push(createItem(i));
      } else {
        pageItems.push(createItem(1));
        if (current > 4) pageItems.push(<BootstrapPagination.Ellipsis key="start-ellipsis" disabled />);
        for (let i = current - range; i <= current + range; i++) {
          if (i > 1 && i < total) pageItems.push(createItem(i));
        }
        if (current < total - 3) pageItems.push(<BootstrapPagination.Ellipsis key="end-ellipsis" disabled />);
        pageItems.push(createItem(total));
      }

      return (
        <BootstrapPagination className="mt-3 justify-content-center flex-wrap">
          <BootstrapPagination.Prev onClick={() => onChange(current - 1)} disabled={current === 1} />
          {pageItems}
          <BootstrapPagination.Next onClick={() => onChange(current + 1)} disabled={current === total} />
        </BootstrapPagination>
      );
    };

    const renderTable = (type, id, columns, rows) => {
      const longTextColumns = type === "Evaluations" ? [12] : [11, 12];
      return (
        <Card className="mt-3">
          <Card.Header as="h5">{type}</Card.Header>
          <Card.Body style={{ overflowX: "auto" }}>
            <Table striped bordered hover responsive id={id}>
              <thead>
                <tr>{columns.map((c, i) => <th key={i}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        title={typeof cell === "string" && cell.length > 100 ? cell : undefined}
                        style={
                          longTextColumns.includes(i)
                            ? { maxWidth: "200px", whiteSpace: "pre-wrap", wordWrap: "break-word", overflowY: "auto" }
                            : {}
                        }
                      >
                        {typeof cell === "string" && cell.length > 100 ? `${cell.slice(0, 100)}...` : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      );
    };

    const evaluationColumns = [
      "#", "Email", "Lead ID", "Agent Name", "Team Leader", "Mode of Communication","Response Time", 
      "Greetings", "Accuracy", "Building Rapport", "Presenting Solutions", "Call Closing", "Bonus Point", "Evaluation Summary", "Edit"
    ];

    const escalationColumns = [
      "#", "Email", "Lead ID", "Evaluated by", "Agent Name", "Team Leader", "Lead Source",
      "User Rating", "Lead Status", "Escalation Severity", "Issue Identification", "Escalation Action", "Additional Information", "Edit"
    ];

    const marketingColumns = ["#", "Lead ID", "Team Leader", "Branch", "Source", "Lead Quality", "Edit"];

    const evaluationRows = paginationData.ev.map((val, i) => {
      // Debug: Log the greetings array to see its structure
      console.log("Greetings data:", val?.greetings); // ✅ Add this line

      return [
        (currentPages - 1) * ROWS_PER_PAGES + i + 1,
        val?.useremail,
        val?.leadID,
        val?.agentName,
        val?.teamleader,
        val?.mod,
        val?.responsetime,
        Array.isArray(val?.greetings)
          ? val.greetings[2] ?? val.greetings[1] ?? val.greetings[0] ?? ""
          : "",
        val?.accuracy,
        val?.building,
        val?.presenting,
        val?.closing,
        val?.bonus,
        val?.evaluationsummary,
        <FaEdit
    style={{ cursor: "pointer", color: "#FF0000", size:"90" }}
    onClick={() => handleEditEvaluation(val._id)}
  />
      ];
    });
    

    const escalationRows = paginationData.esc.map((val, i) => [
      (currentPage - 1) * ROWS_PER_PAGE + i + 1,
      val?.useremail, val?.leadID, val?.evaluatedby, val?.agentName, val?.teamleader,
      val?.leadsource, val?.userrating, val?.leadstatus, val?.escalationseverity,
      val?.issueidentification, val?.escalationaction, val?.additionalsuccessrmation,
       <FaEdit
    style={{ cursor: "pointer", color: "#FF0000", size:"90" }}
    onClick={() => handleEditEscalations(val._id)}
  />
    ]);

    const marketingRows = marketingPagination.rows.map((item, idx) => [
      (marketingCurrentPage - 1) * ROWS_PER_MARKETING_PAGE + idx + 1,
      item.leadID, item.teamleader, item.branch, item.source, item.leadQuality,
    ]);

    return (
      <Container className="py-4">
        <div className="d-flex justify-content-center mb-4">
          <Button onClick={handlerExport} variant="primary">Export PDF</Button>
        </div>

        {loading ? (
          <>
            <PlaceholderSection title="Loading Evaluations..." />
            <PlaceholderSection title="Loading Escalations..." />
          </>
        ) : (
          <Tabs defaultActiveKey="evaluations" className="mb-3">
            <Tab eventKey="evaluations" title={`Evaluations (${data.ev.length})`}>
              {renderTable("Evaluations", "evaluation-table", evaluationColumns, evaluationRows)}
              {renderPagination(currentPages, paginationData.evPages, setCurrentPages)}
            </Tab>
            <Tab eventKey="escalations" title={`Escalations (${data.esc.length})`}>
              {renderTable("Escalations", "escalation-table", escalationColumns, escalationRows)}
              {renderPagination(currentPage, paginationData.escPages, setCurrentPage)}
            </Tab>
            <Tab eventKey="marketing" title={`Marketing (${marketingData.length})`}>
              {marketingLoading ? (
                <PlaceholderSection title="Loading Marketing..." />
              ) : (
                <>
                  {renderTable("Marketing", "marketing-table", marketingColumns, marketingRows)}
                  {renderPagination(marketingCurrentPage, marketingPagination.totalPages, setMarketingCurrentPage)}
                </>
              )}
            </Tab>
          </Tabs>
        )}  
      </Container>
    );
  };

  const PlaceholderSection = ({ title }) => (
    <Card className="mb-4">
      <Card.Header as="h5">{title}</Card.Header>
      <Card.Body>
        <Placeholder animation="glow">
          <Placeholder xs={12} />
          <Placeholder xs={10} />
          <Placeholder xs={8} />
        </Placeholder>
        <div className="d-flex justify-content-center mt-3">
          <Spinner animation="border" variant="primary" />
        </div>
      </Card.Body>
    </Card>
  );

  export default UserData;
