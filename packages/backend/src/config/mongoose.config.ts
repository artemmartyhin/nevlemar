import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongooseConfig = (): MongooseModuleOptions => {
  if (process.env.MONGODB_URI) {
    return { uri: process.env.MONGODB_URI };
  }
  const user = process.env.DB_USERNAME;
  const pass = process.env.DB_PASSWORD;
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '27017';
  const db = process.env.DB_NAME || 'nevlemar';
  const auth = user && pass ? `${encodeURIComponent(user)}:${encodeURIComponent(pass)}@` : '';
  const authSrc = user ? '?authSource=admin' : '';
  return { uri: `mongodb://${auth}${host}:${port}/${db}${authSrc}` };
};
