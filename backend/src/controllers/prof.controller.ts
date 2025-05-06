import { Request, Response } from 'express';
import User from '../models/user.model'; // Assuming you have a User model

// GET /api/profile - Fetch user profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // Assuming `req.user` is populated by authentication middleware
    const user = await User.findById(userId).select('-password'); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user); // Return the user object, including username and name
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/profile - Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // Assuming `req.user` is populated by authentication middleware
    const { name, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name; // Allow updating name
    if (email) user.email = email; // Allow updating email
    if (password) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};