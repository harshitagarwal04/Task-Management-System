import express from 'express';
import { changePassword } from '../controllers/changePassword.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Change password (from profile page)
router.put('/change', authenticate, changePassword);

export default router;