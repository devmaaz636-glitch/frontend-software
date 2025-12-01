import React, { useState } from "react";
import { Card } from "reactstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createReportMarketing } from "../features/userApis";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import toast from "react-hot-toast";

const FilterCardMarketing = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [branch, setBranch] = useState("");
  const [teamLeader, setTeamLeader] = useState("");
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => date.toISOString().split("T")[0];
  const getFileName = (start, end, ext) => `Report_${start}_to_${end}.${ext}`;

  const fetchReportData = async () => {
    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);

    if (startDate > endDate) {
      toast.error("Start date cannot be later than end date.");
      return null;
    }

    const response = await createReportMarketing({
      startDate: formattedStart,
      endDate: formattedEnd,
      branch: branch || "",
      teamleader: teamLeader || "",
    });

    if (response?.status === 404 || !response?.data?.success) {
      toast.error(
        response?.data?.message || "No data available for the selected date range."
      );
      return null;
    }

    return {
      data: response.data.data,
      formattedStart,
      formattedEnd,
    };
  };

  const handleDownloadExcel = async () => {
    setLoading(true);
    try {
      const result = await fetchReportData();
      if (!result) return;

      const { data, formattedStart, formattedEnd } = result;
      const filteredData = data.map(({ _id, owner, __v, ...rest }) => rest);

      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Marketing Report");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, getFileName(formattedStart, formattedEnd, "xlsx"));
    } catch (err) {
      toast.error("An error occurred while generating the Excel report.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    setLoading(true);
    try {
      const result = await fetchReportData();
      if (!result) return;

      const { data, formattedStart, formattedEnd } = result;
      const doc = new jsPDF("l", "pt", "a3");

      doc.text("Marketing Report", 40, 30);
      doc.text(`Date Range: ${formattedStart} to ${formattedEnd}`, 40, 60);

      const tableHeaders = Object.keys(data[0]).filter(
        (key) => !["_id", "owner", "__v", "createdAt", "updatedAt"].includes(key)
      );
      const tableData = data.map((item) =>
        tableHeaders.map((key) => item[key] ?? "")
      );

      doc.autoTable({
        head: [tableHeaders],
        body: tableData,
        startY: 80,
        styles: {
          cellPadding: 5,
          fontSize: 10,
          overflow: "linebreak",
          halign: "left",
        },
      });

      doc.save(getFileName(formattedStart, formattedEnd, "pdf"));
    } catch (err) {
      toast.error("An error occurred while generating the PDF report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-3 p-md-4 shadow-sm rounded-lg">
      <div className="text-center mb-4">
        <h4 className="mb-2">Generate Marketing Report</h4>
        <p className="text-muted mb-0">
          Select a date range to download the Marketing report
        </p>
      </div>

      <div className="row g-3">
        <div>
          <label htmlFor="startDate" className="form-label">
            Start Date
          </label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            placeholderText="Select start date"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="form-label">
            End Date
          </label>
          <DatePicker
            id="endDate"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="form-control"
            dateFormat="yyyy-MM-dd"
            minDate={startDate}
            maxDate={new Date()}
            placeholderText="Select end date"
          />
        </div>

        <div>
          <label htmlFor="branch" className="form-label">Branch Name</label>
          <input
            id="branch"
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="form-control"
            placeholder="Enter Branch name"
          />
        </div>

        <div>
          <label htmlFor="teamLeader" className="form-label">Team Lead</label>
          <input
            id="teamLeader"
            type="text"
            value={teamLeader}
            onChange={(e) => setTeamLeader(e.target.value)}
            className="form-control"
            placeholder="Enter team lead name"
          />
        </div>
      </div>

      <button
          className="mt-3 btn btn-primary flex-grow-1 flex-sm-grow-0"
          onClick={handleDownloadPDF}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Downloading...
            </>
          ) : (
            "Export PDF"
          )}
        </button>

        <button
          className="mt-3 btn btn-success flex-grow-1 flex-sm-grow-0"
          onClick={handleDownloadExcel}
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Downloading...
            </>
          ) : (
            "Export CSV"
          )}
        </button>
    </Card>
  );
};

export default FilterCardMarketing;
