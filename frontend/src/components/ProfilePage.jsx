import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav, NavDropdown, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import logoImage from '../assets/stetsonLogo.png';
import avatarImage from '../assets/dummyPic.png';
import backgroundImage from '../assets/8721c539-55df-468e-bbfc-3aa36fa6374a.png';
import backgroundIv from '../assets/backinv.png';

function ProfilePage() {
  const [userInfo, setUserInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchMessages();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://104.248.12.12:3000/api/users/profile', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const profile = await response.json();
        console.log("Profile fetched:", profile);
        setUserInfo(profile);
      } else {
        console.error("Failed to fetch profile. Status:", response.status);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchMessages = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://104.248.12.12:3000/api/messages', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const msgs = await response.json();
        console.log("Messages fetched:", msgs);
        setMessages(msgs);
      } else {
        console.error("Failed to fetch messages. Status:", response.status);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  if (!userInfo) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="min-vh-100 w-100">

      {/* Navbar */}
      <Container className="mt-4 d-flex justify-content-start align-items-center">
        <Navbar expand="lg">
          <Container>
            <Card.Img variant="top" src={logoImage} className="me-auto img-fluid" style={{ width: '15%' }} />
            <Navbar.Toggle aria-controls="basic-navbar" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Button variant="outline-success" className="ms-4" onClick={() => navigate("/")}>Home</Button>
                <Button variant="outline-success" className="ms-4" onClick={() => navigate("/oppPage")}>Opportunities</Button>
                <Button variant="outline-success" className="ms-4" onClick={() => navigate("/userListPage")}>Users</Button>
              </Nav>

              {/* Admin menu if user is admin */}
              {userInfo.role === 'admin' && (
                <Nav className="me-auto">
                  <NavDropdown title="Administrator">
                    <NavDropdown.Item onClick={() => navigate("/adminPanelOp")}>Approve Opportunities</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => navigate("/adminPanelUser")}>Approve Users</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              )}
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
          <Card.Body className="text-center">
            <Card.Title>{userInfo.first_name} {userInfo.last_name}</Card.Title>
            <Card.Text><strong>Username:</strong> {userInfo.user_name}</Card.Text>
            <Card.Text><strong>Role:</strong> {userInfo.role}</Card.Text>
            <Card.Text><strong>Age:</strong> {userInfo.age}</Card.Text>
            <Card.Text><strong>Major:</strong> {userInfo.major || "Not provided"}</Card.Text>
            <Card.Text><strong>Company:</strong> {userInfo.company || "Not provided"}</Card.Text>
            <Card.Text><strong>Title:</strong> {userInfo.title || "Not provided"}</Card.Text>
            <Card.Text>
              <strong>LinkedIn:</strong> {userInfo.linkedin_link ? (
                <a href={userInfo.linkedin_link} target="_blank" rel="noopener noreferrer">Profile</a>
              ) : "No LinkedIn provided"}
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>

      {/* Messages Section */}
      <Container className="d-flex flex-column justify-content-center align-items-center mt-5">
        <h3>Messages</h3>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg) => (
            <Card key={msg._id} className="mb-3" style={{ width: '40rem' }}>
              <Card.Body>
                <Card.Text><strong>From:</strong> {msg.senderId?.user_name || "Unknown"}</Card.Text>
                <Card.Text><strong>To:</strong> {msg.receiverId?.user_name || "Unknown"}</Card.Text>
                <Card.Text>{msg.message}</Card.Text>
                <Card.Text className="text-muted">{new Date(msg.createdAt).toLocaleString()}</Card.Text>
              </Card.Body>
            </Card>
          ))
        )}
      </Container>

      {/* Background Images at bottom */}
                                <div
                            style={{
                            position: 'absolute',  // Positioning it within the navbar
                            top: 0,
                            right: 0,
                            width: '200px',  // Set a small size for the background image
                            height: '350px',  // Set a small size for the background image
                            backgroundImage: `url(${backgroundImage})`,  // Background image URL
                            backgroundSize: 'cover',  // Ensure the background image covers the div
                            backgroundRepeat: 'no-repeat',  // Prevent repeating the image
                            }}
                />

                        <div
                            style={{
                            position: 'absolute',  // Positioning it within the navbar
                            top: 1100,
                            right: 1100,
                            width: '400px',  // Set a small size for the background image
                            height: '350px',  // Set a small size for the background image
                            backgroundImage: `url(${backgroundIv})`,  // Background image URL
                            backgroundSize: 'cover',  // Ensure the background image covers the div
                            backgroundRepeat: 'no-repeat',  // Prevent repeating the image
                            }}
                />

    </div>
  );
}

export default ProfilePage;

