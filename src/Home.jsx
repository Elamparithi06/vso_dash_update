import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Table, Card, Container, Navbar, Nav, Modal } from "react-bootstrap";
import { X } from "react-bootstrap-icons"; // Import X icon for delete
import dropdownData from "./dropdownData";
import SignIn from "./SignIn";
import BarChart from './BarChart'; // Import the BarChart component
import "./Home.css";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rows, setRows] = useState([]); // Store table rows (Home tab data)
  const [reportData, setReportData] = useState([]); // Store report data
  const [activeTab, setActiveTab] = useState("home"); // Track active tab ("home" or "reports" or "barchart")
  const [expandedRowIndex, setExpandedRowIndex] = useState(null); // Track expanded row

  // Popup Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");

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
    sessionStorage.setItem("reportData", JSON.stringify(rows)); // Save data to sessionStorage
    setReportData(rows); // Update report data state

    // Show modal with submission confirmation
    setModalContent("Your response is submitted");
    setShowModal(true); // Trigger the modal to open
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

  // Handle showing modal with content
  const showPopup = (content) => {
    setModalContent(content);
    setShowModal(true); // Set the modal visibility to true
  };

  const handleModalClose = () => {
    setShowModal(false);
    setModalContent(""); // Reset the modal content when closing
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
        <img className="image" src="data:image/png;base64,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" alt="CavinKare" />
          <Navbar.Brand href="#">Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link onClick={() => toggleTab("home")}>Home</Nav.Link>
              <Nav.Link onClick={() => toggleTab("reports")}>Reports</Nav.Link>
              <Nav.Link onClick={() => toggleTab("barchart")}>BarChart</Nav.Link>
              <Button variant="danger" className="ms-3" onClick={handleLogout}>Sign Out</Button>
            </Nav>
          </Navbar.Collapse>
    
      </Navbar>

      {/* Home Tab */}
      {activeTab === "home" && (
        <Container className="mt-4">
          <h1 className="title">VSO audit tracking dashboard</h1>
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
                          type="number"
                          value={row.totalRemarks}
                          onChange={(e) => {
                            const updatedRows = [...rows];
                            updatedRows[index].totalRemarks = e.target.value;
                            setRows(updatedRows);
                          }}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={row.critical}
                          onChange={(e) => {
                            const updatedRows = [...rows];
                            updatedRows[index].critical = e.target.value;
                            setRows(updatedRows);
                          }}
                        />
                      </td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => deleteRow(row.id)}>
                          <X />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <Button onClick={addRow} variant="primary" className="mt-3">+ Add Row</Button>
            <Button onClick={handleSubmit} variant="success" className="mt-3 ms-2">Submit</Button>
          </Card>
        </Container>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
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
                    {/* Render each remark on a new line */}
                    {row.remarks.map((remark, idx) => (
                      <div key={idx}>{remark}</div>
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
      )}

      {/* BarChart Tab */}
      {activeTab === "barchart" && (
        <Container className="mt-4">
          <Card className="p-3">
            <h2>BarChart</h2>
            <BarChart reportData={reportData} /> {/* BarChart displayed in this tab */}
          </Card>
        </Container>
      )}

      {/* Popup Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Submission Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
