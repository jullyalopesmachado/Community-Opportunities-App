// routes/user.routes.js
import express from 'express';
import { create, findAll, findOne, update, deleteUser, getUserProfile, approveUser } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin approving a user 
router.put('/approve/:id', verifyToken, approveUser);

// Secure profile route (for logged-in users)
router.get('/profile', verifyToken, getUserProfile);

// Regular CRUD routes
router.post('/', create);
router.get('/', findAll);
router.get('/:username', findOne);
router.put('/:username', update);
router.delete('/:username', deleteUser);

export default router;

