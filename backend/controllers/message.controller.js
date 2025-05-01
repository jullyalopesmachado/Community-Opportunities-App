import Message from '../models/message.model.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id; // must use authMiddleware to set req.user
    const newMessage = await Message.create({ senderId, receiverId, message });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMessagesForUser = async (req, res) => {
  try {
    const userId = req.user.id; // get from token
    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).populate('senderId', 'user_name').populate('receiverId', 'user_name');

    res.status(200).json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

