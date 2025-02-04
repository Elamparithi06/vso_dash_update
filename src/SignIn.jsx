import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Card, Container, Row, Col } from "react-bootstrap";
import './SignIn.css'

export default function SignIn({ onAuthenticate }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "CQA auditor" && password === "CavinKare123") {
      onAuthenticate();
    } else {
      setError("Invalid username or password");
      setTimeout(() => setError(""), 3000); // Error message fades after 3 seconds
    }
  };

  return (
    <div className="signin-container d-flex justify-content-center align-items-center vh-100 container-fluid">
      <Row className="signin-row w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={4}>
          <Card className="signin-card p-4 shadow-lg" style={{ maxWidth: "100%" }}>
            <h3 className="signin-title mb-4 text-center">Sign In</h3>
            {error && <p className="signin-error text-danger text-center fade-in">{error}</p>}
            <Form onSubmit={handleLogin} className="signin-form">
              <Form.Group className="signin-form-group mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                  className="signin-input"
                />
              </Form.Group>
              <Form.Group className="signin-form-group mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="signin-input"
                />
              </Form.Group>
              <Button type="submit" variant="primary" className="signin-btn w-100">Sign In</Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
