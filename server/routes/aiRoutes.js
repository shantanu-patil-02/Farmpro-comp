import { Router } from 'express';
import { chatWithAgronomist } from '../services/geminiService.js';

const router = Router();

// POST /api/ai/chat
router.post('/chat', async (req, res, next) => {
  try {
    const { message, context } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message string is required',
      });
    }

    const aiResponse = await chatWithAgronomist({
      message: message.trim(),
      context: context || {},
    });

    res.json(aiResponse);
  } catch (err) {
    next(err);
  }
});

export default router;
