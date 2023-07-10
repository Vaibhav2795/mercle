import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types';

const userSchema: Schema<IUser> = new Schema<IUser>({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  walletAddress: { type: [String], required: false },
  active: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    required: false,
  },
  created: {
    type: String,
    default: new Date().toISOString(),
  },
  lastActive: {
    type: String,
    required: false,
  },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
