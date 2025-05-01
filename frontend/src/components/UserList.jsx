// imports
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, Pagination, Navbar, NavDropdown, Dropdown, Modal, Form } from "react-bootstrap";
import logoImage from "../assets/stetsonLogo.png";
import avatarImage from "../assets/dummyPic.png";
import backgroundImage from '../assets/8721c539-55df-468e-bbfc-3aa36fa6374a.png';
import backgroundIv from '../assets/backinv.png';
import Nav from "react-bootstrap/Nav";

function UserList() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const navigate = useNavigate();
    const [userStatus, setUserStatus] = useState("User logged in");

    // New states for messaging
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [messageText, setMessageText] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch("http://104.248.12.12:3000/api/users", {
                    method: "GET",
                    mode: "cors",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setUsers(data.users);
                } else {
                    console.error("Failed to fetch users. Status:", response.status);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(users.length / itemsPerPage);

    // Handle opening the message modal
    const handleSendMessageClick = (userId) => {
        setSelectedUserId(userId);
        setShowModal(true);
    };

    // Handle sending the message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            const response = await fetch('http://104.248.12.12:3000/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    receiverId: selectedUserId,
                    message: messageText,
                }),
            });

            if (response.ok) {
                alert('Message sent successfully!');
                setShowModal(false);
                setMessageText("");
            } else {
                alert('Failed to send message.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error sending message.');
        }
    };

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
                                {(userStatus === "User logged in" || userStatus === "Admin logged in") && (
                                    <>
                                        <Button variant="outline-success" className="ms-4" onClick={() => navigate("/")}>Home</Button>
                                        <Button variant="outline-success" className="ms-4" onClick={() => navigate("/profilePage")}>Profile</Button>
                                    </>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </Container>

            {/* User Cards */}
            <Container className="mt-4">
                <Row className="justify-content-center">
                    {currentItems.map((user) => (
                        <Col key={user._id} md={3} className="mb-4">
                            <Card className="d-flex justify-content-center align-items-center" style={{ width: '18rem' }}>
                                <Card.Body className="d-flex flex-column align-items-center">
                                    <div className="d-flex justify-content-center mb-3">
                                        <Card.Img
                                            variant="top"
                                            src={avatarImage}
                                            style={{ width: '8rem', height: '8rem', objectFit: 'cover', borderRadius: '50%' }}
                                        />
                                    </div>
                                    <Card.Title>{user.first_name} {user.last_name}</Card.Title>
                                    <Card.Text>
                                        <strong>Major:</strong> {user.major || "N/A"} <br />
                                        <strong>Company:</strong> {user.company || "N/A"} <br />
                                    </Card.Text>

                                    <div className="d-flex gap-2">
                                        <Button variant="outline-success" onClick={() => navigate(`/user/${user._id}`)}>View Profile</Button>
                                        <Button variant="success" onClick={() => handleSendMessageClick(user._id)}>Message</Button>
                                    </div>

                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Pagination */}
                {users.length > 0 && totalPages > 1 && (
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

            {/* Send Message Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Send Message</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSendMessage}>
                        <Form.Group className="mb-3">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button type="submit" variant="success" className="w-100">
                            Send
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Background */}
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

export default UserList;

