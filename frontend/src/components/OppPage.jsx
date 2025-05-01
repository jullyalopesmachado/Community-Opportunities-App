import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button, Card, Navbar, Nav, NavDropdown, Dropdown } from 'react-bootstrap';
import logoImage from '../assets/stetsonLogo.png';
import backgroundImage from '../assets/8721c539-55df-468e-bbfc-3aa36fa6374a.png'; // Import background image asset
import backgroundIv from '../assets/backinv.png'; // Import background image asset

function OppPage() {
    const { id } = useParams(); // Get opportunity ID from URL
    const [opportunity, setOpportunity] = useState(null);
    const [userStatus, setUserStatus] = useState("User logged in"); // State to track user login status
    const [showModal, setShowModal] = useState(false); // For modal visibility (optional for login/signup)
    const [isLogin, setIsLogin] = useState(false); // To toggle between login and signup modals
    const navigate = useNavigate(); // Hook to navigate to different pages

    // Fetch opportunity data when component mounts or ID changes
    useEffect(() => {
        const fetchOpportunity = async () => {
            try {
                 const response = await fetch(`http://104.248.12.12:3000/api/opportunities/${id}`); // OLD ONE 
                const data = await response.json();
                setOpportunity(data);
            } catch (error) {
                console.error("Error fetching opportunity:", error);
            }
        };
        fetchOpportunity();
    }, [id]);

    // Show loading message until opportunity data is fetched
    if (!opportunity) {
        return <div>Loading...</div>;
    }

    // Handle login/signup modal toggle
    const handleLoginSignupClick = (isLogin) => {
        setIsLogin(isLogin);
        setShowModal(true);
    };

    return (
        <div className="min-vh-100 w-100">
            {/* Navbar Section */}
            <Container className="mt-4 d-flex justify-content-start align-items-center">
                <Navbar expand="lg">
                    <Container className="mt-4 d-flex justify-content-start align-items-center">
                        {/* Logo */}
                        <Card.Img variant="top" src={logoImage} className="me-auto img-fluid" style={{ width: '15%' }} />
                        <Navbar.Toggle aria-controls="basic-navbar" className="me-auto" />
                        <Navbar.Collapse id="basic-navbar-nav" className="me-auto img-fluid">
                            <Nav className="me-auto">
                                {/* Navigation for logged in or admin users */}
                                {(userStatus === "User logged in" || userStatus === "Admin logged in") && (
                                    <>
                                        <Button variant="outline-success" className="ms-4" onClick={() => navigate('/profilePage')}>Profile</Button>
                                        <Button variant="outline-success" className="ms-4" onClick={() => navigate('/oppPage')}>Opportunities</Button>
                                        <Button variant="outline-success" className="ms-4" onClick={() => navigate('/userListPage')}>Users</Button>
                                    </>
                                )}
                            </Nav>

                            {/* Admin Dropdown */}
                            <Nav className="me-auto">
                                {userStatus === "Admin logged in" && (
                                    <NavDropdown title="Administrator" id="basic-nav-dropdown">
                                        <NavDropdown.Item onClick={() => navigate('/adminPanelOp')}>Approve Opportunity</NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => navigate('/adminPanelUser')}>Approve User</NavDropdown.Item>
                                    </NavDropdown>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </Container>

            {/* Background image positioned in the top-right corner */}
            <div>
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '300px',
                        height: '400px',
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        top: 400,
                        right: 1100,
                        width: '400px',
                        height: '350px',
                        backgroundImage: `url(${backgroundIv})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                />
            </div>

            {/* Opportunity Details Card */}
            <Container className="mt-5 d-flex justify-content-center">
                <Card style={{ width: '50%' }}>
                    <Card.Body>
                        <Card.Title>{opportunity.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Type: {opportunity.type}</Card.Subtitle>
                        <Card.Text>{opportunity.description}</Card.Text>
                        <Card.Text><strong>Posted By:</strong> {opportunity.posted_by}</Card.Text>
                        <Card.Text><strong>Created At:</strong> {new Date(opportunity.createdAt).toLocaleDateString()}</Card.Text>
                        <Button variant="outline-success" href="/oppPage">Back to Opportunities</Button>
                    </Card.Body>
                </Card>
            </Container>

            {/* User login dropdown placed at the bottom center */}
            <Container className="d-flex justify-content-center align-items-center mt-5 mb-5" style={{ position: 'absolute', bottom: '20px', width: '100%' }}>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {userStatus}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setUserStatus("User logged in")}>User logged in</Dropdown.Item>
                        <Dropdown.Item onClick={() => setUserStatus("Admin logged in")}>Admin logged in</Dropdown.Item>
                        </Dropdown.Menu>
                </Dropdown>
            </Container>
        </div>
    );
}

export default OppPage;
