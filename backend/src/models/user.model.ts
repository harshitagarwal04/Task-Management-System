import mongoose, { Document, Schema } from 'mongoose';

// Define the User interface
export interface IUser extends Document {
  username: string; // Used for login
  name?: string; // Editable in the profile section
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const UserSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true }, // Required and unique
    name: { type: String }, // Optional
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create the User model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;