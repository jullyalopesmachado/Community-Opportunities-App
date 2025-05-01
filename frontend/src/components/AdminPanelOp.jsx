import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Pagination, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/stetsonLogo.png";
import backgroundImage from "../assets/8721c539-55df-468e-bbfc-3aa36fa6374a.png";

function AdminPanelOp() {
  const [opportunities, setOpportunities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const navigate = useNavigate();

  const fetchOpportunities = async (page) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://104.248.12.12:3000/api/opportunities?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.opportunities) {
        setOpportunities(data.opportunities.filter(op => !op.isApproved));
        setTotalPages(data.totalPages); // Save total pages from backend
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    }
  };

  const approveOpportunity = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://104.248.12.12:3000/api/opportunities/approve/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        alert("Opportunity approved!");
        fetchOpportunities(currentPage);
      } else {
        alert("Failed to approve opportunity.");
      }
    } catch (error) {
      console.error("Error approving opportunity:", error);
    }
  };

  useEffect(() => {
    fetchOpportunities(currentPage);
  }, [currentPage]);

  return (
    <div className="min-vh-100 w-100">
      {/* Navbar */}
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
              <Nav className="ms-auto">
                <NavDropdown title="Administrator">
                  <NavDropdown.Item onClick={() => navigate('/adminPanelOp')}>Approve Opportunity</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate('/adminPanelUser')}>Approve User</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Container>

      {/* Page Title */}
      <Container className="mt-5 text-center">
        <h2>Pending Opportunities</h2>
      </Container>

      {/* Pending Opportunities */}
      <Container className="mt-4">
        <Row>
          {opportunities.map((op) => (
            <Col md={4} key={op._id} className="mb-4">
              <Card className="text-center">
                <Card.Header>{op.type ? op.type.toUpperCase() : "OPPORTUNITY"}</Card.Header>
                <Card.Body>
                  <Card.Title>{op.title}</Card.Title>
                  <Card.Text>{op.description}</Card.Text>
                  <Card.Text><strong>Location:</strong> {op.location}</Card.Text>
                  <Button variant="success" onClick={() => approveOpportunity(op._id)}>
                    Approve
                  </Button>
                </Card.Body>
                <Card.Footer className="text-muted">
                  Posted by {op.posted_by}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-4">
            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        )}
      </Container>

      {/* Background image */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: -90,
        width: '200px',
        height: '350px',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }} />
    </div>
  );
}

export default AdminPanelOp;

