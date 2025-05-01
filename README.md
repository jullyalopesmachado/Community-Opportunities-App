Web Application – Assignment 3
Course: CINF301: Web Application Development
Student Name: Júllya Lopes Machado
Assignment Due Date: Wednesday, April 30, 2025
Server IP: 104.248.12.12

Admin Login Credentials
Username: jujubaju

Password: pass

Live Demo Links
Front End: http://104.248.12.12

Swagger Documentation: http://104.248.12.12:2456/api-docs

Project Description
This web application is a full-stack alumni marketplace system built for CINF301 Assignment 3.
It allows users to:

Create accounts (pending admin approval)

Log in securely

View alumni profiles

Post and view opportunities

Send and receive private messages

Admins can approve pending users and pending opportunities

Differentiate between admin and regular users with role-based access

Protect backend routes through authentication middleware

Manage data with a fully functional API

Access complete Swagger documentation for API testing

Deployment Stack
Backend
Node.js and Express.js

MongoDB Atlas (with credentials securely stored using .env)

Swagger UI documentation (/api-docs)

JWT Authentication with role-based authorization

Password hashing using bcrypt

PM2 process manager for backend deployment (pm2 start app.js --name backend)

Backend running on Port 3000

Frontend
React.js (built with Vite)

Styled with React-Bootstrap components

Static production build served via nginx (/var/www/html)

Fully responsive and mobile-friendly design

Tools Used
PM2 for backend process management

dotenv for secure environment variable handling

MongoDB VSCode Playground for data seeding

nginx for serving the frontend

Swagger for full API documentation and endpoint testing

Security Considerations
.env file is included in .gitignore and not committed to GitHub

JWT token-based authentication protects user sessions

Role-based access control (admin versus regular user)

Only admins can approve users and opportunities through protected routes

MongoDB password and secret keys are kept private and never exposed
