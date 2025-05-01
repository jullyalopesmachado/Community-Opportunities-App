import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // remove password
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

