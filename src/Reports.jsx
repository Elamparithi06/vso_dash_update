import { Container, Table } from "react-bootstrap";
import React, { useEffect, useState } from "react";

export default function Reports() {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const savedReportData = sessionStorage.getItem("reportData");
    if (savedReportData) {
      const parsedData = JSON.parse(savedReportData);
      setReportData(parsedData);
    }
  }, []);

  return (
    <Container id="reports" className="mt-4">
      <h2>Reports</h2>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>SL.NO</th>
            <th>VSO</th>
            <th>DISTRIBUTOR CODE</th>
            <th>DISTRIBUTOR NAME</th>
            <th>CLAIM CODE</th>
            <th>AUDIT DATE</th>
            <th>PROCEDURAL REMARKS</th>
            <th>VSO COMPLIES</th>
            <th>TOTAL REMARKS</th>
            <th>CRITICAL</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.vso}</td>
              <td>{row.distributorCode}</td>
              <td>{row.distributorName}</td>
              <td>{row.claimCode}</td>
              <td>{row.auditDate}</td>
              <td>
                {/* Loop through each remark and display them on separate lines */}
                {row.remarks.map((remark, idx) => (
                  <div key={idx}>{remark}</div>  {/* Each remark will be displayed on a new line */}
                ))}
              </td>
              <td>{row.complies}</td>
              <td>{row.totalRemarks}</td>
              <td>{row.critical}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
