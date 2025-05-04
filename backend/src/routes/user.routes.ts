import { Router } from 'express';
import User from '../models/user.model';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/users - get all users (id and username)
router.get('/', authenticate, async (req, res) => {
  try {
    const users = await User.find({}, '_id username');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

export default router;