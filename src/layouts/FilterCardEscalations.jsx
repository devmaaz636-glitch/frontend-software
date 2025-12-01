import React, { useState } from "react";
import { Card, CardBody, Button, Spinner, Form, FormGroup, Label, Input } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createReportEscalations } from "../features/userApis";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";

const FilterCardEscalations = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [teamLeader, setTeamLeader] = useState("");

  const validateDates = () => {
    if (startDate > endDate) {
      toast.error("Start date cannot be later than end date.");
      return false;
    }
    return true;
  };

  const fetchReportData = async () => {
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];
    return await createReportEscalations({
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      agentName: agentName.trim(),
      teamleader: teamLeader.trim(),
    });
  };

  const handleDownloadExcel = async () => {
    if (!validateDates()) return;
    setLoading(true);
    try {
      const response = await fetchReportData();

      if (response?.status === 404 || !response?.data?.data?.length) {
        toast.error(response.data?.message || "No data found for selected range.");
        return;
      }

      const data = response.data.data.map(({ _id, owner, __v, ...rest }) => rest);
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Escalations Report");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, `Escalations_Report_${startDate.toISOString().split("T")[0]}_to_${endDate.toISOString().split("T")[0]}.xlsx`);
    } catch {
      toast.error("An error occurred while exporting Excel report.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!validateDates()) return;
    setLoading(true);
    try {
      const response = await fetchReportData();

      if (response?.status === 404 || !response?.data?.data?.length) {
        toast.error(response.data?.message || "No data found for selected range.");
        return;
      }

      const data = response.data.data;
      const doc = new jsPDF("landscape", "pt", "a3");
      doc.text("Escalations Report", 40, 40);
      doc.text(
        `Date Range: ${startDate.toISOString().split("T")[0]} to ${endDate.toISOString().split("T")[0]}`,
        40,
        60
      );

      const headers = Object.keys(data[0]).filter(
        (key) => !["_id", "owner", "__v", "createdAt", "updatedAt"].includes(key)
      );
      const body = data.map((item) => headers.map((key) => item[key]));

      autoTable(doc, {
        head: [headers],
        body,
        startY: 100,
        styles: { fontSize: 9, cellPadding: 4, overflow: "linebreak" },
      });

      doc.save(`Escalations_Report_${startDate.toISOString().split("T")[0]}_to_${endDate.toISOString().split("T")[0]}.pdf`);
    } catch {
      toast.error("An error occurred while exporting PDF report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow rounded">
      <CardBody>
        <h4 className="text-center mb-3">Generate Escalations Report</h4>
        <p className="text-center text-muted">Select filters and export as PDF or Excel.</p>

        <Form className="row g-3">
          <FormGroup className="col-md-6">
            <Label for="startDate">Start Date</Label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              placeholderText="Select start date"
              id="startDate"
            />
          </FormGroup>
          <FormGroup className="col-md-6">
            <Label for="endDate">End Date</Label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              minDate={startDate}
              maxDate={new Date()}
              placeholderText="Select end date"
              id="endDate"
            />
          </FormGroup>
          <FormGroup className="col-md-6">
            <Label for="agentName">Agent Name</Label>
            <Input
              type="text"
              id="agentName"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Enter agent name"
            />
          </FormGroup>
          <FormGroup className="col-md-6">
            <Label for="teamLeader">Team Lead</Label>
            <Input
              type="text"
              id="teamLeader"
              value={teamLeader}
              onChange={(e) => setTeamLeader(e.target.value)}
              placeholder="Enter team lead name"
            />
          </FormGroup>
        </Form>
      </CardBody>
      <Button color="primary" onClick={handleDownloadPDF} disabled={loading}>
            {loading ? <><Spinner size="sm" className="me-2" />Downloading...</> : "Export PDF"}
          </Button>
          <Button className="mt-4" color="success" onClick={handleDownloadExcel} disabled={loading}>
            {loading ? <><Spinner size="sm" className="me-2" />Downloading...</> : "Export Excel"}
          </Button>
    </Card>
  );
};

export default FilterCardEscalations;
