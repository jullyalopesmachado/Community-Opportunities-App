// OppListPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, Pagination, Navbar, NavDropdown, Modal, Form, Dropdown, Nav } from 'react-bootstrap';
import logoImage from '../assets/stetsonLogo.png';
import backgroundImage from '../assets/8721c539-55df-468e-bbfc-3aa36fa6374a.png'; 
import backgroundIv from '../assets/backinv.png'; 

function OppListPage() {
    const [opportunities, setOpportunities] = useState([]);
    const [showPostModal, setShowPostModal] = useState(false);
    const [newOpportunity, setNewOpportunity] = useState({ title: '', description: '', location: '', type: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;
    const navigate = useNavigate();
    const [userStatus, setUserStatus] = useState("User logged in");

    const fetchOpportunities = async () => {
        try {
            const response = await fetch(`http://104.248.12.12:3000/api/opportunities?page=${currentPage}`);
            const data = await response.json();
            console.log("Fetched opportunities:", data);
            setOpportunities(data.opportunities || []);
        } catch (error) {
            console.error("Error fetching opportunities:", error);
        }
    };

    useEffect(() => {
        fetchOpportunities();
    }, [currentPage]);

    const handlePostOpportunity = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Please login before posting.');
            return;
        }

        try {
            const profileResponse = await fetch('http://104.248.12.12:3000/api/users/profile', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!profileResponse.ok) {
                alert('Please login again.');
                return;
            }

            const profile = await profileResponse.json();
            const postedBy = profile.user_name;

            const response = await fetch('http://104.248.12.12:3000/api/opportunities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: newOpportunity.title,
                    description: newOpportunity.description,
                    location: newOpportunity.location,
                    type: newOpportunity.type,
                    posted_by: postedBy,
                }),
            });

            if (response.ok) {
                alert('Opportunity submitted! Awaiting admin approval.');
                setShowPostModal(false);
                setNewOpportunity({ title: '', description: '', location: '', type: '' });
                fetchOpportunities();
            } else {
                const errorResponse = await response.json();
                console.error('Failed to submit opportunity:', errorResponse);
                alert('Failed to submit opportunity.');
            }
        } catch (err) {
            console.error('Error posting opportunity:', err);
            alert('Error posting opportunity.');
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = opportunities.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(opportunities.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="min-vh-100 w-100">

            {/* Navigation Bar */}
            <Container className="mt-4 d-flex justify-content-start align-items-center">
                <Navbar expand="lg">
                    <Container className="mt-4 d-flex justify-content-start align-items-center">
                        <Card.Img variant="top" src={logoImage} className="me-auto img-fluid" style={{ width: '15%' }} />
                        <Navbar.Toggle aria-controls="basic-navbar" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                {(userStatus === "User logged in" || userStatus === "Admin logged in") && (
                                    <>
                                        <Button variant="outline-success" className="ms-4" onClick={() => navigate("/")}>Home</Button>
                                        <Button variant="outline-success" className="ms-4" onClick={() => navigate("/profilePage")}>Profile</Button>
                                        <Button variant="outline-success" className="ms-4" onClick={() => navigate("/userListPage")}>Users</Button>
                                    </>
                                )}
                            </Nav>

                            <Nav className="me-auto">
                                {userStatus === "Admin logged in" && (
                                    <NavDropdown title="Administrator">
                                        <NavDropdown.Item onClick={() => navigate('/adminPanelOp')}>Approve Opportunity</NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => navigate('/adminPanelUser')}>Approve User</NavDropdown.Item>
                                    </NavDropdown>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </Container>

            {/* Opportunities Section */}
            <Container className="mt-5">
                <Row>
                    {currentItems.map((opportunity) => (
                        <Col key={opportunity._id} md={6} className="mb-4">
                            <Card className="text-center">
                                <Card.Header>{opportunity.type?.toUpperCase()}</Card.Header>
                                <Card.Body>
                                    <Card.Title>{opportunity.title}</Card.Title>
                                    <Card.Text>{opportunity.description}</Card.Text>
                                    <Button
                                        variant="outline-success"
                                        onClick={() => navigate(`/opportunity/${opportunity._id}`)}
                                    >
                                        View Details
                                    </Button>
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    Posted by {opportunity.posted_by} on {new Date(opportunity.createdAt).toLocaleDateString()}
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
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                        <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                    </Pagination>
                )}
            </Container>

            {/* Post Opportunity Button */}
            <Container className="d-flex justify-content-center align-items-center mt-5 mb-5">
                <Button variant="success" onClick={() => setShowPostModal(true)}>Post New Opportunity</Button>
            </Container>

            {/* Post Opportunity Modal */}
            <Modal show={showPostModal} onHide={() => setShowPostModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Post New Opportunity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handlePostOpportunity}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={newOpportunity.title}
                                onChange={(e) => setNewOpportunity({ ...newOpportunity, title: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                value={newOpportunity.description}
                                onChange={(e) => setNewOpportunity({ ...newOpportunity, description: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                value={newOpportunity.location}
                                onChange={(e) => setNewOpportunity({ ...newOpportunity, location: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Control
                                type="text"
                                value={newOpportunity.type}
                                onChange={(e) => setNewOpportunity({ ...newOpportunity, type: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Button variant="success" type="submit" className="w-100">Submit</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Status Dropdown */}
            <Container className="d-flex justify-content-center align-items-center mt-5 mb-5">
                <Dropdown>
                    <Dropdown.Toggle variant="success">
                        {userStatus}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setUserStatus("User logged in")}>User logged in</Dropdown.Item>
                        <Dropdown.Item onClick={() => setUserStatus("Admin logged in")}>Admin logged in</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Container>

            {/* Background Images */}
            <Container className="d-flex justify-content-center align-items-center mt-5 mb-5">
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '200px',
                    height: '350px',
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }} />

                <div style={{
                    position: 'absolute',
                    top: 490,
                    right: 1100,
                    width: '400px',
                    height: '350px',
                    backgroundImage: `url(${backgroundIv})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                }} />
            </Container>
        </div>
    );
}

export default OppListPage;

