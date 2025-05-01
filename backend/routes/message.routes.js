import express from 'express';
import { sendMessage, getMessagesForUser } from '../controllers/message.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, sendMessage);    // send a message
router.get('/', verifyToken, getMessagesForUser);  // get all your messages

export default router;

