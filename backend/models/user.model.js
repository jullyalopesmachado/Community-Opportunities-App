// user.model.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  user_name: {
    type: String,
    unique: true,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  major: {
    type: String
  },
  company: {
    type: String
  },
  title: {
    type: String
  },
  linkedin_link: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshToken: {
    type: String
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;

