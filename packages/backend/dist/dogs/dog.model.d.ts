import * as mongoose from 'mongoose';
export interface Dog extends mongoose.Document {
    name: string;
    age: number;
    breed: string;
    gender: string;
}
