// controllers/opportunity.controller.js
import Opportunity from '../models/opportunity.model.js';

// Create a new opportunity
export const create = async (req, res) => {
  try {
    const { title, description, location, type, posted_by } = req.body;

    if (!title || !description || !location || !type || !posted_by) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newOpportunity = new Opportunity({
      title,
      description,
      location,
      type,
      posted_by,
      isApproved: false
    });

    await newOpportunity.save();
    res.status(201).json({ message: "Opportunity created! Awaiting admin approval." });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all opportunities (paginated)
export const findAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;

  try {
    const total = await Opportunity.countDocuments();
    const opportunities = await Opportunity.find()
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      opportunities,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Find one opportunity
export const findOne = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) return res.status(404).json({ message: "Opportunity not found." });
    res.json(opportunity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Approve an opportunity
export const approveOpportunity = async (req, res) => {
  try {
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!updatedOpportunity) {
      return res.status(404).json({ message: "Opportunity not found." });
    }
    res.json({ message: "Opportunity approved successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export default {
  create,
  findAll,
  findOne,
  approveOpportunity
};

