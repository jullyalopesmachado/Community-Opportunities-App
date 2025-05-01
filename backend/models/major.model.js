import mongoose from 'mongoose';

const MajorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  department: { type: String },
}, { timestamps: true });

const Major = mongoose.model('Major', MajorSchema);
export default Major;
