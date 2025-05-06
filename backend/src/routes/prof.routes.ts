import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/prof.controller';
import { authenticate } from '../middlewares/auth.middleware'; // Middleware for authentication

const router = express.Router();

// GET /api/profile - Fetch user profile
router.get('/', authenticate, getUserProfile);

// PUT /api/profile - Update user profile
router.put('/', authenticate, updateUserProfile);

export default router;