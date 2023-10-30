import * as mongoose from 'mongoose';

export const UserModel = mongoose.model('User', new mongoose.Schema({
  email: String,
  firstName: String,
  lastName: String,
  picture: String,
  accessToken: String,
  role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
}));

export interface User extends mongoose.Document {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
  role: 'user' | 'admin' | 'moderator';
}
