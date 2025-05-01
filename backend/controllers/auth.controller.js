// auth.controller.js
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

// REGISTER new user
export const register = async (req, res) => {
  try {
   
      console.log("📝 Saving user:", req.body);
      const { 
      user_name, 
      first_name, 
      last_name, 
      age, 
      password, 
      major = '', 
      company = '', 
      title = '', 
      linkedin_link = '' 
    } = req.body;

    if (!user_name || !first_name || !last_name || !age || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      user_name,
      first_name,
      last_name,
      age,
      password: hashedPassword,
      major,
      company,
      title,
      linkedin_link,
      role: 'user',
      isApproved: false,
      refreshToken: ''
    });

    console.log("User saved:", user);

    res.status(201).json({ message: 'User registered! Await admin approval.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(400).json({ error: err.message });
  }
};

// LOGIN user
export const login = async (req, res) => {
  const { user_name, password } = req.body;
  const user = await User.findOne({ user_name });

  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  if (!user.isApproved) return res.status(403).json({ message: 'Account not approved yet' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: false, // Set true if HTTPS
    sameSite: 'Strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({ accessToken });
};

// REFRESH Access Token
export const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: 'No refresh token' });

  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken });

  if (!user) return res.status(403).json({ message: 'Forbidden' });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user._id.toString() !== decoded.id) return res.status(403).json({ message: 'Forbidden' });

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  });
};

// LOGOUT user
export const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken });

  if (user) {
    user.refreshToken = '';
    await user.save();
  }

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'Strict', secure: false });
  res.sendStatus(204);
};

