// AdminPanelUser.jsx
import React, { useState, useEffect } from "react";
import { Container, Button, Card, Row, Col, Navbar, Nav, NavDropdown } from "react-bootstrap";
import logoImage from '../assets/stetsonLogo.png';
import backgroundImage from '../assets/8721c539-55df-468e-bbfc-3aa36fa6374a.png';
import backgroundIv from '../assets/backinv.png';
import { useNavigate } from "react-router-dom";

function AdminPanelUser() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://104.248.12.12:3000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log("Fetched users:", data);

      if (Array.isArray(data)) {
        setUsers(data); // <- Fixed: data is array directly
      } else if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const approveUser = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://104.248.12.12:3000/api/users/approve/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        alert("User approved!");
        fetchUsers();
      } else {
        alert("Failed to approve user");
      }
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-vh-100 w-100">
      
      {/* Navigation Bar */}
      <Container className="mt-4 d-flex justify-content-start align-items-center">
        <Navbar expand="lg">
          <Container>
            <Card.Img variant="top" src={logoImage} className="me-auto img-fluid" style={{ width: "15%" }} />
            <Navbar.Toggle aria-controls="basic-navbar" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Button variant="outline-success" className="ms-4" onClick={() => navigate("/")}>Home</Button>
                <Button variant="outline-success" className="ms-4" onClick={() => navigate("/profilePage")}>Profile</Button>
                <Button variant="outline-success" className="ms-4" onClick={() => navigate("/userListPage")}>Users</Button>
              </Nav>
              <Nav>
                <NavDropdown title="Administrator">
                  <NavDropdown.Item onClick={() => navigate('/adminPanelOp')}>Approve Opportunities</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate('/adminPanelUser')}>Approve Users</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Container>

      {/* Page Title */}
      <Container className="mt-5">
        <h1 className="text-center">Pending Users</h1>
      </Container>

      {/* Pending Users List */}
      <Container className="mt-5">
        <Row>
          {users.filter(user => user.isApproved === false).map((user) => (
            <Col md={4} key={user._id} className="mb-4">
              <Card>
                <Card.Body className="text-center">
                  <Card.Title>{user.first_name} {user.last_name}</Card.Title>
                  <Card.Text><strong>Username:</strong> {user.user_name}</Card.Text>
                  <Card.Text><strong>Role:</strong> {user.role}</Card.Text>
                  <Button variant="success" onClick={() => approveUser(user._id)}>Approve</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Background images */}
      <Container className="d-flex justify-content-center align-items-center mt-5 mb-5">
       
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: -90,
            width: '250px',
            height: '350px',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </Container>

    </div>
  );
}

export default AdminPanelUser;

