import * as mongoose from 'mongoose';

export interface Dog extends mongoose.Document {
    name: string;
    born: Date;
    breed: string;
    gender: string;
    image: string;
    isPuppy: boolean;
  }