import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Table, Card, Container, Navbar, Nav } from "react-bootstrap";
import { X } from "react-bootstrap-icons"; // Import X icon for delete
import dropdownData from "./dropdownData";
import SignIn from "./SignIn";
import BarChart from './BarChart'; // Import the BarChart component
import "./Home.css";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rows, setRows] = useState([]); // Store table rows (Home tab data)
  const [reportData, setReportData] = useState([]); // Store report data
  const [activeTab, setActiveTab] = useState("home"); // Track active tab ("home", "reports", "barchart", "vsoCalculations")
  const [expandedRowIndex, setExpandedRowIndex] = useState(null); // Track expanded row

  useEffect(() => {
    // Check if user is authenticated on component mount
    const isAuthenticatedFromSession = sessionStorage.getItem("isAuthenticated");
    if (isAuthenticatedFromSession === "true") {
      setIsAuthenticated(true);
    }

    // Initialize rows with empty values (Home tab data)
    setRows(Array.from({ length: 5 }, (_, index) => ({
      id: index + 1,
      vso: "",
      distributorCode: "",
      distributorName: "",
      claimCode: "",
      auditDate: "",
      remarks: [], // Initialize as an array for multiple selected remarks
      complies: "",
      totalRemarks: "",
      critical: ""
    })));

    // Load saved report data from sessionStorage (Reports tab data)
    const savedReportData = sessionStorage.getItem("reportData");
    if (savedReportData) {
      setReportData(JSON.parse(savedReportData));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("reportData"); // Keep report data intact
    sessionStorage.removeItem("calculationData"); // Remove calculation data
    setIsAuthenticated(false);
    setRows([]); // Reset Home tab data
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: rows.length + 1, // Increment row ID
        vso: "",
        distributorCode: "",
        distributorName: "",
        claimCode: "",
        auditDate: "",
        remarks: [], // Initialize with an empty array for multiple selected remarks
        complies: "",
        totalRemarks: "",
        critical: ""
      }
    ]);
  };

  const deleteRow = (id) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleSubmit = () => {
    // Calculate NC%, Repeated NC%, and Non-repeated NC% in the backend
    const totalCheckpoints = 18; // You mentioned this as a constant
    let totalNC = 0;
    let totalRepeatedNC = 0;
    let totalNonRepeatedNC = 0;

    // To track repeated and non-repeated NC
    const remarkCount = {};

    rows.forEach(row => {
      const remarks = row.remarks;
      totalNC += remarks.length;
      
      // Count remarks for repeated and non-repeated
      remarks.forEach(remark => {
        remarkCount[remark] = (remarkCount[remark] || 0) + 1;
      });
    });

    // Calculate repeated and non-repeated NC
    Object.values(remarkCount).forEach(count => {
      if (count > 1) {
        totalRepeatedNC += count;
      } else {
        totalNonRepeatedNC += count;
      }
    });

    // Calculate the percentages
    const ncPercentage = ((totalNC / (rows.length * totalCheckpoints)) * 100).toFixed(2);
    const repeatedNCPercentage = ((totalRepeatedNC / (rows.length * totalCheckpoints)) * 100).toFixed(2);
    const nonRepeatedNCPercentage = ((totalNonRepeatedNC / (rows.length * totalCheckpoints)) * 100).toFixed(2);

    // Store the calculated data in session storage
    const calculationData = {
      totalNC,
      totalRepeatedNC,
      totalNonRepeatedNC,
      ncPercentage,
      repeatedNCPercentage,
      nonRepeatedNCPercentage
    };

    sessionStorage.setItem("calculationData", JSON.stringify(calculationData));

    // Store report data in sessionStorage
    sessionStorage.setItem("reportData", JSON.stringify(rows)); 

    // Update reportData state
    setReportData(rows);
  };

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  const toggleRemarkSelection = (rowIndex, remark) => {
    const updatedRows = [...rows];
    const currentRemarks = updatedRows[rowIndex].remarks;

    if (currentRemarks.includes(remark)) {
      updatedRows[rowIndex].remarks = currentRemarks.filter((r) => r !== remark); // Deselect remark
    } else {
      updatedRows[rowIndex].remarks.push(remark); // Select remark
    }

    setRows(updatedRows);
  };

  // Handle selecting a row for showing remarks
  const handleRowClick = (index) => {
    if (expandedRowIndex === index) {
      // If the same row is clicked again, do not collapse it
      return;
    }
    setExpandedRowIndex(index); // Expand the selected row
  };

  if (!isAuthenticated) {
    return <SignIn onAuthenticate={() => {
      sessionStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
    }} />;
  }

  return (
    <Container fluid className="p-0 m-0">
      <Navbar bg="primary" variant="dark" expand="lg" className="p-3">
        <Container>
          <Navbar.Brand href="#">Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => toggleTab("home")}>Home</Nav.Link>
              <Nav.Link onClick={() => toggleTab("reports")}>Reports</Nav.Link>
              <Nav.Link onClick={() => toggleTab("barchart")}>BarChart</Nav.Link>
              <Nav.Link onClick={() => toggleTab("vsoCalculations")}>VSO Calculations</Nav.Link>
              <Button variant="danger" className="ms-3" onClick={handleLogout}>Sign Out</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Home Tab */}
      {activeTab === "home" && (
        <Container className="mt-4">
          <Card className="card p-3">
            <h2 className="tableTitle">VSO NC</h2>
            <div className="table-responsive">
              <Table striped bordered hover className="table-sm">
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={row.id}
                      onClick={() => handleRowClick(index)} // Handle row click for selection
                      className={expandedRowIndex === index ? "selected" : ""} // Add selected class for styling
                    >
                      <td>{row.id}</td>
                      <td>
                        <Form.Select
                          value={row.vso}
                          onChange={(e) => {
                            const updatedRows = [...rows];
                            updatedRows[index].vso = e.target.value;
                            setRows(updatedRows);
                          }}
                        >
                          <option value="">Select VSO</option>
                          {dropdownData?.vsoOptions?.map((vso) => (
                            <option key={vso} value={vso}>{vso}</option>
                          )) || <option>Loading...</option>}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Select
                          value={row.distributorCode}
                          onChange={(e) => {
                            const updatedRows = [...rows];
                            updatedRows[index].distributorCode = e.target.value;
                            setRows(updatedRows);
                          }}
                        >
                          <option value="">Select Distributor Code</option>
                          {dropdownData?.distributorOptions?.map((dist) => (
                            <option key={dist.code} value={dist.code}>{dist.code}</option>
                          )) || <option>Loading...</option>}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Select
                          value={row.distributorName}
                          onChange={(e) => {
                            const updatedRows = [...rows];
                            updatedRows[index].distributorName = e.target.value;
                            setRows(updatedRows);
                          }}
                        >
                          <option value="">Select Distributor Name</option>
                          {dropdownData?.distributorOptions?.map((dist) => (
                            <option key={dist.name} value={dist.name}>{dist.name}</option>
                          )) || <option>Loading...</option>}
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={row.claimCode}
                          onChange={(e) => {
                            const updatedRows = [...rows];
                            updatedRows[index].claimCode = e.target.value;
                            setRows(updatedRows);
                          }}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="date"
                          value={row.auditDate}
                          onChange={(e) => {
                            const updatedRows = [...rows];
                            updatedRows[index].auditDate = e.target.value;
                            setRows(updatedRows);
                          }}
                        />
                      </td>
                      <td>
                        {expandedRowIndex === index && ( // Show remarks only for the expanded row
                          <div>
                            {dropdownData?.proceduralRemarks?.map((remarkOption) => (
                              <div key={remarkOption} className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`remark-${remarkOption}`}
                                  checked={row.remarks.includes(remarkOption)}
                                  onChange={() => toggleRemarkSelection(index, remarkOption)}
                                />
                                <label className="form-check-label" htmlFor={`remark-${remarkOption}`}>
                                  {remarkOption}
                                </label>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>
                        <Form.Select
                          value={row.complies}
                          onChange={(e) => {
                            const updatedRows = [...rows];
                            updatedRows[index].complies = e.target.value;
                            setRows(updatedRows);
                          }}
                        >
                          <option value="">Select Compliance</option>
                          <option value="YES">YES</option>
                          <option value="NO">NO</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={row.totalRemarks}
                          onChange={(e) => {
                            const updatedRows = [...rows];
                            updatedRows[index].totalRemarks = e.target.value;
                            setRows(updatedRows);
                          }}
                        />
                      </td>
                      <td>
                        <Form.Select
                          value={row.critical}
                          onChange={(e) => {
                            const updatedRows = [...rows];
                            updatedRows[index].critical = e.target.value;
                            setRows(updatedRows);
                          }}
                        >
                          <option value="">Select Critical</option>
                          <option value="YES">YES</option>
                          <option value="NO">NO</option>
                        </Form.Select>
                      </td>
                      <td>
                        <Button variant="danger" onClick={() => deleteRow(row.id)}>
                          <X /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <Button variant="primary" onClick={addRow}>Add Row</Button>
            <Button variant="success" onClick={handleSubmit} className="ms-2">
              Submit
            </Button>
          </Card>
        </Container>
      )}

      {/* VSO Calculations Tab */}
      {activeTab === "vsoCalculations" && (
        <Container className="mt-4">
          <Card className="p-3">
            <h2>VSO Calculations</h2>
            <Table striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th>Total NC</th>
                  <th>Total Repeated NC</th>
                  <th>Total Non-Repeated NC</th>
                  <th>NC %</th>
                  <th>Repeated NC %</th>
                  <th>Non-Repeated NC %</th>
                </tr>
              </thead>
              <tbody>
                {/* Fetch data from sessionStorage */}
                {(() => {
                  const calculationData = JSON.parse(sessionStorage.getItem("calculationData"));
                  return (
                    <tr>
                      <td>{calculationData?.totalNC || 0}</td>
                      <td>{calculationData?.totalRepeatedNC || 0}</td>
                      <td>{calculationData?.totalNonRepeatedNC || 0}</td>
                      <td>{calculationData?.ncPercentage || "0%"}</td>
                      <td>{calculationData?.repeatedNCPercentage || "0%"}</td>
                      <td>{calculationData?.nonRepeatedNCPercentage || "0%"}</td>
                    </tr>
                  );
                })()}
              </tbody>
            </Table>
          </Card>
        </Container>
      )}
    </Container>
  );
}
