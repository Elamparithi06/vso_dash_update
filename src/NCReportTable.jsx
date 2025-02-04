import React from "react";
import { Table } from "react-bootstrap";

const NCReportTable = ({ reportData }) => {
  if (!reportData || reportData.length === 0) {
    return <p>No data available.</p>;
  }

  // Total Checkpoints (constant value)
  const TOTAL_CHECKPOINTS = 8;

  // Function to calculate percentages
  const calculatePercentage = (value, total) =>
    total > 0 ? ((value / total) * 100).toFixed(0) + "%" : "NA";

  return (
    <div className="table-responsive">
      <Table striped bordered hover className="nc-report-table">
        <thead>
          <tr>
            <th>VSO</th>
            <th>Total Audits</th>
            <th>NC</th>
            <th>Non-Repeated NC</th>
            <th>Repeated NC</th>
            <th>Total Checkpoints</th>
            <th>NC %</th>
            <th>Non-Repeated NC %</th>
            <th>Repeated NC %</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((row, index) => {
            const ncPercentage = calculatePercentage(row.nc, row.totalCheckpoints);
            const nonRepeatedNCPercentage = calculatePercentage(row.nonRepeatedNC, row.totalCheckpoints);
            const repeatedNCPercentage = calculatePercentage(row.repeatedNC, row.totalCheckpoints);

            return (
              <tr key={index}>
                <td>{row.vso}</td>
                <td>{row.totalAudits}</td>
                <td>{row.nc}</td>
                <td>{row.nonRepeatedNC ?? "NA"}</td>
                <td>{row.repeatedNC ?? "NA"}</td>
                <td>{row.totalCheckpoints}</td>
                <td>{ncPercentage}</td>
                <td>{nonRepeatedNCPercentage}</td>
                <td>{repeatedNCPercentage}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default NCReportTable;
