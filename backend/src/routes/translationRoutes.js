import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import translationController from '../controllers/translationController.js';

const router = express.Router();

// Protected translation route
router.post('/translate', protectRoute, translationController.translateMessage);

export default router; 