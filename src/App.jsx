import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home"; // Your home component
import Reports from "./Reports"; // Your reports component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/barchart" element={<BarChart/>} />
      </Routes>
    </Router>
  );
}

export default App;
