import mongoose from "mongoose";

const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  posted_by: { type: String, required: true },
  type: { type: String, required: false }, // <-- Add this line (optional if you want)
  isApproved: { type: Boolean, default: false }
}, { timestamps: true });

const Opportunity = mongoose.model("Opportunity", OpportunitySchema);
export default Opportunity;

