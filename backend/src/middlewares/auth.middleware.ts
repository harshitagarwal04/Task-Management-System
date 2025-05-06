import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { Request, Response, NextFunction } from 'express';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        console.error('No token provided');
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!); // Verify the token
        (req as any).user = await User.findById((decoded as any).userId).select('-password'); // Attach user to the request
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};