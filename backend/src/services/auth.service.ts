import User, { IUser } from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {
    async register({ username, password, email }: { username: string; password: string; email: string }) {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            throw new Error('Username or email already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, email });
        const savedUser = await newUser.save();
        const { password: _password, ...userObj } = savedUser.toObject();
        return userObj;
    }

    async login({ username, password }: { username: string; password: string }) {
        const user = await User.findOne({ username });
        if (!user) {
            // console.log('User not found');
            console.error('User not found');
            throw new Error('Invalid username or password');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // console.log('Password not found');
            console.error('Password mismatch');
            throw new Error('Invalid username or password');
        }
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );
        return token;
    }
}

export const findUserByUsername = async (username: string): Promise<IUser | null> => {
  const user = await User.findOne({ username }) as IUser; // Cast the result to IUser
  return user;
};