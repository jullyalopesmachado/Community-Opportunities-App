import Major from '../models/major.model.js';

export const create = async (req, res) => {
  try {
    const major = await Major.create(req.body);
    res.status(201).json(major);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const findAll = async (req, res) => {
  try {
    const majors = await Major.find();
    res.json(majors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
