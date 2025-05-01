// WelcomePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Carousel, Alert, Breadcrumb, Card, Form, Nav, Navbar, NavDropdown, NavbarCollapse, Modal, Dropdown } from 'react-bootstrap';
import logoImage from '../assets/stetsonLogo.png';
import nobelImage from '../assets/nobelPrize.png';
import whitsImage from '../assets/whits.png';
import hawksImage from '../assets/hawks2.jpeg';
import CardGroup from 'react-bootstrap/CardGroup';

function WelcomePage() {
    const [userStatus, setUserStatus] = useState("Logged out");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        user_name: '',
        password: '',
        first_name: '',
        last_name: '',
        age: '',
        major: '',
        company: '',
        title: '',
        linkedin_link: ''
    });
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleSelect = (eventKey) => {
        setUserStatus(eventKey);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? 'http://104.248.12.12:3000/api/auth/login' : 'http://104.248.12.12:3000/api/auth/register';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log("Server responded:", data);

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem('token', data.accessToken);
                    navigate('/profilePage');
                } else {
                    alert('Signup successful! Await admin approval.');
                }
                setShowModal(false);
            } else {
                alert(data.message || 'Something went wrong.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const handleLoginSignupClick = (loginMode) => {
        setIsLogin(loginMode);
        setFormData({
            user_name: '',
            password: '',
            first_name: '',
            last_name: '',
            age: '',
            major: '',
            company: '',
            title: '',
            linkedin_link: ''
        });
        setShowModal(true);
    };

    return (
        <div className="min-vh-100 w-100">
            <Container className="mt-4 d-flex justify-content-start align-items-center">
                <Navbar expand="lg" className="img-fluid">
                    <Container className="mt-4 d-flex justify-content-start align-items-center">
                        <Card.Img variant="top" src={logoImage} className="me-auto img-fluid" style={{ width: '15%' }} />
                        <Navbar.Toggle aria-controls="basic-navbar" className="me-auto" />
                        <Navbar.Collapse id="basic-navbar-nav" className="me-auto img-fluid">
                            <Nav className="me-auto">
                                {(userStatus === "User logged in" || userStatus === "Admin logged in") && (
                                    <>
                                        <Button variant="outline-success" className="ms-4" onClick={() => navigate('/profilePage')}>Profile</Button>
                                        <Button variant="outline-success" className="ms-4" onClick={() => navigate('/oppPage')}>Opportunities</Button>
                                        <Button variant="outline-success" className="ms-4" onClick={() => navigate('/userListPage')}>Users</Button>
                                    </>
                                )}
                            </Nav>

                            {(userStatus === "Logged out") && (
                                <>
                                    <Button variant="outline-success" className="ms-4" onClick={() => handleLoginSignupClick(true)}>Login</Button>
                                    <Button variant="outline-success" className="ms-4" onClick={() => handleLoginSignupClick(false)}>Signup</Button>
                                </>
                            )}
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </Container>

            {/* Cards */}
            <CardGroup>
                <Card><Card.Img variant="top" src={nobelImage} /><Card.Body><Card.Title>Dr. Daniel Plante Wins Nobel Prize of Physics</Card.Title><Card.Text>Groundbreaking research in quantum mechanics!</Card.Text></Card.Body><Card.Footer><small className="text-muted">Last updated 3 mins ago</small></Card.Footer></Card>
                <Card><Card.Img variant="top" src={whitsImage} /><Card.Body><Card.Title>Free Whits Frozen Custard Today!</Card.Title><Card.Text>Stop by CUB for free custard for all students!</Card.Text></Card.Body><Card.Footer><small className="text-muted">Last updated 3 mins ago</small></Card.Footer></Card>
                <Card><Card.Img variant="top" src={hawksImage} /><Card.Body><Card.Title>Hawks on Campus?</Card.Title><Card.Text>So many Hawks flying around campus! Send photos to Instagram page!</Card.Text></Card.Body><Card.Footer><small className="text-muted">Last updated 12 mins ago</small></Card.Footer></Card>
            </CardGroup>

            {/* User login dropdown */}
            <Container className="d-flex justify-content-center align-items-center mt-5 mb-5">
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        {userStatus}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleSelect("Logged out")}>Logged out</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSelect("User logged in")}>User logged in</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleSelect("Admin logged in")}>Admin logged in</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Container>

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isLogin ? "Login" : "Signup"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        {!isLogin && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control type="number" name="age" value={formData.age} onChange={handleInputChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Major</Form.Label>
                                    <Form.Control type="text" name="major" value={formData.major} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Company</Form.Label>
                                    <Form.Control type="text" name="company" value={formData.company} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" name="title" value={formData.title} onChange={handleInputChange} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>LinkedIn Link</Form.Label>
                                    <Form.Control type="text" name="linkedin_link" value={formData.linkedin_link} onChange={handleInputChange} />
                                </Form.Group>
                            </>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="user_name" value={formData.user_name} onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" value={formData.password} onChange={handleInputChange} required autoComplete="current-password" />
                        </Form.Group>
                        <Button variant="success" type="submit" className="w-100">
                            {isLogin ? "Login" : "Signup"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default WelcomePage;

