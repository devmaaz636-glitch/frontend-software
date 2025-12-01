import React, { useState } from "react";
import {
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
} from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createReportEvaluations } from "../features/userApis";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

const FilterCardEvaluations = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [agentName, setAgentName] = useState("");
  const [teamLeader, setTeamLeader] = useState("");
  const [loading, setLoading] = useState(false);

  const validateDates = (start, end) => {
    if (start > end) {
      toast.error("Start date cannot be later than end date.");
      return false;
    }
    return true;
  };

  const fetchReportData = async (start, end) => {
    return await createReportEvaluations({
      startDate: start,
      endDate: end,
      agentName: agentName.trim(),
      teamleader: teamLeader.trim(),
    });
  };

  const handleDownloadExcel = async () => {
    setLoading(true);
    try {
      const formattedStart = startDate.toISOString().split("T")[0];
      const formattedEnd = endDate.toISOString().split("T")[0];
      if (!validateDates(startDate, endDate)) return setLoading(false);

      const response = await fetchReportData(formattedStart, formattedEnd);
      const records = response?.data?.data || [];

      if (!response?.data?.success || !records.length) {
        toast.error("No data available for the selected date range.");
        return setLoading(false);
      }

      const data = records.map(({ _id, __v, owner, ...rest }) => rest);
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Evaluations Report");

      const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Report_${formattedStart}_to_${formattedEnd}.xlsx`
      );
    } catch (err) {
      toast.error("An error occurred while exporting Excel.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const formattedStart = startDate.toISOString().split("T")[0];
      const formattedEnd = endDate.toISOString().split("T")[0];
      if (!validateDates(startDate, endDate)) return setLoading(false);

      const response = await fetchReportData(formattedStart, formattedEnd);
      const records = response?.data?.data || [];

      if (!response?.data?.success || !records.length) {
        toast.error("No data available for the selected date range.");
        return setLoading(false);
      }

      const doc = new jsPDF("l", "pt", "a3");
      doc.text("Evaluations Report", 40, 30);
      doc.text(`Date Range: ${formattedStart} to ${formattedEnd}`, 40, 50);

      const headers = Object.keys(records[0])
        .filter((key) => !["_id", "__v", "owner", "createdAt", "updatedAt"].includes(key));
      const body = records.map((item) => headers.map((key) => item[key]));

      if (!headers.length) {
        toast.error("Unable to generate PDF: no valid fields found.");
        return setLoading(false);
      }

      autoTable(doc, {
        head: [headers],
        body,
        startY: 70,
        styles: { fontSize: 10, cellPadding: 3 },
      });

      doc.save(`Report_${formattedStart}_to_${formattedEnd}.pdf`);
    } catch (err) {
      toast.error("An error occurred while generating the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow-sm rounded">
      <CardBody>
        <h4 className="text-center mb-3">Generate Evaluation Report</h4>
        <p className="text-muted text-center mb-4">
          Select filters and download the report as PDF or Excel
        </p>

        <Row>
          <Col md={6}>
            <FormGroup>
              <Label for="startDate">Start Date</Label>
              <DatePicker
                selected={startDate}
                onChange={setStartDate}
                className="form-control"
                dateFormat="yyyy-MM-dd"
                maxDate={new Date()}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="endDate">End Date</Label>
              <DatePicker
                selected={endDate}
                onChange={setEndDate}
                className="form-control"
                dateFormat="yyyy-MM-dd"
                minDate={startDate}
                maxDate={new Date()}
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="agentName">Agent Name</Label>
              <Input
                type="text"
                id="agentName"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Enter agent name"
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="teamLeader">Team Leader</Label>
              <Input
                type="text"
                id="teamLeader"
                value={teamLeader}
                onChange={(e) => setTeamLeader(e.target.value)}
                placeholder="Enter team leader name"
              />
            </FormGroup>
          </Col>
        </Row>

       
      </CardBody>
      <Button
            color="primary"
            onClick={handleDownloadPDF}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : (
              <i className="bi bi-file-earmark-pdf me-2" />
            )}
            Export PDF
          </Button>

          <Button 
          className="mt-3"
            color="success"
            onClick={handleDownloadExcel}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : (
              <i className="bi bi-file-earmark-excel me-2" />
            )}
            Export Excel
          </Button>
    </Card>
  );
};

export default FilterCardEvaluations;
