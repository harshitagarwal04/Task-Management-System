import express from 'express';
import { resetPassword } from '../controllers/password.controller';

const router = express.Router();

// Reset password (forgot password)
router.post('/reset', resetPassword);

export default router;