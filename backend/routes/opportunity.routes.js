// routes/opportunity.routes.js
import express from 'express';
import { create, findAll, findOne, approveOpportunity } from '../controllers/opportunity.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, create);
router.get('/', findAll);
router.get('/:id', findOne);

// Secure Approve Route
router.put('/approve/:id', verifyToken, (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}, approveOpportunity);

export default router;

