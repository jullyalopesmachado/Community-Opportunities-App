// User.jsx
import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown, Card, Button, Dropdown } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import logoImage from '../assets/stetsonLogo.png';
import avatarImage from '../assets/dummyPic.png';
import backgroundImage from '../assets/8721c539-55df-468e-bbfc-3aa36fa6374a.png';
import backgroundIv from '../assets/backinv.png';

function User() {
    const [userId, setUserId] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [major, setMajor] = useState(null);
    const [company, setCompany] = useState(null);
    const [title, setTitle] = useState(null);
    const [email, setEmail] = useState(null);
    const [linkedinLink, setLinkedinLink] = useState(null);
    const [userStatus, setUserStatus] = useState("User logged in");

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch("http://104.248.12.12:3000/api/users", {
                    method: "GET",
                    mode: "cors",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched users:", data);

                    const foundUser = data.find(user => user._id === id);  

                    if (foundUser) {
                        setFirstName(foundUser.first_name);
                        setLastName(foundUser.last_name);
                        setMajor(foundUser.major);
                        setCompany(foundUser.company);
                        setTitle(foundUser.title);
                        setEmail(foundUser.email);
                        setLinkedinLink(foundUser.linkedin_link);
                        setUserId(foundUser._id);
                    } else {
                        console.error("User not found in the list.");
                    }
                } else {
                    console.error("Failed to fetch user data. Status:", response.status);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        if (id) fetchUsers();
    }, [id]);

    return (
        <div className="min-vh-100 w-100">

            {/* Navigation Bar */}
            <Container className="mt-4 d-flex justify-content-start align-items-center">
                <Navbar expand="lg">
                    <Container>
                        <Card.Img variant="top" src={logoImage} className="me-auto img-fluid" style={{ width: '15%' }} />
                        <Navbar.Toggle aria-controls="basic-navbar" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                {(userStatus === "User logged in" || userStatus === "Admin logged in") && (
                                    <>
                                        <Button variant="outline-success" className="ms-4" onClick={() => navigate("/")}>Home</Button>
                                        <Button variant="outline-success" className="ms-4" onClick={() => navigate("/oppPage")}>Opportunities</Button>
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

            {/* Profile Card */}
            <Container className="d-flex justify-content-center align-items-center mt-5 mb-5">
                <Card style={{ width: '28rem', paddingTop: '3rem', paddingBottom: '3rem' }}>
                    <div className="d-flex justify-content-center align-items-center">
                        <Card.Img variant="top" src={avatarImage} className="rounded-circle img-fluid" style={{ height: '220px', width: '240px' }} />
                    </div>
                    <Card.Body>
                        <Card.Title>{firstName ?? "Loading..."} {lastName ?? ""}</Card.Title>
                        <Card.Text><strong>Major:</strong> {major ?? "Not provided"}</Card.Text>
                        <Card.Text><strong>Company:</strong> {company ?? "Not provided"}</Card.Text>
                        <Card.Text><strong>Title:</strong> {title ?? "Not provided"}</Card.Text>
                        <Card.Text><strong>Email:</strong> {email ?? "Not provided"}</Card.Text>
                        <Card.Text>
                            <strong>LinkedIn:</strong> {linkedinLink ? <a href={linkedinLink} target="_blank" rel="noopener noreferrer">Profile</a> : "No LinkedIn provided"}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>

            {/* User Status Dropdown */}
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

            {/* Fixed Background Images at Bottom */}
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    right: 0,
                    width: '200px',
                    height: '350px',
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    zIndex: -1
                }}
            />
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    width: '400px',
                    height: '350px',
                    backgroundImage: `url(${backgroundIv})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    zIndex: -1
                }}
            />
        </div>
    );
}

export default User;

