import * as mongoose from 'mongoose';

export const DogSchema = new mongoose.Schema({
  name: String,
  born: Date,
  breed: String,
  gender: String,
  image: String,
  isPuppy: Boolean,
});
