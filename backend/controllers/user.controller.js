import User from '../models/user.model.js';

// Create and Save a new User
export const create = async (req, res) => {
  if (!req.body.user_name || !req.body.first_name || !req.body.last_name || !req.body.password) {
    return res.status(400).send({ message: "All fields are required" });
  }

  const user = new User({
    user_name: req.body.user_name,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    age: req.body.age,
    password: req.body.password,
    major: req.body.major || '',
    company: req.body.company || '',
    title: req.body.title || '',
    linkedin_link: req.body.linkedin_link || '',
    role: req.body.role || 'user',
    refreshToken: '',
    isApproved: false
  });

  try {
    const data = await user.save();
    res.status(201).send(data);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send({ message: "User already exists" });
    }
    res.status(500).send({ message: err.message || "Error creating user" });
  }
};

// Retrieve all Users
export const findAll = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Find a single user by username
export const findOne = async (req, res) => {
  try {
    const user = await User.findOne({ user_name: req.params.username });
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Update a user by username
export const update = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { user_name: req.params.username },
      req.body,
      { new: true }
    );
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

//  Delete a user by username
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ user_name: req.params.username });
    if (!user) return res.status(404).send({ message: "User not found" });
    res.send({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

//  Approve a user (admin action)
export const approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User approved successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Logged-in User Profile
export const getUserProfile = (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(req.user);
};

// Export all functions
export default {
  create,
  findAll,
  findOne,
  update,
  deleteUser,
  approveUser,
  getUserProfile
};

