import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import majorRoutes from './routes/major.routes.js';
import opportunityRoutes from './routes/opportunity.routes.js';
import setupSwagger from './api/swagger.js';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';

const allowedOrigins = [
  'http://104.248.12.12',         // nginx-frontend
  'http://104.248.12.12:5173'     // vite-dev server
];

dotenv.config();

const app = express();

app.use(cors({
   origin: true,
  credentials: true
}));

app.use(express.json());
console.log("Connecting to MongoDB URI:", process.env.MONGODB_URI);

app.use(cookieParser()); // parse cookies
app.use('/api/auth', authRoutes); // add auth routes

app.use('/api/messages', messageRoutes);

mongoose.connect(process.env.MONGODB_URI, {
    ssl: true,
    tlsInsecure: false,
    dbName: 'assignment3'
  })
  
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/majors', majorRoutes);
app.use('/api/opportunities', opportunityRoutes);

// Swagger
setupSwagger(app);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(3000,'0.0.0.0', () => {
  console.log('Server listening on port 3000');
});
